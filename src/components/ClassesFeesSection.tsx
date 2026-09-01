import React from 'react';
import { ClassFeeItem } from '../types.js';
import { Sparkles, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

interface ClassesFeesProps {
  classes: ClassFeeItem[];
  onSelectClassForTrial: (className: string) => void;
}

export const ClassesFeesSection: React.FC<ClassesFeesProps> = ({ classes, onSelectClassForTrial }) => {
  const sortedClasses = [...classes].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="classes" className="py-20 sm:py-24 bg-stone-50/50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Transparent & Affordable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">Classes & Monthly Fees</h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">Clear, honest pricing with zero hidden charges. Monthly payment format for family convenience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {sortedClasses.map((item) => {
            const isFeatured = item.isPopular;
            const displayedFee = item.id === 'cls-nursery-ukg' ? 500 : item.monthlyFee;
            return (
              <div key={item.id} className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 transition-all duration-300 ${isFeatured ? 'border-2 border-amber-500 shadow-lg ring-1 ring-amber-400/30' : 'border border-stone-200 shadow-sm hover:shadow-md'}`}>
                {isFeatured && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-xs flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-200" /> Most Popular</div>}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">{item.name}</h3>
                    <p className="text-xs font-semibold text-amber-800 tracking-wide mt-0.5">{item.gradeRange || 'Foundation Batch'}</p>
                  </div>
                  <div className="py-3 border-y border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">₹{displayedFee}</span>
                      <span className="text-xs font-medium text-slate-500">/ month</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ 3-Day Free Trial Available</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[3rem]">{item.description}</p>
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">What's Included:</p>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {item.features && item.features.length > 0 ? item.features.map((feat, fIdx) => <li key={fIdx} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /><span className="leading-tight">{feat}</span></li>) : <><li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>Daily 1.5 Hours Structured Class</span></li><li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>Core Concept Worksheets</span></li><li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>Weekly Assessment & Revision</span></li></>}
                    </ul>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-100">
                  <button type="button" onClick={() => onSelectClassForTrial(item.name)} className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${isFeatured ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm' : 'bg-stone-900 hover:bg-slate-800 text-white'}`}>
                    <span>Start 3-Day Trial</span><ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs max-w-3xl mx-auto space-y-2">
          <p className="text-sm font-bold text-slate-800 font-['Plus_Jakarta_Sans']">“Affordable monthly learning support designed for families.”</p>
          <p className="text-xs text-slate-500 leading-relaxed">All fees are charged purely on a monthly basis without long-term contracts. Parents are welcome to visit or message anytime to discuss their child's requirements.</p>
        </div>
      </div>
    </section>
  );
};