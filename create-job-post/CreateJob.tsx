
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { getTagSuggestions } from '../services/ai';
import { Job } from '../types';

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingJob = location.state?.job as Job | undefined;
  const isEditing = location.state?.isEditing || false;

  const [formData, setFormData] = useState({
    title: editingJob?.title || '',
    category: '', // Mock jobs don't carry explicit category, default empty
    description: editingJob?.description || '',
    type: editingJob?.type || 'Fixed Price',
    // Try to extract number from budget string "$2000" or "$25/hr" for the input, else empty
    budget: editingJob?.budget ? parseFloat(editingJob.budget.replace(/[^0-9.]/g, '')).toString() : '',
    duration: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Tag State
  const [tags, setTags] = useState<string[]>(editingJob?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
    // Simulate API call
    console.log(isEditing ? 'Job Updated:' : 'Job Posted:', { ...formData, images, tags });
    alert(isEditing ? 'Job updated successfully!' : 'Job posted successfully! Redirecting to dashboard...');
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Job Post' : 'Post a Job'}</h1>
          <p className="mt-1 text-gray-500">{isEditing ? 'Update your job details.' : 'Reach thousands of top-rated freelancers.'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. Senior React Developer for E-commerce Project"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Category</label>
             <select 
               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
               value={formData.category}
               onChange={(e) => setFormData({...formData, category: e.target.value})}
             >
               <option value="">Select a category...</option>
               <option>Development</option>
               <option>Design</option>
               <option>Marketing</option>
               <option>Writing</option>
             </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              rows={6}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the project deliverables, timeline, and required skills..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Tags Section */}
          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Required Skills / Tags</label>
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
                  placeholder="Add tags (e.g. React, Node.js)"
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
                 <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                   {tag}
                   <button
                     type="button"
                     onClick={() => removeTag(tag)}
                     className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                   >
                     <span className="sr-only">Remove large option</span>
                     <X className="h-3 w-3" />
                   </button>
                 </span>
               ))}
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <input 
                   type="file" 
                   multiple 
                   accept="image/*,.pdf" 
                   onChange={handleImageChange}
                   className="hidden" 
                   id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                   <Upload className="h-8 w-8 text-gray-400 mb-2" />
                   <p className="text-sm text-gray-600">Click to upload photos or documents</p>
                   <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                </label>
             </div>

             {previews.length > 0 && (
               <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {previews.map((src, index) => (
                   <div key={index} className="relative group">
                     <img src={src} alt="Preview" className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                     <button
                       type="button"
                       onClick={() => removeImage(index)}
                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X className="h-3 w-3" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Type</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="fixed"
                    name="type"
                    type="radio"
                    checked={formData.type === 'Fixed Price'}
                    onChange={() => setFormData({...formData, type: 'Fixed Price'})}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="fixed" className="ml-3 block text-sm font-medium text-gray-700">
                    Fixed Price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="hourly"
                    name="type"
                    type="radio"
                    checked={formData.type === 'Hourly'}
                    onChange={() => setFormData({...formData, type: 'Hourly'})}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="hourly" className="ml-3 block text-sm font-medium text-gray-700">
                    Hourly Rate
                  </label>
                </div>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">
                 {formData.type === 'Fixed Price' ? 'Total Budget ($)' : 'Hourly Rate ($/hr)'}
               </label>
               <input 
                 type="number" 
                 required
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                 placeholder="0.00"
                 value={formData.budget}
                 onChange={(e) => setFormData({...formData, budget: e.target.value})}
               />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/client/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Job' : 'Post Job Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
