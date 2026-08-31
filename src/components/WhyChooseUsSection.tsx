import React from 'react';
import { ShieldCheck, Target, Repeat, UserCheck, HeartHandshake, TrendingUp, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const reasons = [
    {
      id: 'reason-1',
      title: 'Strong Foundation',
      description: 'Build core concepts from an early age (Nursery to Class 8) so students never feel lost or overwhelmed in higher classes.',
      icon: Target,
      accent: 'bg-amber-500 text-white'
    },
    {
      id: 'reason-2',
      title: 'Regular Practice',
      description: 'Encourage consistent daily study habits and problem-solving discipline through guided homework and worksheets.',
      icon: Repeat,
      accent: 'bg-emerald-600 text-white'
    },
    {
      id: 'reason-3',
      title: 'Personal Attention',
      description: 'Small batch sizes allow our mentors to understand each student\'s individual learning speed and clear doubts patiently.',
      icon: UserCheck,
      accent: 'bg-sky-600 text-white'
    },
    {
      id: 'reason-4',
      title: 'Affordable Fees',
      description: 'Quality learning support accessible to local families at just ₹300 to ₹600 per month with simple monthly payment.',
      icon: HeartHandshake,
      accent: 'bg-rose-500 text-white'
    },
    {
      id: 'reason-5',
      title: 'Progress Focused',
      description: 'Step-by-step improvement tracking, weekly concept review assessments, and gradual confidence building.',
      icon: TrendingUp,
      accent: 'bg-purple-600 text-white'
    },
    {
      id: 'reason-6',
      title: 'Parent Communication',
      description: 'Keeping parents regularly informed about attendance, homework completion, and milestone achievements.',
      icon: MessageSquareQuote,
      accent: 'bg-indigo-600 text-white'
    }
  ];

  return (
    <section id="why-us" className="py-20 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Parent Trust & Quality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Why Choose IQRA INSTITUTE
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Realistic, student-centered learning support built on dedication, patience, and strong values.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-stone-50/80 rounded-2xl border border-stone-200/90 p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${item.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-amber-500 transition-colors font-['Outfit']">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Student Centered</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
