import React from 'react';
import { Teacher } from '../types.js';
import { GraduationCap, BookOpen, Users, CheckCircle2, Award, Heart } from 'lucide-react';

interface TeachersProps {
  teachers: Teacher[];
  onOpenTrial: () => void;
}

export const TeachersSection: React.FC<TeachersProps> = ({
  teachers,
  onOpenTrial
}) => {
  const sortedTeachers = [...teachers].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="teachers" className="py-20 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            <span>Dedicated Mentors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Our Teachers
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Mentors committed to clear concepts, regular practice, and patient guidance for every young learner.
          </p>
        </div>

        {/* Teacher Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sortedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-stone-50/70 rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              {/* Profile Top */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Photo or Initials Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-900 font-black text-2xl font-['Outfit'] shadow-xs overflow-hidden shrink-0">
                    {teacher.photoUrl ? (
                      <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{teacher.name.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black font-['Outfit'] text-slate-900">
                      {teacher.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-amber-800">
                      {teacher.role || 'Faculty Member'}
                    </p>
                    <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      <GraduationCap className="w-3 h-3 text-amber-600" />
                      <span>{teacher.qualification}</span>
                    </div>
                  </div>
                </div>

                {/* Qualification Details */}
                <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Academic Background:
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    • {teacher.qualification}
                  </p>
                  {teacher.teachingPhilosophy && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-stone-100">
                      "{teacher.teachingPhilosophy}"
                    </p>
                  )}
                </div>

                {/* Subjects if specified */}
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Subjects Mentored:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Personalized batch attention</span>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
                >
                  Join Trial Class →
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Verification Note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto">
          IQRA INSTITUTE faculty is directly accessible to parents for feedback and queries regarding their child's daily progress.
        </div>

      </div>
    </section>
  );
};
