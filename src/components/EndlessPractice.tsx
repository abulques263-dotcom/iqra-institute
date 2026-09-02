import React, { useMemo, useState } from 'react';
import { ArrowRight, Award, Brain, CheckCircle2, GraduationCap, Loader2, RotateCcw, Sparkles, Trophy, X, XCircle } from 'lucide-react';

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
const tracks = [
  { id: 'school', label: 'School Practice', note: 'NCERT-aligned concepts + daily revision' },
  { id: 'entrance', label: 'AMU / CHS-style Entrance', note: 'Original entrance-pattern practice, not copied papers' },
  { id: 'olympiad', label: 'Olympiad Challenge', note: 'Higher-order thinking and tricky concepts' }
];

function seedFrom(text: string) {
  return text.split('').reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) % 1000003, 7);
}

function localQuestions(studentClass: string, subject: string, difficulty: string, track: string, count: number): PracticeQuestion[] {
  const classNo = Number(studentClass.replace(/\D/g, '')) || 5;
  const seed = seedFrom(`${studentClass}|${subject}|${difficulty}|${track}|${Date.now()}`);
  const questions: PracticeQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const n = Math.abs(seed + i * 97) % 17 + 2;
    let q = '';
    let options: string[] = [];
    let correct = 0;
    let topic = '';
    let explanation = '';

    if (subject === 'Mathematics') {
      if (classNo <= 3) {
        const a = n + i;
        const b = (n % 8) + 2;
        q = track === 'entrance' ? `A shop has ${a} pencils and receives ${b} more. How many pencils are there now?` : `What is ${a} + ${b}?`;
        const ans = a + b;
        options = [String(ans), String(ans + 1), String(ans - 1), String(ans + 2)];
        correct = 0; topic = 'Number Operations'; explanation = `Add ${a} and ${b}: ${a} + ${b} = ${ans}.`;
      } else if (classNo <= 5) {
        const a = n + 6, b = (n % 7) + 3;
        q = `A rectangle has length ${a} cm and breadth ${b} cm. What is its perimeter?`;
        const ans = 2 * (a + b);
        options = [String(ans) + ' cm', String(ans + 5) + ' cm', String(ans - 4) + ' cm', String(ans + 10) + ' cm'];
        correct = 0; topic = 'Mensuration'; explanation = `Perimeter = 2 × (length + breadth) = 2 × (${a} + ${b}) = ${ans} cm.`;
      } else {
        const a = n + 4, b = (n % 6) + 2;
        q = `If 3x + ${a} = ${3 * b + a}, what is x?`;
        const ans = b;
        options = [String(ans), String(ans + 1), String(ans - 1), String(ans + 2)];
        correct = 0; topic = 'Algebra'; explanation = `Subtract ${a} from both sides: 3x = ${3 * b}. Therefore x = ${b}.`;
      }
    } else if (subject === 'Science') {
      const science = classNo <= 3
        ? ['Which organ helps us breathe?', 'Which part of a plant usually makes food?', 'Which sense organ helps us hear?']
        : classNo <= 5
          ? ['Which process changes water into water vapour?', 'Which force pulls objects towards Earth?', 'Which organ pumps blood around the body?']
          : ['Which gas is mainly used by green plants during photosynthesis?', 'Which unit is commonly used to measure electric current?', 'Which part of a cell controls most cell activities?'];
      const idx = Math.abs(seed + i) % science.length;
      q = science[idx];
      if (q.includes('breathe')) { options = ['Lungs', 'Stomach', 'Kidney', 'Skin']; correct = 0; topic = 'Human Body'; explanation = 'The lungs take oxygen into the body and remove carbon dioxide.'; }
      else if (q.includes('makes food')) { options = ['Leaf', 'Root', 'Flower', 'Fruit']; correct = 0; topic = 'Plants'; explanation = 'Leaves contain chlorophyll and are the main site of photosynthesis.'; }
      else if (q.includes('hear')) { options = ['Ears', 'Eyes', 'Nose', 'Tongue']; correct = 0; topic = 'Sense Organs'; explanation = 'The ears receive sound vibrations and help us hear.'; }
      else if (q.includes('water into water')) { options = ['Evaporation', 'Freezing', 'Melting', 'Condensation']; correct = 0; topic = 'States of Matter'; explanation = 'Evaporation changes liquid water into water vapour.'; }
      else if (q.includes('pulls objects')) { options = ['Gravity', 'Friction', 'Magnetism', 'Buoyancy']; correct = 0; topic = 'Force'; explanation = 'Gravity is the force that attracts objects towards Earth.'; }
      else if (q.includes('pumps blood')) { options = ['Heart', 'Liver', 'Lung', 'Brain']; correct = 0; topic = 'Human Body'; explanation = 'The heart pumps blood to different parts of the body.'; }
      else if (q.includes('green plants')) { options = ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen']; correct = 0; topic = 'Photosynthesis'; explanation = 'Plants use carbon dioxide and water to make food with light energy.'; }
      else if (q.includes('electric current')) { options = ['Ampere', 'Volt', 'Ohm', 'Watt']; correct = 0; topic = 'Electricity'; explanation = 'Electric current is measured in amperes (A).'; }
      else { options = ['Nucleus', 'Cell wall', 'Cytoplasm', 'Vacuole']; correct = 0; topic = 'Cell'; explanation = 'The nucleus contains genetic material and controls many cell activities.'; }
    } else if (subject === 'English') {
      const sentences = [
        { q: 'Choose the correct plural of “child”.', a: 'children', o: ['children', 'childs', 'childes', 'childrens'], t: 'Grammar', e: 'The plural form of child is children.' },
        { q: 'Choose the word closest in meaning to “rapid”.', a: 'fast', o: ['fast', 'slow', 'late', 'weak'], t: 'Rapid means fast or quick.' },
        { q: 'Choose the correct sentence.', a: 'She goes to school every day.', o: ['She go to school every day.', 'She goes to school every day.', 'She going school every day.', 'She gone to school every day.'], t: 'Subject-Verb Agreement', e: 'With “she” in the simple present, we use “goes”.' }
      ];
      const item = sentences[Math.abs(seed + i) % sentences.length];
      q = item.q; options = [...item.o]; correct = options.indexOf(item.a); topic = item.t; explanation = item.e;
    } else if (subject === 'Reasoning') {
      const start = n;
      q = `Find the next number: ${start}, ${start + 2}, ${start + 4}, ${start + 6}, ?`;
      const ans = start + 8;
      options = [String(ans), String(ans + 2), String(ans - 2), String(ans + 4)];
      correct = 0; topic = 'Number Series'; explanation = 'The pattern adds 2 each time, so the next number is 8 more than the first term.';
    } else {
      const facts = [
        { q: 'Which is the capital of India?', a: 'New Delhi', o: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], t: 'India GK', e: 'New Delhi is the capital of India.' },
        { q: 'How many days are there in a leap year?', a: '366', o: ['365', '366', '364', '360'], t: 'General Knowledge', e: 'A leap year has 366 days because February has 29 days.' },
        { q: 'Which planet is known as the Red Planet?', a: 'Mars', o: ['Mars', 'Venus', 'Jupiter', 'Mercury'], t: 'Space', e: 'Mars appears reddish because of iron-rich dust on its surface.' }
      ];
      const item = facts[Math.abs(seed + i) % facts.length];
      q = item.q; options = [...item.o]; correct = options.indexOf(item.a); topic = item.t; explanation = item.e;
    }

    if (track === 'entrance') {
      q = `Entrance-style: ${q}`;
      difficulty = difficulty === 'Easy' ? 'Medium' : difficulty;
    }
    if (track === 'olympiad') {
      q = `Challenge: ${q}`;
    }

    questions.push({
      id: `local-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      studentClass,
      subject,
      topic,
      difficulty,
      question: q,
      options,
      correctAnswer: correct,
      answer: options[correct],
      explanation
    });
  }
  return questions;
}

export const EndlessPractice: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [studentClass, setStudentClass] = useState('Class 5');
  const [subject, setSubject] = useState('Mathematics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [track, setTrack] = useState('school');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState('');

  const trackInfo = useMemo(() => tracks.find(t => t.id === track) || tracks[0], [track]);

  const loadBatch = async (resetScore = false) => {
    setLoading(true);
    setNotice('');
    const fallback = localQuestions(studentClass, subject, difficulty, track, 10);
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentClass, subject, difficulty, count: 10, language: 'English/Hinglish', track })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(data.questions) || data.questions.length < 5) throw new Error(data.error || 'AI unavailable');
      setQuestions(data.questions);
      setNotice('AI-generated fresh set loaded.');
    } catch (error) {
      setQuestions(fallback);
      setNotice('AI abhi unavailable hai, lekin practice band nahi hogi — ye questions built-in IQRA practice engine se aaye hain.');
    } finally {
      setIndex(0); setSelected(null); setFinished(false); if (resetScore) setScore(0); setLoading(false);
    }
  };

  const answerCurrent = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[index]?.correctAnswer) setScore(value => value + 1);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(value => value + 1); setSelected(null);
    } else setFinished(true);
  };

  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-20 right-20 z-[59] w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl flex items-center justify-center" title="Endless Question Practice" aria-label="Open Endless Question Practice"><Brain className="w-5 h-5" /></button>

    {open && <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div><div><div className="font-extrabold">IQRA Question Arena</div><div className="text-xs text-slate-400">Class 1–8 • unlimited fresh sets • AI + offline fallback</div></div></div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-800" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        {questions.length === 0 && !finished && <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-3">
            {tracks.map(t => <button key={t.id} onClick={() => setTrack(t.id)} className={`text-left p-4 rounded-2xl border transition ${track === t.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100' : 'border-stone-200 bg-white hover:border-amber-300'}`}><div className="flex items-center gap-2 font-black text-slate-900"><Award className="w-4 h-4 text-amber-600" />{t.label}</div><p className="text-xs text-slate-500 mt-1 leading-5">{t.note}</p></button>)}
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs font-bold text-slate-700">Class<select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white">{classes.map(c => <option key={c}>{c}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Subject<select value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white">{subjects.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="text-xs font-bold text-slate-700">Difficulty<select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 bg-white"><option>Easy</option><option>Medium</option><option>Challenging</option></select></label>
          </div>
          <div className="mt-5 grid sm:grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-50 border border-stone-200 p-4"><div className="text-2xl font-black text-slate-900">8</div><p className="text-xs text-slate-500">classes covered</p></div><div className="rounded-2xl bg-slate-50 border border-stone-200 p-4"><div className="text-2xl font-black text-slate-900">5</div><p className="text-xs text-slate-500">core subjects</p></div><div className="rounded-2xl bg-amber-50 border border-amber-200 p-4"><div className="text-2xl font-black text-amber-700">∞</div><p className="text-xs text-slate-500">fresh practice sets</p></div></div>
          <div className="mt-5 p-5 rounded-2xl bg-amber-50 border border-amber-200"><div className="font-extrabold text-slate-900">{trackInfo.label}</div><p className="mt-1 text-sm text-slate-600">AI available hua to fresh generated questions milenge. AI fail hone par built-in practice engine automatically continue karega.</p><p className="mt-2 text-xs text-slate-500">AMU/CHS section original entrance-style practice hai; official previous-year papers ko verbatim copy nahi kiya gaya hai.</p></div>
          {notice && <div className="mt-4 rounded-xl bg-sky-50 border border-sky-200 p-3 text-sm text-sky-800">{notice}</div>}
          <button onClick={() => loadBatch(true)} disabled={loading} className="mt-5 w-full px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"><GraduationCap className="w-4 h-4" />{loading ? 'Question set ready ho raha hai...' : 'Start 10 Questions'}</button>
        </div>}

        {questions.length > 0 && !finished && questions[index] && <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-stone-50">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3"><span>Question {index + 1} / {questions.length}</span><span>{score} correct</span></div>
          <div className="h-1.5 rounded-full bg-stone-200 mb-5"><div className="h-1.5 rounded-full bg-amber-600" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-sm">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">{questions[index].topic} · {questions[index].difficulty}</div>
            <h2 className="mt-2 text-lg sm:text-2xl font-extrabold leading-relaxed text-slate-900">{questions[index].question}</h2>
            <div className="mt-5 space-y-3">{questions[index].options.map((option, optionIndex) => { const correct = selected !== null && optionIndex === questions[index].correctAnswer; const wrong = selected === optionIndex && !correct; return <button key={optionIndex} disabled={selected !== null} onClick={() => answerCurrent(optionIndex)} className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 ${correct ? 'bg-emerald-50 border-emerald-500' : wrong ? 'bg-rose-50 border-rose-400' : selected === null ? 'bg-white border-stone-200 hover:border-amber-400' : 'bg-stone-50 border-stone-200'}`}><span className="w-7 h-7 shrink-0 rounded-full border flex items-center justify-center font-black text-xs">{String.fromCharCode(65 + optionIndex)}</span><span className="text-sm font-semibold text-slate-800 flex-1">{option}</span>{correct && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}{wrong && <XCircle className="w-5 h-5 text-rose-600" />}</button>; })}</div>
            {selected !== null && <div className="mt-5 bg-slate-50 border border-stone-200 rounded-2xl p-4"><div className="font-extrabold text-sm text-slate-900">Explanation</div><p className="mt-1 text-sm leading-6 text-slate-600">{questions[index].explanation}</p></div>}
          </div>
          {selected !== null && <button onClick={next} className="mt-4 w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-600 text-white font-extrabold inline-flex items-center justify-center gap-2">{index + 1 === questions.length ? 'See Result' : 'Next Question'}<ArrowRight className="w-4 h-4" /></button>}
        </div>}

        {finished && <div className="p-6 sm:p-8 text-center overflow-y-auto">
          <Trophy className="w-12 h-12 mx-auto text-amber-600" />
          <h2 className="mt-3 text-2xl font-black text-slate-900">Set complete</h2>
          <p className="mt-1 text-slate-600">Score: <strong>{score}/{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto"><button onClick={() => loadBatch(false)} disabled={loading} className="px-5 py-3 rounded-2xl bg-amber-600 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"><Sparkles className="w-4 h-4" />{loading ? 'Loading...' : 'Next 10 Fresh Questions'}</button><button onClick={() => { setQuestions([]); setFinished(false); setScore(0); setIndex(0); setSelected(null); }} className="px-5 py-3 rounded-2xl border border-stone-300 font-extrabold text-slate-800 flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" />Change Track</button><button onClick={() => setOpen(false)} className="px-5 py-3 rounded-2xl border border-stone-300 font-extrabold text-slate-800">Close</button></div>
          {notice && <div className="mt-4 rounded-xl bg-sky-50 border border-sky-200 p-3 text-sm text-sky-800">{notice}</div>}
        </div>}
      </div>
    </div>}
  </>;
};

export default EndlessPractice;
