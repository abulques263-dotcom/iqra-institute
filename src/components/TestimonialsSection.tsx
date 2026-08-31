import React, { useState } from 'react';
import { Testimonial } from '../types.js';
import { Star, MessageSquareQuote, ChevronLeft, ChevronRight, User, CheckCircle } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const published = testimonials.filter(t => t.isPublished !== false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (published.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? published.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === published.length - 1 ? 0 : prev + 1));
  };

  const current = published[currentIndex];

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-700" />
            <span>Parent Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Student & Parent Feedback
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Real feedback from local parents on conceptual clarity and daily study improvement.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white rounded-3xl border border-stone-200 shadow-md p-8 sm:p-12 space-y-8 max-w-3xl mx-auto">
          
          {/* Quote & Stars */}
          <div className="space-y-4 text-center">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote Text */}
            <p className="text-lg sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-800 leading-relaxed italic">
              “{current.quote}”
            </p>
          </div>

          {/* Author Info */}
          <div className="flex flex-col items-center justify-center text-center pt-4 border-t border-stone-100 space-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center mb-1">
              {current.parentName.charAt(0)}
            </div>
            <p className="font-extrabold text-base text-slate-900 font-['Outfit']">
              {current.parentName}
            </p>
            <p className="text-xs font-semibold text-amber-800">
              Parent of {current.studentClass} Student
            </p>
          </div>

          {/* Navigation Controls */}
          {published.length > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {published.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx ? 'w-6 bg-amber-600' : 'w-2 bg-stone-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
