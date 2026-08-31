import React, { useState } from 'react';
import { DailyQuestion, SubjectCategory } from '../types.js';
import { X, Search, Filter, BookOpen, Brain, CheckCircle, Lightbulb, Eye, EyeOff, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyQuestionsArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: DailyQuestion[];
}

export const DailyQuestionsArchiveModal: React.FC<DailyQuestionsArchiveModalProps> = ({
  isOpen,
  onClose,
  questions
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const subjects = ['All', 'Mathematics', 'Science', 'English', 'Reasoning', 'General Knowledge'];
  const classes = ['All', 'Nursery', 'Class 1 – 4', 'Class 5 – 6', 'Class 7 – 8'];
  const difficulties = ['All', 'Easy', 'Medium', 'Challenging'];

  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'All' && q.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }
    if (selectedClass !== 'All' && !q.studentClass.toLowerCase().includes(selectedClass.toLowerCase())) {
      return false;
    }
    if (selectedDifficulty !== 'All' && q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const qText = (q.question + ' ' + q.subject + ' ' + q.explanation).toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const subjectBadgeColors: Record<string, string> = {
    Mathematics: 'bg-amber-100 text-amber-900 border-amber-300',
    Science: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    English: 'bg-sky-100 text-sky-900 border-sky-300',
    Reasoning: 'bg-purple-100 text-purple-900 border-purple-300',
    'General Knowledge': 'bg-rose-100 text-rose-900 border-rose-300'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
                Daily Questions Archive
              </h2>
              <p className="text-xs text-slate-500">
                Practice concept-building questions published for IQRA INSTITUTE students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white px-6 py-3.5 border-b border-stone-200 space-y-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword, topic, or concept..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/60"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-amber-600" /> Subject:
            </span>
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSubject === sub
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {sub}
              </button>
            ))}

            <div className="h-4 w-px bg-stone-300 hidden sm:block mx-1" />

            <span className="font-bold text-slate-600 shrink-0">Class:</span>
            {classes.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedClass === cls
                    ? 'bg-slate-800 text-white'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No questions found</p>
              <p className="text-xs text-slate-500">Try changing your search term or filter options.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isAnswerOpen = revealedAnswers[q.id];
              const isHintOpen = revealedHints[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4 hover:border-amber-300 transition-colors"
                >
                  {/* Meta header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-400 font-['Outfit']">#{idx + 1}</span>
                      <span className={`px-2.5 py-0.5 rounded-md font-bold border text-[11px] ${subjectBadgeColors[q.subject] || 'bg-stone-100 text-slate-800'}`}>
                        {q.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 border border-stone-200 text-[11px]">
                        {q.studentClass}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-50 text-slate-600 border border-stone-200 text-[11px]">
                        {q.difficulty}
                      </span>
                    </div>

                    <span className="text-slate-400 text-[11px]">
                      {new Date(q.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans'] leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-slate-800 flex items-center justify-between"
                        >
                          <span>{opt}</span>
                          {isAnswerOpen && (q.answer.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(q.answer.toLowerCase())) && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => toggleAnswer(q.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isAnswerOpen
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-slate-800'
                      }`}
                    >
                      {isAnswerOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{isAnswerOpen ? 'Hide Answer' : 'Show Answer & Explanation'}</span>
                    </button>

                    {q.hint && (
                      <button
                        type="button"
                        onClick={() => toggleHint(q.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isHintOpen ? 'Hide Hint' : 'Hint'}</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Drawer */}
                  {isHintOpen && q.hint && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
                      <span className="font-bold text-amber-800">Hint:</span> {q.hint}
                    </div>
                  )}

                  {/* Explanation Drawer */}
                  {isAnswerOpen && (
                    <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold uppercase text-[11px] text-emerald-800">Correct Answer:</span>
                        <span className="font-extrabold text-sm text-emerald-900 font-['Outfit']">{q.answer}</span>
                      </div>
                      {q.explanation && (
                        <div className="pt-2 border-t border-emerald-200/70 text-slate-700 whitespace-pre-line leading-relaxed">
                          <p className="font-bold text-[11px] uppercase text-emerald-900 mb-0.5">Explanation:</p>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Showing {filteredQuestions.length} practice questions</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-bold hover:bg-stone-800"
          >
            Close Archive
          </button>
        </div>

      </div>
    </div>
  );
};
