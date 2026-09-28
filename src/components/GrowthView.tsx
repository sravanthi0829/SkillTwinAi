import { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Code2, 
  FolderGit2, 
  Award, 
  Bot, 
  Compass, 
  CheckCircle2, 
  Printer, 
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  Area
} from 'recharts';
import { SkillTwinAnalysis, UserProfile } from '../types';

interface GrowthViewProps {
  profile: UserProfile;
  analysis: SkillTwinAnalysis;
  interviewScores: number[];
}

export default function GrowthView({ profile, analysis, interviewScores }: GrowthViewProps) {
  const [copied, setCopied] = useState(false);

  // Compute metrics
  const allTasks = analysis.roadmap?.flatMap((w) => w.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const totalTasks = allTasks.length;
  const roadmapPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const targetRole = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal;

  // Chart data: Skill Proficiency distribution
  const allSkills = [
    ...analysis.strongSkills.map((s) => ({ name: s.name, score: s.percentage, status: 'Strong' })),
    ...analysis.improveSkills.map((s) => ({ name: s.name, score: s.percentage, status: 'Improve' })),
    ...analysis.learnSkills.slice(0, 3).map((s) => ({ name: s.name, score: s.percentage, status: 'To Learn' })),
  ];

  // Radar data
  const radarData = [
    { subject: 'Languages', current: 80, target: 90 },
    { subject: 'Frameworks', current: 60, target: 85 },
    { subject: 'Architecture', current: 45, target: 80 },
    { subject: 'Cloud/DevOps', current: 35, target: 75 },
    { subject: 'Problem Solving', current: 75, target: 90 },
    { subject: 'Interview Readiness', current: interviewScores.length > 0 ? interviewScores[interviewScores.length - 1] : 70, target: 95 },
  ];

  // Weekly study hours projection data
  const weeklyStudyData = [
    { week: 'Week 1', plannedHours: 12, completedHours: completedTasks > 0 ? 12 : 6 },
    { week: 'Week 2', plannedHours: 14, completedHours: completedTasks > 2 ? 14 : 0 },
    { week: 'Week 3', plannedHours: 16, completedHours: completedTasks > 5 ? 16 : 0 },
    { week: 'Week 4', plannedHours: 18, completedHours: completedTasks > 8 ? 18 : 0 },
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out my SkillTwin AI profile! I am preparing for ${targetRole} with a ${analysis.overallMatchScore}% readiness score.`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    const fullData = {
      exportedAt: new Date().toISOString(),
      studentProfile: profile,
      skillTwinAnalysis: analysis,
      growthMetrics: {
        completedTasks,
        totalTasks,
        roadmapCompletionPercentage: roadmapPct,
        interviewScores,
        latestInterviewScore: interviewScores.length > 0 ? interviewScores[interviewScores.length - 1] : null,
      },
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skilltwin_${profile.fullName.replace(/\s+/g, '_').toLowerCase()}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Career Velocity Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Growth
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tracking your progress across skills learned, projects built, roadmap milestones, and mock interviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Download all data as JSON"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export All Data (JSON)</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Share Twin'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards as explicitly required by prompt:
          - Skills learned
          - Projects completed
          - Roadmap progress
          - Interview practice
          - Certifications
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Skills Learned */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {profile.skills.length}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Skills in Profile
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {analysis.strongSkills.length} strong, {analysis.learnSkills.length} to learn
            </div>
          </div>
        </div>

        {/* Metric 2: Projects Completed */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {profile.projects.length}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Projects Built
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {analysis.recommendedProjects.length} ideas available
            </div>
          </div>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {roadmapPct}%
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Roadmap Done
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {completedTasks} of {totalTasks} tasks done
            </div>
          </div>
        </div>

        {/* Metric 4: Interview Practice */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {interviewScores.length > 0 ? `${interviewScores[interviewScores.length - 1]}%` : 'Ready'}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Interview Practice
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {interviewScores.length} mock session{interviewScores.length === 1 ? '' : 's'} taken
            </div>
          </div>
        </div>

        {/* Metric 5: Certifications */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {profile.certifications.length}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Certifications
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Industry credentials
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Skill Proficiency Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Skill Proficiency Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proficiency estimates across key technical skills
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allSkills.slice(0, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Proficiency']}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Competency Radar (Current vs Target) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Domain Mastery Balance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current twin coverage vs hiring goal
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Current
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                Hiring Target
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeOpacity={0.4} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Hiring Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Printable Digital Twin Career Card Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Digital Twin Career Summary Badge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified snapshot suitable for portfolio or resume cover letter
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            ID: ST-TWIN-{profile.fullName.slice(0, 3).toUpperCase()}-{profile.age || '21'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Candidate</span>
            <div className="font-bold text-sm text-slate-900 dark:text-white">{profile.fullName}</div>
            <div className="text-slate-500 dark:text-slate-400">{profile.college} ({profile.degree})</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Target Career</span>
            <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{targetRole}</div>
            <div className="text-slate-500 dark:text-slate-400">{analysis.digitalTwinPersona}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Current Twin Readiness</span>
            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
              {analysis.overallMatchScore}% Match
            </div>
            <div className="text-slate-500 dark:text-slate-400">Roadmap: {completedTasks}/{totalTasks} tasks done</div>
          </div>
        </div>
      </div>
    </div>
  );
}
