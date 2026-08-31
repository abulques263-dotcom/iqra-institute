import React from 'react';
import { Eye, Target, Compass, BookOpenCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-24 bg-white border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Our Foundation Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            About IQRA INSTITUTE
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Dedicated to nurturing young minds from Nursery to Class 8
          </p>
        </div>

        {/* The Core Story & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Main Narrative (Left) */}
          <div className="lg:col-span-7 space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-xs space-y-4">
              <p className="font-semibold text-slate-900 text-lg sm:text-xl font-['Outfit'] border-b border-stone-200 pb-3">
                Why Foundation Years (Classes 1–8) Are The Most Crucial
              </p>
              
              <p>
                Today, many students begin taking their studies seriously only when they reach <span className="font-semibold text-slate-900">Classes 9 or 10</span>. By that time, many important years of foundational learning have already passed, and students often start feeling overwhelmed by sudden academic pressure.
              </p>

              <p className="text-amber-950 font-medium bg-amber-50/80 p-4 rounded-xl border border-amber-200/70 text-base">
                <span className="font-bold text-amber-900">IQRA INSTITUTE was started with a different vision.</span> We believe that a child’s foundation should be nurtured and strengthened from an early age, before high-stakes exam pressure begins.
              </p>

              <p>
                Instead of waiting until high school, we help young children understand how to learn, develop regular daily study discipline, build crystal-clear basic concepts, and gradually discover their individual strengths.
              </p>

              <p className="text-slate-800 font-medium">
                Our aim is not simply to make children memorize textbook answers. We want them to truly understand what they are studying, practice consistently, and grow into happy, confident, independent learners.
              </p>
            </div>
          </div>

          {/* Vision & Mission Cards (Right) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Our Vision Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Our Vision</p>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900 leading-snug">
                “Build strong foundations before academic pressure begins.”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Empowering children to approach mathematics, reading, and science with joyful curiosity rather than fear or stress.
              </p>
            </div>

            {/* Our Mission Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-1">Our Mission</p>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900 leading-snug">
                “To provide accessible, quality and consistent learning support for children from an early age.”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Delivering high-quality, attentive tutoring at affordable monthly rates so every family can give their child a solid start in life.
              </p>
            </div>

          </div>

        </div>

        {/* 4 Pillars of Learning at IQRA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">1</div>
            <h4 className="font-bold text-slate-900 text-base">Concept Clarity</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We focus on the 'why' and 'how' behind mathematical operations, language rules, and scientific facts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">2</div>
            <h4 className="font-bold text-slate-900 text-base">Daily Practice Habit</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instilling a routine of everyday problem solving and reading so learning becomes second nature.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">3</div>
            <h4 className="font-bold text-slate-900 text-base">Personal Care</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Small batches ensure no student gets left behind. Doubts are cleared patiently and respectfully.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">4</div>
            <h4 className="font-bold text-slate-900 text-base">Parent Partnership</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Regular feedback to parents on attendance, homework completion, and concept milestones.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
