import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  MessageSquareText, 
  User, 
  Trash2, 
  ArrowRight,
  Lightbulb,
  ExternalLink,
  Zap,
  Settings2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, SkillTwinAnalysis, ChatMessage } from '../types';
import { askSkillTwin, askN8nChatbot } from '../services/api';

interface SkillTwinChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  analysis: SkillTwinAnalysis | null;
  defaultMode?: 'skilltwin' | 'n8n';
}

const PRESET_QUESTIONS = [
  'What should I learn next?',
  'Which skill should I improve?',
  'Suggest a project for me.',
  'Prepare me for an AI interview.',
  'Create a 30-day study plan.',
  'How can I improve my resume?',
];

export default function SkillTwinChat({ 
  isOpen, 
  onClose, 
  profile, 
  analysis,
  defaultMode = 'skilltwin'
}: SkillTwinChatProps) {
  const [chatMode, setChatMode] = useState<'skilltwin' | 'n8n'>(defaultMode || 'n8n');
  
  // Keep chatMode in sync when defaultMode changes
  useEffect(() => {
    if (defaultMode) {
      setChatMode(defaultMode);
    }
  }, [defaultMode]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // n8n Configuration - User specified webhook
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState(() => {
    const saved = localStorage.getItem('skilltwin_n8n_webhook');
    if (saved && !saved.includes('LNrlvTafo4ymbRtP')) {
      return saved;
    }
    return 'https://sravsss29.app.n8n.cloud/webhook/0672996e-dfee-4168-a1a2-cd6b434aef26/chat';
  });
  const [showN8nSettings, setShowN8nSettings] = useState(false);
  const n8nWorkflowUrl = 'https://sravsss29.app.n8n.cloud/workflow/LNrlvTafo4ymbRtP?projectId=Xq3skc603RPxIMGc';

  const [skillTwinMessages, setSkillTwinMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-st',
      sender: 'assistant',
      text: `Hi ${profile.fullName}! I'm your SkillTwin AI career companion. I know your background in ${profile.degree || 'tech'} and that your target role is ${profile.careerGoal}. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [n8nMessages, setN8nMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-n8n',
      sender: 'assistant',
      text: `⚡ Connected to n8n Cloud Webhook! Ready to assist you with your personalized career path, skills, and projects.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [n8nError, setN8nError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, skillTwinMessages, n8nMessages, chatMode]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInput('');
    setIsLoading(true);
    setN8nError(null);

    if (chatMode === 'skilltwin') {
      setSkillTwinMessages((prev) => [...prev, userMsg]);
      try {
        const res = await askSkillTwin({
          message: messageText.trim(),
          profile,
          analysis,
          history: skillTwinMessages,
        });

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setSkillTwinMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
        setSkillTwinMessages((prev) => [
          ...prev,
          {
            id: `bot-err-${Date.now()}`,
            sender: 'assistant',
            text: 'I am right here with you! Let us keep building your skills step by step.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // n8n Chatbot Mode
      setN8nMessages((prev) => [...prev, userMsg]);
      try {
        const res = await askN8nChatbot({
          message: messageText.trim(),
          webhookUrl: n8nWebhookUrl,
          profile,
        });

        const botMsg: ChatMessage = {
          id: `n8n-${Date.now()}`,
          sender: 'assistant',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setN8nMessages((prev) => [...prev, botMsg]);
      } catch (err: any) {
        console.error(err);
        setN8nError(err.message || 'n8n workflow endpoint not reachable');
        setN8nMessages((prev) => [
          ...prev,
          {
            id: `n8n-err-${Date.now()}`,
            sender: 'assistant',
            text: `⚠️ Notice from n8n Cloud: ${err.message || 'Could not reach webhook endpoint'}.\n\nPlease ensure your workflow LNrlvTafo4ymbRtP is switched to "Active" in n8n Cloud.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    if (chatMode === 'skilltwin') {
      setSkillTwinMessages([
        {
          id: 'welcome-fresh',
          sender: 'assistant',
          text: `Chat refreshed! What career questions can I answer for you, ${profile.fullName}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setN8nMessages([
        {
          id: 'welcome-n8n-fresh',
          sender: 'assistant',
          text: `n8n chat session reset. Ready to trigger workflow actions!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const saveN8nSettings = (url: string) => {
    setN8nWebhookUrl(url);
    localStorage.setItem('skilltwin_n8n_webhook', url);
    setShowN8nSettings(false);
  };

  if (!isOpen) return null;

  const currentMessages = chatMode === 'skilltwin' ? skillTwinMessages : n8nMessages;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[99999] flex justify-end bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full sm:max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300"
      >
        
        {/* Chat Drawer Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
              chatMode === 'n8n' 
                ? 'bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 shadow-rose-500/25'
                : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-500/25'
            }`}>
              {chatMode === 'n8n' ? <Zap className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-cyan-200" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  {chatMode === 'n8n' ? 'n8n Workflow Bot' : 'Ask Your SkillTwin'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {chatMode === 'n8n' ? 'Endpoint: 0672996e-dfee-4168-a1a2-cd6b434aef26' : 'Personalized Gemini Career Twin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {chatMode === 'n8n' && (
              <button
                onClick={() => setShowN8nSettings(!showN8nSettings)}
                title="Configure n8n Webhook"
                className={`p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer ${
                  showN8nSettings ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : ''
                }`}
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClear}
              title="Clear chat history"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher Banner: SkillTwin AI vs n8n Workflow */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => {
                setChatMode('skilltwin');
                setShowN8nSettings(false);
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                chatMode === 'skilltwin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>SkillTwin AI</span>
            </button>
            <button
              onClick={() => {
                setChatMode('n8n');
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                chatMode === 'n8n'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>n8n Cloud Bot</span>
            </button>
          </div>

          <a
            href={n8nWorkflowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            title="Open workflow in n8n Cloud editor"
          >
            <span>Open in n8n</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* n8n Settings Drawer / Alert */}
        {chatMode === 'n8n' && showN8nSettings && (
          <div className="p-4 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-200/80 dark:border-rose-900/60 space-y-2.5 text-xs animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
              <span className="flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-rose-600" />
                <span>n8n Webhook Configuration</span>
              </span>
              <button
                onClick={() => setShowN8nSettings(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Webhook URL:
              </label>
              <input
                type="text"
                value={n8nWebhookUrl}
                onChange={(e) => setN8nWebhookUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="https://sravsss29.app.n8n.cloud/webhook/..."
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-2">
                <button
                  onClick={() => saveN8nSettings('https://sravsss29.app.n8n.cloud/webhook/0672996e-dfee-4168-a1a2-cd6b434aef26/chat')}
                  className="text-[10px] text-rose-700 dark:text-rose-300 underline cursor-pointer"
                >
                  Prod URL
                </button>
                <button
                  onClick={() => saveN8nSettings('https://sravsss29.app.n8n.cloud/webhook-test/0672996e-dfee-4168-a1a2-cd6b434aef26/chat')}
                  className="text-[10px] text-rose-700 dark:text-rose-300 underline cursor-pointer"
                >
                  Test URL
                </button>
              </div>
              <button
                onClick={() => saveN8nSettings(n8nWebhookUrl)}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Preset Prompt Pills (for SkillTwin AI) */}
        {chatMode === 'skilltwin' && (
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1 mb-2">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Suggested Questions:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 whitespace-nowrap transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* n8n Status Ribbon */}
        {chatMode === 'n8n' && (
          <div className="px-4 py-2 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Endpoint: <strong>0672996e...ef26</strong></span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-mono text-[10px]">
              Ready & Live
            </span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {currentMessages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div key={m.id} className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
                    isBot 
                      ? chatMode === 'n8n' ? 'bg-rose-600' : 'bg-indigo-600' 
                      : 'bg-slate-700'
                  }`}
                >
                  {isBot ? (
                    chatMode === 'n8n' ? <Zap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-cyan-200" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60'
                      : chatMode === 'n8n' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {m.text}
                  <div className="text-[9px] mt-1 opacity-60 text-right">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin ${
                chatMode === 'n8n' ? 'border-rose-600' : 'border-indigo-600'
              }`} />
              <span>{chatMode === 'n8n' ? 'Triggering n8n workflow...' : 'SkillTwin is analyzing your profile...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={
              chatMode === 'n8n'
                ? "Ask your n8n workflow agent (0672996e)..."
                : "Ask your SkillTwin anything..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white transition cursor-pointer disabled:opacity-40 ${
              chatMode === 'n8n' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
