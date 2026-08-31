import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Calendar,
  X
} from 'lucide-react';
import { api } from '../../api.js';
import { QuestionBankItem, QuestionBankStats, DailyQuestion } from '../../types.js';

interface QuestionBankManagerProps {
  onDataUpdated?: () => void;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  onDataUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bank' | 'generator' | 'daily' | 'import-export'>('bank');
  
  // Bank State
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<QuestionBankStats | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Edit / Create Modal State
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionBankItem> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // AI Generator Batch State
  const [aiClass, setAiClass] = useState('Class 1 – 4');
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [aiTopic, setAiTopic] = useState('Fractions and Decimals');
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Challenging'>('Medium');
  const [aiCount, setAiCount] = useState(5);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedBatch, setAiGeneratedBatch] = useState<QuestionBankItem[]>([]);

  // Daily Questions State
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);

  // Import / Export State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    loadStats();
    loadQuestions(1);
    loadDailyQuestions();
  }, []);

  const loadStats = async () => {
    try {
      const s = await api.getQuestionBankStats();
      setStats(s);
    } catch (e) {
      console.warn('Stats load error', e);
    }
  };

  const loadDailyQuestions = async () => {
    try {
      const dq = await api.getDailyQuestions();
      setDailyQuestions(dq);
    } catch (e) {
      console.warn('Daily questions load error', e);
    }
  };

  const loadQuestions = async (pageNum: number = page) => {
    setIsLoading(true);
    try {
      const res = await api.getQuestionBank({
        page: pageNum,
        limit: 15,
        search: searchQuery || undefined,
        subject: filterSubject || undefined,
        studentClass: filterClass || undefined,
        difficulty: filterDifficulty || undefined
      });
      setQuestions(res.questions);
      setTotalQuestions(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load question bank', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadQuestions(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterSubject('');
    setFilterClass('');
    setFilterDifficulty('');
    setTimeout(() => {
      loadQuestions(1);
    }, 50);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      if (isCreatingNew) {
        await api.createQuestion(editingQuestion);
        setSaveMessage('Question created successfully in Question Bank!');
      } else if (editingQuestion.id) {
        await api.updateQuestion(editingQuestion.id, editingQuestion);
        setSaveMessage('Question updated successfully!');
      }

      setEditingQuestion(null);
      setIsCreatingNew(false);
      loadQuestions(page);
      loadStats();
      if (onDataUpdated) onDataUpdated();

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to remove this question from the Question Bank?')) return;
    try {
      await api.deleteQuestion(id);
      loadQuestions(page);
      loadStats();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  const handleSetAsDaily = async (q: QuestionBankItem) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.createDailyQuestion({
        id: 'dq-' + Date.now(),
        date: today,
        subject: q.subject,
        studentClass: q.studentClass,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        hint: q.hint,
        difficulty: q.difficulty,
        isPublished: true,
        createdAt: new Date().toISOString()
      });
      loadDailyQuestions();
      alert(`Question successfully published as Today's Question (${today})!`);
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to set daily question');
    }
  };

  const handleGenerateAiBatch = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await api.generateAiQuestionBatch({
        studentClass: aiClass,
        subject: aiSubject,
        topic: aiTopic,
        difficulty: aiDifficulty,
        count: aiCount
      });
      setAiGeneratedBatch(result);
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI question batch');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddAiBatchToBank = async () => {
    if (aiGeneratedBatch.length === 0) return;
    try {
      await api.bulkImportQuestions(aiGeneratedBatch);
      alert(`Successfully added ${aiGeneratedBatch.length} AI-generated questions to the Question Bank!`);
      setAiGeneratedBatch([]);
      loadQuestions(1);
      loadStats();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to add AI batch to Question Bank');
    }
  };

  const handleExportAll = async () => {
    try {
      const res = await api.exportAllQuestions();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.questions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `iqra_question_bank_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to export questions');
    }
  };

  const handleBulkImport = async () => {
    if (!importJsonText.trim()) return;
    try {
      const parsed = JSON.parse(importJsonText);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const res = await api.bulkImportQuestions(list);
      setImportStatus({
        success: true,
        message: `Successfully imported ${res.addedCount} questions. Total Bank Size: ${res.totalCount}`
      });
      setImportJsonText('');
      loadQuestions(1);
      loadStats();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: err.message || 'Invalid JSON format. Please verify.'
      });
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Toast alert */}
      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('bank')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'bank'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>1,000+ Question Bank ({totalQuestions || stats?.totalCount || 1000})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('generator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'generator'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Batch Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'daily'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Questions ({dailyQuestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('import-export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'import-export'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import / Export JSON</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingQuestion({
              studentClass: 'Class 1 – 4',
              subject: 'Mathematics',
              topic: 'Arithmetic',
              difficulty: 'Medium',
              question: '',
              options: ['', '', '', ''],
              answer: '',
              explanation: '',
              hint: ''
            });
            setIsCreatingNew(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 1: QUESTION BANK LISTING & FILTERS */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'bank' && (
        <div className="space-y-4">
          
          {/* Quick Stats Summary */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-xl font-black text-amber-700 font-['Outfit']">{stats.totalCount}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Total Questions in Bank</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-xl font-black text-emerald-700 font-['Outfit']">{Object.keys(stats.bySubject).length} Subjects</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Maths, Science, English, GK...</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-xl font-black text-slate-800 font-['Outfit']">{Object.keys(stats.byClass).length} Class Grades</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Nursery to Class 8</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-xl font-black text-indigo-700 font-['Outfit']">100% Verified</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Concept Explanations Included</div>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <form onSubmit={handleApplyFilter} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or topics..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50/50"
                />
              </div>

              <div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50/50"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Reasoning">Reasoning</option>
                </select>
              </div>

              <div>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50/50"
                >
                  <option value="">All Classes</option>
                  <option value="Nursery – UKG">Nursery – UKG</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 1 – 4">Class 1 – 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 5 – 6">Class 5 – 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 7 – 8">Class 7 – 8</option>
                </select>
              </div>

              <div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50/50"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>

            </div>

            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
              <span className="text-xs text-slate-500 font-medium">
                Showing {questions.length} of {totalQuestions} questions (Page {page} of {totalPages})
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 text-xs font-bold transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>

          {/* Question Cards Feed */}
          {isLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-slate-500">
              Loading questions from database...
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-slate-500 space-y-2">
              <p className="font-bold text-slate-700">No questions found matching the search criteria.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-amber-700 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-black">
                        {q.studentClass}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 text-xs font-bold">
                        {q.subject}
                      </span>
                      {q.topic && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {q.topic}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'Medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetAsDaily(q)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1"
                        title="Publish this as Today's Daily Question on homepage"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Set as Daily</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestion(q);
                          setIsCreatingNew(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                        title="Edit question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 font-['Outfit']">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(q.options || []).map((opt, oIdx) => {
                      const isCorrect = opt.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
                        opt.startsWith(q.answer) ||
                        q.answer.startsWith(opt);
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-stone-50/70 border-stone-200 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-700 uppercase font-black">Answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Hint */}
                  <div className="text-xs text-slate-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                    <p>
                      <strong className="font-bold text-slate-800">Explanation: </strong>
                      {q.explanation}
                    </p>
                    {q.hint && (
                      <p className="text-amber-800">
                        <strong className="font-bold">Hint: </strong>
                        {q.hint}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => loadQuestions(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-600 font-medium px-2">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => loadQuestions(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 2: AI BATCH QUESTION GENERATOR */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'generator' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-5 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-base text-slate-900 font-['Outfit']">
                AI Batch Question Generator (Gemini 3.7 Flash)
              </h4>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              Generate 1, 5, or 10 curriculum-aligned questions for any class and topic. Review the generated batch, make any edits, and add them directly to the 1,000+ live Question Bank.
            </p>
          </div>

          {/* Generator Controls */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Class</label>
                <select
                  value={aiClass}
                  onChange={(e) => setAiClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Reasoning">Reasoning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  <option value="Easy">Easy (Conceptual)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Challenging">Challenging (Advanced)</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">Topic / Curriculum Concept</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Fractions, Plant Nutrition, English Tenses, Number Patterns..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Batch Count</label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  <option value={1}>1 Question</option>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isGeneratingAi}
                onClick={handleGenerateAiBatch}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingAi ? `Generating ${aiCount} Questions with AI...` : `Generate ${aiCount} Questions`}</span>
              </button>
            </div>
          </div>

          {/* AI Batch Preview List */}
          {aiGeneratedBatch.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div>
                  <h4 className="font-bold text-sm text-amber-950 font-['Outfit']">
                    Generated Batch Preview ({aiGeneratedBatch.length} questions)
                  </h4>
                  <p className="text-xs text-amber-800">
                    Review generated questions below before adding them to your permanent library.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddAiBatchToBank}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Add All {aiGeneratedBatch.length} to Question Bank</span>
                </button>
              </div>

              <div className="space-y-3">
                {aiGeneratedBatch.map((q, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>#{idx + 1} • {q.studentClass} • {q.subject} ({q.difficulty})</span>
                      <button
                        type="button"
                        onClick={() => setAiGeneratedBatch(aiGeneratedBatch.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-bold text-sm text-slate-900">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(q.options || []).map((opt, oIdx) => (
                        <div key={oIdx} className="p-1.5 bg-stone-50 rounded border text-slate-700">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded">
                      Correct Answer: {q.answer}
                    </div>
                    <p className="text-xs text-slate-600 bg-stone-50 p-2 rounded">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 3: DAILY QUESTIONS OF THE DAY */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base text-slate-900 font-['Outfit']">
                Daily Questions of the Day ({dailyQuestions.length})
              </h4>
              <p className="text-xs text-slate-500">
                The top scheduled question is spotlighted live on the website homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                const newDaily: DailyQuestion = {
                  id: 'dq-' + Date.now(),
                  date: today,
                  subject: 'Mathematics',
                  studentClass: 'Class 1 – 4',
                  question: 'What is 15 × 4?',
                  options: ['A) 50', 'B) 60', 'C) 70', 'D) 80'],
                  answer: 'B) 60',
                  explanation: '15 multiplied by 4 equals 60.',
                  hint: 'Think of 15 + 15 + 15 + 15',
                  difficulty: 'Easy',
                  isPublished: true,
                  createdAt: new Date().toISOString()
                };
                api.createDailyQuestion(newDaily).then(() => loadDailyQuestions());
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Daily Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {dailyQuestions.map((dq, idx) => (
              <div key={dq.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-400">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-slate-700 text-xs font-bold">
                      {dq.date}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Live on Homepage
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Delete this daily question?')) {
                        await api.deleteDailyQuestion(dq.id);
                        loadDailyQuestions();
                      }
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-bold text-amber-900">{dq.studentClass} • {dq.subject} ({dq.difficulty})</div>
                <p className="font-bold text-sm text-slate-900">{dq.question}</p>
                <div className="text-xs text-emerald-800 font-bold">Answer: {dq.answer}</div>
                <p className="text-xs text-slate-600">{dq.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-TAB 4: BULK IMPORT & EXPORT */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'import-export' && (
        <div className="space-y-5">
          {/* Export Box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Export 1,000+ Question Bank
                </h4>
                <p className="text-xs text-slate-500">
                  Download the entire question repository in formatted JSON for offline backup or curriculum transfer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportAll}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All to JSON</span>
              </button>
            </div>
          </div>

          {/* Import Box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div>
              <h4 className="font-bold text-base text-slate-900 font-['Outfit']">
                Bulk Import Questions (JSON)
              </h4>
              <p className="text-xs text-slate-500">
                Paste JSON array of questions with keys: <code>studentClass</code>, <code>subject</code>, <code>topic</code>, <code>question</code>, <code>options</code>, <code>answer</code>, <code>explanation</code>, <code>hint</code>, <code>difficulty</code>.
              </p>
            </div>

            {importStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                importStatus.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {importStatus.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{importStatus.message}</span>
              </div>
            )}

            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='[{"studentClass": "Class 5", "subject": "Science", "question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "..."}]'
              className="w-full p-3 rounded-xl border border-stone-300 font-mono text-xs bg-stone-50"
            />

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!importJsonText.trim()}
                onClick={handleBulkImport}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON to Bank</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / CREATE QUESTION MODAL */}
      {/* ---------------------------------------------------- */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <form
            onSubmit={handleSaveQuestion}
            className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                {isCreatingNew ? 'Create New Bank Question' : 'Edit Question'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Class Level</label>
                <input
                  type="text"
                  value={editingQuestion.studentClass || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, studentClass: e.target.value })}
                  placeholder="e.g. Class 1 – 4, Class 5"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  value={editingQuestion.subject || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                  placeholder="e.g. Mathematics, Science"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={editingQuestion.difficulty || 'Medium'}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Topic</label>
              <input
                type="text"
                value={editingQuestion.topic || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                placeholder="e.g. Fractions, Grammar, Solar System"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Question Text</label>
              <textarea
                rows={2}
                value={editingQuestion.question || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                placeholder="Enter question text..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Multiple Choice Options (4 Options)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    value={(editingQuestion.options && editingQuestion.options[optIdx]) || ''}
                    onChange={(e) => {
                      const newOpts = [...(editingQuestion.options || ['', '', '', ''])];
                      newOpts[optIdx] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-emerald-800 block mb-1">Correct Answer</label>
                <input
                  type="text"
                  value={editingQuestion.answer || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                  placeholder="e.g. Option text or value"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/40 text-xs font-bold text-emerald-950"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-800 block mb-1">Hint (Optional)</label>
                <input
                  type="text"
                  value={editingQuestion.hint || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, hint: e.target.value })}
                  placeholder="Optional hint for students"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Step-by-Step Explanation</label>
              <textarea
                rows={2}
                value={editingQuestion.explanation || ''}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                placeholder="Explain why this answer is correct..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs resize-none"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
