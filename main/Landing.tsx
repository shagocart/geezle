
import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Zap, Globe, CheckCircle, Lock, UserCheck, 
  FileText, Upload, DollarSign, Scale, ArrowRight, User, BadgeCheck 
} from 'lucide-react';
import { MOCK_GIGS } from '../constants';
import GigCard from '../components/GigCard';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { HowItWorksStep } from '../types';

const IconMap: Record<string, any> = {
  ShieldCheck, Zap, Globe, CheckCircle, Lock, UserCheck, 
  FileText, Upload, DollarSign, Scale, User, BadgeCheck
};

const Landing: React.FC = () => {
  const { content } = useContent();
  const [howItWorksTab, setHowItWorksTab] = useState<'employer' | 'freelancer'>('employer');

  const renderIcon = (iconName: string, className: string) => {
    const Icon = IconMap[iconName] || ShieldCheck;
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-6">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                Next-Gen Freelance Marketplace
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                {content.landing.hero.title.split(' ').map((word, i) => 
                  i < 3 ? <span key={i}>{word} </span> : <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{word} </span>
                )}
              </h1>
              <p className="mt-4 text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {content.landing.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/create-job" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                  {content.landing.hero.primaryCtaText}
                </Link>
                <Link to="/browse-jobs" className="inline-flex justify-center items-center px-8 py-4 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 md:text-lg shadow-sm hover:shadow-md transition-all">
                  {content.landing.hero.secondaryCtaText}
                </Link>
              </div>

              {/* Stats Row */}
              {content.landing.hero.showTrustBadges && (
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap justify-center lg:justify-start gap-8 text-center lg:text-left">
                  {content.landing.stats.map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-full">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img
                   className="w-full h-full object-cover"
                   src={content.landing.hero.image}
                   alt="Freelance Collaboration"
                 />
                 {/* Floating Badge */}
                 <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs">
                    <div className="bg-green-100 p-3 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Payment Protected</p>
                      <p className="text-xs text-gray-500">Funds held in escrow until approval.</p>
                    </div>
                 </div>
               </div>
               {/* Decorative Blobs */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-gray-50 py-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by industry leaders</p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['TechGiant', 'GlobalMedia', 'FutureCorp', 'StartUpInc', 'DevSolutions'].map((brand, i) => (
               <span key={i} className="text-xl md:text-2xl font-bold text-gray-800">{brand}</span>
             ))}
           </div>
        </div>
      </section>

      {/* How It Works Section */}
      {content.landing.howItWorks.enabled && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How AtMyWorks Works</h2>
              <p className="mt-4 text-xl text-gray-500">Simple, secure, and streamlined for everyone.</p>
              
              {/* Tabs */}
              <div className="mt-8 inline-flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setHowItWorksTab('employer')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${howItWorksTab === 'employer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  For Employers
                </button>
                <button 
                  onClick={() => setHowItWorksTab('freelancer')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${howItWorksTab === 'freelancer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  For Freelancers
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(howItWorksTab === 'employer' ? content.landing.howItWorks.employerSteps : content.landing.howItWorks.freelancerSteps).map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                      {renderIcon(step.icon, "w-7 h-7 text-indigo-600 group-hover:text-white")}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.description}</p>
                    
                    {/* Step Number Background */}
                    <div className="absolute top-4 right-6 text-9xl font-bold text-gray-50 opacity-50 select-none pointer-events-none -z-10">
                      {idx + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us (Features) */}
      {content.landing.whyChoose.enabled && (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="mb-12 lg:mb-0">
                <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
                  {content.landing.whyChoose.title}
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  We've built a platform that prioritizes security and quality above all else. Unlike others, we don't just connect you; we protect you.
                </p>
                <div className="space-y-6">
                  {content.landing.whyChoose.features.map((feature, idx) => (
                    <div key={idx} className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          {renderIcon(feature.icon, "h-6 w-6")}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg leading-6 font-medium text-white">{feature.title}</h3>
                        <p className="mt-2 text-base text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Team working securely" 
                  className="rounded-2xl shadow-2xl border-4 border-gray-800"
                />
                <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl max-w-xs">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="text-green-500 h-5 w-5" />
                    <span className="font-bold">Admin Verified</span>
                  </div>
                  <p className="text-sm text-gray-600">Every user is manually reviewed to ensure a scam-free environment.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Popular Services</h2>
              <p className="mt-2 text-gray-500">Most viewed gigs by our clients</p>
            </div>
            <Link to="/browse" className="hidden sm:flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
              Browse all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_GIGS.slice(0, 4).map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
             <Link to="/browse" className="text-indigo-600 font-medium">View all services &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">Trusted by Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.landing.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                <div className="flex items-center mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Zap key={i} className="h-4 w-4 fill-current" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            {content.landing.cta.title}
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            {content.landing.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/signup" className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
              Get Started Now
            </Link>
            <Link to="/browse" className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-xl border border-indigo-500 hover:bg-indigo-800 transition-colors">
              Explore Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
