
import React from 'react';
import { NewsItem } from '../types';
import { X, Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsImage } from './NewsImage';

interface NewsDetailProps {
  news: NewsItem | null;
  onClose: () => void;
  isBannerActive?: boolean;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, onClose, isBannerActive }) => {
  if (!news) return null;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${news.title} - TendenciaRD`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[200] bg-white overflow-y-auto ${isBannerActive ? 'pt-24 md:pt-28' : ''}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className={`fixed ${isBannerActive ? 'top-28 md:top-32' : 'top-6'} right-6 z-50 bg-panorama-navy text-white p-3 rounded-full shadow-2xl hover:bg-panorama-red transition-all hover:rotate-90`}
          >
            <X size={24} />
          </button>

          {/* Article Header */}
          <header className="mb-10 text-center">
            <span className="inline-block bg-panorama-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
              {news.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-news font-black text-panorama-navy leading-tight mb-8">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest border-y border-slate-100 py-6">
              <div className="flex items-center gap-2">
                <User size={16} className="text-panorama-red" />
                <span>Por {news.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-panorama-red" />
                <span>{news.date}</span>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button onClick={() => handleShare('facebook')} className="hover:text-blue-600 transition-colors">
                  <Facebook size={18} />
                </button>
                <button onClick={() => handleShare('twitter')} className="hover:text-sky-400 transition-colors">
                  <Twitter size={18} />
                </button>
                <button onClick={() => handleShare('copy')} className="hover:text-panorama-red transition-colors">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <NewsImage 
              src={news.imageUrl} 
              alt={news.title} 
              height={450}
              aspectRatio="video"
            />
          </div>

          {/* Article Content */}
          <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-10 italic border-l-4 border-panorama-red pl-6 py-2">
              {news.excerpt}
            </p>
            
            <div className="text-slate-800 text-lg md:text-xl leading-relaxed space-y-8 whitespace-pre-line font-serif">
              {news.content || "Contenido completo no disponible."}
            </div>

            {/* Article Footer */}
            <footer className="mt-20 pt-12 border-t-4 border-panorama-navy flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-panorama-navy rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl rotate-3">
                  T
                </div>
                <div>
                  <p className="font-black text-panorama-navy uppercase text-xl tracking-tight">TendenciaRD</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Periodismo de Verdad</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-panorama-navy font-black px-6 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  <Share2 size={18} /> Compartir
                </button>
                <button 
                  onClick={onClose}
                  className="bg-panorama-navy hover:bg-panorama-red text-white font-black px-10 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
                >
                  Cerrar Artículo
                </button>
              </div>
            </footer>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
