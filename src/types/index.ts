export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface UserProfile {
  // Personal Details
  fullName: string;
  age: string;
  email: string;
  phone?: string;
  location: string;

  // Education
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  cgpa?: string;

  // Skills
  skills: string[];

  // Projects
  hasProjects: 'Yes' | 'No';
  projects: ProjectItem[];

  // Certifications
  hasCertifications: 'Yes' | 'No';
  certifications: CertificationItem[];

  // Interests
  interests: string[];

  // Career Goal
  careerGoal: string;
  customCareerGoal?: string;

  // Learning Preference
  learningPreference: 'Videos' | 'Courses' | 'Reading' | 'Hands-on Projects' | 'Practice Problems' | 'Combination';

  // Available Time
  availableTime: 'Less than 1 hour' | '1–2 hours' | '2–3 hours' | 'More than 3 hours';
}

export interface SkillScore {
  name: string;
  percentage: number;
  category: 'core' | 'framework' | 'tool' | 'soft';
  status: 'strong' | 'improve' | 'learn';
  importance: 'High' | 'Medium' | 'Critical';
  reason: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: string;
  learningResource?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  theme: string;
  tasks: RoadmapTask[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  skillsLearned: string[];
  problemStatement: string;
  mainFeatures: string[];
  stepByStepPlan: string[];
  whyRecommended: string;
}

export interface SkillTwinAnalysis {
  overallMatchScore: number;
  summaryHeadline: string;
  digitalTwinPersona: string;
  strongSkills: SkillScore[];
  improveSkills: SkillScore[];
  learnSkills: SkillScore[];
  roadmap: RoadmapWeek[];
  recommendedProjects: RecommendedProject[];
  twinHighlights: {
    strengthSummary: string;
    gapSummary: string;
    nextBigMilestone: string;
  };
  createdAt: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  feedback?: {
    whatWasGood: string;
    whatWasMissing: string;
    suggestedImprovement: string;
    score: number; // 1-10
  };
}

export interface InterviewSession {
  role: string;
  questionCount: number;
  maxQuestions: number;
  currentQuestionIndex: number;
  messages: InterviewMessage[];
  isCompleted: boolean;
  finalReport?: {
    overallScore: number; // e.g. 82/100
    grade: string; // e.g. "Ready for Junior/Associate roles with minor prep"
    strengths: string[];
    areasToImprove: string[];
    recommendedTopics: string[];
    summary: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
