import React from 'react';
import { WebsiteSettings } from '../types.js';
import { Logo } from './Logo.js';
import { Phone, MessageCircle, MapPin, Sparkles, Heart, Shield, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenTrial: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenTrial, onOpenAdmin }) => {
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent("Assalamualaikum, I would like to know more about IQRA INSTITUTE.")}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About IQRA', href: '#about' },
    { name: 'Classes & Fees', href: '#classes' },
    { name: 'Teachers', href: '#teachers' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Daily Questions', href: '#daily-questions' },
    { name: 'Latest Updates', href: '#news' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Institute Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" customLogoUrl={settings.logoUrl} className="brightness-125" />
            </div>
            
            <p className="text-amber-400 font-bold text-sm font-['Plus_Jakarta_Sans']">
              “{settings.tagline}”
            </p>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Providing foundation academic guidance for children from Nursery to Class 8. Focused on conceptual clarity, disciplined study habits, and patient mentorship.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenTrial}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Start 3-Day Free Trial</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </p>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Official Campus & Contact
            </p>
            
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Call:</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-white font-bold text-stone-200 transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">WhatsApp:</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white font-bold text-stone-200 transition-colors">
                    {settings.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-800/80 border border-stone-700/60">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-stone-200 leading-snug">
                    📍 {settings.address || '25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque'}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("IQRA INSTITUTE, " + (settings.address || "25 Futa Road, Budh Vihar, Sector 63, Noida, Uttar Pradesh, Gali No. 23A, Near Gulshan-e-Tayyaba Mosque"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] text-amber-400 hover:text-amber-300 font-bold hover:underline pt-0.5"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-stone-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Timings: {settings.timing || 'Morning & Evening Batches (Mon–Sat)'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.instituteName}. All rights reserved. Foundation Learning for Young Children.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-stone-300 transition-colors flex items-center gap-1 text-[11px] opacity-75 hover:opacity-100"
            >
              <Lock className="w-3 h-3 text-stone-500" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors flex items-center gap-1"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[10px]">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
