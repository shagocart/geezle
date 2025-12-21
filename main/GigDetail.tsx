
import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, CheckCircle, Clock, RotateCcw, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { MOCK_GIGS } from '../constants';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUser } from '../context/UserContext';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const { toggleLikeGig, isGigLiked } = useFavorites();
  const { user } = useUser();
  
  const [selectedPackage, setSelectedPackage] = useState<'Standard' | 'Premium'>('Standard');

  const gig = MOCK_GIGS.find(g => g.id === id);

  if (!gig) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Gig Not Found</h2>
        <p className="text-gray-500 mt-2">The gig you are looking for does not exist.</p>
        <Link to="/browse" className="text-indigo-600 mt-4 inline-block hover:underline">Back to Browse</Link>
      </div>
    </div>
  );

  const isLiked = isGigLiked(gig.id);
  const currentPrice = selectedPackage === 'Standard' ? gig.price : gig.price * 1.8;
  const currentDelivery = selectedPackage === 'Standard' ? gig.deliveryTime || '3 Days' : '1 Day';
  const currentRevisions = selectedPackage === 'Standard' ? 2 : 'Unlimited';

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission if wrapped in a form accidentally

    // 1. Check Authentication
    if (!user) {
        // Redirect directly to login, passing the current location to return to
        navigate('/auth/login', { state: { from: location.pathname } });
        return;
    }

    // 2. Logic based on role (No strict confirm blocking)
    const role = user.role || 'guest';
    
    if (role === 'employer' || role === 'admin') {
        alert(`Initiating ${selectedPackage} order for ${formatPrice(currentPrice)}. Redirecting to escrow funding...`);
        navigate('/client/dashboard');
    } else {
        // Freelancers purchasing logic (if allowed)
        alert('Order initiated! Redirecting to messages to coordinate with the seller.');
        navigate('/messages'); 
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
        navigate('/auth/login', { state: { from: location.pathname } });
        return;
    }
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-gray-900">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 truncate max-w-xs">{gig.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <img src={gig.freelancerAvatar} alt={gig.freelancerName} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="text-sm font-bold text-gray-900 hover:underline cursor-pointer">{gig.freelancerName}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-gray-700 mr-1">{gig.rating}</span>
                    <span>({gig.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-sm text-gray-500">
                <p>3 Orders in Queue</p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-8">
              <img src={gig.image} alt={gig.title} className="w-full h-96 object-cover" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Gig</h2>
              <div className="prose prose-indigo text-gray-600 max-w-none">
                <p>
                  Are you looking for a professional service? You've come to the right place! 
                  I will provide high-quality work tailored to your needs.
                </p>
                <p className="mt-4">
                  <strong>Why choose me?</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Professional and Creative Designs</li>
                    <li>Fast Delivery</li>
                    <li>Unlimited Revisions</li>
                    <li>100% Satisfaction Guarantee</li>
                  </ul>
                </p>
                <p className="mt-4">Please contact me before placing an order to discuss your project requirements.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">About The Seller</h2>
              <div className="flex items-start gap-4">
                 <img src={gig.freelancerAvatar} alt={gig.freelancerName} className="w-20 h-20 rounded-full" />
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">{gig.freelancerName}</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-3">Professional Freelancer | {gig.category} Expert</p>
                    <button 
                        onClick={handleContact}
                        type="button"
                        className="text-sm border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    >
                        Contact Me
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Pricing & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button 
                    type="button"
                    onClick={() => setSelectedPackage('Standard')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${selectedPackage === 'Standard' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    Standard
                </button>
                <button 
                    type="button"
                    onClick={() => setSelectedPackage('Premium')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${selectedPackage === 'Premium' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    Premium
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-gray-900">{selectedPackage} Package</h3>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {selectedPackage === 'Standard' 
                    ? 'Includes basic service delivery with standard assets and source files. Perfect for small projects.'
                    : 'Everything in Standard plus priority support, additional revisions, and faster delivery time.'}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {currentDelivery} Delivery
                  </div>
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <RotateCcw className="h-4 w-4 mr-2 text-gray-400" />
                    {typeof currentRevisions === 'number' ? `${currentRevisions} Revisions` : currentRevisions}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Source File
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    High Resolution
                  </div>
                  {selectedPackage === 'Premium' && (
                    <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Commercial Use
                    </div>
                  )}
                </div>

                <button 
                    onClick={handleContinue}
                    type="button"
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg mb-3 active:scale-95 transform"
                >
                  Continue ({formatPrice(currentPrice)})
                </button>
                <button 
                    onClick={handleContact}
                    type="button"
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact Seller
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span className="flex items-center"><ShieldCheck className="h-3 w-3 inline mr-1" /> Secure Escrow Payment</span>
                <button onClick={() => toggleLikeGig(gig.id)} type="button" className={`flex items-center hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}>
                    <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} /> {isLiked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GigDetail;
