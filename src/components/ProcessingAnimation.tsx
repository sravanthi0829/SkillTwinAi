import { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete: () => void;
  isBackendReady: boolean;
}

const STEPS = [
  'Analyzing your skills...',
  'Finding your skill gaps...',
  'Building your career roadmap...',
  'Creating your SkillTwin...',
];

export default function ProcessingAnimation({ onComplete, isBackendReady }: ProcessingAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    return () => clearInterval(timer);
  }, []);

  // When step 3 is reached AND backend data is ready, trigger complete
  useEffect(() => {
    if (currentStepIndex >= STEPS.length - 1 && isBackendReady) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStepIndex, isBackendReady, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl px-4 select-none">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Avatar / Brain Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 animate-spin blur-lg opacity-60" style={{ animationDuration: '4s' }} />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl">
            <BrainCircuit className="w-10 h-10 animate-pulse text-cyan-200" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow-md">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Synthesizing Your Twin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gemini AI is analyzing millions of career data points
          </p>
        </div>

        {/* The 4 steps specified in the prompt */}
        <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : isCurrent
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-[1.02]'
                    : 'text-slate-400 dark:text-slate-600 font-normal'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex-shrink-0" />
                )}
                <span className="text-sm">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((currentStepIndex + 1) / STEPS.length) * 100)}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <span>Almost ready</span>
          <ArrowRight className="w-3 h-3" />
          <span>Entering your personalized dashboard</span>
        </p>
      </div>
    </div>
  );
}
