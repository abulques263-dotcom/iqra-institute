import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, X, Sparkles, Loader2, Brain, BookOpen } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

const starterSuggestions = [
  'Mujhe fractions samjhao',
  'Class 5 Maths ka question do',
  'Photosynthesis easy words me samjhao'
];

function offlineAnswer(text: string) {
  const q = text.toLowerCase();
  if (q.includes('fraction') || q.includes('fractions')) return 'Fraction kisi whole cheez ke part ko show karta hai. Jaise pizza ko 4 equal slices me kaato aur 1 slice lo, to 1/4 hoga. Upar wala number numerator aur neeche wala denominator hota hai. Check: 2/4 ko simplest form me kaise likhenge?';
  if (q.includes('photosynthesis')) return 'Photosynthesis me green plants sunlight ki help se carbon dioxide aur water se food banate hain. Is process me oxygen bhi release hoti hai. Check: plants photosynthesis ke liye sunlight ke saath kaunsi gas use karte hain?';
  if (q.includes('multiplication') || q.includes('multiply')) return 'Multiplication ko repeated addition samajh sakte ho. 4 × 3 ka matlab 4 ko 3 baar add karna, yani 4 + 4 + 4 = 12. Check: 6 × 5 kitna hoga?';
  if (q.includes('division') || q.includes('divide')) return 'Division ka matlab kisi quantity ko equal groups me baantna. 12 ÷ 3 ka matlab 12 ko 3 equal groups me baanto, har group me 4 aayega. Check: 20 ÷ 5 kitna hai?';
  return 'AI connection abhi available nahi hai, lekin main basic study help yahin de sakta hoon. Maths, Science, English ya reasoning ka topic likho. Practice ke liye Question Arena bhi use kar sakte ho.';
}

export function AIStudyAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState(starterSuggestions);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (value?: string) => {
    const message = (value ?? input).trim();
    if (!message || loading) return;
    const nextMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(nextMessages); setInput(''); setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: messages.slice(-6), studentClass: 'Class 1 to 8', subject: 'General Studies' })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `AI request failed (${response.status})`);
      setMessages([...nextMessages, { role: 'assistant', content: data.reply || 'Answer generate nahi ho paya.' }]);
      if (Array.isArray(data.suggestions) && data.suggestions.length) setSuggestions(data.suggestions.slice(0, 3));
    } catch (error) {
      console.error('AI assistant error:', error);
      setMessages([...nextMessages, { role: 'assistant', content: offlineAnswer(message) }]);
      setSuggestions(['Ek Maths question do', 'Science ka concept samjhao', 'Reasoning practice do']);
    } finally {
      setLoading(false);
    }
  };

  return <>
    {open && <div className="fixed bottom-20 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[390px] h-[min(680px,calc(100vh-6rem))] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
      <div className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center"><Bot className="w-5 h-5" /></div><div><div className="font-bold">Iqra AI Study Assistant</div><div className="text-xs text-slate-300 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Step-by-step learning</div></div></div>
        <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10" aria-label="Close AI assistant"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-3">
        {messages.length === 0 && <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm"><div className="font-bold text-slate-900 mb-1">AI Study Help</div><p className="text-sm text-slate-600 leading-6">Maths, Science, English aur Reasoning ke doubts poochho. AI available hoga to Gemini answer dega; connection fail hua to basic offline help continue rahegi.</p></div>}
        {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${message.role === 'user' ? 'bg-slate-900 text-white rounded-br-md' : 'bg-white text-slate-700 border border-stone-200 rounded-bl-md shadow-sm'}`}>{message.content}</div></div>)}
        {loading && <div className="flex justify-start"><div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 text-slate-500 flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Answer prepare ho raha hai...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div className="px-3 pt-3 bg-white border-t border-stone-200 shrink-0">
        <div className="grid grid-cols-2 gap-2 pb-2"><button onClick={() => sendMessage('Maths practice question do')} disabled={loading} className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-slate-700 disabled:opacity-50"><Brain className="inline w-3.5 h-3.5 mr-1" />Practice</button><button onClick={() => sendMessage('Kisi concept ko easy example se samjhao')} disabled={loading} className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-slate-700 disabled:opacity-50"><BookOpen className="inline w-3.5 h-3.5 mr-1" />Explain</button></div>
        <div className="flex gap-2 overflow-x-auto pb-2">{suggestions.slice(0, 3).map(s => <button key={s} onClick={() => sendMessage(s)} disabled={loading} className="shrink-0 text-xs px-3 py-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-amber-50 text-slate-700 disabled:opacity-50">{s}</button>)}</div>
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2 pb-3"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Apna question yahan likho..." className="flex-1 min-w-0 rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-200" disabled={loading} /><button type="submit" disabled={!input.trim() || loading} className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center disabled:opacity-40" aria-label="Send question"><Send className="w-4 h-4" /></button></form>
      </div>
    </div>}
    <button type="button" onClick={() => setOpen(v => !v)} className="fixed bottom-5 right-20 sm:right-20 z-[59] w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center" title="Ask Iqra AI" aria-label="Open Iqra AI Study Assistant">{open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}</button>
  </>;
}

export default AIStudyAssistant;
