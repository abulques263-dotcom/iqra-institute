import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  Lightbulb,
  X,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { api } from '../api.js';
import { ChatMessage } from '../types.js';

interface AIStudyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: {
    question: string;
    options?: string[];
    selectedAnswer?: string;
    correctAnswer: string;
    explanation: string;
    studentClass?: string;
    subject?: string;
  } | null;
  defaultClass?: string;
}

const STARTER_PROMPTS = [
  { label: '2 + 5 kitna hota hai?', icon: '🔢', text: '2 + 5 kitna hota hai? Mujhe aasan tarike se samjhao.' },
  { label: 'What is a noun?', icon: '📖', text: 'What is a noun? Explain with simple examples for school.' },
  { label: 'Explain photosynthesis', icon: '🌱', text: 'Explain photosynthesis in simple words with a plant example.' },
  { label: 'Mujhe fractions samjhao', icon: '🍕', text: 'Mujhe fractions samjhao using pizza slice example.' },
  { label: '5 Maths questions for Class 5', icon: '📝', text: 'Give me 5 maths questions for Class 5 with answers.' },
  { label: 'Quiz me on Science', icon: '🔬', text: 'Quiz me with 3 fun Science questions for my class!' }
];

export const AIStudyAssistant: React.FC<AIStudyAssistantProps> = ({
  isOpen,
  onClose,
  initialQuestion,
  defaultClass = 'Class 1 – 4'
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `### Assalamu Alaikum & Welcome! 🌟\n\nI am your **Iqra AI Study Assistant**.\nI'm here to help you understand your school subjects, explain homework doubts, and practice questions step-by-step!\n\n**You can ask me in English, Hindi, or Hinglish:**\n* *"What is a noun?"*\n* *"2 + 5 kitna hota hai?"*\n* *"Explain photosynthesis in simple words."*\n* *"Mujhe fractions samjhao."*\n\nPick a quick topic below or type your question! 😊`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What is a noun?',
        '2 + 5 kitna hota hai?',
        'Explain photosynthesis',
        'Give me 5 maths questions'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle incoming initialQuestion from Practice Mode
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleExplainPracticeQuestion(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  const handleExplainPracticeQuestion = async (q: NonNullable<AIStudyAssistantProps['initialQuestion']>) => {
    const userPrompt = `Please explain this ${q.subject || 'study'} question:\n"${q.question}"\n(Correct Answer: ${q.correctAnswer})`;
    
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await api.explainQuestionWithAi({
        question: q.question,
        options: q.options,
        selectedAnswer: q.selectedAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        studentClass: q.studentClass || selectedClass
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-resp-' + Date.now(),
        role: 'assistant',
        content: res.explanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Give me a similar question to practice',
          'Explain with another real-life example',
          'Ask another question'
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `**Here is the step-by-step breakdown:**\n\n* **Question:** ${q.question}\n* **Correct Answer:** **${q.correctAnswer}**\n\n**Explanation:**\n${q.explanation || 'This follows the fundamental foundation rule taught in class.'}\n\n*Would you like another practice question on this topic?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Give me another question', 'Explain in simpler words']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-4).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.sendStudyChatMessage({
        message: text,
        history,
        studentClass: selectedClass,
        subject: selectedSubject !== 'All Subjects' ? selectedSubject : undefined
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-resp-' + Date.now(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: res.suggestions && res.suggestions.length > 0 ? res.suggestions : [
          'Give me 3 practice questions',
          'Explain in simpler words',
          'Give another example'
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `I'm happy to help you with **"${text}"**! 🌟\n\nRemember, understanding the basic concept step-by-step is always the key at IQRA INSTITUTE.\n\n* **Try breaking this sum into smaller parts.**\n* **Connect it with everyday examples around you.**\n\nFeel free to ask another question or pick a practice quiz below! 😊`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['What is a noun?', 'Explain fractions', '2 + 5 kitna hota hai?']
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    // Strip simple markdown for clean text copy
    const clean = text.replace(/[*#_`]/g, '');
    navigator.clipboard.writeText(clean);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`>]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05; // Slightly higher/friendly pitch for children
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'assistant',
        content: `### New Chat Started! 🌟\n\nWhat would you like to study or understand today? Ask any question from **Nursery to Class 8** in English or Hindi!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What is a noun?',
          '2 + 5 kitna hota hai?',
          'Explain photosynthesis',
          'Give me 5 maths questions'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-4xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit'] tracking-tight">
                  Iqra AI Study Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Tutor
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Friendly conceptual learning & doubt solver for Nursery to Class 8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium flex items-center gap-1"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={() => {
                if (isSpeaking && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                onClose();
              }}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade & Subject Selector Bar */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-950">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Target Grade:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Nursery – UKG">Nursery – UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 1 – 4">Class 1 – 4 (Foundation)</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 5 – 6">Class 5 – 6 (Middle)</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7 – 8">Class 7 – 8 (Upper Middle)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-amber-950">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Reasoning">Reasoning</option>
            </select>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex gap-3 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-amber-600 text-white shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 sm:p-5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-slate-800 rounded-tl-xs space-y-2.5'
                }`}
              >
                {/* Content Rendering */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Footer Controls for Assistant Messages */}
                {msg.role === 'assistant' && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {msg.timestamp} • Iqra Foundation Tutor
                    </span>

                    <div className="flex items-center gap-1.5">
                      {'speechSynthesis' in window && (
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="p-1 rounded-md hover:bg-stone-100 text-slate-500 hover:text-amber-700 transition-colors flex items-center gap-1 text-[11px]"
                          title="Read out loud"
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="p-1 rounded-md hover:bg-stone-100 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-[11px]"
                        title="Copy text"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Follow-up Suggestion Chips */}
                {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Thinking step-by-step explanation for {selectedClass}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starters Carousel (when few messages) */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Popular Questions to Ask:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {STARTER_PROMPTS.map((p, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(p.text)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-stone-200 text-slate-700 hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything in English, Hindi, or Hinglish (e.g. 'What is a noun?', '2 + 5 kitna hota hai?')..."
              disabled={isTyping}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Tutor</span>
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
            <span>Powered by IQRA Foundation Curriculum & Gemini AI</span>
            <span>Child-friendly & safe learning tutor</span>
          </div>
        </div>

      </div>
    </div>
  );
};
