/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar, { TabKey } from './components/Navbar';
import OnboardingForm from './components/OnboardingForm';
import ProcessingAnimation from './components/ProcessingAnimation';
import DashboardView from './components/DashboardView';
import SkillGapsView from './components/SkillGapsView';
import RoadmapView from './components/RoadmapView';
import ProjectsView from './components/ProjectsView';
import InterviewView from './components/InterviewView';
import GrowthView from './components/GrowthView';
import SkillTwinChat from './components/SkillTwinChat';
import { UserProfile, SkillTwinAnalysis, ProjectItem } from './types';
import { analyzeSkillTwin } from './services/api';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skilltwin_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [analysis, setAnalysis] = useState<SkillTwinAnalysis | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skilltwin_analysis');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (profile && analysis) return 'skilltwin';
    return 'home';
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [backendAnalysisReady, setBackendAnalysisReady] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<SkillTwinAnalysis | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [interviewScores, setInterviewScores] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skilltwin_interview_scores');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [82];
        }
      }
    }
    return [82];
  });

  // Save changes to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('skilltwin_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (analysis) {
      localStorage.setItem('skilltwin_analysis', JSON.stringify(analysis));
    }
  }, [analysis]);

  useEffect(() => {
    localStorage.setItem('skilltwin_interview_scores', JSON.stringify(interviewScores));
  }, [interviewScores]);

  // Handle Form Submission -> Trigger AI Analysis & Animation
  const handleFormSubmit = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsProcessing(true);
    setBackendAnalysisReady(false);

    try {
      const result = await analyzeSkillTwin(newProfile);
      setPendingAnalysis(result);
      setBackendAnalysisReady(true);
    } catch (err) {
      console.error('Failed to analyze twin:', err);
      // Fallback is handled gracefully by server
      setBackendAnalysisReady(true);
    }
  };

  // Called when the 4-step loading animation finishes
  const handleAnimationComplete = () => {
    if (pendingAnalysis) {
      setAnalysis(pendingAnalysis);
      setPendingAnalysis(null);
    }
    setIsProcessing(false);
    setActiveTab('skilltwin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setActiveTab('home');
  };

  const handleAddProjectToProfile = (newProj: ProjectItem) => {
    if (!profile) return;
    const updatedProjects = [...profile.projects, newProj];
    const updatedProfile = {
      ...profile,
      hasProjects: 'Yes' as const,
      projects: updatedProjects,
    };
    setProfile(updatedProfile);
  };

  const handleRecordInterviewScore = (score: number) => {
    setInterviewScores((prev) => [...prev, score]);
  };

  const hasCompleteTwin = Boolean(profile && analysis);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasProfile={hasCompleteTwin}
        profile={profile}
        onReset={handleReset}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Onboarding Form if on 'home' tab or if user hasn't generated their twin yet */}
        {(!hasCompleteTwin || activeTab === 'home') ? (
          <OnboardingForm
            onSubmit={handleFormSubmit}
            isLoading={isProcessing}
            initialProfile={profile}
          />
        ) : (
          /* Active Tabs */
          <>
            {activeTab === 'skilltwin' && analysis && profile && (
              <DashboardView
                profile={profile}
                analysis={analysis}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {activeTab === 'skillgaps' && analysis && profile && (
              <SkillGapsView
                analysis={analysis}
                profile={profile}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'roadmap' && analysis && profile && (
              <RoadmapView
                analysis={analysis}
                profile={profile}
                onUpdateAnalysis={(updated) => setAnalysis(updated)}
              />
            )}

            {activeTab === 'projects' && analysis && profile && (
              <ProjectsView
                analysis={analysis}
                profile={profile}
                onAddProjectToProfile={handleAddProjectToProfile}
              />
            )}

            {activeTab === 'interview' && profile && (
              <InterviewView
                profile={profile}
                onRecordInterviewScore={handleRecordInterviewScore}
              />
            )}

            {activeTab === 'growth' && analysis && profile && (
              <GrowthView
                profile={profile}
                analysis={analysis}
                interviewScores={interviewScores}
              />
            )}
          </>
        )}
      </main>

      {/* 4-Step Processing Animation Overlay */}
      {isProcessing && (
        <ProcessingAnimation
          isBackendReady={backendAnalysisReady}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* Ask Your SkillTwin Chat Drawer */}
      {hasCompleteTwin && profile && (
        <SkillTwinChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          profile={profile}
          analysis={analysis}
        />
      )}

      {/* Floating Assistant Launcher Button (Bottom Right) */}
      {hasCompleteTwin && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2 transform hover:-translate-y-1 transition duration-200 cursor-pointer"
          title="Ask Your SkillTwin AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Ask SkillTwin
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">SkillTwin AI</span>
            <span>— Personalized AI Career Digital Twin for Students</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.8 Flash & Full-Stack Node.js
          </p>
        </div>
      </footer>
    </div>
  );
}
