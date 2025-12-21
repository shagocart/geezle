
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Tag, Heart } from 'lucide-react';
import { Job } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';

const JobCard: React.FC<{ job: Job; compact?: boolean }> = ({ job, compact = false }) => {
  const { formatStringCurrency } = useCurrency();
  const { toggleLikeJob, isJobLiked } = useFavorites();
  const isLiked = isJobLiked(job.id);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikeJob(job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div 
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer relative group"
    >
      <div className="flex justify-between items-start">
        <div className="pr-8">
          <h3 className={`font-bold text-gray-900 hover:text-indigo-600 transition-colors ${compact ? 'text-base' : 'text-lg'}`}>
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-900">{job.type}</span> - {formatStringCurrency(job.budget)} - Posted {job.postedTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          {!compact && (
            <button 
                onClick={handleApplyClick}
                className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors z-10"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      <p className={`text-gray-600 mt-4 ${compact ? 'line-clamp-2 text-sm' : ''}`}>
        {job.description}
      </p>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-900 mr-1">Payment Verified</span>
            <CheckBadge />
          </div>
          <span>{job.proposals} Proposals</span>
          <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> Remote</span>
        </div>
        <div>
           Client: <span className="font-medium text-gray-900">{job.clientName}</span>
        </div>
      </div>
    </div>
  );
};

const CheckBadge = () => (
  <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default JobCard;
