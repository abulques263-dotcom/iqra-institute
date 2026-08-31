import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  ChevronRight,
  Lightbulb,
  X,
  Play,
  Bot,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { api } from '../api.js';
import { QuestionBankItem, PracticeSessionConfig, PracticeQuestionAttempt } from '../types.js';

interface PracticeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiTutorWithQuestion?: (questionData: {
    question: string;
    options?: string[];
    selectedAnswer?: string;
    correctAnswer: string;
    explanation: string;
    studentClass?: string;
    subject?: string;
  }) => void;
  initialClass?: string;
  initialSubject?: string;
}

export const PracticeModeModal: React.FC<PracticeModeModalProps> = ({
  isOpen,
  onClose,
  onOpenAiTutorWithQuestion,
  initialClass = 'Class 1 – 4',
  initialSubject = 'All'
}) => {
  // State 1: Configuration / Setup
  // State 2: Active Session
  // State 3: Summary Scorecard
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

  // Load topics when subject or class changes
  useEffect(() => {
    if (isOpen) {
      api.getQuestionTopics(
        config.subject !== 'All' ? config.subject : undefined,
        config.studentClass !== 'All' ? config.studentClass : undefined
      ).then(topics => setAvailableTopics(topics));
    }
  }, [config.subject, config.studentClass, isOpen]);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && viewState === 'quiz') {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
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

      if (fetched && fetched.length > 0) {
        setQuestions(fetched);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setShowHint(false);
        setAttempts([]);
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setViewState('quiz');
      } else {
        alert('No questions matched the selected criteria. Try selecting "All Subjects" or "All Classes".');
      }
    } catch (err) {
      console.error('Error starting practice:', err);
      alert('Failed to load practice questions. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    const currentQ = questions[currentIndex];
    // Check answer correctness (matches string or prefix like A))
    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.answer.trim().toLowerCase() ||
      selectedOption.startsWith(currentQ.answer) ||
      currentQ.answer.startsWith(selectedOption);

    const newAttempt: PracticeQuestionAttempt = {
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
    };

    setAttempts(prev => [...prev, newAttempt]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Finish Quiz
      setIsTimerRunning(false);
      setViewState('scorecard');
    }
  };

  const handleAskAiAboutCurrent = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    if (onOpenAiTutorWithQuestion) {
      onOpenAiTutorWithQuestion({
        question: currentQ.question,
        options: currentQ.options,
        selectedAnswer: selectedOption || undefined,
        correctAnswer: currentQ.answer,
        explanation: currentQ.explanation,
        studentClass: currentQ.studentClass,
        subject: currentQ.subject
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Score Calculations
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const scorePercentage = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-4xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden relative">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit']">
                  Practice With AI & 1,000+ Question Bank
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  Concept Training
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foundation questions with instant evaluation, explanations & AI tutor integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VIEW 1: PRACTICE SETUP & FILTERING */}
        {/* ---------------------------------------------------- */}
        {viewState === 'setup' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-stone-50/50">
            {/* Value Proposition Hero */}
            <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent p-6 rounded-2xl border border-amber-200/70 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                    Official 1,000+ Question Library
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                    Select Your Class & Practice Topic
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    Every question comes with step-by-step conceptual reasoning. If you get stuck, the <strong>Iqra AI Tutor</strong> will explain the solution in simple words!
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200 text-center shrink-0 shadow-2xs">
                  <div className="text-2xl font-black text-amber-700 font-['Outfit']">1,000+</div>
                  <div className="text-[11px] font-bold text-slate-600">Curated Questions</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">● Nursery to Class 8</div>
                </div>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Class Level */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>Select Class / Grade Level</span>
                </label>
                <select
                  value={config.studentClass}
                  onChange={(e) => setConfig({ ...config, studentClass: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="All">All Grades (Nursery to Class 8)</option>
                  <option value="Nursery – UKG">Nursery – UKG (Early Foundations)</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 1 – 4">Class 1 – 4 (Primary Foundation)</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 5 – 6">Class 5 – 6 (Middle School)</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 7 – 8">Class 7 – 8 (Upper Middle School)</option>
                </select>
              </div>

              {/* Subject */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Select Subject</span>
                </label>
                <select
                  value={config.subject}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value, topic: 'All' })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="All">All Subjects (Mixed Practice)</option>
                  <option value="Mathematics">Mathematics (Numbers, Geometry, Word Problems)</option>
                  <option value="Science">Science (Plants, Human Body, Matter, Energy)</option>
                  <option value="English">English (Grammar, Vocabulary, Sentence Structure)</option>
                  <option value="General Knowledge">General Knowledge (India, World, Environment)</option>
                  <option value="Reasoning">Reasoning & Logic (Patterns, Sequences, Coding)</option>
                </select>
              </div>

              {/* Topic */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-amber-600" />
                  <span>Specific Topic (Optional)</span>
                </label>
                <select
                  value={config.topic}
                  onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="All">All Topics in Curriculum</option>
                  {availableTopics.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty & Count */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Difficulty</label>
                  <select
                    value={config.difficulty}
                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy (Foundation)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Challenging">Challenging (Advanced)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Questions</label>
                  <select
                    value={config.count}
                    onChange={(e) => setConfig({ ...config, count: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value={5}>5 Questions (Quick Quiz)</option>
                    <option value={10}>10 Questions (Standard)</option>
                    <option value={15}>15 Questions (Thorough)</option>
                    <option value={20}>20 Questions (Mock Test)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Launch Button */}
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={handleStartPractice}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-2xl font-extrabold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
                <span>{isLoading ? 'Loading Questions...' : `Start ${config.count}-Question Practice Session`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 2: ACTIVE INTERACTIVE QUIZ */}
        {/* ---------------------------------------------------- */}
        {viewState === 'quiz' && questions.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-50">
            {/* Quiz Subheader: Progress & Timer */}
            <div className="bg-white border-b border-stone-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 font-['Outfit']">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 text-xs font-bold">
                  {questions[currentIndex].subject}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                  {questions[currentIndex].studentClass}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatTime(timerSeconds)}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{attempts.filter(a => a.isCorrect).length} Correct</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 h-1.5 shrink-0">
              <div
                className="bg-amber-600 h-1.5 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Main Question Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Question Card */}
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {questions[currentIndex].topic || 'Curriculum Concept'} • {questions[currentIndex].difficulty}
                  </span>
                  {questions[currentIndex].hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-bold text-slate-500 hover:text-amber-700 flex items-center gap-1 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                    </button>
                  )}
                </div>

                <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed font-['Outfit']">
                  {questions[currentIndex].question}
                </h3>

                {showHint && questions[currentIndex].hint && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-fadeIn">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Hint:</strong> {questions[currentIndex].hint}
                    </div>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-3">
                {(questions[currentIndex].options || []).map((option, oIdx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = isAnswerSubmitted && (
                    option.trim().toLowerCase() === questions[currentIndex].answer.trim().toLowerCase() ||
                    option.startsWith(questions[currentIndex].answer) ||
                    questions[currentIndex].answer.startsWith(option)
                  );
                  const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrectAnswer;

                  let cardStyle = 'bg-white border-stone-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/30';
                  if (isSelected && !isAnswerSubmitted) {
                    cardStyle = 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20';
                  } else if (isCorrectAnswer) {
                    cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                  } else if (isWrongSelected) {
                    cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-500/20';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs font-black shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isCorrectAnswer && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs shrink-0">
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                          <span>Correct Answer</span>
                        </span>
                      )}

                      {isWrongSelected && (
                        <span className="flex items-center gap-1 text-rose-600 font-bold text-xs shrink-0">
                          <XCircle className="w-5 h-5 fill-rose-100" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-Submission Explanation & AI Tutor Bridge */}
              {isAnswerSubmitted && (
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Step-by-Step Concept Explanation</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Answer: <strong className="text-slate-900">{questions[currentIndex].answer}</strong>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {questions[currentIndex].explanation}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                    <button
                      onClick={handleAskAiAboutCurrent}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                    >
                      <Bot className="w-4 h-4 text-amber-600" />
                      <span>Ask Iqra AI Tutor to explain in simpler Hindi/English</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to end this practice session?')) {
                    setIsTimerRunning(false);
                    setViewState('scorecard');
                  }
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Quit Session
              </button>

              <div className="flex items-center gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 === questions.length ? 'View Performance Scorecard' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 3: PERFORMANCE SCORECARD */}
        {/* ---------------------------------------------------- */}
        {viewState === 'scorecard' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-stone-50">
            {/* Scorecard Hero */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                  Practice Session Completed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Target: {config.studentClass} • {config.subject}
                </p>
              </div>

              {/* Big Score Numbers */}
              <div className="py-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-center gap-8">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
                    {totalCorrect} <span className="text-slate-400 text-xl font-normal">/ {questions.length}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Score</div>
                </div>

                <div className="h-10 w-px bg-stone-300" />

                <div>
                  <div className={`text-3xl sm:text-4xl font-black font-['Outfit'] ${
                    scorePercentage >= 80 ? 'text-emerald-600' : scorePercentage >= 50 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {scorePercentage}%
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Accuracy</div>
                </div>

                <div className="h-10 w-px bg-stone-300" />

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
                    {formatTime(timerSeconds)}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Time Spent</div>
                </div>
              </div>

              {/* Feedback Badge */}
              <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold text-left ${
                scorePercentage >= 80
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  : scorePercentage >= 50
                  ? 'bg-amber-50 text-amber-950 border border-amber-200'
                  : 'bg-rose-50 text-rose-950 border border-rose-200'
              }`}>
                {scorePercentage >= 80 && (
                  <p>🌟 <strong>Outstanding Conceptual Foundation!</strong> You answered most questions correctly and showed great problem-solving clarity.</p>
                )}
                {scorePercentage >= 50 && scorePercentage < 80 && (
                  <p>👏 <strong>Good Effort!</strong> Review the explanations below or ask the Iqra AI Tutor to master the missed concepts.</p>
                )}
                {scorePercentage < 50 && (
                  <p>💡 <strong>Practice Makes Perfect!</strong> Don't worry, every mistake is a chance to learn. Review the explanations below step-by-step.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleStartPractice}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Another Batch</span>
                </button>

                <button
                  onClick={() => setViewState('setup')}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
                >
                  Change Topic / Class
                </button>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <h4 className="font-extrabold text-sm text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span>Detailed Question Review ({attempts.length})</span>
              </h4>

              {attempts.map((att, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border bg-white shadow-2xs space-y-2 ${
                    att.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-slate-800">
                      Q{idx + 1}. {att.question}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      att.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {att.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <span className="text-slate-500 font-medium">Your Pick: </span>
                      <strong className={att.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {att.selectedOption || 'Not selected'}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-emerald-800 font-medium">Correct Answer: </span>
                      <strong className="text-emerald-950">{att.correctAnswer}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                    <strong className="font-bold text-slate-700">Explanation: </strong>
                    {att.explanation}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
