import React, { useState } from 'react';
import { FAQItem } from '../types.js';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';

interface FAQSectionProps {
  faqs: FAQItem[];
  phone: string;
  whatsapp: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, phone, whatsapp }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappMessage = encodeURIComponent("Assalamualaikum, I have a question regarding IQRA INSTITUTE admission.");

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Parent Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Everything you need to know about our classes, monthly fees, and 3-day trial sessions.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-amber-800 transition-colors"
                >
                  <span className="text-base sm:text-lg font-['Outfit']">{faq.question}</span>
                  <div className="p-1 rounded-lg bg-stone-200/80 text-slate-700 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-stone-200/50 animate-fadeIn">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
          <h3 className="text-lg font-bold font-['Outfit'] text-slate-900">
            Have more questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            We are always happy to speak with parents and discuss how we can support your child’s learning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call: {phone}
            </a>
            <a
              href={`https://wa.me/91${whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: {whatsapp}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
