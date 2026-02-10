
import React, { useState, useEffect } from 'react';
import { UserInput, GiftRecommendation, AppState } from './types';
import { getGiftRecommendations } from './services/geminiService';
import InputForm from './components/InputForm';
import GiftCard from './components/GiftCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: false,
    recommendations: [],
    favorites: [],
    error: null
  });

  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('giftgenie_favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, favorites: parsed }));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('giftgenie_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  const handleFetchRecommendations = async (input: UserInput) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setShowSavedOnly(false); // Reset to show new results
    try {
      const results = await getGiftRecommendations(input);
      setState(prev => ({ ...prev, loading: false, recommendations: results, error: null }));
      
      setTimeout(() => {
        const resultsEl = document.getElementById('main-content');
        resultsEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Something went wrong' 
      }));
    }
  };

  const toggleFavorite = (gift: GiftRecommendation) => {
    setState(prev => {
      const isFav = prev.favorites.some(f => f.id === gift.id);
      if (isFav) {
        return { ...prev, favorites: prev.favorites.filter(f => f.id !== gift.id) };
      } else {
        return { ...prev, favorites: [...prev.favorites, gift] };
      }
    });
  };

  const displayedRecommendations = showSavedOnly ? state.favorites : state.recommendations;

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[35%] h-[45%] bg-rose-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] left-[60%] w-[20%] h-[20%] bg-amber-100/30 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <i className="fa-solid fa-gift text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                Gift<span className="text-indigo-600">Genie</span>
              </h1>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">
                The Art of Giving
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border ${
                showSavedOnly 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-500'
              }`}
            >
              <i className={`fa-solid fa-heart ${showSavedOnly ? '' : 'text-rose-400'}`}></i>
              <span className="hidden sm:inline">Saved Gifts</span>
              {state.favorites.length > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${showSavedOnly ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                  {state.favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          
          {/* Sidebar / Input Section */}
          <aside className="lg:w-[400px] lg:sticky lg:top-32 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 leading-[1.1]">
                Give something <span className="text-indigo-600">unforgettable.</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Describe the person and the occasion, and we'll handle the inspiration.
              </p>
            </div>

            <InputForm onSubmit={handleFetchRecommendations} isLoading={state.loading} />

            {state.error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-sm flex items-start gap-3 animate-shake">
                <i className="fa-solid fa-circle-exclamation mt-1"></i>
                <p className="font-medium leading-relaxed">{state.error}</p>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0" id="main-content">
            {state.loading ? (
              <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 text-2xl animate-pulse"></i>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Curation in Progress</h3>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">
                    We're browsing the multiverse for the most thoughtful matches...
                  </p>
                </div>
              </div>
            ) : displayedRecommendations.length > 0 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">
                      {showSavedOnly ? 'Your Collection' : 'Curated Picks'}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                      {displayedRecommendations.length} {showSavedOnly ? 'saved favorites' : 'personalized suggestions'}
                    </p>
                  </div>
                  {showSavedOnly && (
                    <button 
                      onClick={() => setShowSavedOnly(false)}
                      className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                    >
                      Return to Feed
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedRecommendations.map((gift, idx) => (
                    <GiftCard 
                      key={gift.id} 
                      gift={gift} 
                      index={idx} 
                      isFavorited={state.favorites.some(f => f.id === gift.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>

                {!showSavedOnly && (
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/30 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 mb-6 rotate-12">
                        <i className="fa-solid fa-lightbulb text-indigo-500 text-2xl"></i>
                      </div>
                      <h4 className="text-2xl font-black text-indigo-900 leading-tight">Not seeing "The One"?</h4>
                      <p className="text-indigo-700/70 font-bold max-w-md mx-auto">
                        Try adding more specific hobbies or personality traits in the description. The more detail, the more magical the results!
                      </p>
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mt-4 px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        Adjust Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px] bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  <i className="fa-solid fa-sparkles text-4xl text-slate-300 relative z-10 group-hover:text-indigo-300 transition-colors"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-400 mb-3">
                  {showSavedOnly ? "You haven't saved any gifts yet" : "Your suggestions await"}
                </h3>
                <p className="text-slate-300 font-bold max-w-xs mx-auto leading-relaxed uppercase text-[10px] tracking-[0.2em]">
                  {showSavedOnly ? "Browse recommendations and hit the heart to save them here." : "Fill out the magic form to start your personalized journey."}
                </p>
                {showSavedOnly && (
                  <button 
                    onClick={() => setShowSavedOnly(false)}
                    className="mt-8 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                  >
                    Go Browsing
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <i className="fa-solid fa-gift text-slate-400"></i>
            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">GiftGenie v2.0</span>
          </div>
          <p className="text-slate-300 text-[10px] font-black tracking-[0.3em] uppercase max-w-xs leading-loose">
            Designed for thoughtful people by artificial intelligence
          </p>
        </div>
      </footer>

      {/* Tailwind Config Extension (Injected via style tag for simplicity in this context) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}} />
    </div>
  );
};

export default App;
