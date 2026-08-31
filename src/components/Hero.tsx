import React from 'react';
import { WebsiteSettings } from '../types.js';
import { Sparkles, Phone, MessageCircle, ArrowRight, BookOpen, CheckCircle2, Award, Users, GraduationCap, Shield } from 'lucide-react';

interface HeroProps {
  settings: WebsiteSettings;
  onOpenTrialModal: () => void;
  onOpenContact: () => void;
  onExploreClasses: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenTrialModal,
  onOpenContact,
  onExploreClasses
}) => {
  const whatsappMessage = encodeURIComponent("Assalamualaikum, I would like to know more about IQRA INSTITUTE and the 3-day trial classes.");
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsappMessage}`;

  return (
    <section id="home-hero" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 bg-gradient-to-b from-amber-50/50 via-white to-stone-50/60 border-b border-stone-200/60 overflow-hidden">
      {/* Subtle geometric background accents */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-amber-100/40 via-orange-100/20 to-sky-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Subheading, Story & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xs mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{settings.heroBadge || "Nursery to Class 8 • Foundation Learning Support"}</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] text-slate-900 tracking-tight leading-[1.1]">
                {settings.instituteName}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-amber-700 leading-snug">
                “{settings.tagline}”
              </p>
            </div>

            {/* Supporting Explanation */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {settings.heroDescription || "IQRA INSTITUTE focuses on developing children’s academic foundation, conceptual understanding, discipline, and useful daily study habits from an early age. We believe in understanding concepts rather than rote memorization."}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-trial-cta-btn"
                onClick={onOpenTrialModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>3 Days Free Trial</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-contact-cta-btn"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl shadow-xs hover:shadow transition-all"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Contact Us</span>
              </button>

              <a
                id="hero-whatsapp-cta-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-xl shadow-xs transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nursery to Class 8</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹300 – ₹600 / Month</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>DU Graduate Mentors</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personal Attention</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Daily Practice Problems</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Upfront Burden</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Education Showcase & Quick Overview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card Container */}
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl overflow-hidden p-6 sm:p-7 space-y-6">
                
                {/* Visual Header */}
                <div className="relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 aspect-[16/10] group">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
                    alt="Young Indian students learning in an encouraging classroom environment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Classroom Atmosphere</p>
                      <p className="text-sm font-bold">Encouraging Young Learners to Ask Questions</p>
                    </div>
                  </div>
                </div>

                {/* Core Philosophy Highlight */}
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Why Early Foundation Matters</span>
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    Building strong reading, mathematical reasoning, and daily study discipline in Classes 1–8 prepares children for a lifetime of confident learning without exam fear.
                  </p>
                </div>

                {/* Quick Fee Snapshot */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span>Monthly Fee Snapshot</span>
                    <button
                      onClick={onExploreClasses}
                      className="text-amber-700 hover:underline font-bold text-xs"
                    >
                      View All Details →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-center">
                      <p className="text-xs text-slate-600 font-medium">Nursery – UKG</p>
                      <p className="text-base font-bold text-slate-900 font-['Outfit']">₹350 <span className="text-[10px] text-slate-500 font-normal">/mo</span></p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-center">
                      <p className="text-xs text-slate-600 font-medium">Class 1 – 4</p>
                      <p className="text-base font-bold text-slate-900 font-['Outfit']">₹300 <span className="text-[10px] text-slate-500 font-normal">/mo</span></p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-center">
                      <p className="text-xs text-slate-600 font-medium">Class 5 – 6</p>
                      <p className="text-base font-bold text-slate-900 font-['Outfit']">₹400 <span className="text-[10px] text-slate-500 font-normal">/mo</span></p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-center">
                      <p className="text-xs text-slate-600 font-medium">Class 7 – 8</p>
                      <p className="text-base font-bold text-slate-900 font-['Outfit']">₹600 <span className="text-[10px] text-slate-500 font-normal">/mo</span></p>
                    </div>
                  </div>
                </div>

                {/* Direct 3-Day Trial Prompt */}
                <button
                  onClick={onOpenTrialModal}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Start 3-Day Trial For Your Child</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
