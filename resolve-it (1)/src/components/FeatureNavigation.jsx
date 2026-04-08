import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeatureNavigation = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = items.findIndex(item => location.pathname.includes(item.to));
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(items[currentIndex - 1].to);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      navigate(items[currentIndex + 1].to);
    }
  };

  // Always show navigation buttons, even if currentIndex === -1 (for debugging/fallback)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className={`p-2 rounded-lg border border-zinc-800 bg-zinc-900 transition-all ${
          currentIndex === 0 
            ? 'opacity-30 cursor-not-allowed text-zinc-600' 
            : 'text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50'
        }`}
        title="Previous Feature"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
        {currentIndex + 1} / {items.length}
      </div>

      <button
        onClick={handleNext}
        disabled={currentIndex === items.length - 1}
        className={`p-2 rounded-lg border border-zinc-800 bg-zinc-900 transition-all ${
          currentIndex === items.length - 1 
            ? 'opacity-30 cursor-not-allowed text-zinc-600' 
            : 'text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50'
        }`}
        title="Next Feature"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
