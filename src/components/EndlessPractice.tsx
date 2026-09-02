import React, { useState } from 'react';
import { ArrowRight, Brain, CheckCircle2, GraduationCap, Loader2, RotateCcw, Sparkles, Trophy, X, XCircle } from 'lucide-react';

type PracticeQuestion = {
  id: string;
  studentClass: string;
  subject: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  answer: string;
  explanation: string;
};

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
const subjects = ['Mathematics', 'Science', 'English', 'General Knowledge', 'Reasoning'];

export const EndlessPractice: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [studentClass, setStudentClass] = useState('Class 5');
  const [subject, setSubject] = useState('Mathematics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState('');

  const loadBatch = async (resetScore = false) => {
    setLoading(true);
    setNotice('');
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentClass, subject, difficulty, count: 10, language: 'English/Hinglish' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(data.questions) || !data.questions.length) {
        throw new Error(data.error || 'Questions load nahi ho paye.');
      }
      setQuestions(data.questions);
      setIndex(0);
      setSelected(null);
      setFinished(false);
      if (resetScore) setScore(0);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Questions load nahi ho paye.');
    } finally {
      setLoading(false);
    }
  };

  const current = questions[index];
  const answerCurrent = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === current.correctAnswer) setScore(value => value + 1);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(value => value + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-20 right-20 sm:right-20 z-[59] w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl flex items-center justify-center" title="Endless AI Practice" aria-label="Open Endless AI Practice">
      <Brain className="w-5 h-5" />
    </button>

    {open && <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div><div><div className="font-extrabold">IQRA Endless AI Practice</div><div className="text-xs text-slate-400">New questions whenever you press Next Set</div></div></div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-800" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        {questions.length === 0 && !finished && <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs font-bold text-slate-700">Class<select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white"><option value="All Classes">All Classes</option>{classes.map(c => <option key={c}>{c}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Subject<select value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white">{subjects.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Difficulty<select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white"><option>Easy</option><option>Medium</option><option>Challenging</option></select></label>
          </div>
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200"><div className="font-extrabold text-slate-900">Practice as much as you want</div><p className="mt-1 text-sm text-slate-600">Har set me 10 fresh AI-generated questions aayenge. Set khatam hone par “Next Set” se practice continue kar sakte ho.</p></div>
          {notice && <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{notice}</div>}
          <button onClick={() => loadBatch(true)} disabled={loading} className="mt-5 w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"><GraduationCap className="w-4 h-4" />{loading ? 'Questions ban rahe hain...' : 'Start Practice'}</button>
        </div>}

        {questions.length > 0 && !finished && current && <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-stone-50">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3"><span>Question {index + 1} / {questions.length}</span><span>{score} correct</span></div>
          <div className="h-1.5 rounded-full bg-stone-200 mb-5"><div className="h-1.5 rounded-full bg-amber-600" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-sm">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">{current.topic} · {current.difficulty}</div>
            <h2 className="mt-2 text-lg sm:text-2xl font-extrabold leading-relaxed text-slate-900">{current.question}</h2>
            <div className="mt-5 space-y-3">{current.options.map((option, optionIndex) => { const correct = selected !== null && optionIndex === current.correctAnswer; const wrong = selected === optionIndex && !correct; return <button key={optionIndex} disabled={selected !== null} onClick={() => answerCurrent(optionIndex)} className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 ${correct ? 'bg-emerald-50 border-emerald-500' : wrong ? 'bg-rose-50 border-rose-400' : selected === null ? 'bg-white border-stone-200 hover:border-amber-400' : 'bg-stone-50 border-stone-200'}`}><span className="w-7 h-7 shrink-0 rounded-full border flex items-center justify-center font-black text-xs">{String.fromCharCode(65 + optionIndex)}</span><span className="text-sm font-semibold text-slate-800 flex-1">{option}</span>{correct && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}{wrong && <XCircle className="w-5 h-5 text-rose-600" />}</button>; })}</div>
            {selected !== null && <div className="mt-5 bg-slate-50 border border-stone-200 rounded-2xl p-4"><div className="font-extrabold text-sm text-slate-900">Explanation</div><p className="mt-1 text-sm leading-6 text-slate-600">{current.explanation}</p></div>}
          </div>
          {selected !== null && <button onClick={next} className="mt-4 w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-600 text-white font-extrabold inline-flex items-center justify-center gap-2">{index + 1 === questions.length ? 'See Result' : 'Next Question'}<ArrowRight className="w-4 h-4" /></button>}
        </div>}

        {finished && <div className="p-6 sm:p-8 text-center overflow-y-auto">
          <Trophy className="w-12 h-12 mx-auto text-amber-600" />
          <h2 className="mt-3 text-2xl font-black text-slate-900">Set complete</h2>
          <p className="mt-1 text-slate-600">Score: <strong>{score}/{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto"><button onClick={() => loadBatch(false)} disabled={loading} className="px-5 py-3 rounded-2xl bg-amber-600 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"><Sparkles className="w-4 h-4" />{loading ? 'Loading...' : 'Next Set – 10 New Questions'}</button><button onClick={() => { setQuestions([]); setFinished(false); setScore(0); setIndex(0); setSelected(null); }} className="px-5 py-3 rounded-2xl border border-stone-300 font-extrabold text-slate-800 flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" />Change Class/Subject</button></div>
          {notice && <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{notice}</div>}
        </div>}
      </div>
    </div>}
  </>;
};

export default EndlessPractice;
