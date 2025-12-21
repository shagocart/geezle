import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-4">
              AtMyWorks
            </h3>
            <p className="text-gray-400 text-sm">
              The secure, enterprise-grade freelancing platform. Connect, collaborate, and grow with confidence.
            </p>
            <div className="flex space-x-4 mt-6">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">For Clients</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400">How to Hire</a></li>
              <li><a href="#" className="hover:text-indigo-400">Talent Marketplace</a></li>
              <li><a href="#" className="hover:text-indigo-400">Project Catalog</a></li>
              <li><a href="#" className="hover:text-indigo-400">Enterprise Solutions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">For Freelancers</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400">How to Find Work</a></li>
              <li><a href="#" className="hover:text-indigo-400">Direct Contracts</a></li>
              <li><a href="#" className="hover:text-indigo-400">Freelancer Resources</a></li>
              <li><a href="#" className="hover:text-indigo-400">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2024 AtMyWorks Global Inc.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
             <Globe className="h-4 w-4" />
             <span>English (US)</span>
             <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;