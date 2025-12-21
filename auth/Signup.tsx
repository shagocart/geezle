import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

const Signup: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Signup
    console.log('Signup payload:', { ...formData, role: selectedRole });
    // In a real app, you would dispatch an auth action here
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Join as a Client or Freelancer' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {step === 1 && (
            <div className="space-y-4">
              <div 
                onClick={() => handleRoleSelect(UserRole.EMPLOYER)}
                className={`relative rounded-lg border-2 p-4 cursor-pointer hover:border-indigo-600 transition-all ${selectedRole === UserRole.EMPLOYER ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className={`h-8 w-8 ${selectedRole === UserRole.EMPLOYER ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">I'm a client, hiring for a project</h3>
                    </div>
                  </div>
                  {selectedRole === UserRole.EMPLOYER && <CheckCircle2 className="h-6 w-6 text-indigo-600" />}
                </div>
              </div>

              <div 
                onClick={() => handleRoleSelect(UserRole.FREELANCER)}
                className={`relative rounded-lg border-2 p-4 cursor-pointer hover:border-indigo-600 transition-all ${selectedRole === UserRole.FREELANCER ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className={`h-8 w-8 ${selectedRole === UserRole.FREELANCER ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">I'm a freelancer, looking for work</h3>
                    </div>
                  </div>
                  {selectedRole === UserRole.FREELANCER && <CheckCircle2 className="h-6 w-6 text-indigo-600" />}
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
                  ${selectedRole ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                {selectedRole ? 'Create Account' : 'Select a Role'}
              </button>
            </div>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="8+ characters"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create My Account
                </button>
              </div>

              <div className="text-center">
                 <button 
                   type="button" 
                   onClick={() => setStep(1)}
                   className="text-sm text-gray-500 hover:text-indigo-600"
                 >
                   Back to role selection
                 </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Signup;