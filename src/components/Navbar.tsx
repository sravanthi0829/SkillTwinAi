import { useState } from 'react';
import { 
  Sparkles, 
  UserCheck, 
  BarChart3, 
  Compass, 
  FolderGit2, 
  Bot, 
  TrendingUp, 
  Menu, 
  X, 
  RotateCcw,
  MessageSquareText
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { UserProfile } from '../types';

export type TabKey = 'home' | 'skilltwin' | 'skillgaps' | 'roadmap' | 'projects' | 'interview' | 'growth';

interface NavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  hasProfile: boolean;
  profile: UserProfile | null;
  onReset: () => void;
  onOpenChat: (mode?: 'skilltwin' | 'n8n') => void;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  hasProfile,
  profile,
  onReset,
  onOpenChat,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: TabKey; label: string; icon: any }[] = [
    { key: 'home', label: 'Home', icon: Compass },
    { key: 'skilltwin', label: 'My SkillTwin', icon: UserCheck },
    { key: 'skillgaps', label: 'Skill Gaps', icon: BarChart3 },
    { key: 'roadmap', label: 'Roadmap', icon: Compass },
    { key: 'projects', label: 'Projects', icon: FolderGit2 },
    { key: 'interview', label: 'Interview', icon: Bot },
    { key: 'growth', label: 'My Growth', icon: TrendingUp },
  ];

  const handleTabClick = (key: TabKey) => {
    onSelectTab(key);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectTab(hasProfile ? 'skilltwin' : 'home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
                  SkillTwin
                </span>
                <span className="text-xs px-1.5 py-0.5 font-bold uppercase rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Digital Career Twin
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          {hasProfile && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-slate-200 dark:shadow-none'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* n8n Chatbot Button */}
            <button
              onClick={() => onOpenChat('n8n')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-orange-500/20 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 transition-all cursor-pointer shadow-xs"
              title="Open n8n Workflow Chatbot (LNrlvTafo4ymbRtP)"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>n8n Bot</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-mono hidden sm:inline">⚡</span>
            </button>

            {hasProfile && (
              <button
                onClick={() => onOpenChat('skilltwin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 transition-all cursor-pointer shadow-xs"
              >
                <MessageSquareText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Ask SkillTwin</span>
              </button>
            )}

            {hasProfile && (
              <button
                onClick={onReset}
                title="Edit Details / Create New Twin"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-medium">Edit Details</span>
              </button>
            )}

            <ThemeToggle />

            {/* Mobile Menu Button */}
            {hasProfile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && hasProfile && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Ask SkillTwin AI</span>
            </button>
            <button
              onClick={() => {
                onReset();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Edit Details
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
