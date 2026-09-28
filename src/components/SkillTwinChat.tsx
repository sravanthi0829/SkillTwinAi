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
  Lightbulb
} from 'lucide-react';
import { UserProfile, SkillTwinAnalysis, ChatMessage } from '../types';
import { askSkillTwin } from '../services/api';

interface SkillTwinChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  analysis: SkillTwinAnalysis | null;
}

const PRESET_QUESTIONS = [
  'What should I learn next?',
  'Which skill should I improve?',
  'Suggest a project for me.',
  'Prepare me for an AI interview.',
  'Create a 30-day study plan.',
  'How can I improve my resume?',
];

export default function SkillTwinChat({ isOpen, onClose, profile, analysis }: SkillTwinChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hi ${profile.fullName}! I'm your SkillTwin AI career companion. I know your background in ${profile.degree || 'tech'} and that your target role is ${profile.careerGoal}. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await askSkillTwin({
        message: messageText.trim(),
        profile,
        analysis,
        history: messages,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
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
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'assistant',
        text: `Chat refreshed! What career questions can I answer for you, ${profile.fullName}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Chat Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>Ask Your SkillTwin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Context-aware career mentor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
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

        {/* Preset Prompt Pills */}
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

        {/* Message Stream */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div key={m.id} className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
                    isBot ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4 text-cyan-200" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60'
                      : 'bg-indigo-600 text-white'
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
              <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span>SkillTwin is analyzing your profile...</span>
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
            type="text"
            placeholder="Ask your SkillTwin anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
