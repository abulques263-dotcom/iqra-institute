import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.js';
import { WebsiteSettings } from '../types.js';
import { Phone, MessageCircle, Menu, X, Sparkles, BookOpen, ShieldCheck, HelpCircle, Layers, Users, Calendar, Image as ImageIcon, Bell } from 'lucide-react';

interface NavbarProps {
  settings: WebsiteSettings;
  onOpenTrialModal: (prefillClass?: string) => void;
  onOpenDailyQuestions: () => void;
  onOpenPractice: () => void;
  onOpenAiTutor: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenTrialModal,
  onOpenDailyQuestions,
  onOpenPractice,
  onOpenAiTutor,
  onOpenAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Classes & Fees', href: '#classes' },
    { name: 'Teachers', href: '#teachers' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Daily Question', href: '#daily-questions' },
    { name: '1,000+ Practice', href: '#practice-mode' },
    { name: 'Iqra AI Tutor', href: '#ai-tutor' },
    { name: 'Updates', href: '#news' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#daily-questions') {
      onOpenDailyQuestions();
      return;
    }
    if (href === '#practice-mode') {
      onOpenPractice();
      return;
    }
    if (href === '#ai-tutor') {
      onOpenAiTutor();
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const whatsappMessage = encodeURIComponent("Assalamualaikum, I would like to know more about IQRA INSTITUTE and the 3-day trial classes.");
  const whatsappUrl = `https://wa.me/91${settings.whatsapp}?text=${whatsappMessage}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      {settings.announcementActive && settings.announcement && (
        <div id="top-announcement-bar" className="bg-amber-600 text-white text-xs sm:text-sm py-1.5 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium truncate">
              <span className="bg-amber-700/80 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" /> Notice
              </span>
              <span className="truncate">{settings.announcement}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs shrink-0 font-medium">
              <a
                href={`tel:${settings.phone}`}
                className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <Phone className="w-3 h-3" /> Call: {settings.phone}
              </a>
              <span className="opacity-40">|</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                <MessageCircle className="w-3 h-3 text-emerald-300" /> WhatsApp: {settings.whatsapp}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        id="main-navigation-bar"
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-stone-200/50 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <Logo size="md" customLogoUrl={settings.logoUrl} />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-slate-700 hover:text-amber-700 transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Direct */}
            <a
              id="nav-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Chat with us on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Call Direct */}
            <a
              id="nav-call-btn"
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 border border-stone-300/80 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>{settings.phone}</span>
            </a>

            {/* 3 Days Free Trial Button */}
            <button
              id="nav-trial-btn"
              onClick={() => onOpenTrialModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>3 Days Free Trial</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              id="nav-mobile-trial-btn"
              onClick={() => onOpenTrialModal()}
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              Free Trial
            </button>
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="xl:hidden bg-white border-b border-stone-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 pt-2 border-b border-stone-100 pb-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-stone-100 text-slate-800 font-semibold text-xs border border-stone-200"
              >
                <Phone className="w-4 h-4 text-amber-600" /> Call {settings.phone}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Us
              </a>
            </div>

            <div className="flex flex-col space-y-1.5 py-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrialModal();
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-lg shadow-sm text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Start 3-Day Free Trial</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-600 font-medium text-xs rounded-lg text-center"
              >
                Admin Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
