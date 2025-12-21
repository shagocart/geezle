
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Gig } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';

const GigCard: React.FC<{ gig: Gig }> = ({ gig }) => {
  const { formatPrice } = useCurrency();
  const { toggleLikeGig, isGigLiked } = useFavorites();
  const isLiked = isGigLiked(gig.id);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikeGig(gig.id);
  };

  return (
    <div 
      onClick={() => navigate(`/gigs/${gig.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative flex flex-col h-full"
    >
      <div className="relative">
        <img src={gig.image} alt={gig.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <button 
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors shadow-sm z-30 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <img src={gig.freelancerAvatar} alt={gig.freelancerName} className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium text-gray-700">{gig.freelancerName}</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {gig.title}
        </h3>
        
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-gray-900">{gig.rating}</span>
          <span className="text-sm text-gray-500">({gig.reviews})</span>
        </div>

        {gig.tags && gig.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {gig.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Starting at</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(gig.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
