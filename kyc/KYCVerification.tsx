
import React, { useState, useEffect } from 'react';
import { Upload, ShieldCheck, Check, AlertCircle, RefreshCw, XCircle, FileText, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const KYCVerification: React.FC = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    mobile: '',
    dob: '',
    nationality: '',
    idType: 'Passport'
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status mapping
  const currentStatus = user?.kycStatus || 'none';

  useEffect(() => {
    // If we have previous rejection notes or data, we could preload them here
    // For now, if status is approved, we assume no action needed unless they want to update
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission delay
    setTimeout(() => {
      // In a real app, upload file and data to server
      updateUser({ kycStatus: 'pending' });
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }, 2000);
  };

  // Render Logic based on Status

  if (currentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6 animate-pulse">
            <RefreshCw className="h-10 w-10 text-blue-600 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Under Review</h2>
          <p className="mt-4 text-gray-600">
            Thank you for submitting your documents. Our compliance team is currently reviewing your application.
          </p>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 inline-block text-left">
            <p className="font-semibold mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Review typically takes 24-48 hours.</li>
              <li>You will be notified via email and dashboard.</li>
              <li>Withdrawals remain paused until approval.</li>
            </ul>
          </div>
          <div className="mt-8">
            <button onClick={() => navigate('/freelancer/dashboard')} className="text-indigo-600 font-medium hover:underline">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">You are Verified!</h2>
          <p className="mt-2 text-gray-600">
            Your identity has been confirmed. You now have full access to all platform features, including withdrawals and priority support.
          </p>
          <div className="mt-8">
            <button onClick={() => navigate('/freelancer/dashboard')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form View (None, Rejected, Resubmission Required)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Identity Verification</h1>
          <p className="mt-2 text-gray-600">
             To ensure the safety of our marketplace, we require all users to verify their identity.
          </p>
        </div>

        {currentStatus === 'rejected' && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex">
              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800">Verification Rejected</h3>
                <p className="text-sm text-red-700 mt-1">
                  Your previous submission was not approved. Please review the requirements and submit valid documents.
                  <br/>
                  <span className="font-semibold">Reason:</span> Document was blurry or expired.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50 flex items-center">
             <ShieldCheck className="h-5 w-5 text-indigo-600 mr-3" />
             <h3 className="text-lg font-medium text-gray-900">KYC Submission Form</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Full Name (as on ID)</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Street, City, Zip, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input 
                  type="text" 
                  name="nationality"
                  required
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ID Document Type</label>
                <select 
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Passport</option>
                  <option>Driver License</option>
                  <option>National ID Card</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Government ID (Front)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUpload}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                  {file ? (
                    <div>
                      <FileText className="h-10 w-10 text-indigo-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs text-green-600 mt-2 font-medium">Ready to upload</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Clear photo of your {formData.idType}</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 10MB</p>
                    </div>
                  )}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start bg-yellow-50 p-4 rounded-md">
               <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
               <p className="ml-3 text-sm text-yellow-700">
                 By submitting this form, you confirm that the information provided is accurate and belongs to you. False information may lead to permanent account suspension.
               </p>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={!file || isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
                  ${file && !isSubmitting ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
