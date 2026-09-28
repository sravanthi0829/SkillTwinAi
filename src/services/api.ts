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

export async function askN8nChatbot(params: {
  message: string;
  sessionId?: string;
  webhookUrl?: string;
  profile?: UserProfile;
}): Promise<{ reply: string; usedUrl?: string; error?: string; tip?: string }> {
  const targetUrl = params.webhookUrl || 'https://sravsss29.app.n8n.cloud/webhook/0672996e-dfee-4168-a1a2-cd6b434aef26/chat';
  const sid = params.sessionId || `st-${Date.now()}`;

  // 1. Try calling the n8n production webhook directly from the browser (fully supported on Vercel)
  try {
    const directRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: sid,
        chatInput: params.message,
        message: params.message,
      }),
    });

    if (directRes.ok) {
      const data = await directRes.json().catch(async () => {
        const text = await directRes.text();
        return { output: text };
      });

      const reply = 
        data.output || 
        data.text || 
        data.message || 
        data.response || 
        (Array.isArray(data) && data[0]?.output) || 
        (typeof data === 'string' ? data : JSON.stringify(data));

      return { reply: typeof reply === 'string' ? reply : JSON.stringify(reply), usedUrl: targetUrl };
    }
  } catch (directErr) {
    console.warn('Direct n8n fetch error, trying proxy route fallback:', directErr);
  }

  // 2. Fallback to local server proxy if running in fullstack dev mode
  try {
    const response = await fetch('/api/n8n/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, sessionId: sid, webhookUrl: targetUrl }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (proxyErr) {
    console.warn('Proxy fetch error:', proxyErr);
  }

  throw new Error('Unable to connect to n8n webhook. Please verify your n8n workflow is active.');
}

