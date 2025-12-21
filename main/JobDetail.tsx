
import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Clock, ShieldCheck, Flag, Share2, Heart, Star } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUser } from '../context/UserContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatStringCurrency } = useCurrency();
  const { toggleLikeJob, isJobLiked } = useFavorites();
  const { user } = useUser();
  
  const job = MOCK_JOBS.find(j => j.id === id);

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Job Not Found</h2>
        <p className="text-gray-500 mt-2">The job post you are looking for does not exist or has been removed.</p>
        <Link to="/browse-jobs" className="text-indigo-600 mt-4 inline-block hover:underline">Back to Jobs</Link>
      </div>
    </div>
  );

  const isSaved = isJobLiked(job.id);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
        // Redirect directly to login, passing the current location to return to
        navigate('/auth/login', { state: { from: location.pathname } });
        return;
    }

    const role = user.role || 'guest';

    if (role === 'employer') {
        alert("You are currently logged in as an Employer. Please log in as a Freelancer to apply for jobs.");
        return;
    }

    // Direct apply for valid users
    alert(`Application for "${job.title}" submitted successfully! The client will review your profile.`);
    navigate('/browse-jobs');
  };

  const handleSave = () => {
    toggleLikeJob(job.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse-jobs" className="hover:text-gray-900">Jobs</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 truncate max-w-xs">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium">{job.type}</span>
                <span>Posted {job.postedTime}</span>
                <span className="flex items-center"><MapPin className="h-3 w-3 mr-1"/> Remote</span>
              </div>

              <hr className="border-gray-100 mb-6" />

              <div className="prose prose-indigo max-w-none text-gray-700">
                <p>{job.description}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Collaborate with cross-functional teams</li>
                  <li>Deliver high-quality solutions within deadlines</li>
                  <li>Participate in code reviews and design discussions</li>
                </ul>
                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Proven experience in relevant field</li>
                  <li>Strong communication skills</li>
                  <li>Portfolio of previous work</li>
                </ul>
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-3">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Activity on this Job</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <p className="text-gray-500">Proposals</p>
                   <p className="font-medium text-gray-900">{job.proposals || 'Less than 5'}</p>
                 </div>
                 <div>
                   <p className="text-gray-500">Interviewing</p>
                   <p className="font-medium text-gray-900">0</p>
                 </div>
                 <div>
                   <p className="text-gray-500">Invites Sent</p>
                   <p className="font-medium text-gray-900">0</p>
                 </div>
                 <div>
                   <p className="text-gray-500">Unanswered Invites</p>
                   <p className="font-medium text-gray-900">0</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <button 
                 onClick={handleApply}
                 type="button"
                 className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md mb-3 active:scale-95 transform"
               >
                 Apply Now
               </button>
               <button 
                 onClick={handleSave}
                 type="button"
                 className={`w-full border font-medium py-3 rounded-lg transition-colors flex items-center justify-center ${isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
               >
                 <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save Job'}
               </button>
               <div className="mt-6 space-y-4">
                 <div className="flex items-start">
                   <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                   <div>
                     <p className="font-bold text-gray-900">{formatStringCurrency(job.budget)}</p>
                     <p className="text-xs text-gray-500">{job.type === 'Hourly' ? 'Hourly Rate' : 'Fixed Price'}</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                   <div>
                     <p className="font-bold text-gray-900">Project Length</p>
                     <p className="text-xs text-gray-500">1-3 Months</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                   <div>
                     <p className="font-bold text-gray-900">Commitment</p>
                     <p className="text-xs text-gray-500">30+ hrs/week</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">About the Client</h3>
              <div className="flex items-center mb-4">
                 <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl mr-3">
                   {job.clientName.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-gray-900">{job.clientName}</p>
                   <p className="text-xs text-gray-500">United States</p>
                 </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  Payment Verified
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  4.95 of 20 Reviews
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  Member since Jan 2023
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 px-2">
               <button className="flex items-center hover:text-gray-800"><Flag className="h-3 w-3 mr-1"/> Flag as inappropriate</button>
               <button onClick={handleShare} className="flex items-center hover:text-gray-800"><Share2 className="h-3 w-3 mr-1"/> Share</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;
