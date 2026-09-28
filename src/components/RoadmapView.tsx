import { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillTwinAnalysis, UserProfile, RoadmapTask, RoadmapWeek } from '../types';

interface RoadmapViewProps {
  analysis: SkillTwinAnalysis;
  profile: UserProfile;
  onUpdateAnalysis: (updated: SkillTwinAnalysis) => void;
}

export default function RoadmapView({ analysis, profile, onUpdateAnalysis }: RoadmapViewProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 2, 3, 4]);

  const targetRole = profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal;

  const toggleWeek = (weekNum: number) => {
    if (expandedWeeks.includes(weekNum)) {
      setExpandedWeeks(expandedWeeks.filter((w) => w !== weekNum));
    } else {
      setExpandedWeeks([...expandedWeeks, weekNum]);
    }
  };

  const handleToggleTask = (weekIndex: number, taskId: string) => {
    const updatedRoadmap = [...analysis.roadmap];
    const task = updatedRoadmap[weekIndex].tasks.find((t) => t.id === taskId);
    if (task) {
      const willBeCompleted = !task.completed;
      task.completed = willBeCompleted;

      if (willBeCompleted) {
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // Ignore
        }
      }

      onUpdateAnalysis({
        ...analysis,
        roadmap: updatedRoadmap,
      });
    }
  };

  // Metrics
  const allTasks = analysis.roadmap?.flatMap((w) => w.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const totalTasks = allTasks.length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Curated Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your AI Learning Roadmap
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Customized for {profile.fullName} based on missing skills, daily pace ({profile.availableTime}), and preference for {profile.learningPreference}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-center">
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {completedTasks}/{totalTasks}
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Tasks Done
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Overall Roadmap Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{progressPct}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Metadata badges */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            🎯 Target: {targetRole}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{profile.availableTime} daily</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-violet-500" />
            <span>Format: {profile.learningPreference}</span>
          </span>
        </div>
      </div>

      {/* Week-by-Week Accordion / Cards */}
      <div className="space-y-5">
        {analysis.roadmap?.map((week, weekIdx) => {
          const isExpanded = expandedWeeks.includes(week.weekNumber);
          const weekTasksDone = week.tasks.filter((t) => t.completed).length;
          const weekAllDone = weekTasksDone === week.tasks.length && week.tasks.length > 0;

          return (
            <div
              key={week.weekNumber}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm ${
                weekAllDone
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Week Header */}
              <div
                onClick={() => toggleWeek(week.weekNumber)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 select-none transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    weekAllDone
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  }`}>
                    {weekAllDone ? <CheckCheck className="w-5 h-5" /> : `W${week.weekNumber}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {week.title}
                      </h2>
                      {weekAllDone && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          Complete!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {week.theme} • {weekTasksDone} of {week.tasks.length} tasks completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${week.tasks.length > 0 ? (weekTasksDone / week.tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Tasks List */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  {week.tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(weekIdx, task.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group select-none ${
                          task.completed
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-600 dark:text-slate-300'
                            : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="pt-0.5 flex-shrink-0">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:scale-110" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className={`text-sm font-bold ${
                              task.completed ? 'line-through text-slate-500 dark:text-slate-400 font-medium' : 'text-slate-900 dark:text-white'
                            }`}>
                              {task.title}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 w-fit">
                              ⏱️ {task.estimatedHours}
                            </span>
                          </div>

                          <p className={`text-xs ${
                            task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {task.description}
                          </p>

                          {task.learningResource && (
                            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                              <BookOpen className="w-3 h-3" />
                              <span>Recommended resource: {task.learningResource}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
