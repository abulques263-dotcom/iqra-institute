import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, CheckCircle2, XCircle, Clock, HelpCircle, RotateCcw, ArrowRight, BookOpen, GraduationCap, Award, Lightbulb, X, Play, Filter } from 'lucide-react';
import { api } from '../api.js';
import { QuestionBankItem, PracticeSessionConfig, PracticeQuestionAttempt } from '../types.js';

interface PracticeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass?: string;
  initialSubject?: string;
}

export const PracticeModeModal: React.FC<PracticeModeModalProps> = ({
  isOpen,
  onClose,
  initialClass = 'Class 1 – 4',
  initialSubject = 'All'
}) => {
  const [viewState, setViewState] = useState<'setup' | 'quiz' | 'scorecard'>('setup');
  const [config, setConfig] = useState<PracticeSessionConfig>({
    studentClass: initialClass,
    subject: initialSubject,
    topic: 'All',
    difficulty: 'All',
    count: 10
  });
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState<PracticeQuestionAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.getQuestionTopics(
      config.subject !== 'All' ? config.subject : undefined,
      config.studentClass !== 'All' ? config.studentClass : undefined
    ).then(setAvailableTopics).catch(() => setAvailableTopics([]));
  }, [config.subject, config.studentClass, isOpen]);

  useEffect(() => {
    if (!isTimerRunning || viewState !== 'quiz') return;
    const interval = window.setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning, viewState]);

  const handleStartPractice = async () => {
    setIsLoading(true);
    try {
      const fetched = await api.getPracticeQuestions({
        studentClass: config.studentClass !== 'All' ? config.studentClass : undefined,
        subject: config.subject !== 'All' ? config.subject : undefined,
        topic: config.topic !== 'All' ? config.topic : undefined,
        difficulty: config.difficulty !== 'All' ? config.difficulty : undefined,
        count: config.count
      });
      if (!fetched?.length) {
        alert('No questions matched the selected criteria. Try selecting All Subjects or All Classes.');
        return;
      }
      setQuestions(fetched);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setAttempts([]);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setViewState('quiz');
    } catch (err) {
      console.error('Error starting practice:', err);
      alert('Failed to load practice questions. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.answer.trim().toLowerCase() ||
      selectedOption.startsWith(currentQ.answer) || currentQ.answer.startsWith(selectedOption);
    setAttempts(prev => [...prev, {
      questionId: currentQ.id,
      question: currentQ.question,
      subject: currentQ.subject,
      studentClass: currentQ.studentClass,
      options: currentQ.options,
      selectedOption,
      correctAnswer: currentQ.answer,
      isCorrect,
      explanation: currentQ.explanation,
      hint: currentQ.hint
    }]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setIsTimerRunning(false);
      setViewState('scorecard');
    }
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const scorePercentage = questions.length ? Math.round((totalCorrect / questions.length) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-4xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden relative">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md"><Brain className="w-6 h-6" /></div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg font-['Outfit']">Practice & 1,000+ Question Bank</h3>
              <p className="text-xs text-slate-400">Foundation questions with instant evaluation and explanations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        {viewState === 'setup' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-stone-50/50">
            <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent p-6 rounded-2xl border border-amber-200/70">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider">Official 1,000+ Question Library</span>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-2">Select Your Class & Practice Topic</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1">Every question comes with step-by-step conceptual reasoning and simple explanations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-amber-600" />Select Class / Grade Level</label>
                <select value={config.studentClass} onChange={e => setConfig({ ...config, studentClass: e.target.value })} className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <option value="All">All Grades (Nursery to Class 8)</option><option value="Nursery – UKG">Nursery – UKG</option><option value="Class 1">Class 1</option><option value="Class 2">Class 2</option><option value="Class 3">Class 3</option><option value="Class 4">Class 4</option><option value="Class 1 – 4">Class 1 – 4</option><option value="Class 5">Class 5</option><option value="Class 6">Class 6</option><option value="Class 5 – 6">Class 5 – 6</option><option value="Class 7">Class 7</option><option value="Class 8">Class 8</option><option value="Class 7 – 8">Class 7 – 8</option>
                </select>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-amber-600" />Select Subject</label>
                <select value={config.subject} onChange={e => setConfig({ ...config, subject: e.target.value, topic: 'All' })} className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <option value="All">All Subjects (Mixed Practice)</option><option value="Mathematics">Mathematics</option><option value="Science">Science</option><option value="English">English</option><option value="General Knowledge">General Knowledge</option><option value="Reasoning">Reasoning & Logic</option>
                </select>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Filter className="w-4 h-4 text-amber-600" />Specific Topic (Optional)</label>
                <select value={config.topic} onChange={e => setConfig({ ...config, topic: e.target.value })} className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800"><option value="All">All Topics in Curriculum</option>{availableTopics.map((t, i) => <option key={i} value={t}>{t}</option>)}</select>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-slate-800 block mb-1.5">Difficulty</label><select value={config.difficulty} onChange={e => setConfig({ ...config, difficulty: e.target.value })} className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"><option value="All">All Levels</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Challenging">Challenging</option></select></div>
                <div><label className="text-xs font-bold text-slate-800 block mb-1.5">Questions</label><select value={config.count} onChange={e => setConfig({ ...config, count: Number(e.target.value) })} className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option></select></div>
              </div>
            </div>

            <button onClick={handleStartPractice} disabled={isLoading} className="w-full sm:w-auto mx-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"><Play className="w-5 h-5 fill-current" />{isLoading ? 'Loading Questions...' : `Start ${config.count}-Question Practice Session`}</button>
          </div>
        )}

        {viewState === 'quiz' && questions.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-50">
            <div className="bg-white border-b border-stone-200 px-5 py-3 flex items-center justify-between shrink-0"><div className="flex items-center gap-2"><span className="font-extrabold text-sm">Question {currentIndex + 1} of {questions.length}</span><span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 text-xs font-bold">{questions[currentIndex].subject}</span></div><div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Clock className="w-3.5 h-3.5" />{formatTime(timerSeconds)}<span className="hidden sm:inline text-emerald-700">{attempts.filter(a => a.isCorrect).length} Correct</span></div></div>
            <div className="w-full bg-stone-200 h-1.5"><div className="bg-amber-600 h-1.5" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4"><div className="flex items-start justify-between gap-2"><span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{questions[currentIndex].topic || 'Curriculum Concept'} • {questions[currentIndex].difficulty}</span>{questions[currentIndex].hint && <button onClick={() => setShowHint(!showHint)} className="text-xs font-bold text-slate-500 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5 text-amber-600" />{showHint ? 'Hide Hint' : 'Show Hint'}</button>}</div><h3 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed">{questions[currentIndex].question}</h3>{showHint && questions[currentIndex].hint && <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900"><strong>Hint:</strong> {questions[currentIndex].hint}</div>}</div>
              <div className="space-y-3">{(questions[currentIndex].options || []).map((option, i) => { const selected = selectedOption === option; const correct = isAnswerSubmitted && (option.trim().toLowerCase() === questions[currentIndex].answer.trim().toLowerCase() || option.startsWith(questions[currentIndex].answer) || questions[currentIndex].answer.startsWith(option)); const wrong = isAnswerSubmitted && selected && !correct; return <button key={i} disabled={isAnswerSubmitted} onClick={() => setSelectedOption(option)} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${selected && !isAnswerSubmitted ? 'bg-amber-50 border-amber-600' : correct ? 'bg-emerald-50 border-emerald-500' : wrong ? 'bg-rose-50 border-rose-400' : 'bg-white border-stone-200 hover:border-amber-400'}`}><span className="flex items-center gap-3 text-xs sm:text-sm"><span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black">{String.fromCharCode(65 + i)}</span>{option}</span>{correct && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}{wrong && <XCircle className="w-5 h-5 text-rose-600" />}</button>; })}</div>
              {isAnswerSubmitted && <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3"><div className="flex items-center justify-between border-b border-stone-100 pb-2"><span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase"><HelpCircle className="w-4 h-4 text-amber-600" />Step-by-Step Concept Explanation</span><span className="text-xs">Answer: <strong>{questions[currentIndex].answer}</strong></span></div><p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{questions[currentIndex].explanation}</p></div>}
            </div>
            <div className="bg-white border-t border-stone-200 p-4 flex justify-between"><button onClick={() => { if (confirm('Are you sure you want to end this practice session?')) { setIsTimerRunning(false); setViewState('scorecard'); } }} className="text-xs font-bold text-slate-500 px-3 py-2">Quit Session</button>{!isAnswerSubmitted ? <button onClick={handleSubmitAnswer} disabled={!selectedOption} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-40">Submit Answer</button> : <button onClick={handleNextQuestion} className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-2">{currentIndex + 1 === questions.length ? 'View Performance Scorecard' : 'Next Question'}<ArrowRight className="w-4 h-4" /></button>}</div>
          </div>
        )}

        {viewState === 'scorecard' && <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-stone-50 space-y-6"><div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4 max-w-xl mx-auto"><div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto"><Award className="w-9 h-9" /></div><h3 className="text-2xl sm:text-3xl font-black text-slate-900">Practice Session Completed!</h3><p className="text-xs sm:text-sm text-slate-600">Target: {config.studentClass} • {config.subject}</p><div className="py-4 bg-stone-50 rounded-2xl border flex items-center justify-center gap-8"><div><div className="text-3xl font-black">{totalCorrect} <span className="text-slate-400 text-xl font-normal">/ {questions.length}</span></div><div className="text-xs font-bold text-slate-500 uppercase">Score</div></div><div className="h-10 w-px bg-stone-300" /><div><div className="text-3xl font-black">{scorePercentage}%</div><div className="text-xs font-bold text-slate-500 uppercase">Accuracy</div></div><div className="h-10 w-px bg-stone-300" /><div><div className="text-3xl font-black">{formatTime(timerSeconds)}</div><div className="text-xs font-bold text-slate-500 uppercase">Time Spent</div></div></div><div className="p-4 rounded-xl text-xs sm:text-sm font-semibold text-left bg-amber-50 text-amber-950 border border-amber-200">{scorePercentage >= 80 ? 'Outstanding conceptual foundation. Keep practicing.' : scorePercentage >= 50 ? 'Good effort. Review the explanations and practice the missed concepts.' : 'Keep practicing. Every mistake is a chance to learn.'}</div><div className="flex flex-wrap justify-center gap-3"><button onClick={handleStartPractice} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"><RotateCcw className="w-4 h-4" />Try Another Batch</button><button onClick={() => setViewState('setup')} className="px-5 py-2.5 rounded-xl bg-stone-100 text-slate-800 font-bold text-xs">Change Topic / Class</button></div></div><div className="space-y-3 max-w-2xl mx-auto"><h4 className="font-extrabold text-sm">Detailed Question Review ({attempts.length})</h4>{attempts.map((att, i) => <div key={i} className="p-4 rounded-2xl border bg-white space-y-2"><div className="font-bold text-xs">Q{i + 1}. {att.question}</div><div className="grid sm:grid-cols-2 gap-2 text-xs"><div className="p-2 rounded-lg bg-stone-50">Your Pick: <strong>{att.selectedOption || 'Not selected'}</strong></div><div className="p-2 rounded-lg bg-emerald-50">Correct Answer: <strong>{att.correctAnswer}</strong></div></div><p className="text-xs text-slate-600 bg-stone-50 p-2.5 rounded-lg"><strong>Explanation: </strong>{att.explanation}</p></div>)}</div></div>}
      </div>
    </div>
  );
};
