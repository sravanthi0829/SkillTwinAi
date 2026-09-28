import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const hasApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for realistic fallback generation when API key is missing or quota/rate limit is reached
function generateFallbackAnalysis(profile: any) {
  const goal = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal || 'Software Engineer';
  const userSkills: string[] = profile.skills || ['Python', 'HTML/CSS'];
  const userSkillSet = new Set<string>(userSkills.map((s: string) => s.toLowerCase().trim()));

  // Role templates
  const roleSkillMap: Record<string, { core: string[]; high: string[]; advanced: string[] }> = {
    'AI Engineer': {
      core: ['Python', 'Machine Learning', 'AI', 'SQL'],
      high: ['Deep Learning', 'PyTorch / TensorFlow', 'Data Science', 'Problem Solving'],
      advanced: ['MLOps', 'Vector Databases', 'Prompt Engineering', 'Cloud'],
    },
    'Software Developer': {
      core: ['JavaScript', 'HTML/CSS', 'Python', 'Java', 'C++', 'SQL'],
      high: ['Data Structures & Algorithms', 'REST APIs', 'Git', 'Problem Solving'],
      advanced: ['System Design', 'Cloud', 'Docker / CI/CD', 'Testing'],
    },
    'Data Scientist': {
      core: ['Python', 'SQL', 'Data Science', 'Machine Learning'],
      high: ['Statistics', 'Data Visualization', 'Pandas & NumPy', 'Problem Solving'],
      advanced: ['Big Data (Spark)', 'Feature Engineering', 'Cloud', 'MLOps'],
    },
    'Web Developer': {
      core: ['JavaScript', 'HTML/CSS', 'React / Next.js', 'SQL'],
      high: ['Tailwind CSS', 'Node.js / Express', 'TypeScript', 'Problem Solving'],
      advanced: ['Performance Optimization', 'Web Security', 'Cloud Deployment', 'State Management'],
    },
    'Cybersecurity Engineer': {
      core: ['Cybersecurity', 'Networking Basics', 'Linux / Bash', 'Python'],
      high: ['Penetration Testing', 'SIEM / Threat Hunting', 'Cryptography', 'Cloud'],
      advanced: ['Zero Trust Architecture', 'Incident Response', 'Reverse Engineering', 'Compliance'],
    },
    'Cloud Engineer': {
      core: ['Cloud', 'Linux', 'Networking', 'Python'],
      high: ['AWS / GCP / Azure', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'CI/CD'],
      advanced: ['Site Reliability Engineering', 'Cloud Security', 'Cost Optimization', 'Microservices'],
    },
    'UI/UX Designer': {
      core: ['UI/UX', 'Figma', 'Wireframing', 'HTML/CSS'],
      high: ['Design Systems', 'User Research', 'Interactive Prototyping', 'Usability Testing'],
      advanced: ['Accessibility (a11y)', 'Design-to-Code Handoff', 'Micro-interactions', 'Information Architecture'],
    },
  };

  const roleInfo = roleSkillMap[goal] || roleSkillMap['Software Developer'];
  const allNeeded = [...roleInfo.core, ...roleInfo.high, ...roleInfo.advanced];

  const strongSkills: any[] = [];
  const improveSkills: any[] = [];
  const learnSkills: any[] = [];

  // Categorize
  userSkills.forEach((skill: string) => {
    const isNeeded = allNeeded.some(n => n.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(n.toLowerCase()));
    if (isNeeded) {
      if (['Python', 'JavaScript', 'HTML/CSS', 'Java', 'SQL', 'C++'].includes(skill)) {
        strongSkills.push({
          name: skill,
          percentage: Math.floor(Math.random() * 15) + 75,
          category: 'core',
          status: 'strong',
          importance: 'Critical',
          reason: 'Solid foundation proven by coursework or initial practice.',
        });
      } else {
        improveSkills.push({
          name: skill,
          percentage: Math.floor(Math.random() * 20) + 48,
          category: 'framework',
          status: 'improve',
          importance: 'High',
          reason: 'Good working exposure; needs deeper production-grade project experience.',
        });
      }
    } else {
      strongSkills.push({
        name: skill,
        percentage: 70,
        category: 'core',
        status: 'strong',
        importance: 'Medium',
        reason: 'Valuable complementary skill in your overall tech toolkit.',
      });
    }
  });

  // Check what's missing
  allNeeded.forEach(needed => {
    const hasIt = Array.from(userSkillSet).some((s: string) => s.includes(needed.toLowerCase()) || needed.toLowerCase().includes(s));
    if (!hasIt) {
      learnSkills.push({
        name: needed,
        percentage: Math.floor(Math.random() * 20) + 10,
        category: 'tool',
        status: 'learn',
        importance: 'Critical',
        reason: `Essential milestone skill required in modern ${goal} hiring standards.`,
      });
    }
  });

  if (strongSkills.length === 0) {
    strongSkills.push({
      name: userSkills[0] || 'Problem Solving',
      percentage: 75,
      category: 'soft',
      status: 'strong',
      importance: 'High',
      reason: 'Core analytical mindset to build upon.',
    });
  }

  const matchScore = Math.min(88, Math.max(38, Math.round((strongSkills.length * 20 + improveSkills.length * 10) / (allNeeded.length * 15) * 100)));

  // Generate 4-week roadmap based on available time & preference
  const pref = profile.learningPreference || 'Hands-on Projects';
  const time = profile.availableTime || '1–2 hours';

  const roadmap = [
    {
      weekNumber: 1,
      title: `Week 1: Core Foundation & Tooling for ${goal}`,
      theme: 'Mastering the fundamentals & setting up your dev sandbox',
      tasks: [
        {
          id: 'w1-t1',
          title: `Deepen ${strongSkills[0]?.name || 'Programming'} Proficiency`,
          description: `Focus on modern patterns, clean architecture, and best practices tailored to ${pref}.`,
          completed: false,
          estimatedHours: time === 'Less than 1 hour' ? '4 hrs' : '8 hrs',
          learningResource: `${pref} focused crash course & interactive documentation`,
        },
        {
          id: 'w1-t2',
          title: `Set up Version Control & GitHub Repository`,
          description: 'Document your learning journey with structured commits and clean README files.',
          completed: false,
          estimatedHours: '3 hrs',
          learningResource: 'GitHub workflow and open-source hygiene guide',
        },
        {
          id: 'w1-t3',
          title: `Solve 5 Practical Problems in ${strongSkills[0]?.name || 'Core Language'}`,
          description: 'Solidify logic building and data structure manipulations.',
          completed: false,
          estimatedHours: '4 hrs',
          learningResource: 'Curated problem set matching your skill level',
        },
      ],
    },
    {
      weekNumber: 2,
      title: `Week 2: Target Skill Bridge - ${learnSkills[0]?.name || 'Specialized Domain'}`,
      theme: 'Closing your biggest skill gap',
      tasks: [
        {
          id: 'w2-t1',
          title: `Essential Concepts of ${learnSkills[0]?.name || 'Applied Tech'}`,
          description: `Learn the architecture, core APIs, and practical syntax.`,
          completed: false,
          estimatedHours: '6 hrs',
          learningResource: 'Targeted tutorial & visual breakdown',
        },
        {
          id: 'w2-t2',
          title: `Build a Mini POC / Sandbox Module`,
          description: `Create a functional test project applying ${learnSkills[0]?.name || 'new concepts'}.`,
          completed: false,
          estimatedHours: '5 hrs',
          learningResource: 'Step-by-step code walkthrough',
        },
      ],
    },
    {
      weekNumber: 3,
      title: `Week 3: Advanced Integration & ${improveSkills[0]?.name || 'System Workflows'}`,
      theme: 'Connecting multiple layers into a cohesive prototype',
      tasks: [
        {
          id: 'w3-t1',
          title: `Integrate Database & State Management`,
          description: 'Connect persistent data models with frontend or pipeline logic.',
          completed: false,
          estimatedHours: '6 hrs',
          learningResource: 'Real-world data modeling masterclass',
        },
        {
          id: 'w3-t2',
          title: `Implement Performance Benchmarking & Error Handling`,
          description: 'Add robust validation, logging, and graceful error boundaries.',
          completed: false,
          estimatedHours: '4 hrs',
          learningResource: 'Production-ready engineering patterns',
        },
      ],
    },
    {
      weekNumber: 4,
      title: `Week 4: Capstone Portfolio Project & Mock Interview Ready`,
      theme: 'Showcase-worthy deployment and career readiness',
      tasks: [
        {
          id: 'w4-t1',
          title: `Build & Deploy ${goal} Capstone Project`,
          description: 'Package your project with a live URL, clean demo video, and architecture diagram.',
          completed: false,
          estimatedHours: '10 hrs',
          learningResource: 'Cloud deployment guide and portfolio template',
        },
        {
          id: 'w4-t2',
          title: `Complete 2 AI Mock Technical Interviews`,
          description: 'Test your ability to articulate system design and core terminology clearly.',
          completed: false,
          estimatedHours: '3 hrs',
          learningResource: 'SkillTwin AI Interactive Interview simulator',
        },
      ],
    },
  ];

  // Recommended Projects
  const recommendedProjects = [
    {
      id: 'proj-1',
      title: `Intelligent ${goal} Showcase Platform`,
      difficulty: 'Intermediate' as const,
      technologies: [strongSkills[0]?.name || 'Python', learnSkills[0]?.name || 'Cloud', 'SQL', 'REST API'],
      skillsLearned: [learnSkills[0]?.name || 'System Design', 'Full-stack Integration', 'Deployment'],
      problemStatement: `Hiring managers look for candidates who can solve real user problems rather than tutorial clones. Build a solution that ingests dynamic data and serves actionable insights.`,
      mainFeatures: [
        'Automated data ingestion and structured validation',
        'Intuitive responsive dashboard with live metrics',
        'Role-based permissions or personalized feeds',
        'End-to-end cloud deployment with continuous integration',
      ],
      stepByStepPlan: [
        'Step 1: Define user persona and create database schema.',
        'Step 2: Build backend service endpoints and data pipeline.',
        'Step 3: Develop responsive frontend interface.',
        'Step 4: Connect authentication and test edge cases.',
        'Step 5: Deploy to cloud hosting with custom domain and README.',
      ],
      whyRecommended: `Directly targets your gap in ${learnSkills[0]?.name || 'modern tools'} while highlighting your existing strengths.`,
    },
    {
      id: 'proj-2',
      title: `Real-Time Data Analyzer & Metrics Engine`,
      difficulty: 'Beginner' as const,
      technologies: [userSkills[0] || 'Python', 'Data Visualization', 'JSON/APIs'],
      skillsLearned: ['Data Cleansing', 'Metric Calculations', 'UI Visualization'],
      problemStatement: `Organizations drown in unstructured data. Build a tool that processes raw inputs and visually reveals key performance indicators.`,
      mainFeatures: [
        'File uploader (CSV / JSON)',
        'Automatic summary statistic generation',
        'Interactive bar & trend charts',
        'Exportable executive summary reports',
      ],
      stepByStepPlan: [
        'Step 1: Set up input parser and validation.',
        'Step 2: Calculate core distribution and aggregation stats.',
        'Step 3: Render visual graphs.',
        'Step 4: Add dark/light mode and sample datasets.',
      ],
      whyRecommended: 'Fast 1-week build that immediately boosts your resume and GitHub contributions.',
    },
    {
      id: 'proj-3',
      title: `Autonomous ${goal} Agent & Workflow Automation`,
      difficulty: 'Advanced' as const,
      technologies: ['AI / LLM API', userSkills[0] || 'Python', 'Vector DB / Cache', 'Docker'],
      skillsLearned: ['AI Integration', 'Prompt Optimization', 'Modern Cloud Ops'],
      problemStatement: `Modern software workflows require AI-augmented automation. Create an agent that executes tasks autonomously based on natural language instructions.`,
      mainFeatures: [
        'Context-aware reasoning engine',
        'Execution history and retry logic',
        'Third-party API webhook connector',
        'Observability dashboard tracking token efficiency and latency',
      ],
      stepByStepPlan: [
        'Step 1: Design tool invocation schemas.',
        'Step 2: Integrate LLM API with structured output.',
        'Step 3: Build safety boundaries and fallback handlers.',
        'Step 4: Package in Docker container and deploy.',
      ],
      whyRecommended: 'Demonstrates cutting-edge expertise that sets you apart from 95% of other entry-level applicants.',
    },
  ];

  return {
    overallMatchScore: matchScore,
    summaryHeadline: `You're currently a ~${matchScore}% match for target role: ${goal}. With targeted skill-bridging, you can be interview-ready in 4-6 weeks!`,
    digitalTwinPersona: `${profile.fullName || 'Student'}'s ${goal} Twin`,
    strongSkills: strongSkills.slice(0, 5),
    improveSkills: improveSkills.slice(0, 4),
    learnSkills: learnSkills.slice(0, 5),
    roadmap,
    recommendedProjects,
    twinHighlights: {
      strengthSummary: `Strong foundation in ${strongSkills.map(s => s.name).join(', ')}.`,
      gapSummary: `Immediate focus areas: ${learnSkills.slice(0, 3).map(s => s.name).join(', ')}.`,
      nextBigMilestone: `Complete Week 1 milestone: Deepen ${strongSkills[0]?.name || 'Core Skills'} and start bridging ${learnSkills[0]?.name || 'first high-impact skill'}.`,
    },
    createdAt: new Date().toISOString(),
  };
}

// Route: Analyze SkillTwin Profile
app.post('/api/analyze-twin', async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    if (!profile || !profile.fullName) {
      res.status(400).json({ error: 'Profile data is required' });
      return;
    }

    if (!hasApiKey) {
      // Use fallback
      const fallback = generateFallbackAnalysis(profile);
      res.json(fallback);
      return;
    }

    const goal = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal || 'Software Engineer';
    const skillsList = (profile.skills || []).join(', ');
    const projectsList = (profile.projects || []).map((p: any) => `${p.name}: ${p.description} (Tech: ${p.technologies?.join(', ') || 'N/A'})`).join('; ');
    const certsList = (profile.certifications || []).map((c: any) => `${c.name} (${c.issuer})`).join(', ');

    const prompt = `You are the core intelligence of "SkillTwin AI", an advanced career digital twin architect for students.
Analyze this student profile and generate a detailed SkillTwin assessment for their target career:

Student Profile:
- Name: ${profile.fullName}
- Age: ${profile.age || 'N/A'}
- Degree & Branch: ${profile.degree || ''} in ${profile.branch || ''} at ${profile.college || ''} (Year: ${profile.currentYear || 'N/A'}, CGPA: ${profile.cgpa || 'N/A'})
- Current Skills: ${skillsList || 'None specified'}
- Prior Projects: ${projectsList || 'None'}
- Certifications: ${certsList || 'None'}
- Interests: ${(profile.interests || []).join(', ')}
- Target Career Goal: ${goal}
- Learning Preference: ${profile.learningPreference}
- Available Daily Study Time: ${profile.availableTime}

Requirements:
1. Estimate overall match score (percentage 0-100) for the target role.
2. Provide a motivating, realistic summary headline.
3. Categorize skills into three distinct buckets:
   - "strongSkills": Skills the user already has (percentage 70-95%).
   - "improveSkills": Skills where the user has some exposure or basic knowledge but needs production improvement (percentage 40-69%).
   - "learnSkills": Essential missing skills for the target career that the user should prioritize learning (percentage 10-35%).
4. Generate a 4-week tailored learning roadmap (Week 1 to Week 4) strictly adapted to their learning preference (${profile.learningPreference}) and daily time (${profile.availableTime}). Each week must have 2-4 actionable tasks with completed: false.
5. Recommend 3 distinct, high-impact projects ("recommendedProjects") addressing their skill gaps. Each project must have title, difficulty ('Beginner' | 'Intermediate' | 'Advanced'), technologies (array), skillsLearned (array), problemStatement, mainFeatures (array of strings), stepByStepPlan (array of 4-5 strings), and whyRecommended.
6. Provide twinHighlights (strengthSummary, gapSummary, nextBigMilestone).

Respond ONLY with valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallMatchScore: { type: Type.INTEGER, description: 'Percentage 0-100' },
            summaryHeadline: { type: Type.STRING },
            digitalTwinPersona: { type: Type.STRING },
            strongSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  status: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['name', 'percentage', 'status', 'reason'],
              },
            },
            improveSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  status: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['name', 'percentage', 'status', 'reason'],
              },
            },
            learnSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  status: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['name', 'percentage', 'status', 'reason'],
              },
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                        estimatedHours: { type: Type.STRING },
                        learningResource: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'description', 'completed', 'estimatedHours'],
                    },
                  },
                },
                required: ['weekNumber', 'title', 'theme', 'tasks'],
              },
            },
            recommendedProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skillsLearned: { type: Type.ARRAY, items: { type: Type.STRING } },
                  problemStatement: { type: Type.STRING },
                  mainFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stepByStepPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whyRecommended: { type: Type.STRING },
                },
                required: ['id', 'title', 'difficulty', 'technologies', 'skillsLearned', 'problemStatement', 'mainFeatures', 'stepByStepPlan', 'whyRecommended'],
              },
            },
            twinHighlights: {
              type: Type.OBJECT,
              properties: {
                strengthSummary: { type: Type.STRING },
                gapSummary: { type: Type.STRING },
                nextBigMilestone: { type: Type.STRING },
              },
              required: ['strengthSummary', 'gapSummary', 'nextBigMilestone'],
            },
          },
          required: [
            'overallMatchScore',
            'summaryHeadline',
            'digitalTwinPersona',
            'strongSkills',
            'improveSkills',
            'learnSkills',
            'roadmap',
            'recommendedProjects',
            'twinHighlights',
          ],
        },
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    parsed.createdAt = new Date().toISOString();
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing twin:', error);
    // Graceful fallback to guarantee UI continuity
    const fallback = generateFallbackAnalysis(req.body);
    res.json(fallback);
  }
});

// Route: Start AI Interview Session
app.post('/api/interview/start', async (req: Request, res: Response) => {
  try {
    const { role, profile } = req.body;
    const targetRole = role || profile?.careerGoal || 'Software Engineer';
    const skills = (profile?.skills || []).join(', ');

    if (!hasApiKey) {
      const fallbackQuestions: Record<string, string> = {
        'AI Engineer': 'Explain the difference between supervised and unsupervised learning, and how would you choose an evaluation metric for an imbalanced classification problem?',
        'Software Developer': 'Explain the difference between process and thread, and how you would design a RESTful API with proper error handling and idempotent operations.',
        'Data Scientist': 'What is the bias-variance tradeoff, and how do you handle missing values and outliers in a real-world messy dataset?',
        'Web Developer': 'Can you explain the difference between client-side rendering and server-side rendering, and when you would choose each for web performance and SEO?',
        'Cybersecurity Engineer': 'What are the main principles of Defense in Depth, and how do you mitigate against SQL Injection and Cross-Site Scripting (XSS)?',
        'Cloud Engineer': 'Explain the difference between containers and virtual machines, and how you would architect a highly available multi-region application on the cloud.',
        'UI/UX Designer': 'Walk me through your design process from initial user discovery to wireframing and interactive usability testing. How do you handle stakeholder disagreement?',
      };

      const q = fallbackQuestions[targetRole] || `Tell me about a challenging technical problem you solved using ${skills || 'your programming skills'}, and how you verified your solution was performant.`;
      res.json({
        question: q,
        questionIndex: 1,
        totalQuestions: 4,
      });
      return;
    }

    const prompt = `You are a friendly, senior technical interviewer conducting an entry-to-mid level interview for the role of "${targetRole}".
Candidate context:
Skills: ${skills || 'General CS'}
Education: ${profile?.degree || 'Computer Science'}

Ask Question #1. It should be a realistic, foundational yet practical question for a candidate aiming to become a "${targetRole}".
Make it engaging and direct (2-3 sentences max).
Respond in JSON format: { "question": "..." }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
          },
          required: ['question'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      question: parsed.question || 'Explain how you approach structuring and troubleshooting a software project from scratch.',
      questionIndex: 1,
      totalQuestions: 4,
    });
  } catch (err) {
    console.error('Error starting interview:', err);
    res.json({
      question: 'Explain the difference between supervised and unsupervised learning with a practical real-world example.',
      questionIndex: 1,
      totalQuestions: 4,
    });
  }
});

// Route: Evaluate Interview Answer
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const { targetRole, question, answer, questionIndex, totalQuestions = 4, history = [] } = req.body;

    if (!hasApiKey) {
      const isLast = questionIndex >= totalQuestions;
      res.json({
        feedback: {
          whatWasGood: 'You clearly conveyed the fundamental concepts and demonstrated practical awareness of real-world application.',
          whatWasMissing: 'Could provide deeper specifics on edge cases, algorithmic complexity, or industry best practices.',
          suggestedImprovement: 'Structure your answers using the STAR method (Situation, Task, Action, Result) or state technical tradeoffs explicitly.',
          score: 8,
        },
        nextQuestion: isLast ? null : `Great! Moving to Question ${questionIndex + 1}: How would you optimize the performance and handle unexpected latency or failures in such an architecture?`,
        isCompleted: isLast,
        finalReport: isLast ? {
          overallScore: 84,
          grade: 'Strong Junior Candidate - Hiring Ready',
          strengths: ['Clear communication style', 'Good foundational domain grasp', 'Practical mindset'],
          areasToImprove: ['Deeper articulation of trade-offs', 'Explicit architectural edge cases', 'Concrete metric benchmarking'],
          recommendedTopics: ['System Design Basics', 'Async workflows & fault tolerance', 'Unit & Integration Testing'],
          summary: `You gave thoughtful answers appropriate for an aspiring ${targetRole}. Focus on quantifying your results and practicing architectural reasoning!`,
        } : null,
      });
      return;
    }

    const isLast = questionIndex >= totalQuestions;

    const prompt = `You are evaluating an interview candidate for the role of "${targetRole}".
Current Question (#${questionIndex} of ${totalQuestions}): "${question}"
Candidate's Answer: "${answer}"

Previous context: ${JSON.stringify(history.slice(-3))}

Provide constructive, realistic feedback on their answer:
1. whatWasGood: 1-2 positive highlights of their answer.
2. whatWasMissing: 1-2 points they missed or glossed over.
3. suggestedImprovement: A quick concrete tip or better phrased key point.
4. score: An integer score from 1 to 10.
${isLast ? 'Since this was the last question, nextQuestion should be null, and generate a comprehensive finalReport.' : 'Generate nextQuestion: Question #' + (questionIndex + 1) + ' for the role of ' + targetRole + ' (2-3 sentences max).'}

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatWasGood: { type: Type.STRING },
            whatWasMissing: { type: Type.STRING },
            suggestedImprovement: { type: Type.STRING },
            score: { type: Type.INTEGER },
            nextQuestion: { type: Type.STRING, nullable: true },
            finalReport: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                overallScore: { type: Type.INTEGER },
                grade: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                summary: { type: Type.STRING },
              },
            },
          },
          required: ['whatWasGood', 'whatWasMissing', 'suggestedImprovement', 'score'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      feedback: {
        whatWasGood: parsed.whatWasGood,
        whatWasMissing: parsed.whatWasMissing,
        suggestedImprovement: parsed.suggestedImprovement,
        score: parsed.score || 8,
      },
      nextQuestion: isLast ? null : (parsed.nextQuestion || 'How would you scale this design to handle concurrent peak user loads?'),
      isCompleted: isLast,
      finalReport: isLast ? (parsed.finalReport || {
        overallScore: 82,
        grade: 'Proficient Foundation',
        strengths: ['Logical structure', 'Clear concepts'],
        areasToImprove: ['System scale trade-offs', 'Testing methodologies'],
        recommendedTopics: ['Deep dive into production frameworks'],
        summary: `Well done! You demonstrated strong reasoning for ${targetRole}.`,
      }) : null,
    });
  } catch (err) {
    console.error('Error evaluating interview:', err);
    const isLast = (req.body.questionIndex || 1) >= (req.body.totalQuestions || 4);
    res.json({
      feedback: {
        whatWasGood: 'Good core conceptual understanding and direct answer.',
        whatWasMissing: 'Could include deeper real-world examples and edge cases.',
        suggestedImprovement: 'Mention specific library names or design patterns to stand out.',
        score: 8,
      },
      nextQuestion: isLast ? null : 'How do you test and validate your code before pushing to production?',
      isCompleted: isLast,
      finalReport: isLast ? {
        overallScore: 80,
        grade: 'Career Ready Candidate',
        strengths: ['Clear terminology', 'Direct communication'],
        areasToImprove: ['Hands-on production examples'],
        recommendedTopics: ['CI/CD Pipelines', 'Integration Testing'],
        summary: 'Solid performance throughout the mock interview session.',
      } : null,
    });
  }
});

// Route: Ask Your SkillTwin AI Career Assistant Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, profile, analysis, history = [] } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!hasApiKey) {
      let reply = `As your SkillTwin, I see you are aiming for ${profile?.careerGoal || 'Software Engineer'}. `;
      const lower = message.toLowerCase();
      if (lower.includes('learn next') || lower.includes('which skill')) {
        const topGap = analysis?.learnSkills?.[0]?.name || 'Modern System Architecture';
        reply += `I recommend prioritizing **${topGap}**. It has the highest market demand in 2025/2026 for your target role and bridges your biggest current gap. Check Week 1 & 2 of your roadmap to get started!`;
      } else if (lower.includes('project')) {
        const proj = analysis?.recommendedProjects?.[0];
        reply += `You should build: **${proj?.title || 'an end-to-end full-stack portfolio platform'}**. It utilizes ${proj?.technologies?.join(', ') || 'your core languages'} and solves a real problem that recruiters look for!`;
      } else if (lower.includes('interview')) {
        reply += `To prepare for your ${profile?.careerGoal || 'tech'} interview, head over to the **Interview** tab in your SkillTwin navbar. Practice responding to dynamic mock questions and get instant feedback on what was good, what was missing, and how to improve!`;
      } else if (lower.includes('study plan') || lower.includes('30-day')) {
        reply += `Here is your 30-Day Sprint:
• **Days 1-7**: Master ${analysis?.strongSkills?.[0]?.name || 'fundamentals'} advanced syntax & Git.
• **Days 8-15**: Dive into ${analysis?.learnSkills?.[0]?.name || 'key gap framework'} with a micro-prototype.
• **Days 16-24**: Build out your recommended capstone project.
• **Days 25-30**: Deploy live, document README, and practice 3 AI mock interviews.`;
      } else if (lower.includes('resume')) {
        reply += `For your resume:
1. Put your target title "${profile?.careerGoal || 'Engineer'}" right beneath your name.
2. Group skills into 'Languages', 'Frameworks/Tools', and 'Concepts' instead of one long list.
3. For projects, use the XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.`;
      } else {
        reply += `You currently have ${analysis?.overallMatchScore || 65}% match readiness. Keep executing on your roadmap tasks and let me know if you want detailed code examples or interview tips!`;
      }

      res.json({
        reply,
        suggestedActions: [
          'What should I learn next?',
          'Suggest a project for me',
          'Prepare me for an AI interview',
          'Create a 30-day study plan',
        ],
      });
      return;
    }

    const systemPrompt = `You are the personal "SkillTwin AI" companion for ${profile?.fullName || 'the student'}.
You are an intelligent digital career twin that knows everything about this student's profile:
- Target Role: ${profile?.careerGoal || 'Software Engineer'}
- Current Skills: ${(profile?.skills || []).join(', ')}
- Education: ${profile?.degree || ''} in ${profile?.branch || ''} from ${profile?.college || ''}
- Daily Study Time: ${profile?.availableTime || '1-2 hours'}
- Learning Style: ${profile?.learningPreference || 'Hands-on Projects'}
- SkillTwin Readiness Score: ${analysis?.overallMatchScore || 65}%
- Top Missing Skills: ${(analysis?.learnSkills || []).slice(0, 3).map((s: any) => s.name).join(', ')}
- Top Strong Skills: ${(analysis?.strongSkills || []).slice(0, 3).map((s: any) => s.name).join(', ')}

Guidelines:
- Speak as their personalized, empathetic, hyper-knowledgeable digital career twin & mentor.
- Be concise, actionable, and encouraging. Use bullet points or short bold formatting when appropriate.
- Refer directly to their actual skills, target goal, or roadmap when answering.
- Keep responses under 180 words so they are quick to digest.`;

    const chatMessages = [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages,
    });

    const reply = response.text || 'I am right here with you! Let us keep building your skills step by step.';
    res.json({
      reply,
      suggestedActions: [
        'What should I learn next?',
        'Which skill should I improve?',
        'Suggest a project for me',
        'Create a 30-day study plan',
      ],
    });
  } catch (err: any) {
    console.error('Error in chat:', err);
    res.json({
      reply: `I am here to guide your career path! Based on your target role (${req.body.profile?.careerGoal || 'Engineer'}), focus on your roadmap milestones and let me know what questions you have.`,
      suggestedActions: [
        'What should I learn next?',
        'Suggest a project for me',
        'Prepare me for an AI interview',
      ],
    });
  }
});

// Route: Proxy to user's n8n workflow chatbot
app.post('/api/n8n/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, webhookUrl, profile } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const defaultUrls = [
      webhookUrl,
      'https://sravsss29.app.n8n.cloud/webhook/0672996e-dfee-4168-a1a2-cd6b434aef26/chat',
      'https://sravsss29.app.n8n.cloud/webhook-test/0672996e-dfee-4168-a1a2-cd6b434aef26/chat',
    ].filter(Boolean) as string[];

    const payload = {
      action: 'sendMessage',
      chatInput: message,
      message: message,
      sessionId: sessionId || `st-session-${Date.now()}`,
      metadata: {
        candidateName: profile?.fullName || 'Student',
        targetRole: profile?.careerGoal || 'Software Engineer',
        skills: profile?.skills || [],
        college: profile?.college || '',
        source: 'SkillTwin AI'
      }
    };

    let lastError: any = null;
    let successfulReply: string | null = null;
    let usedEndpoint: string = '';

    for (const url of defaultUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data: any = await response.json();
            const text = 
              data.output || 
              data.text || 
              data.message || 
              data.response || 
              data.result || 
              (Array.isArray(data) && data[0]?.output) || 
              (Array.isArray(data) && data[0]?.message) ||
              JSON.stringify(data);
            successfulReply = typeof text === 'string' ? text : JSON.stringify(text);
          } else {
            successfulReply = await response.text();
          }
          usedEndpoint = url;
          break;
        } else {
          const errText = await response.text();
          lastError = `Status ${response.status}: ${errText}`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (successfulReply) {
      res.json({ reply: successfulReply, usedUrl: usedEndpoint });
    } else {
      // Return clear guidance with workflow link so the student/user can activate their workflow
      res.status(502).json({
        error: 'Unable to reach active n8n webhook',
        details: lastError,
        workflowUrl: 'https://sravsss29.app.n8n.cloud/workflow/LNrlvTafo4ymbRtP?projectId=Xq3skc603RPxIMGc',
        tip: 'Make sure your workflow is set to "Active" in n8n Cloud, or click "Test step" / "Listen for test event" if using test mode.'
      });
    }
  } catch (err: any) {
    console.error('Error in /api/n8n/chat:', err);
    res.status(500).json({ error: 'Internal error communicating with n8n chatbot', details: err.message });
  }
});


// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SkillTwin AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
