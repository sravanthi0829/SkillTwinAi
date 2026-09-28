import { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  Info, 
  Sparkles, 
  Compass, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { SkillTwinAnalysis, UserProfile, SkillScore } from '../types';
import { TabKey } from './Navbar';

interface SkillGapsViewProps {
  analysis: SkillTwinAnalysis;
  profile: UserProfile;
  onNavigate: (tab: TabKey) => void;
}

// Helper to generate visual ASCII-like block bars as shown in prompt: "████████░░ 80%"
function renderAsciiBar(pct: number) {
  const totalBlocks = 10;
  const filledBlocks = Math.round(pct / 10);
  const emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}

export default function SkillGapsView({ analysis, profile, onNavigate }: SkillGapsViewProps) {
  const [filter, setFilter] = useState<'all' | 'strong' | 'improve' | 'learn'>('all');
  const targetRole = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal;

  const allSkills: SkillScore[] = [
    ...(analysis.strongSkills || []),
    ...(analysis.improveSkills || []),
    ...(analysis.learnSkills || []),
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Target Career */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Comparative Benchmark</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Skill Gap Analysis
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comparing your verified background against competitive entry-level market requirements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Target Career
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {targetRole}
              </div>
            </div>
          </div>
        </div>

        {/* Clear Legal Disclaimer as explicitly requested by prompt */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <strong className="font-semibold">Notice: </strong>
            These percentages are AI-generated estimates based on your stated coursework, self-reported skills, and industry heuristics. They are educational guideposts, not official certifications or psychometric assessments.
          </div>
        </div>
      </div>

      {/* Target Career Snapshot Bar Graph (as illustrated in prompt specification) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Benchmark Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                Target: {targetRole}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual block representation of skill coverage vs hiring baseline
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Scale: █ = 10% proficiency
          </div>
        </div>

        <div className="space-y-4">
          {allSkills.slice(0, 6).map((skill) => {
            const isStrong = skill.status === 'strong';
            const isImprove = skill.status === 'improve';
            return (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-200 w-36 sm:w-48 truncate">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs hidden sm:inline tracking-widest text-slate-400">
                      {renderAsciiBar(skill.percentage)}
                    </span>
                    <span className={`font-mono font-bold w-12 text-right ${
                      isStrong ? 'text-emerald-400' : isImprove ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {skill.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isStrong
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isImprove
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500'
                    }`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 3 Core Sections required by the prompt: Strong, Improve, Learn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: ✅ Your Strong Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                ✅ Your Strong Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Skills you already have</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            These form your baseline unfair advantage. Highlight these prominently in your resume and initial interview rounds.
          </p>

          <div className="space-y-3">
            {analysis.strongSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {skill.name}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {skill.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {skill.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 📈 Improve These Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                📈 Improve These Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Knowledge exists, needs depth</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            You know the basic syntax or theory, but need hands-on project work to answer deep architectural questions.
          </p>

          <div className="space-y-3">
            {analysis.improveSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {skill.name}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    {skill.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {skill.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: 🎯 Skills You Should Learn */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                🎯 Skills You Should Learn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Critical missing prerequisites</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Essential skills missing from your current profile that recruiters search for during resume screenings.
          </p>

          <div className="space-y-3">
            {analysis.learnSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {skill.name}
                  </span>
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                    {skill.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {skill.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            Ready to bridge these gaps step-by-step?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Your personalized learning roadmap organizes these missing skills into weekly actionable milestones.
          </p>
        </div>
        <button
          onClick={() => onNavigate('roadmap')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer flex-shrink-0"
        >
          <Compass className="w-4 h-4 text-cyan-300" />
          <span>Go to AI Learning Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
