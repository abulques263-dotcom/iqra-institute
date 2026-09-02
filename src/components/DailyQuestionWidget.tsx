import React, { useState } from 'react';
import { DailyQuestion } from '../types.js';
import { Brain, HelpCircle, CheckCircle, Lightbulb, Eye, EyeOff, BookOpen, ArrowRight, Award } from 'lucide-react';

interface DailyQuestionWidgetProps {
  question: DailyQuestion | null;
  onOpenArchive: () => void;
  onOpenPractice?: () => void;
}

export const DailyQuestionWidget: React.FC<DailyQuestionWidgetProps> = ({
  question,
  onOpenArchive,
  onOpenPractice,
  onAskAiTutor
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!question) {
    return null;
  }

  const subjectBadgeColors: Record<string, string> = {
    Mathematics: 'bg-amber-100 text-amber-900 border-amber-300',
    Science: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    English: 'bg-sky-100 text-sky-900 border-sky-300',
    Reasoning: 'bg-purple-100 text-purple-900 border-purple-300',
    'General Knowledge': 'bg-rose-100 text-rose-900 border-rose-300',
    'Basic Concepts': 'bg-indigo-100 text-indigo-900 border-indigo-300'
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Challenging: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const isCorrect = (opt: string) => {
    if (!question.answer) return false;
    const cleanOpt = opt.toLowerCase().trim();
    const cleanAns = question.answer.toLowerCase().trim();
    return cleanAns.includes(cleanOpt) || cleanOpt.includes(cleanAns);
  };

  return (
    <section id="daily-questions" className="py-16 sm:py-20 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Brain className="w-3.5 h-3.5 text-amber-700" />
            <span>Daily Practice Concept</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Today’s Question
          </h2>
          <p className="text-amber-700 font-bold text-base sm:text-lg font-['Plus_Jakarta_Sans']">
            “Think. Solve. Learn.”
          </p>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            A small daily thinking exercise to sharpen basic concepts and build curiosity. Young learners can attempt it on their own or with their parents.
          </p>
        </div>

        {/* Question Card Container */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-xs font-bold border ${subjectBadgeColors[question.subject] || 'bg-stone-100 text-slate-800'}`}>
                {question.subject}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-slate-700 border border-stone-200">
                {question.studentClass}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${difficultyColors[question.difficulty] || 'bg-stone-50 text-slate-600'}`}>
                {question.difficulty}
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Published: {new Date(question.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-['Plus_Jakarta_Sans']">
              {question.question}
            </h3>

            {/* Optional Image */}
            {question.imageUrl && (
              <div className="rounded-xl overflow-hidden max-w-md my-3 border border-stone-200">
                <img src={question.imageUrl} alt="Question Visual" className="w-full h-auto object-contain" />
              </div>
            )}

            {/* Multiple Choice Options (if present) */}
            {question.options && question.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isAnswerOpt = isCorrect(opt);

                  let btnStyle = 'bg-stone-50 border-stone-200 text-slate-800 hover:bg-stone-100';

                  if (hasSubmitted || showAnswer) {
                    if (isAnswerOpt) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isAnswerOpt) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-amber-50 border-amber-500 text-amber-950 font-semibold ring-1 ring-amber-500';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedOption(opt);
                        setHasSubmitted(true);
                      }}
                      className={`text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {hasSubmitted && isAnswerOpt && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Bar (Hint, Show Answer, View Archive) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Show Answer Toggle */}
              <button
                id="toggle-daily-answer-btn"
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                  showAnswer
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-800 border-stone-300 hover:bg-stone-50'
                }`}
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-600" />}
                <span>{showAnswer ? 'Hide Answer & Explanation' : 'Show Answer'}</span>
              </button>

              {/* Hint button */}
              {question.hint && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              )}
            </div>

            {/* Previous Questions Button */}
            <button
              id="view-previous-questions-btn"
              type="button"
              onClick={onOpenArchive}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 hover:underline transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Previous Questions Archive →</span>
            </button>
          </div>

          {/* Hint Card */}
          {showHint && question.hint && (
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs sm:text-sm text-amber-950 space-y-1 animate-fadeIn">
              <p className="font-bold flex items-center gap-1.5 text-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600" /> Hint:
              </p>
              <p className="pl-5 leading-relaxed">{question.hint}</p>
            </div>
          )}

          {/* Answer & Explanation Section */}
          {showAnswer && (
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Correct Answer:</span>
                <span className="text-base font-extrabold text-emerald-900 font-['Outfit']">{question.answer}</span>
              </div>
              
              {question.explanation && (
                <div className="space-y-1 pt-2 border-t border-emerald-200/60">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Step-by-Step Explanation:</p>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed pl-1">
                    {question.explanation}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Practice Mode Promotion Banner */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-800/60 px-2 py-0.5 rounded text-amber-200">
                <Brain className="w-3 h-3" /> Practice Hub
              </div>
              <h4 className="text-base font-extrabold font-['Outfit']">1,000+ Question Practice Bank</h4>
              <p className="text-xs text-amber-100/90">Test yourself with interactive timed quizzes from Nursery to Class 8.</p>
            </div>
            {onOpenPractice && (
              <button
                type="button"
                onClick={onOpenPractice}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-amber-800 font-bold text-xs hover:bg-amber-50 shadow-sm transition-all"
              >
                Start Practice →
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
