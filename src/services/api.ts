import { SkillTwinAnalysis, UserProfile, InterviewSession } from '../types';

export async function analyzeSkillTwin(profile: UserProfile): Promise<SkillTwinAnalysis> {
  const response = await fetch('/api/analyze-twin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error('Failed to generate SkillTwin analysis');
  }

  return response.json();
}

export async function startInterview(role: string, profile: UserProfile): Promise<{ question: string; questionIndex: number; totalQuestions: number }> {
  const response = await fetch('/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, profile }),
  });

  if (!response.ok) {
    throw new Error('Failed to start interview');
  }

  return response.json();
}

export async function evaluateInterviewAnswer(params: {
  targetRole: string;
  question: string;
  answer: string;
  questionIndex: number;
  totalQuestions: number;
  history: any[];
}): Promise<{
  feedback: {
    whatWasGood: string;
    whatWasMissing: string;
    suggestedImprovement: string;
    score: number;
  };
  nextQuestion: string | null;
  isCompleted: boolean;
  finalReport?: any;
}> {
  const response = await fetch('/api/interview/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate interview response');
  }

  return response.json();
}

export async function askSkillTwin(params: {
  message: string;
  profile: UserProfile;
  analysis: SkillTwinAnalysis | null;
  history?: any[];
}): Promise<{ reply: string; suggestedActions: string[] }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to get SkillTwin response');
  }

  return response.json();
}
