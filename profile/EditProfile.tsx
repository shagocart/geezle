
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Camera, MapPin, Mail, Lock, Briefcase, User, X, Plus, Image as ImageIcon, Trash2, Edit2, Eye, EyeOff, Save, Video, GraduationCap, Award, Upload } from 'lucide-react';
import { PortfolioItem, WorkExperience, Education, Certification } from '../types';

const EditProfile: React.FC = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const portfolioImageRef = useRef<HTMLInputElement>(null);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    password: '', 
    availability: user?.availability || 'Available',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const [introVideo, setIntroVideo] = useState<string>(user?.introVideo || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [success, setSuccess] = useState('');

  // Enhanced Sections State
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(user?.workExperience || []);
  const [education, setEducation] = useState<Education[]>(user?.education || []);
  const [certifications, setCertifications] = useState<Certification[]>(user?.certifications || []);

  // Modal States
  const [activeModal, setActiveModal] = useState<'portfolio' | 'experience' | 'education' | 'certification' | null>(null);
  
  // Item States for Modals
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(user?.portfolio || []);
  const [currentPortfolioItem, setCurrentPortfolioItem] = useState<Partial<PortfolioItem>>({});
  
  const [currentExperience, setCurrentExperience] = useState<Partial<WorkExperience>>({});
  const [currentEducation, setCurrentEducation] = useState<Partial<Education>>({});
  const [currentCertification, setCurrentCertification] = useState<Partial<Certification>>({});

  const [isEditingItem, setIsEditingItem] = useState(false);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        alert("Video size must be less than 50MB");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setIntroVideo(url); // Preview locally
    }
  };

  const removeVideo = () => {
    setIntroVideo('');
    setVideoFile(null);
  };

  const addSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // --- CRUD Modal Handlers (Generic pattern) ---

  const openModal = (type: 'portfolio' | 'experience' | 'education' | 'certification', item?: any) => {
    setActiveModal(type);
    setIsEditingItem(!!item);
    if (type === 'portfolio') setCurrentPortfolioItem(item || { title: '', description: '', image: '', isVisible: true });
    if (type === 'experience') setCurrentExperience(item || { title: '', company: '', startDate: '', endDate: '', description: '' });
    if (type === 'education') setCurrentEducation(item || { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' });
    if (type === 'certification') setCurrentCertification(item || { name: '', issuer: '', issueDate: '', isVerified: false });
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsEditingItem(false);
  };

  const saveItem = () => {
    if (activeModal === 'portfolio') {
      if (!currentPortfolioItem.title || !currentPortfolioItem.image) return alert("Title and Image required");
      const newItem = { ...currentPortfolioItem, id: currentPortfolioItem.id || Date.now().toString() } as PortfolioItem;
      setPortfolio(prev => isEditingItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [newItem, ...prev]);
    }
    if (activeModal === 'experience') {
      if (!currentExperience.title || !currentExperience.company) return alert("Title and Company required");
      const newItem = { ...currentExperience, id: currentExperience.id || Date.now().toString() } as WorkExperience;
      setWorkExperience(prev => isEditingItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [newItem, ...prev]);
    }
    if (activeModal === 'education') {
      if (!currentEducation.school) return alert("School required");
      const newItem = { ...currentEducation, id: currentEducation.id || Date.now().toString() } as Education;
      setEducation(prev => isEditingItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [newItem, ...prev]);
    }
    if (activeModal === 'certification') {
      if (!currentCertification.name) return alert("Name required");
      const newItem = { ...currentCertification, id: currentCertification.id || Date.now().toString() } as Certification;
      setCertifications(prev => isEditingItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [newItem, ...prev]);
    }
    closeModal();
  };

  const deleteItem = (type: 'portfolio' | 'experience' | 'education' | 'certification', id: string) => {
    if (!window.confirm("Are you sure?")) return;
    if (type === 'portfolio') setPortfolio(prev => prev.filter(i => i.id !== id));
    if (type === 'experience') setWorkExperience(prev => prev.filter(i => i.id !== id));
    if (type === 'education') setEducation(prev => prev.filter(i => i.id !== id));
    if (type === 'certification') setCertifications(prev => prev.filter(i => i.id !== id));
  };

  const handlePortfolioImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPortfolioItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Main Submit ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUser({
      name: formData.name,
      title: formData.title,
      email: formData.email,
      location: formData.location,
      bio: formData.bio,
      avatar: avatarPreview,
      skills: skills,
      portfolio: portfolio,
      introVideo: introVideo,
      availability: formData.availability as 'Available' | 'Unavailable',
      workExperience: workExperience,
      education: education,
      certifications: certifications,
    });

    setSuccess('Profile updated successfully!');
    setTimeout(() => {
        if (user?.role === 'freelancer') {
            navigate(`/profile/${user.id}`);
        } else {
            navigate('/client/dashboard');
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-indigo-50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-1 text-gray-500">Update your professional information.</p>
          </div>
          <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            View Public Profile
          </button>
        </div>

        {success && (
          <div className="mx-8 mt-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Avatar & Availability */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-full w-full p-6 text-gray-300" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 w-8 h-8" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              <p className="mt-2 text-sm text-gray-500">Profile Photo</p>
            </div>

            <div className="flex-1 space-y-4 w-full">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                 <select 
                   name="availability"
                   value={formData.availability}
                   onChange={handleInputChange}
                   className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                 >
                   <option value="Available">Available - I'm open to new work</option>
                   <option value="Unavailable">Unavailable - Hide my gigs</option>
                 </select>
                 <p className="text-xs text-gray-500 mt-1">When unavailable, your gigs will be hidden from search.</p>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Intro Video</label>
                 <div className="flex items-center gap-4">
                   {introVideo ? (
                     <div className="relative w-40 h-24 bg-black rounded-lg overflow-hidden group">
                       <video src={introVideo} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button type="button" onClick={removeVideo} className="text-white bg-red-600 p-1.5 rounded-full"><Trash2 className="h-4 w-4"/></button>
                       </div>
                     </div>
                   ) : (
                     <div 
                       onClick={() => videoInputRef.current?.click()}
                       className="w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                     >
                       <Video className="h-6 w-6 text-gray-400" />
                       <span className="text-xs text-gray-500 mt-1">Upload Video</span>
                     </div>
                   )}
                   <div className="text-xs text-gray-500">
                     <p>Upload a 60s intro to build trust.</p>
                     <p>Max 50MB. MP4/WebM.</p>
                   </div>
                 </div>
                 <input type="file" ref={videoInputRef} onChange={handleVideoChange} className="hidden" accept="video/mp4,video/webm" />
               </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Basic Info Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession / Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea name="bio" rows={4} value={formData.bio} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                 {skills.map((skill, idx) => (
                   <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                     {skill}
                     <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 text-indigo-400 hover:text-indigo-600"><X className="h-3 w-3" /></button>
                   </span>
                 ))}
               </div>
              <div className="relative flex">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill(e)} className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add skill..." />
                 <button type="button" onClick={(e) => addSkill(e)} className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md text-gray-500 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Work Experience */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center"><Briefcase className="h-5 w-5 mr-2 text-indigo-500"/> Work Experience</h3>
              <button type="button" onClick={() => openModal('experience')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"><Plus className="h-4 w-4 mr-1"/> Add</button>
            </div>
            <div className="space-y-3">
              {workExperience.map(item => (
                <div key={item.id} className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.company} • {item.startDate} - {item.endDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => openModal('experience', item)} className="text-blue-600"><Edit2 className="h-4 w-4"/></button>
                    <button type="button" onClick={() => deleteItem('experience', item.id)} className="text-red-600"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center"><GraduationCap className="h-5 w-5 mr-2 text-indigo-500"/> Education</h3>
              <button type="button" onClick={() => openModal('education')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"><Plus className="h-4 w-4 mr-1"/> Add</button>
            </div>
            <div className="space-y-3">
              {education.map(item => (
                <div key={item.id} className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.school}</h4>
                    <p className="text-sm text-gray-600">{item.degree}, {item.fieldOfStudy}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => openModal('education', item)} className="text-blue-600"><Edit2 className="h-4 w-4"/></button>
                    <button type="button" onClick={() => deleteItem('education', item.id)} className="text-red-600"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center"><Award className="h-5 w-5 mr-2 text-indigo-500"/> Certifications</h3>
              <button type="button" onClick={() => openModal('certification')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"><Plus className="h-4 w-4 mr-1"/> Add</button>
            </div>
            <div className="space-y-3">
              {certifications.map(item => (
                <div key={item.id} className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.issuer} • {item.issueDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => openModal('certification', item)} className="text-blue-600"><Edit2 className="h-4 w-4"/></button>
                    <button type="button" onClick={() => deleteItem('certification', item.id)} className="text-red-600"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-indigo-500"/> Portfolio</h3>
              <button type="button" onClick={() => openModal('portfolio')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"><Plus className="h-4 w-4 mr-1"/> Add</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {portfolio.map(item => (
                <div key={item.id} className="relative group border rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-2">
                    <p className="font-bold text-sm truncate">{item.title}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => openModal('portfolio', item)} className="bg-white p-1 rounded-full shadow"><Edit2 className="h-3 w-3 text-blue-600"/></button>
                    <button type="button" onClick={() => deleteItem('portfolio', item.id)} className="bg-white p-1 rounded-full shadow"><Trash2 className="h-3 w-3 text-red-600"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Footer */}
          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-8 -mb-8 mt-8 z-10 shadow-inner">
             <button type="button" onClick={() => navigate(-1)} className="bg-white py-2.5 px-5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold capitalize">{isEditingItem ? 'Edit' : 'Add'} {activeModal}</h3>
              <button onClick={closeModal}><X className="h-5 w-5 text-gray-500"/></button>
            </div>
            
            {/* Modal Forms */}
            <div className="space-y-4">
              {activeModal === 'portfolio' && (
                <>
                  <input type="text" placeholder="Project Title" className="w-full border p-2 rounded" value={currentPortfolioItem.title} onChange={e => setCurrentPortfolioItem({...currentPortfolioItem, title: e.target.value})} />
                  <textarea placeholder="Description" className="w-full border p-2 rounded" value={currentPortfolioItem.description} onChange={e => setCurrentPortfolioItem({...currentPortfolioItem, description: e.target.value})} />
                  <div className="border border-dashed p-4 text-center cursor-pointer" onClick={() => portfolioImageRef.current?.click()}>
                    {currentPortfolioItem.image ? <img src={currentPortfolioItem.image} className="h-20 mx-auto"/> : <p>Upload Image</p>}
                    <input type="file" ref={portfolioImageRef} onChange={handlePortfolioImageUpload} className="hidden" accept="image/*" />
                  </div>
                </>
              )}

              {activeModal === 'experience' && (
                <>
                  <input type="text" placeholder="Job Title" className="w-full border p-2 rounded" value={currentExperience.title} onChange={e => setCurrentExperience({...currentExperience, title: e.target.value})} />
                  <input type="text" placeholder="Company" className="w-full border p-2 rounded" value={currentExperience.company} onChange={e => setCurrentExperience({...currentExperience, company: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Start Date" className="w-full border p-2 rounded" value={currentExperience.startDate} onChange={e => setCurrentExperience({...currentExperience, startDate: e.target.value})} />
                    <input type="text" placeholder="End Date" className="w-full border p-2 rounded" value={currentExperience.endDate} onChange={e => setCurrentExperience({...currentExperience, endDate: e.target.value})} />
                  </div>
                  <textarea placeholder="Description" className="w-full border p-2 rounded" value={currentExperience.description} onChange={e => setCurrentExperience({...currentExperience, description: e.target.value})} />
                </>
              )}

              {activeModal === 'education' && (
                <>
                  <input type="text" placeholder="School" className="w-full border p-2 rounded" value={currentEducation.school} onChange={e => setCurrentEducation({...currentEducation, school: e.target.value})} />
                  <input type="text" placeholder="Degree" className="w-full border p-2 rounded" value={currentEducation.degree} onChange={e => setCurrentEducation({...currentEducation, degree: e.target.value})} />
                  <input type="text" placeholder="Field of Study" className="w-full border p-2 rounded" value={currentEducation.fieldOfStudy} onChange={e => setCurrentEducation({...currentEducation, fieldOfStudy: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Start Year" className="w-full border p-2 rounded" value={currentEducation.startYear} onChange={e => setCurrentEducation({...currentEducation, startYear: e.target.value})} />
                    <input type="text" placeholder="End Year" className="w-full border p-2 rounded" value={currentEducation.endYear} onChange={e => setCurrentEducation({...currentEducation, endYear: e.target.value})} />
                  </div>
                </>
              )}

              {activeModal === 'certification' && (
                <>
                  <input type="text" placeholder="Certification Name" className="w-full border p-2 rounded" value={currentCertification.name} onChange={e => setCurrentCertification({...currentCertification, name: e.target.value})} />
                  <input type="text" placeholder="Issuing Organization" className="w-full border p-2 rounded" value={currentCertification.issuer} onChange={e => setCurrentCertification({...currentCertification, issuer: e.target.value})} />
                  <input type="text" placeholder="Issue Date" className="w-full border p-2 rounded" value={currentCertification.issueDate} onChange={e => setCurrentCertification({...currentCertification, issueDate: e.target.value})} />
                </>
              )}

              <button onClick={saveItem} className="w-full bg-indigo-600 text-white py-2 rounded font-medium mt-4">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
