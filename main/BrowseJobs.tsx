import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import JobCard from '../components/JobCard';

const BrowseJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Work</h1>
          <p className="mt-1 text-gray-500">Explore opportunities that match your skills.</p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-grow">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search for jobs (e.g., 'React', 'Video Editor')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
             <span className="font-medium">Recent searches:</span>
             <span className="cursor-pointer hover:text-indigo-600">Web Development</span>
             <span className="cursor-pointer hover:text-indigo-600">Copywriting</span>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
               <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;