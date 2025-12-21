
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, CheckCircle, MessageSquare, Edit, PlayCircle, Briefcase, GraduationCap, Award, Video, ShieldCheck } from 'lucide-react';
import { MOCK_GIGS } from '../constants';
import GigCard from '../components/GigCard';
import { useUser } from '../context/UserContext';

const FreelancerProfile: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();
  
  const isMe = user && (id === 'me' || user.id === id);

  // Fallback Mock Profile Data (for viewing others - simulated)
  const mockProfile = {
    name: 'Sarah Jenkins',
    title: 'Senior Brand Designer & Illustrator',
    location: 'United Kingdom',
    joined: 'Jan 2021',
    rating: 4.9,
    reviews: 156,
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    bio: "Hi! I'm Sarah, a passionate graphic designer with over 7 years of experience. I specialize in logo design, brand identity, and custom illustrations.",
    skills: ['Adobe Illustrator', 'Photoshop', 'Logo Design', 'Branding'],
    availability: 'Available',
    introVideo: '',
    kycStatus: 'approved',
    stats: {
      jobsCompleted: 342,
      onTimeDelivery: '98%',
      repeatHireRate: '45%'
    },
    portfolio: [],
    workExperience: [],
    education: [],
    certifications: []
  };

  // Determine display data
  const profileData = isMe ? {
    name: user.name,
    title: user.title || 'Freelancer',
    location: user.location || 'Remote',
    joined: user.joinDate || 'Jan 2024',
    rating: user.rating || 0,
    reviews: user.reviewsCount || 0,
    avatar: user.avatar,
    bio: user.bio || 'No bio added yet.',
    skills: user.skills || [],
    availability: user.availability || 'Available',
    introVideo: user.introVideo,
    kycStatus: user.kycStatus,
    workExperience: user.workExperience || [],
    education: user.education || [],
    certifications: user.certifications || [],
    stats: { jobsCompleted: 0, onTimeDelivery: '100%', repeatHireRate: '0%' },
    portfolio: user.portfolio || [] 
  } : mockProfile;

  const freelancerGigs = isMe 
      ? MOCK_GIGS.filter(g => g.freelancerName === 'Me' || g.freelancerId === user.id) 
      : MOCK_GIGS.filter(g => g.freelancerName === profileData.name);
  
  const visiblePortfolio = profileData.portfolio.filter((item: any) => item.isVisible || isMe);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center relative group">
               {isMe && (
                 <Link to="/profile/edit" className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors" title="Edit Profile">
                   <Edit className="h-4 w-4" />
                 </Link>
               )}

               <div className="relative inline-block">
                 <img src={profileData.avatar || 'https://via.placeholder.com/150'} alt={profileData.name} className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
                 <span className={`absolute bottom-2 right-2 h-4 w-4 border-2 border-white rounded-full ${profileData.availability === 'Unavailable' ? 'bg-gray-400' : 'bg-green-500'}`} title={profileData.availability}></span>
               </div>
               
               <div className="mt-4 flex items-center justify-center space-x-2">
                 <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                 {profileData.kycStatus === 'approved' && (
                   <span title="Identity Verified" className="text-indigo-600">
                     <ShieldCheck className="h-5 w-5 fill-indigo-50" />
                   </span>
                 )}
               </div>
               
               <p className="text-gray-500 text-sm mt-1">{profileData.title}</p>
               
               {profileData.availability === 'Unavailable' && (
                 <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold uppercase rounded-full">
                   Unavailable for new work
                 </span>
               )}

               <div className="mt-4 flex justify-center items-center space-x-1">
                 <Star className="h-5 w-5 text-yellow-400 fill-current" />
                 <span className="font-bold text-gray-900">{profileData.rating}</span>
                 <span className="text-gray-500">({profileData.reviews} reviews)</span>
               </div>

               {!isMe && (
                 <Link to="/messages" className={`mt-6 w-full flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium transition-colors ${profileData.availability === 'Unavailable' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`} onClick={e => profileData.availability === 'Unavailable' && e.preventDefault()}>
                   <MessageSquare className="h-4 w-4 mr-2" /> {profileData.availability === 'Unavailable' ? 'Currently Unavailable' : 'Contact Me'}
                 </Link>
               )}
               
               {isMe && (
                  <Link to="/profile/edit" className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Edit Profile
                  </Link>
               )}

               <div className="mt-6 pt-6 border-t border-gray-100 text-left space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-500 flex items-center"><MapPin className="h-4 w-4 mr-1"/> From</span>
                   <span className="font-medium text-gray-900">{profileData.location}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-1"/> Member since</span>
                   <span className="font-medium text-gray-900">{profileData.joined}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Completed Jobs</span>
                   <span className="font-medium text-gray-900">{profileData.stats.jobsCompleted}</span>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {profileData.skills.length > 0 ? profileData.skills.map(skill => (
                   <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                     {skill}
                   </span>
                 )) : <span className="text-sm text-gray-400 italic">No skills added yet.</span>}
               </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Award className="h-4 w-4 mr-2 text-indigo-600"/> Certifications</h3>
               <div className="space-y-4">
                 {profileData.certifications && profileData.certifications.length > 0 ? profileData.certifications.map(cert => (
                   <div key={cert.id} className="text-sm">
                     <p className="font-medium text-gray-900">{cert.name}</p>
                     <p className="text-gray-500 text-xs">{cert.issuer} • {cert.issueDate}</p>
                     {cert.isVerified && (
                        <span className="inline-flex items-center text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </span>
                     )}
                   </div>
                 )) : <span className="text-sm text-gray-400 italic">No certifications added.</span>}
               </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Intro Video */}
            {profileData.introVideo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center">
                   <Video className="h-5 w-5 text-indigo-600 mr-2" />
                   <h3 className="font-bold text-gray-900">Video Introduction</h3>
                </div>
                <div className="aspect-w-16 aspect-h-9 bg-black">
                   <video controls className="w-full h-full object-contain max-h-[400px]">
                     <source src={profileData.introVideo} type="video/mp4" />
                     Your browser does not support the video tag.
                   </video>
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                {isMe && <Link to="/profile/edit" className="text-indigo-600 hover:underline text-sm">Edit</Link>}
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {profileData.bio}
              </p>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center"><Briefcase className="h-5 w-5 mr-2 text-indigo-600"/> Work Experience</h2>
               </div>
               <div className="space-y-8 border-l-2 border-gray-100 ml-3 pl-8 relative">
                 {profileData.workExperience && profileData.workExperience.length > 0 ? profileData.workExperience.map((job, idx) => (
                   <div key={job.id} className="relative">
                     <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-50"></span>
                     <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                     <p className="text-indigo-600 font-medium text-sm">{job.company} <span className="text-gray-400 font-normal mx-1">|</span> {job.startDate} - {job.endDate}</p>
                     <p className="text-gray-500 text-sm mt-2">{job.description}</p>
                   </div>
                 )) : <p className="text-gray-400 italic">No work experience added.</p>}
               </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center"><GraduationCap className="h-5 w-5 mr-2 text-indigo-600"/> Education</h2>
               </div>
               <div className="space-y-4">
                 {profileData.education && profileData.education.length > 0 ? profileData.education.map((edu) => (
                   <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                     <h3 className="font-bold text-gray-900">{edu.school}</h3>
                     <p className="text-sm text-gray-600">{edu.degree} - {edu.fieldOfStudy}</p>
                     <p className="text-xs text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</p>
                   </div>
                 )) : <p className="text-gray-400 italic">No education added.</p>}
               </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
                 {isMe && <Link to="/profile/edit" className="text-indigo-600 hover:underline text-sm">Manage</Link>}
               </div>
               
               {visiblePortfolio.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {visiblePortfolio.map((item: any) => (
                      <div key={item.id} className={`group relative rounded-lg overflow-hidden border border-gray-200 ${!item.isVisible && isMe ? 'opacity-50 grayscale' : ''}`}>
                         <img src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                           <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                           {item.description && <p className="text-gray-300 text-xs truncate">{item.description}</p>}
                         </div>
                         {!item.isVisible && isMe && (
                           <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">Hidden</div>
                         )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-gray-400 italic text-sm text-center py-6">
                   {isMe ? "Add projects to showcase your best work." : "No portfolio items uploaded."}
                 </div>
               )}
            </div>

            {/* Active Gigs */}
            <div>
               <h2 className="text-xl font-bold text-gray-900 mb-4">My Gigs</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {freelancerGigs.length > 0 ? (
                    freelancerGigs.map(gig => <GigCard key={gig.id} gig={gig} />)
                  ) : (
                    <div className="col-span-2 p-6 bg-white rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                      No active gigs found. {isMe && <Link to="/create-gig" className="text-indigo-600 underline">Create one now</Link>}
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
