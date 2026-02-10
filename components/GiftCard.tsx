
import React from 'react';
import { GiftRecommendation } from '../types';

interface GiftCardProps {
  gift: GiftRecommendation;
  index?: number;
  isFavorited: boolean;
  onFavoriteToggle: (gift: GiftRecommendation) => void;
  showIndex?: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({ 
  gift, 
  index, 
  isFavorited, 
  onFavoriteToggle,
  showIndex = true 
}) => {
  // Determine a theme based on the gift type/name for extra flair
  const isSentimental = gift.type.toLowerCase().includes('sentimental');
  const themeClass = isSentimental ? 'border-rose-100 bg-rose-50/30' : 'border-indigo-100 bg-indigo-50/30';
  const badgeClass = isSentimental ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700';

  return (
    <div className={`relative group rounded-3xl border ${themeClass} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1`}>
      {/* Favorite Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(gift);
        }}
        className={`absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isFavorited 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-110' 
            : 'bg-white text-slate-300 hover:text-rose-400 hover:bg-rose-50 border border-slate-100'
        }`}
        title={isFavorited ? "Remove from favorites" : "Save to favorites"}
      >
        <i className={`fa-solid fa-heart ${isFavorited ? 'animate-bounce' : ''}`}></i>
      </button>

      <div className="flex flex-col gap-4">
        <div className="pr-12">
          <div className="flex items-center gap-2 mb-1">
            {showIndex && index !== undefined && (
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Option #{index + 1}</span>
            )}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
              {gift.type}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-800 leading-tight">
            {gift.giftName}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full w-fit border border-teal-100">
            <i className="fa-solid fa-tag text-[10px]"></i>
            {gift.budgetCategory}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/60 rounded-2xl p-4 border border-white/80">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-sparkles text-indigo-400"></i>
              The Secret Sauce
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {gift.whyItFits}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/50">
              <h4 className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mb-1">Perfect For</h4>
              <p className="text-amber-900/80 text-[11px] font-bold leading-tight">{gift.targetAudience}</p>
            </div>
            <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/50">
              <h4 className="text-[9px] font-black text-purple-600/60 uppercase tracking-widest mb-1">Vibe</h4>
              <p className="text-purple-900/80 text-[11px] font-bold leading-tight">{gift.type}</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Consider Also</h4>
            <div className="flex flex-wrap gap-2">
              {gift.alternatives.map((alt, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white rounded-xl text-slate-500 text-[10px] font-bold border border-slate-100 shadow-sm hover:border-indigo-200 hover:text-indigo-500 cursor-default transition-colors">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
