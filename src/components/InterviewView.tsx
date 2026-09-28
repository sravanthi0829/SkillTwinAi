import { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Award, 
  Mic, 
  MicOff, 
  ThumbsUp, 
  ArrowRight,
  User,
  Star
} from 'lucide-react';
import { UserProfile, InterviewMessage, InterviewSession } from '../types';
import { startInterview, evaluateInterviewAnswer } from '../services/api';

interface InterviewViewProps {
  profile: UserProfile;
  onRecordInterviewScore?: (score: number) => void;
}

const ROLES = [
  'AI Engineer',
  'Software Developer',
  'Data Scientist',
  'Web Developer',
  'App Developer',
  'Cybersecurity Engineer',
  'Cloud Engineer',
  'UI/UX Designer',
];

export default function InterviewView({ profile, onRecordInterviewScore }: InterviewViewProps) {
  const [selectedRole, setSelectedRole] = useState(
    profile.careerGoal === 'Other' && profile.customCareerGoal ? profile.customCareerGoal : profile.careerGoal || 'AI Engineer'
  );

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech dictation is not supported in this browser. Please type your answer.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const handleStartSession = async (roleToUse = selectedRole) => {
    setIsLoading(true);
    try {
      const res = await startInterview(roleToUse, profile);
      setSession({
        role: roleToUse,
        questionCount: 1,
        maxQuestions: 4,
        currentQuestionIndex: 1,
        isCompleted: false,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: res.question,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      });
      setCurrentAnswer('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !session || isLoading) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const answerText = currentAnswer.trim();
    setCurrentAnswer('');

    // Append user message immediately
    const userMsg: InterviewMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...session.messages, userMsg];
    setSession({
      ...session,
      messages: updatedMessages,
    });

    setIsLoading(true);

    try {
      // Find the last question asked
      const lastAiMsg = [...session.messages].reverse().find((m) => m.sender === 'ai');
      const questionText = lastAiMsg?.text || 'Technical question';

      const res = await evaluateInterviewAnswer({
        targetRole: session.role,
        question: questionText,
        answer: answerText,
        questionIndex: session.currentQuestionIndex,
        totalQuestions: session.maxQuestions,
        history: updatedMessages,
      });

      // Update user message with feedback
      userMsg.feedback = res.feedback;

      const newMessages = [...updatedMessages];
      if (res.nextQuestion) {
        newMessages.push({
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      const isCompleted = res.isCompleted || !res.nextQuestion;
      setSession({
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1,
        messages: newMessages,
        isCompleted,
        finalReport: res.finalReport,
      });

      if (isCompleted && res.finalReport && onRecordInterviewScore) {
        onRecordInterviewScore(res.finalReport.overallScore || 85);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>Real-Time AI Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Practice Your Interview 🤖
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select your target role. The AI acts as your senior interviewer, evaluating answers in real time.
            </p>
          </div>

          {/* Role Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSession(null);
              }}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Start / Reset Prompt */}
      {!session ? (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <Bot className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Ready to test your skills as a {selectedRole}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
              You will be asked 4 realistic technical and behavioral interview questions. The AI will evaluate what was good, what was missing, and give actionable suggestions!
            </p>
          </div>

          <button
            onClick={() => handleStartSession(selectedRole)}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Preparing Questions...' : 'Start Mock Interview Now'}</span>
          </button>
        </div>
      ) : (
        /* Active Interview Interactive Interface */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Interview Status Topbar */}
          <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Mock Interview: {session.role}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                (Question {Math.min(session.currentQuestionIndex, session.maxQuestions)} of {session.maxQuestions})
              </span>
            </div>

            <button
              onClick={() => handleStartSession(session.role)}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[560px]">
            {session.messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className="space-y-3">
                  <div className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm ${
                        isAi
                          ? 'bg-gradient-to-tr from-indigo-600 to-violet-600'
                          : 'bg-slate-800 dark:bg-slate-700'
                      }`}
                    >
                      {isAi ? <Bot className="w-5 h-5 text-cyan-200" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <div className="font-semibold text-[11px] mb-1 opacity-70">
                        {isAi ? 'AI Interviewer' : profile.fullName}
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>

                  {/* AI Instant Evaluation Box for the candidate's answer */}
                  {msg.feedback && (
                    <div className="ml-12 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-800/60 pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>AI Answer Assessment</span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span>Score: {msg.feedback.score}/10</span>
                        </div>
                      </div>

                      {/* Required prompt sections: What was good, What was missing, Suggested improvement */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                          <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>What Was Good</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                            {msg.feedback.whatWasGood}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 space-y-1">
                          <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>What Was Missing</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                            {msg.feedback.whatWasMissing}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 space-y-1">
                          <div className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Suggested Improvement</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                            {msg.feedback.suggestedImprovement}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-500 text-xs italic">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span>AI Interviewer is evaluating your answer...</span>
              </div>
            )}

            {/* Final Comprehensive Interview Report */}
            {session.isCompleted && session.finalReport && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white space-y-5 shadow-xl animate-in zoom-in-95 duration-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>Interview Session Complete</span>
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      Candidate Performance Report
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono">
                        {session.finalReport.overallScore}/100
                      </div>
                      <div className="text-[10px] text-indigo-300 font-bold uppercase">
                        Readiness Score
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-100">
                  <strong className="text-white">Readiness Assessment: </strong>
                  {session.finalReport.grade}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                      Demonstrated Strengths
                    </h4>
                    <ul className="space-y-1 text-slate-200">
                      {session.finalReport.strengths.map((str, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      Key Growth Opportunities
                    </h4>
                    <ul className="space-y-1 text-slate-200">
                      {session.finalReport.areasToImprove.map((area, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-slate-300 pt-2 border-t border-indigo-800/80">
                  <strong className="text-white">Summary: </strong>
                  {session.finalReport.summary}
                </div>

                <button
                  onClick={() => handleStartSession(session.role)}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Start Another Interview Session</span>
                </button>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Answer Input Bar */}
          {!session.isCompleted && (
            <form onSubmit={handleSubmitAnswer} className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  title={isRecording ? 'Stop voice recording' : 'Dictate answer with speech'}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isRecording
                      ? 'bg-red-500 text-white border-red-600 animate-pulse'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder={
                    isRecording
                      ? 'Listening to your microphone... speak clearly'
                      : 'Type your answer or explanation here...'
                  }
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  disabled={!currentAnswer.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                >
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center">
                Tip: Click the microphone icon to practice verbal articulation for real interviews.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
