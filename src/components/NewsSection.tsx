import React from 'react';
import { NewsUpdate } from '../types.js';
import { Bell, Calendar, Sparkles, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface NewsSectionProps {
  news: NewsUpdate[];
  onOpenTrial: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  onOpenTrial
}) => {
  const publishedNews = news.filter(n => n.isPublished !== false);

  const categoryBadges: Record<string, string> = {
    'Admission': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Test Notice': 'bg-amber-100 text-amber-900 border-amber-300',
    'Timing': 'bg-sky-100 text-sky-900 border-sky-300',
    'Holiday': 'bg-rose-100 text-rose-900 border-rose-300',
    'Batch Update': 'bg-purple-100 text-purple-900 border-purple-300',
    'Institute Activity': 'bg-indigo-100 text-indigo-900 border-indigo-300'
  };

  return (
    <section id="news" className="py-20 sm:py-24 bg-stone-50/50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Bell className="w-3.5 h-3.5 text-amber-700" />
            <span>Notices & Announcements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Latest Updates
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Important announcements, holiday notifications, and batch schedule updates.
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {publishedNews.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                item.isImportant
                  ? 'border-amber-400/90 ring-1 ring-amber-400/20'
                  : 'border-stone-200'
              }`}
            >
              <div className="space-y-3">
                {/* Meta */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${categoryBadges[item.category] || 'bg-stone-100 text-slate-800'}`}>
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Optional Image */}
                {item.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-48 my-2 border border-stone-200">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {item.category === 'Admission' && (
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-bold">New Registrations Active</span>
                  <button
                    onClick={onOpenTrial}
                    className="text-xs font-bold text-amber-800 hover:underline"
                  >
                    Apply for 3-Day Trial →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
