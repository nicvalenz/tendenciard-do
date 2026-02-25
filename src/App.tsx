
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsCard } from './components/NewsCard';
import { Sidebar } from './components/Sidebar';
import { Ad } from './components/Ads';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { ActivitySection } from './components/ActivitySection';
import { MultimediaSection } from './components/MultimediaSection';
import { NewsDetail } from './components/NewsDetail';
import { ActivityDetail } from './components/ActivityDetail';
import { PollSection } from './components/PollSection';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MOCK_NEWS, MOCK_ADS, DEFAULT_POPUP_CONFIG, DEFAULT_ACTIVITY, DEFAULT_LARGE_POPUP_CONFIG, MOCK_MULTIMEDIA, CATEGORIES, MOCK_POLLS, MOCK_SPONSORS, DEFAULT_POLL_BANNER } from './constants';
import { NewsItem, AdItem, PopupConfig, Activity, LargePopupConfig, MultimediaItem, Poll, Sponsor, PollBannerConfig } from './types';
import { X, Bell, MessageCircle, Settings, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showLargePopup, setShowLargePopup] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPass, setLoginPass] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Inicio');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [popupPosition, setPopupPosition] = useState(0); // 0: bottom-right, 1: bottom-left, 2: top-left, 3: top-right
  
  // Initialize state from localStorage or defaults
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('dm_media_news');
    return saved ? JSON.parse(saved) : MOCK_NEWS;
  });

  const [ads, setAds] = useState<AdItem[]>(() => {
    const saved = localStorage.getItem('dm_media_ads');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved ads with MOCK_ADS to ensure new slots (like ad-activity) are present
      const merged = [...parsed];
      MOCK_ADS.forEach(mockAd => {
        if (!merged.find(a => a.id === mockAd.id)) {
          merged.push(mockAd);
        }
      });
      return merged;
    }
    return MOCK_ADS;
  });

  const [popupConfig, setPopupConfig] = useState<PopupConfig>(() => {
    const saved = localStorage.getItem('dm_media_popup');
    return saved ? JSON.parse(saved) : DEFAULT_POPUP_CONFIG;
  });

  const [activity, setActivity] = useState<Activity>(() => {
    const saved = localStorage.getItem('dm_media_activity');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY;
  });

  const [largePopupConfig, setLargePopupConfig] = useState<LargePopupConfig>(() => {
    const saved = localStorage.getItem('dm_media_large_popup');
    return saved ? JSON.parse(saved) : DEFAULT_LARGE_POPUP_CONFIG;
  });

  const [multimedia, setMultimedia] = useState<MultimediaItem[]>(() => {
    const saved = localStorage.getItem('dm_media_multimedia');
    return saved ? JSON.parse(saved) : MOCK_MULTIMEDIA;
  });

  const [polls, setPolls] = useState<Poll[]>(() => {
    const saved = localStorage.getItem('dm_media_polls');
    return saved ? JSON.parse(saved) : MOCK_POLLS;
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem('dm_media_sponsors');
    return saved ? JSON.parse(saved) : MOCK_SPONSORS;
  });

  const [pollBanner, setPollBanner] = useState<PollBannerConfig>(() => {
    const saved = localStorage.getItem('dm_media_poll_banner');
    return saved ? JSON.parse(saved) : DEFAULT_POLL_BANNER;
  });

  useEffect(() => {
    localStorage.setItem('dm_media_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('dm_media_ads', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('dm_media_popup', JSON.stringify(popupConfig));
  }, [popupConfig]);

  useEffect(() => {
    localStorage.setItem('dm_media_activity', JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem('dm_media_large_popup', JSON.stringify(largePopupConfig));
  }, [largePopupConfig]);

  useEffect(() => {
    localStorage.setItem('dm_media_multimedia', JSON.stringify(multimedia));
  }, [multimedia]);

  useEffect(() => {
    localStorage.setItem('dm_media_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('dm_media_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('dm_media_poll_banner', JSON.stringify(pollBanner));
  }, [pollBanner]);

  // Sync category with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setSelectedCategory('Inicio');
    } else {
      const catName = CATEGORIES.find(cat => {
        const catPath = cat === 'Política RD' ? '/politica-rd' : `/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`;
        return catPath === path;
      });
      if (catName) {
        setSelectedCategory(catName);
      }
    }
  }, [location.pathname, location]);

  const handleAdminAccess = () => {
    setShowLogin(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPass === "panorama2024") {
      setShowAdmin(true);
      setShowLogin(false);
      setLoginPass('');
    } else {
      alert("Acceso denegado: Contraseña incorrecta");
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
    setShowLargePopup(true);
  };

  const activeAdContent = (selectedNews && largePopupConfig.categoryAds?.[selectedNews.category]) || largePopupConfig;

  const getPopupPositionClass = () => {
    return 'bottom-24 right-6'; // Positioned above the WhatsApp button if it exists, or just in that side
  };

  const getAd = (id: string) => ads.find(a => a.id === id);

  const activeCategories = CATEGORIES.filter(cat => 
    ['Inicio', 'Contacto', 'Encuestas', 'Actividad Semanal', 'Internacional', 'Deportes'].includes(cat) || 
    news.some(n => n.category === cat)
  );

  const filteredNews = selectedCategory === 'Inicio' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const handleVote = (pollId: string, candidateId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          candidates: poll.candidates.map(c => 
            c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
          )
        };
      }
      return poll;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 left-0 w-full h-10 bg-[#D32F2F] text-white flex items-center justify-center z-[100] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-md">
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
          <span>ANÚNCIATE AQUÍ</span>
          <button className="bg-white text-[#D32F2F] px-3 py-1 rounded-full font-bold text-[9px] md:text-[10px] hover:bg-opacity-90 transition-colors">
            Más info
          </button>
        </div>
      </div>
      <Helmet>
        <title>TendenciaRD | La noticia que conecta contigo</title>
        <meta name="description" content="Portal de noticias líder en República Dominicana. Política, Deportes, Economía y más." />
        <meta property="og:title" content="TendenciaRD | Noticias de RD" />
        <meta property="og:description" content="La noticia que conecta contigo" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header 
        selectedCategory={selectedCategory} 
        onCategorySelect={setSelectedCategory} 
        categories={activeCategories}
        sponsors={sponsors}
      />

      <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
        {/* Superior Ad Banner */}
        <Ad 
          size="leaderboard" 
          label={getAd('ad-1')?.label} 
          imageUrl={getAd('ad-1')?.imageUrl} 
        />

        {selectedCategory === 'Inicio' && (
          <Hero 
            news={news} 
            onNewsClick={handleNewsClick} 
          />
        )}

        {selectedCategory === 'Encuestas' && (
          <PollSection polls={polls} onVote={handleVote} banner={pollBanner} />
        )}

        {selectedCategory === 'Inicio' && (
          <PollSection polls={polls} onVote={handleVote} />
        )}

        {selectedCategory !== 'Encuestas' && (
          <div className="flex flex-col lg:flex-row gap-8 mt-12">
            {/* Main Feed */}
            <div className="flex-grow">
              {/* Middle Page Ad */}
              <Ad 
                size="leaderboard" 
                label={getAd('ad-1')?.label} 
                imageUrl={getAd('ad-1')?.imageUrl} 
              />

              <div className="flex items-center justify-between mb-8 border-b-4 border-panorama-navy pb-2 mt-8">
                <h2 className="text-3xl font-news font-black uppercase text-panorama-navy flex items-center">
                  <span className="w-8 h-8 bg-panorama-red text-white flex items-center justify-center rounded-full mr-3 text-sm">
                    {selectedCategory === 'Inicio' ? 'U' : selectedCategory.charAt(0)}
                  </span>
                  {selectedCategory === 'Inicio' ? 'Últimas Noticias' : selectedCategory}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No hay noticias disponibles en esta sección</p>
                  </div>
                )}
              </div>

              {(selectedCategory === 'Inicio' || selectedCategory === 'Actividad Semanal') && (
                <ActivitySection 
                  activity={activity} 
                  onActivityClick={() => {
                    setSelectedActivity(activity);
                    setShowLargePopup(true);
                  }}
                />
              )}

              {selectedCategory === 'Inicio' && (
                <MultimediaSection items={multimedia} />
              )}

              {selectedCategory === 'Inicio' && (
                <div className="mb-12">
                  <Ad 
                    size="leaderboard" 
                    label={getAd('ad-activity')?.label} 
                    imageUrl={getAd('ad-activity')?.imageUrl} 
                  />
                </div>
              )}
              
              <div className="flex justify-center mb-12">
                <button className="bg-panorama-navy hover:bg-panorama-red text-white font-black px-12 py-4 rounded-full transition-all transform hover:scale-105 uppercase tracking-widest text-sm shadow-xl">
                  Cargar más noticias
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar news={news} onNewsClick={handleNewsClick} />
          </div>
        )}
      </main>

      <Footer onCategorySelect={setSelectedCategory} categories={activeCategories} />

      {/* Admin Toggle Button */}
      <button 
        onClick={handleAdminAccess}
        className="fixed bottom-6 left-6 z-50 bg-panorama-navy text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-panorama-red transition-all opacity-20 hover:opacity-100"
        title="Panel de Control"
      >
        <Settings size={20} />
      </button>

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          news={news}
          ads={ads}
          popupConfig={popupConfig}
          largePopupConfig={largePopupConfig}
          activity={activity}
          multimedia={multimedia}
          polls={polls}
          sponsors={sponsors}
          pollBanner={pollBanner}
          onUpdateNews={setNews}
          onUpdateAds={setAds}
          onUpdatePopup={setPopupConfig}
          onUpdateLargePopup={setLargePopupConfig}
          onUpdateActivity={setActivity}
          onUpdateMultimedia={setMultimedia}
          onUpdatePolls={setPolls}
          onUpdateSponsors={setSponsors}
          onUpdatePollBanner={setPollBanner}
        />
      )}

    {/* Login Modal */}
    {showLogin && (
      <div className="fixed inset-0 z-[400] bg-panorama-darkNavy/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white w-full max-sm rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-panorama-navy uppercase">Acceso Admin</h3>
            <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-panorama-red"><X size={24} /></button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contraseña</label>
              <input 
                type="password" 
                autoFocus
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold text-center text-xl tracking-widest"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-panorama-navy text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-panorama-red transition-colors shadow-lg"
            >
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    )}

    {/* News Detail Expansion */}
    <NewsDetail 
      news={selectedNews} 
      onClose={() => {
        setSelectedNews(null);
        setShowLargePopup(false);
      }} 
      isBannerActive={showLargePopup}
    />

    {/* Activity Detail Expansion */}
    <ActivityDetail 
      activity={selectedActivity}
      onClose={() => {
        setSelectedActivity(null);
        setShowLargePopup(false);
      }}
      adConfig={showLargePopup ? activeAdContent : undefined}
    />

    {/* Large Modal Popup (Horizontal Banner) */}
    <AnimatePresence>
      {showLargePopup && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[300]"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-panorama-navy text-white shadow-2xl rounded-b-3xl border-x border-b border-white/10 overflow-hidden relative h-20 md:h-24 flex items-center">
              <button 
                onClick={() => setShowLargePopup(false)}
                className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/10 hover:bg-panorama-red text-white p-1.5 rounded-full transition-all shadow-md"
              >
                <X size={18} />
              </button>
              
              <div className="container mx-auto px-4 flex items-center gap-4 md:gap-8">
                {activeAdContent.imageUrl && (
                  <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/20">
                    <img src={activeAdContent.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-grow flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                  <h3 className="text-xs md:text-lg font-news font-black text-white leading-tight">
                    {activeAdContent.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-white/70 leading-tight line-clamp-1 max-w-xl">
                    {activeAdContent.description}
                  </p>
                </div>
                <button className="flex-shrink-0 bg-panorama-red hover:bg-panorama-darkRed text-white font-black py-2 px-4 md:px-8 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[10px] md:text-xs mr-8">
                  {activeAdContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Subscription Popup - Subtle version */}
    {showPopup && (
      <div className={`fixed ${getPopupPositionClass()} z-[150] w-[90vw] max-w-[320px] animate-in slide-in-from-bottom-10 duration-500`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-panorama-navy z-10 p-1 bg-white/80 backdrop-blur rounded-full"
          >
            <X size={14} />
          </button>
          <div className="flex">
            <div className="w-1/4 bg-panorama-navy flex items-center justify-center p-3">
              {popupConfig.imageUrl ? (
                <img src={popupConfig.imageUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <Bell size={24} className="text-white animate-pulse" />
              )}
            </div>
            <div className="w-3/4 p-4">
              <h4 className="text-[11px] font-black text-panorama-navy uppercase mb-0.5">{popupConfig.title}</h4>
              <p className="text-[9px] text-slate-500 mb-2 line-clamp-2 leading-tight">{popupConfig.description}</p>
              <div className="flex gap-1.5">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="flex-grow text-[9px] border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-panorama-red"
                />
                <button className="bg-panorama-red text-white text-[9px] font-black px-2 py-1 rounded-md hover:bg-panorama-darkRed transition-colors uppercase">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Floating WhatsApp Action */}
    <a 
      href="https://wa.me/18097507423" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95 animate-bounce"
    >
      <MessageCircle size={32} />
    </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
