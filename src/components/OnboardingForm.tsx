import { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Code2, 
  FolderGit2, 
  Award, 
  Heart, 
  Target, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Plus, 
  X, 
  Check, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { UserProfile, ProjectItem, CertificationItem } from '../types';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  initialProfile?: UserProfile | null;
}

const PRESET_SKILLS = [
  'Python',
  'Java',
  'C',
  'C++',
  'JavaScript',
  'HTML/CSS',
  'SQL',
  'Machine Learning',
  'AI',
  'Data Science',
  'Cloud',
  'Cybersecurity',
  'UI/UX',
  'Communication',
  'Leadership',
  'Problem Solving',
];

const PRESET_INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'App Development',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Robotics',
  'Software Development',
  'Design',
];

const CAREER_GOALS = [
  'AI Engineer',
  'Software Developer',
  'Data Scientist',
  'Web Developer',
  'App Developer',
  'Cybersecurity Engineer',
  'Cloud Engineer',
  'UI/UX Designer',
  'Other',
];

const LEARNING_PREFERENCES: ('Videos' | 'Courses' | 'Reading' | 'Hands-on Projects' | 'Practice Problems' | 'Combination')[] = [
  'Videos',
  'Courses',
  'Reading',
  'Hands-on Projects',
  'Practice Problems',
  'Combination',
];

const AVAILABLE_TIMES: ('Less than 1 hour' | '1–2 hours' | '2–3 hours' | 'More than 3 hours')[] = [
  'Less than 1 hour',
  '1–2 hours',
  '2–3 hours',
  'More than 3 hours',
];

export default function OnboardingForm({ onSubmit, isLoading, initialProfile }: OnboardingFormProps) {
  // Form State
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [age, setAge] = useState(initialProfile?.age || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [location, setLocation] = useState(initialProfile?.location || '');

  const [college, setCollege] = useState(initialProfile?.college || '');
  const [degree, setDegree] = useState(initialProfile?.degree || 'B.Tech / B.E.');
  const [branch, setBranch] = useState(initialProfile?.branch || 'Computer Science');
  const [currentYear, setCurrentYear] = useState(initialProfile?.currentYear || '3rd Year');
  const [cgpa, setCgpa] = useState(initialProfile?.cgpa || '');

  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || ['Python', 'HTML/CSS', 'Problem Solving']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [hasProjects, setHasProjects] = useState<'Yes' | 'No'>(initialProfile?.hasProjects || 'Yes');
  const [projects, setProjects] = useState<ProjectItem[]>(
    initialProfile?.projects && initialProfile.projects.length > 0
      ? initialProfile.projects
      : [
          {
            id: 'p1',
            name: 'Smart Student Grade Tracker',
            description: 'A web app calculating semester GPA trends with Python and SQLite.',
            technologies: ['Python', 'SQLite', 'HTML/CSS'],
            link: 'https://github.com/example/grade-tracker',
          },
        ]
  );

  const [hasCertifications, setHasCertifications] = useState<'Yes' | 'No'>(
    initialProfile?.hasCertifications || 'Yes'
  );
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    initialProfile?.certifications && initialProfile.certifications.length > 0
      ? initialProfile.certifications
      : [
          {
            id: 'c1',
            name: 'Python for Data Science Fundamentals',
            issuer: 'Coursera / DeepLearning.AI',
            year: '2025',
          },
        ]
  );

  const [interests, setInterests] = useState<string[]>(
    initialProfile?.interests || ['Artificial Intelligence', 'Data Science', 'Software Development']
  );

  const [careerGoal, setCareerGoal] = useState<string>(initialProfile?.careerGoal || 'AI Engineer');
  const [customCareerGoal, setCustomCareerGoal] = useState(initialProfile?.customCareerGoal || '');

  const [learningPreference, setLearningPreference] = useState<
    'Videos' | 'Courses' | 'Reading' | 'Hands-on Projects' | 'Practice Problems' | 'Combination'
  >(initialProfile?.learningPreference || 'Hands-on Projects');

  const [availableTime, setAvailableTime] = useState<
    'Less than 1 hour' | '1–2 hours' | '2–3 hours' | 'More than 3 hours'
  >(initialProfile?.availableTime || '1–2 hours');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sample Profile Quick-Fillers
  const fillSampleProfile = (role: 'AI' | 'Web') => {
    if (role === 'AI') {
      setFullName('Alex Rivera');
      setAge('21');
      setEmail('alex.rivera@university.edu');
      setPhone('+1 (555) 234-8901');
      setLocation('San Jose, CA');
      setCollege('State University of Technology');
      setDegree('B.S. Computer Science');
      setBranch('Computer Science & Engineering');
      setCurrentYear('3rd Year');
      setCgpa('3.72 / 4.0');
      setSkills(['Python', 'SQL', 'Machine Learning', 'Problem Solving', 'Git']);
      setHasProjects('Yes');
      setProjects([
        {
          id: 'p-ai-1',
          name: 'Customer Churn Predictor',
          description: 'Trained Logistic Regression and Random Forest models on telecom customer records.',
          technologies: ['Python', 'Pandas', 'Scikit-Learn'],
          link: 'https://github.com/alexrivera/churn-predictor',
        },
      ]);
      setHasCertifications('Yes');
      setCertifications([
        {
          id: 'c-ai-1',
          name: 'Machine Learning Specialization',
          issuer: 'Stanford Online / Coursera',
          year: '2025',
        },
      ]);
      setInterests(['Artificial Intelligence', 'Data Science', 'Robotics']);
      setCareerGoal('AI Engineer');
      setLearningPreference('Hands-on Projects');
      setAvailableTime('2–3 hours');
    } else {
      setFullName('Maya Patel');
      setAge('20');
      setEmail('maya.patel@student.edu');
      setPhone('+1 (555) 876-5432');
      setLocation('Austin, TX');
      setCollege('Institute of Information Tech');
      setDegree('B.Tech');
      setBranch('Information Technology');
      setCurrentYear('2nd Year');
      setCgpa('8.6 / 10');
      setSkills(['JavaScript', 'HTML/CSS', 'Python', 'Communication', 'UI/UX']);
      setHasProjects('Yes');
      setProjects([
        {
          id: 'p-web-1',
          name: 'Campus Event Hub',
          description: 'A responsive web portal allowing student clubs to publish and register for campus events.',
          technologies: ['React', 'Tailwind CSS', 'Firebase'],
          link: 'https://github.com/mayapatel/campus-hub',
        },
      ]);
      setHasCertifications('Yes');
      setCertifications([
        {
          id: 'c-web-1',
          name: 'Meta Front-End Developer Certificate',
          issuer: 'Meta / Coursera',
          year: '2025',
        },
      ]);
      setInterests(['Web Development', 'Design', 'Software Development']);
      setCareerGoal('Web Developer');
      setLearningPreference('Combination');
      setAvailableTime('1–2 hours');
    }
  };

  // Skill management
  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Interest management
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Project management
  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: `p-${Date.now()}`,
        name: '',
        description: '',
        technologies: [],
        link: '',
      },
    ]);
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Certification management
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: `c-${Date.now()}`,
        name: '',
        issuer: '',
        year: '2025',
      },
    ]);
  };

  const updateCertification = (index: number, field: keyof CertificationItem, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Submission validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (skills.length === 0) errors.skills = 'Please select or add at least one current skill';
    if (!college.trim()) errors.college = 'College/University name is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors({});

    const profileData: UserProfile = {
      fullName: fullName.trim(),
      age: age.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      college: college.trim(),
      degree: degree.trim(),
      branch: branch.trim(),
      currentYear: currentYear.trim(),
      cgpa: cgpa.trim(),
      skills,
      hasProjects,
      projects: hasProjects === 'Yes' ? projects.filter((p) => p.name.trim().length > 0) : [],
      hasCertifications,
      certifications: hasCertifications === 'Yes' ? certifications.filter((c) => c.name.trim().length > 0) : [],
      interests,
      careerGoal,
      customCareerGoal: careerGoal === 'Other' ? customCareerGoal.trim() : undefined,
      learningPreference,
      availableTime,
    };

    onSubmit(profileData);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Friendly Heading & Subtitle as requested */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Student Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create Your SkillTwin 🚀
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          Tell us about yourself and we'll create your personalized AI career twin.
        </p>

        {/* Quick Demo Pre-fill buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Demo Profiles:</span>
          <button
            type="button"
            onClick={() => fillSampleProfile('AI')}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-medium transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Engineer Student</span>
          </button>
          <button
            type="button"
            onClick={() => fillSampleProfile('Web')}
            className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-medium transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Web Developer Student</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Basic information to identify your twin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  formErrors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Age
              </label>
              <input
                type="number"
                placeholder="e.g. 21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. alex@example.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  formErrors.email ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State / Country (e.g. San Jose, CA)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Education</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your current academic status and background</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                College / University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. State University of Technology"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  formErrors.college ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {formErrors.college && <p className="text-xs text-red-500 mt-1">{formErrors.college}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Degree
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech / B.S. / BCA"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Branch / Department
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science & Engg"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Year
              </label>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
                <option value="Postgraduate / Masters">Postgraduate / Masters</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                CGPA / Percentage <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 8.5 / 10 or 3.7 / 4.0 or 85%"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">What skills do you currently have?</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Select all that apply, or add custom ones below:
            </p>

            <div className="flex flex-wrap gap-2">
              {PRESET_SKILLS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 scale-[1.02]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Skills Added */}
            {skills.filter((s) => !PRESET_SKILLS.includes(s)).length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Custom Skills Added:
                </span>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => !PRESET_SKILLS.includes(s))
                    .map((customSkill) => (
                      <span
                        key={customSkill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60"
                      >
                        {customSkill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(customSkill)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Add your own skill input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add your own skill (e.g. Next.js, PyTorch, Docker)"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
            {formErrors.skills && <p className="text-xs text-red-500 mt-1">{formErrors.skills}</p>}
          </div>
        </div>

        {/* Section 4: Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Have you completed any projects?</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Have you completed any projects?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasProjects('Yes')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    hasProjects === 'Yes'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasProjects('No')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    hasProjects === 'No'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {hasProjects === 'Yes' && (
              <div className="space-y-4 pt-2">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Project #{idx + 1}
                      </span>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Remove project"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Project Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Smart Churn Predictor"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Project Link <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="e.g. https://github.com/username/project"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(idx, 'link', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Project Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="What problem does it solve and what was your role?"
                        value={proj.description}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Technologies Used (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Python, Scikit-Learn, Flask"
                        value={proj.technologies.join(', ')}
                        onChange={(e) =>
                          updateProject(
                            idx,
                            'technologies',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Project</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Certifications */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Do you have any certifications?</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Do you have any certifications?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasCertifications('Yes')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    hasCertifications === 'Yes'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasCertifications('No')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    hasCertifications === 'No'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {hasCertifications === 'Yes' && (
              <div className="space-y-3 pt-2">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 relative"
                  >
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AWS Certified Cloud Practitioner"
                        value={cert.name}
                        onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Issuing Organization
                        </label>
                        {certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCertification(idx)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Amazon Web Services / Coursera"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCertification}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Certification</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Interests */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interests</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">What are you interested in?</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Select multiple domains that excite you:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_INTERESTS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 7: Career Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Career Goal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">What career do you want to pursue?</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CAREER_GOALS.map((goal) => {
                const isSelected = careerGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setCareerGoal(goal)}
                    className={`p-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    <span>{goal}</span>
                  </button>
                );
              })}
            </div>

            {careerGoal === 'Other' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Type your custom career goal:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blockchain Developer, Robotics Vision Engineer, Quantitative Analyst"
                  value={customCareerGoal}
                  onChange={(e) => setCustomCareerGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 text-sm bg-indigo-50/30 dark:bg-indigo-950/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 8: Learning Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Learning Preference</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">How do you prefer to learn?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LEARNING_PREFERENCES.map((pref) => {
              const isSelected = learningPreference === pref;
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setLearningPreference(pref)}
                  className={`p-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                  <span>{pref}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 9: Available Time */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Time</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">How much time can you spend learning every day?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVAILABLE_TIMES.map((time) => {
              const isSelected = availableTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setAvailableTime(time)}
                  className={`p-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  <span>{time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Large Bottom Action Button */}
        <div className="pt-4 pb-8 flex flex-col items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[320px] px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-6 h-6 animate-spin text-amber-300" style={{ animationDuration: '3s' }} />
            <span>✨ Create My SkillTwin</span>
            <ChevronRight className="w-5 h-5 text-indigo-200" />
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
            Takes ~5 seconds to run AI skill gap analysis and generate your personalized roadmap
          </p>
        </div>
      </form>
    </div>
  );
}
