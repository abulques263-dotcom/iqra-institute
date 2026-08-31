import React, { useState } from 'react';
import { GalleryItem } from '../types.js';
import { Image as ImageIcon, X, ZoomIn, Layers, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Classroom', 'Students', 'Activities', 'Books', 'Learning Environment'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>Learning Atmosphere</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-900 tracking-tight">
            Institute Gallery
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            A glimpse into our focused learning environment, classroom sessions, and daily activities.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 aspect-[4/3] cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on hover / tap */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded w-fit mb-1">
                  {item.category}
                </span>
                <p className="font-bold text-sm leading-snug">{item.title}</p>
                {item.caption && (
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{item.caption}</p>
                )}
                <div className="flex items-center gap-1 text-[11px] text-amber-200 mt-2 font-medium">
                  <ZoomIn className="w-3.5 h-3.5" /> Tap to enlarge
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeLightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
              
              {/* Top Bar */}
              <div className="p-4 flex items-center justify-between text-white border-b border-stone-800">
                <div>
                  <h4 className="font-bold text-base font-['Outfit']">{activeLightboxImage.title}</h4>
                  <p className="text-xs text-amber-400">{activeLightboxImage.category}</p>
                </div>
                <button
                  onClick={() => setActiveLightboxImage(null)}
                  className="p-2 rounded-xl bg-stone-800 text-white hover:bg-stone-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Container */}
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center p-2">
                <img
                  src={activeLightboxImage.imageUrl}
                  alt={activeLightboxImage.title}
                  className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>

              {/* Caption */}
              {activeLightboxImage.caption && (
                <div className="p-4 bg-stone-900 text-xs text-stone-300 border-t border-stone-800">
                  {activeLightboxImage.caption}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
