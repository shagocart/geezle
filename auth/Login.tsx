
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole, User } from '../types';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Determine the redirect path (default to dashboard based on role, or the page they came from)
    const from = location.state?.from || null;

    let authenticatedUser: User | null = null;

    // Admin Login Logic
    if (email === 'admin@atmyworks.com' && password === 'admin12345') {
      authenticatedUser = {
        id: 'admin-1',
        name: 'Super Admin',
        email,
        role: UserRole.ADMIN,
        avatar: '',
      };
    }
    // Demo Employer Login
    else if (email.includes('employer')) {
      authenticatedUser = {
        id: 'client-1',
        name: 'John Client',
        email,
        role: UserRole.EMPLOYER,
        avatar: 'https://picsum.photos/seed/client/50/50',
        balance: 5000,
        escrowBalance: 1200,
        title: 'CTO at TechStart',
        location: 'San Francisco, CA',
        bio: 'Hiring manager looking for top-tier full stack developers and designers for ongoing projects.',
        availability: 'Available'
      };
    }
    // Demo Freelancer Login
    else if (email.includes('freelancer')) {
      authenticatedUser = {
        id: 'free-1',
        name: 'Jane Freelancer',
        email,
        role: UserRole.FREELANCER,
        avatar: 'https://picsum.photos/seed/freelancer/50/50',
        kycStatus: 'approved',
        balance: 450,
        title: 'Full Stack React Developer',
        location: 'London, UK',
        bio: 'I am a passionate developer with 5 years of experience in React, Node.js, and Cloud Architecture. I love building scalable web applications.',
        skills: ['React', 'Node.js', 'TypeScript', 'Tailwind', 'AWS'],
        rating: 4.9,
        reviewsCount: 32,
        availability: 'Available',
        introVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
        workExperience: [
          { id: '1', title: 'Senior Frontend Dev', company: 'TechSolutions Ltd', country: 'UK', startDate: '2020', endDate: 'Present', description: 'Leading the frontend team.' },
          { id: '2', title: 'Web Developer', company: 'Creative Agency', country: 'UK', startDate: '2018', endDate: '2020', description: 'Developed client websites.' }
        ],
        education: [
          { id: '1', school: 'University of London', degree: 'B.S.', fieldOfStudy: 'Computer Science', country: 'UK', startYear: '2014', endYear: '2018' }
        ],
        certifications: [
          { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2022', isVerified: true },
          { id: '2', name: 'React Native Expert', issuer: 'Meta', issueDate: '2021', isVerified: false }
        ],
        portfolio: [
          {
            id: 'p1',
            title: 'E-commerce Dashboard UI',
            image: 'https://picsum.photos/seed/p1/400/300',
            description: 'A complete dashboard redesign for a Shopify store.',
            isVisible: true
          },
          {
            id: 'p2',
            title: 'Travel App Mobile Design',
            image: 'https://picsum.photos/seed/p2/400/300',
            description: 'Mobile application design for a travel agency including booking flow.',
            isVisible: true
          },
          {
            id: 'p3',
            title: 'SaaS Landing Page',
            image: 'https://picsum.photos/seed/p3/400/300',
            description: 'High converting landing page for a CRM startup.',
            isVisible: false
          }
        ]
      };
    }

    if (authenticatedUser) {
      login(authenticatedUser);
      
      // Redirect Logic
      if (from) {
        navigate(from);
      } else if (authenticatedUser.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (authenticatedUser.role === UserRole.EMPLOYER) {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } else {
      setError('Invalid credentials. For demo, use: admin@atmyworks.com / admin12345. Or include "employer" or "freelancer" in email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">start your 14-day free trial</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="admin@atmyworks.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="********"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Access (Demo)</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail('employer@demo.com'); setPassword('123'); }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Employer
              </button>
              <button
                onClick={() => { setEmail('freelancer@demo.com'); setPassword('123'); }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Freelancer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
