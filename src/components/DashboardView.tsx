import { 
  Sparkles, 
  Target, 
  Code2, 
  FolderGit2, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Clock, 
  BookOpen, 
  Compass, 
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';
import { UserProfile, SkillTwinAnalysis } from '../types';
import { TabKey } from './Navbar';

interface DashboardViewProps {
  profile: UserProfile;
  analysis: SkillTwinAnalysis;
  onNavigate: (tab: TabKey) => void;
  onOpenChat: () => void;
}

export default function DashboardView({ profile, analysis, onNavigate, onOpenChat }: DashboardViewProps) {
  // Calculate completed tasks in roadmap
  const allTasks = analysis.roadmap?.flatMap((w) => w.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const totalTasks = allTasks.length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const targetRole = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Digital Twin Online & Synced</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Hi, {profile.fullName}! 👋
            </h1>
            
            <p className="text-lg sm:text-xl font-medium text-indigo-200">
              Your SkillTwin is ready.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              {analysis.summaryHeadline}
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('skillgaps')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>View Skill Gaps</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer border border-indigo-400/30"
              >
                <Compass className="w-4 h-4 text-cyan-300" />
                <span>Start Roadmap</span>
              </button>
              <button
                onClick={() => onNavigate('interview')}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer border border-slate-700"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Mock Interview</span>
              </button>
            </div>
          </div>

          {/* Twin Readiness Radial / Badge */}
          <div className="flex-shrink-0 w-full md:w-auto bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-indigo-500/30 flex items-center md:flex-col justify-between md:justify-center text-center gap-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${analysis.overallMatchScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{analysis.overallMatchScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-300 font-bold">Match</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-indigo-200">Twin Role Readiness</div>
              <div className="text-[11px] text-slate-400">Target: {targetRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Core Cards as explicitly required by prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Current Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Current Skills</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{profile.skills.length} skills in profile</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('skillgaps')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Strongest: <strong className="text-slate-800 dark:text-slate-200">{analysis.strongSkills[0]?.name || profile.skills[0]}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{analysis.strongSkills.length} Verified Strong</span>
          </div>
        </div>

        {/* Card 2: Career Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Career Goal</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Target Industry Objective</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Primary Goal
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{targetRole}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Persona: <span className="font-medium text-indigo-600 dark:text-indigo-400">{analysis.digitalTwinPersona}</span>
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Next Priority: </span>
                {analysis.twinHighlights.nextBigMilestone}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Daily Commitment:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.availableTime}</span>
          </div>
        </div>

        {/* Card 3: SkillTwin Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">SkillTwin Progress</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Match score & gap metrics</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {analysis.overallMatchScore}/100
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Core Match Readiness</span>
                  <span className="font-bold text-slate-900 dark:text-white">{analysis.overallMatchScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${analysis.overallMatchScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{analysis.strongSkills.length}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Strong</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="font-bold text-amber-700 dark:text-amber-300 text-sm">{analysis.improveSkills.length}</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400">Improve</div>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="font-bold text-rose-700 dark:text-rose-300 text-sm">{analysis.learnSkills.length}</div>
                  <div className="text-[10px] text-rose-600 dark:text-rose-400">To Learn</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="truncate max-w-[200px]">{analysis.twinHighlights.strengthSummary}</span>
            <button
              onClick={() => onNavigate('growth')}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Growth view
            </button>
          </div>
        </div>

        {/* Card 4: Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Projects</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile.projects.length} completed • {analysis.recommendedProjects.length} recommended
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ideas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {profile.projects.length > 0 ? (
                profile.projects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{proj.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{proj.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  No completed projects yet. Check our AI recommended projects to start building!
                </div>
              )}

              {/* Recommended Project Preview */}
              {analysis.recommendedProjects?.[0] && (
                <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Recommended Capstone</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {analysis.recommendedProjects[0].title}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Portfolio Quality:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {profile.projects.length > 1 ? 'High Potential' : 'Needs Capstone'}
            </span>
          </div>
        </div>

        {/* Card 5: Certifications */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Certifications</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile.certifications.length} verified credentials
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Verified
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {profile.certifications.length > 0 ? (
                profile.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cert.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{cert.issuer}</div>
                    </div>
                    {cert.year && (
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {cert.year}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  No certifications listed yet. Taking recognized industry certs can add 15-20% to your twin's market match!
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Education:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{profile.college}</span>
          </div>
        </div>

        {/* Card 6: Learning Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Learning Progress</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Weekly roadmap completion</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Roadmap Tasks Done</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {completedTasks} / {totalTasks} ({taskProgressPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${taskProgressPct}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Style: {profile.learningPreference}</span>
                </div>
                <div className="text-[11px] text-teal-700/80 dark:text-teal-300/80 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Targeting {profile.availableTime} daily pace</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Weeks Planned:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{analysis.roadmap?.length || 4} Weeks</span>
          </div>
        </div>

      </div>

      {/* Floating Ask SkillTwin CTA Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
              Have questions about your career plan?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Your SkillTwin AI assistant can suggest tailored study routines, analyze resume gaps, or give project advice.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenChat}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask Your SkillTwin</span>
        </button>
      </div>
    </div>
  );
}
