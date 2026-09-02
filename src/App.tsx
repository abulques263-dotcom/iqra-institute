import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, BookOpen, Brain, CheckCircle2, GraduationCap, MapPin, MessageCircle, Phone, Sparkles, Star, Target, Users, X } from 'lucide-react';
import { Logo } from './components/Logo.js';
import { EndlessPractice } from './components/EndlessPractice.js';
import { AIStudyAssistant } from './components/AIStudyAssistant.js';
import { TrialAdmissionSection } from './components/TrialAdmissionSection.js';
import { api } from './api.js';
import { ClassFeeItem, Teacher, WebsiteSettings } from './types.js';

const fallbackSettings: WebsiteSettings = {
  instituteName: 'IQRA INSTITUTE',
  tagline: 'Strong Foundations Today, Confident Futures Tomorrow.',
  phone: '8882257389',
  whatsapp: '7678365870',
  address: '25 Futa Road, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque, Budh Vihar, Sector 63, Noida, Uttar Pradesh',
  timing: 'Morning & Evening Batches (Monday to Saturday)',
  announcement: 'Admissions Open for Nursery to Class 8 — 3-Day Free Trial',
  announcementActive: true,
  email: 'abulques263@gmail.com',
  heroBadge: 'Nursery to Class 8 • Foundation Learning',
  heroDescription: 'Concept-first teaching, regular practice, personal attention and an AI-powered study companion for students.'
};

const fallbackClasses: ClassFeeItem[] = [
  { id: 'nur', name: 'Nursery – UKG', gradeRange: 'Pre-Primary', monthlyFee: 500, description: 'Early foundation, phonics, counting and joyful learning.', features: ['Phonics & sounds', 'Basic counting', 'Motor-skill practice', 'Interactive learning'], order: 1 },
  { id: '14', name: 'Class 1 – 4', gradeRange: 'Primary', monthlyFee: 300, description: 'Strong basics in Maths, English, Science and study habits.', features: ['Core Mathematics', 'English reading', 'Science basics', 'Homework support'], isPopular: true, order: 2 },
  { id: '56', name: 'Class 5 – 6', gradeRange: 'Upper Primary', monthlyFee: 400, description: 'Conceptual learning, problem solving and systematic revision.', features: ['Maths word problems', 'General Science', 'English grammar', 'Weekly tests'], order: 3 },
  { id: '78', name: 'Class 7 – 8', gradeRange: 'Middle School', monthlyFee: 600, description: 'Pre-secondary preparation with deeper concepts and doubt clearing.', features: ['Algebra & Geometry', 'In-depth Science', 'Creative writing', 'Reasoning practice'], order: 4 }
];

const gallery = [
  { title: 'Interactive Classroom', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=82' },
  { title: 'Learning & Mentorship', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=82' },
  { title: 'Books & Reading', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=82' }
];

export default function App() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [classes, setClasses] = useState<ClassFeeItem[]>(fallbackClasses);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [trialOpen, setTrialOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getSettings().catch(() => fallbackSettings),
      api.getClasses().catch(() => fallbackClasses),
      api.getTeachers().catch(() => [])
    ]).then(([s, c, t]) => {
      setSettings(s || fallbackSettings);
      setClasses(c?.length ? c : fallbackClasses);
      setTeachers(t || []);
    });
  }, []);

  const whatsapp = encodeURIComponent('Assalamualaikum, I want to know about IQRA INSTITUTE classes and the 3-day free trial.');
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsapp}`;
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 font-['Plus_Jakarta_Sans']">
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-400" />{settings.announcement || fallbackSettings.announcement}</div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300"><a href={`tel:${settings.phone}`} className="hover:text-white flex items-center gap-1"><Phone className="w-3 h-3" />{settings.phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1"><MessageCircle className="w-3 h-3" />WhatsApp</a></div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbfaf7]/90 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="shrink-0"><Logo size="md" /></button>
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button onClick={() => scroll('programs')}>Programs</button><button onClick={() => scroll('ai-learning')}>AI Learning</button><button onClick={() => scroll('teachers')}>Teachers</button><button onClick={() => scroll('gallery')}>Gallery</button><button onClick={() => scroll('contact')}>Contact</button>
          </div>
          <div className="flex items-center gap-2">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold"><MessageCircle className="w-4 h-4" />WhatsApp</a>
            <button onClick={() => setTrialOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-extrabold shadow-sm"><Sparkles className="w-4 h-4" />Free Trial</button>
            <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden p-2 rounded-xl border border-stone-200 bg-white" aria-label="Open menu">{mobileOpen ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}</button>
          </div>
        </nav>
        {mobileOpen && <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 grid grid-cols-2 gap-2 text-sm font-semibold"><button onClick={() => { scroll('programs'); setMobileOpen(false); }}>Programs</button><button onClick={() => { scroll('ai-learning'); setMobileOpen(false); }}>AI Learning</button><button onClick={() => { scroll('teachers'); setMobileOpen(false); }}>Teachers</button><button onClick={() => { scroll('contact'); setMobileOpen(false); }}>Contact</button></div>}
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-stone-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,.18),transparent_32%),radial-gradient(circle_at_10%_70%,rgba(14,165,233,.10),transparent_28%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-[1.08fr_.92fr] gap-12 items-center relative">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-amber-800"><Sparkles className="w-3.5 h-3.5" />{settings.heroBadge || fallbackSettings.heroBadge}</div>
              <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[.98] font-['Outfit'] text-slate-950">Learning that builds <span className="text-amber-600">strong foundations.</span></h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-slate-600">{settings.heroDescription || fallbackSettings.heroDescription}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={() => setTrialOpen(true)} className="px-6 py-3.5 rounded-2xl bg-slate-950 text-white font-extrabold flex items-center justify-center gap-2">Start 3-Day Free Trial <ArrowRight className="w-4 h-4" /></button>
                <button onClick={() => scroll('ai-learning')} className="px-6 py-3.5 rounded-2xl bg-white border border-stone-300 text-slate-800 font-extrabold flex items-center justify-center gap-2"><Brain className="w-4 h-4 text-amber-600" />Try AI Learning</button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-600"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />Nursery to Class 8</span><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />Affordable monthly fees</span><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />AI-powered practice</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-xl h-64 sm:h-80"><img src={gallery[0].image} alt={gallery[0].title} className="w-full h-full object-cover" /></div>
              <div className="space-y-3 mt-8"><div className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-xl h-40 sm:h-48"><img src={gallery[1].image} alt={gallery[1].title} className="w-full h-full object-cover" /></div><div className="rounded-3xl bg-slate-950 text-white p-5 h-40 sm:h-48 flex flex-col justify-between"><div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center"><Brain className="w-5 h-5" /></div><div><p className="font-black">Endless AI Practice</p><p className="text-xs text-slate-400 mt-1">Fresh questions for every new set.</p></div></div></div>
            </div>
          </div>
        </section>

        <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Programs & Fees</p><h2 className="mt-2 text-3xl sm:text-4xl font-black font-['Outfit']">Simple fees. Serious learning.</h2></div><p className="max-w-xl text-sm leading-6 text-slate-600">The same IQRA fee structure is retained while the learning experience is upgraded with digital practice and AI support.</p></div>
          <div className="mt-8 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {classes.map(c => <div key={c.id} className={`relative rounded-3xl border p-5 bg-white shadow-sm hover:-translate-y-1 transition-transform ${c.isPopular ? 'border-amber-300 ring-2 ring-amber-100' : 'border-stone-200'}`}>
              {c.isPopular && <span className="absolute top-4 right-4 text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Popular</span>}
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
              <h3 className="mt-4 font-black text-lg">{c.name}</h3><p className="text-xs font-bold text-slate-400 mt-1">{c.gradeRange}</p>
              <div className="mt-4 flex items-end gap-1"><span className="text-3xl font-black">₹{c.monthlyFee}</span><span className="text-xs font-bold text-slate-400 pb-1">/ month</span></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{c.description}</p>
              <div className="mt-4 space-y-2">{c.features.slice(0, 4).map(f => <div key={f} className="flex items-start gap-2 text-xs font-semibold text-slate-700"><CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />{f}</div>)}</div>
              <button onClick={() => setTrialOpen(true)} className="mt-5 w-full py-2.5 rounded-xl bg-slate-950 text-white text-xs font-extrabold">Choose this class</button>
            </div>)}
          </div>
        </section>

        <section id="ai-learning" className="bg-slate-950 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div><div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-amber-400"><Brain className="w-4 h-4" />IQRA AI Learning Lab</div><h2 className="mt-3 text-3xl sm:text-5xl font-black font-['Outfit'] leading-tight">A study assistant + endless question practice.</h2><p className="mt-5 text-slate-300 leading-7 max-w-xl">Children can ask concepts in simple English, Hindi or Hinglish, then move directly into fresh practice. The AI question generator creates original class-appropriate MCQs instead of forcing children to repeat the same fixed set.</p><div className="mt-7 grid sm:grid-cols-2 gap-3"><div className="rounded-2xl bg-white/5 border border-white/10 p-4"><Sparkles className="w-5 h-5 text-amber-400" /><p className="mt-3 font-extrabold">AI Tutor</p><p className="text-xs text-slate-400 mt-1">Ask doubts and get step-by-step explanations.</p></div><div className="rounded-2xl bg-white/5 border border-white/10 p-4"><Brain className="w-5 h-5 text-amber-400" /><p className="mt-3 font-extrabold">Endless Practice</p><p className="text-xs text-slate-400 mt-1">Generate new 10-question batches for Class 1–8.</p></div></div></div>
              <div className="rounded-3xl bg-white text-slate-900 p-5 sm:p-7 shadow-2xl"><h3 className="font-black text-xl">Start a Practice Session</h3><p className="text-sm text-slate-500 mt-1">Choose your class, subject and difficulty.</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-amber-50 p-4"><Target className="w-5 h-5 text-amber-700" /><p className="mt-2 text-xs font-black">Personalised</p><p className="text-xs text-slate-600 mt-1">Class-level questions</p></div><div className="rounded-2xl bg-emerald-50 p-4"><Award className="w-5 h-5 text-emerald-700" /><p className="mt-2 text-xs font-black">Instant feedback</p><p className="text-xs text-slate-600 mt-1">Explanation after every answer</p></div></div><p className="mt-6 text-xs font-semibold text-slate-500">Use the floating Brain button to open Endless Practice or the Sparkles button for the AI Study Assistant.</p></div>
            </div>
          </div>
        </section>

        <section id="teachers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Faculty</p><h2 className="mt-2 text-3xl sm:text-4xl font-black font-['Outfit']">Teachers who focus on understanding.</h2></div><Users className="hidden sm:block w-9 h-9 text-amber-600" /></div>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {(teachers.length ? teachers : [
              { id: 't1', name: 'Abulques', qualification: 'Graduation completed from University of Delhi (DU)', role: 'Faculty Member & Foundation Mentor', subjects: ['Mathematics', 'Science', 'Basic Concepts'] },
              { id: 't2', name: 'Inam', qualification: 'Graduation completed from University of Delhi (DU)', role: 'Faculty Member & Academic Guide', subjects: ['English', 'Reasoning', 'Foundation Studies'] }
            ] as Teacher[]).map(t => <div key={t.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-xl">{t.name.charAt(0)}</div><h3 className="mt-4 text-xl font-black">{t.name}</h3><p className="text-sm font-bold text-amber-700 mt-1">{t.role}</p><p className="text-sm text-slate-600 mt-3 leading-6">{t.qualification}</p><div className="mt-4 flex flex-wrap gap-2">{(t.subjects || []).map(s => <span key={s} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-slate-700">{s}</span>)}</div></div>)}
          </div>
        </section>

        <section id="gallery" className="bg-white border-y border-stone-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Learning Environment</p><h2 className="mt-2 text-3xl sm:text-4xl font-black font-['Outfit']">A place designed for focused learning.</h2></div></div><div className="mt-8 grid md:grid-cols-3 gap-4">{gallery.map(g => <div key={g.title} className="group rounded-3xl overflow-hidden border border-stone-200 bg-stone-50"><div className="aspect-[4/3] overflow-hidden"><img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><div className="p-4 font-extrabold text-sm">{g.title}</div></div>)}</div></div>
        </section>

        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"><div className="rounded-[2rem] bg-amber-50 border border-amber-200 p-7 sm:p-10 grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center"><div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-800">Visit IQRA INSTITUTE</p><h2 className="mt-2 text-3xl sm:text-4xl font-black font-['Outfit']">Start with a 3-day free trial.</h2><p className="mt-4 text-sm text-slate-700 leading-7">{settings.address}</p><div className="mt-5 flex flex-wrap gap-3"><a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-950 text-white text-xs font-extrabold"><Phone className="w-4 h-4" />{settings.phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-extrabold"><MessageCircle className="w-4 h-4" />WhatsApp</a></div></div><div className="bg-white rounded-3xl border border-amber-200 p-5 sm:p-7"><div className="flex items-center gap-3"><MapPin className="w-6 h-6 text-amber-700" /><div><p className="font-black">Budh Vihar, Sector 63, Noida</p><p className="text-xs text-slate-500 mt-1">Monday to Saturday · Morning & Evening Batches</p></div></div><button onClick={() => setTrialOpen(true)} className="mt-6 w-full py-3.5 rounded-2xl bg-amber-600 text-white font-extrabold">Book Free Trial</button></div></div></section>
      </main>

      <footer className="border-t border-stone-200 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row gap-5 items-center justify-between"><Logo size="sm" /><p className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} IQRA INSTITUTE · Strong Foundations Today, Confident Futures Tomorrow.</p><div className="flex items-center gap-3 text-xs font-bold"><a href={`tel:${settings.phone}`} className="text-slate-700">Call</a><span className="text-stone-300">·</span><a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-700">WhatsApp</a></div></div></footer>

      <EndlessPractice />
      <AIStudyAssistant />
      {trialOpen && <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"><div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"><button onClick={() => setTrialOpen(false)} className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/90 border border-stone-200" aria-label="Close"><X className="w-5 h-5" /></button><div className="p-5 sm:p-7"><TrialAdmissionSection initialClass="Class 1 – 4" whatsappNumber={settings.whatsapp} phoneNumber={settings.phone} address={settings.address} /></div></div></div>}
    </div>
  );
}
