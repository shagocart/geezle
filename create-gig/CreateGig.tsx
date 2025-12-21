import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, DollarSign, Clock, Video, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { getTagSuggestions } from '../services/ai';

const CreateGig: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    deliveryTime: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Tag State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 6 - images.length;
      
      if (remainingSlots <= 0) {
        alert("You can only upload up to 6 photos.");
        return;
      }

      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      setImages(prev => [...prev, ...filesToAdd]);
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert("Video must be under 50MB");
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  // Tag Logic
  const addTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGenerateTags = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in the Title and Description first.");
      return;
    }
    setIsGeneratingTags(true);
    const suggestions = await getTagSuggestions(formData.title, formData.description, formData.category);
    
    if (suggestions && suggestions.length > 0) {
      // Merge new tags avoiding duplicates
      const newTags = [...tags];
      suggestions.forEach(s => {
        if (!newTags.includes(s)) newTags.push(s);
      });
      setTags(newTags);
    } else {
      alert("Could not generate tags at this time. Please try again later.");
    }
    
    setIsGeneratingTags(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Gig Posted:', { ...formData, images, video, tags });
    alert('Gig posted successfully!');
    navigate('/freelancer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Create a New Gig</h1>
          <p className="mt-1 text-gray-500">Showcase your skills and start selling.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Title Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gig Title</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">I will</span>
                </div>
                <input 
                  type="text" 
                  required
                  className="block w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="do something I'm really good at"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">Keep it short and catchy.</p>
          </div>

          {/* Category */}
          <div>
             <label className="block text-sm font-medium text-gray-700">Category</label>
             <select 
               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
               value={formData.category}
               onChange={(e) => setFormData({...formData, category: e.target.value})}
             >
               <option>Select a category...</option>
               <option>Development</option>
               <option>Design</option>
               <option>Marketing</option>
               <option>Writing</option>
               <option>Video</option>
               <option>AI Services</option>
             </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              rows={6}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe what you will provide, your process, and why they should hire you..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Tags Section */}
          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Search Tags</label>
                <button
                  type="button"
                  onClick={handleGenerateTags}
                  disabled={isGeneratingTags}
                  className="text-xs flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isGeneratingTags ? 'Analyzing...' : 'Auto-generate with AI'}
                </button>
             </div>
             <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add tags (e.g. Logo Design, React)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                />
                <button 
                  type="button"
                  onClick={(e) => addTag(e)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-50 border-l border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-gray-500" />
                </button>
             </div>
             <div className="mt-2 flex flex-wrap gap-2">
               {tags.map((tag, idx) => (
                 <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                   {tag}
                   <button
                     type="button"
                     onClick={() => removeTag(tag)}
                     className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                   >
                     <span className="sr-only">Remove large option</span>
                     <X className="h-3 w-3" />
                   </button>
                 </span>
               ))}
             </div>
             <p className="mt-1 text-xs text-gray-500">Tags help buyers find your gig in search results.</p>
          </div>

          {/* Photos */}
          <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-medium text-gray-700">Gig Photos ({images.length}/6)</label>
               <span className="text-xs text-gray-500">Max 6 images</span>
             </div>
             
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <input 
                   type="file" 
                   multiple 
                   accept="image/*" 
                   onChange={handleImageChange}
                   className="hidden" 
                   id="gig-image-upload"
                   disabled={images.length >= 6}
                />
                <label htmlFor="gig-image-upload" className={`cursor-pointer flex flex-col items-center justify-center ${images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                   <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                   <p className="text-sm text-gray-600">Click to upload photos</p>
                   <p className="text-xs text-gray-400 mt-1">High quality images increase sales</p>
                </label>
             </div>
             
             {previews.length > 0 && (
               <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {previews.map((src, index) => (
                   <div key={index} className="relative group">
                     <img src={src} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                     <button
                       type="button"
                       onClick={() => removeImage(index)}
                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X className="h-4 w-4" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Video */}
          <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-medium text-gray-700">Gig Video (Optional)</label>
               <span className="text-xs text-gray-500">Max 1 video (50MB)</span>
             </div>
             
             {!video ? (
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <input 
                     type="file" 
                     accept="video/*" 
                     onChange={handleVideoChange}
                     className="hidden" 
                     id="gig-video-upload"
                  />
                  <label htmlFor="gig-video-upload" className="cursor-pointer flex flex-col items-center justify-center">
                     <Video className="h-8 w-8 text-gray-400 mb-2" />
                     <p className="text-sm text-gray-600">Click to upload video</p>
                     <p className="text-xs text-gray-400 mt-1">MP4, MOV</p>
                  </label>
               </div>
             ) : (
               <div className="relative mt-2 bg-black rounded-lg overflow-hidden group">
                 <video src={videoPreview!} controls className="w-full h-48 object-contain" />
                 <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                 >
                    <X className="h-4 w-4" />
                 </button>
                 <div className="p-2 bg-gray-900 text-white text-xs text-center truncate">
                   {video.name}
                 </div>
               </div>
             )}
          </div>

          {/* Pricing & Time */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
               <label className="block text-sm font-medium text-gray-700">Price ($)</label>
               <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="50"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Delivery Time (Days)</label>
               <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="3"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                  />
               </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/freelancer/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Publish Gig
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;