
import React, { useState } from 'react';
import { PlusCircle, FileText, Users, DollarSign, MessageSquare, Heart, Briefcase, FileCheck, CreditCard, Settings, X, CheckCircle, Clock, Download, Loader2, Send } from 'lucide-react';
import { MOCK_JOBS, MOCK_GIGS, MOCK_ORDERS, MOCK_TRANSACTIONS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useUser } from '../context/UserContext';
import GigCard from '../components/GigCard';
import { Job, Order } from '../types';

type Tab = 'overview' | 'jobs' | 'contracts' | 'financials';

const ClientDashboard: React.FC = () => {
  const { user } = useUser();
  const { formatPrice, formatStringCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!user) return <div>Loading...</div>;

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tab 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-sm text-gray-500">Manage jobs, hire talent, and review work.</p>
            </div>
            <Link to="/create-job" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              <PlusCircle className="h-4 w-4 mr-2" /> Post a New Job
            </Link>
          </div>
          <div className="flex space-x-2 pb-4 overflow-x-auto">
            <NavItem tab="overview" label="Overview" icon={Briefcase} />
            <NavItem tab="jobs" label="My Job Posts" icon={FileText} />
            <NavItem tab="contracts" label="Active Contracts" icon={FileCheck} />
            <NavItem tab="financials" label="Financials" icon={CreditCard} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab user={user} />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'contracts' && <ContractsTab />}
        {activeTab === 'financials' && <FinancialsTab user={user} />}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const OverviewTab = ({ user }: { user: any }) => {
  const { formatPrice } = useCurrency();
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
           <StatsCard title="Total Spent" value={formatPrice(14500)} icon={DollarSign} color="bg-green-100 text-green-600" />
           <StatsCard title="Active Contracts" value="3" icon={Users} color="bg-blue-100 text-blue-600" />
           <StatsCard title="Open Jobs" value="12" icon={FileText} color="bg-purple-100 text-purple-600" />
           <StatsCard title="Unread Messages" value="5" icon={MessageSquare} color="bg-yellow-100 text-yellow-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-gray-900">Recent Job Posts</h3>
               <Link to="#" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
             </div>
             <div className="space-y-4">
               {MOCK_JOBS.slice(0, 3).map(job => (
                 <div key={job.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{job.type} • {job.budget}</p>
                    </div>
                    <div className="text-right">
                       <span className="block text-xl font-bold text-gray-900">{job.proposals}</span>
                       <span className="text-xs text-gray-500 uppercase">Proposals</span>
                    </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Talent</h3>
             <div className="space-y-4">
               {MOCK_GIGS.slice(0, 2).map(gig => (
                 <div key={gig.id} className="flex items-start space-x-3">
                   <img src={gig.freelancerAvatar} className="w-10 h-10 rounded-full object-cover" />
                   <div>
                     <p className="text-sm font-medium text-gray-900 line-clamp-1">{gig.freelancerName}</p>
                     <p className="text-xs text-gray-500 line-clamp-1">{gig.title}</p>
                   </div>
                 </div>
               ))}
             </div>
             <Link to="/browse" className="block mt-4 text-center text-sm text-indigo-600 font-medium hover:underline">Find More Talent</Link>
           </div>
        </div>
    </div>
  );
};

const JobsTab = () => {
  const { formatStringCurrency } = useCurrency();
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter jobs based on toggle
  const displayedJobs = MOCK_JOBS.filter(job => 
    showArchived ? job.status !== 'Open' : job.status === 'Open'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
           <h3 className="font-bold text-gray-900">{showArchived ? 'Archived Jobs' : 'Active Jobs'}</h3>
           <div className="flex space-x-2">
             <button 
                onClick={() => setShowArchived(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!showArchived ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
             >
                Active
             </button>
             <button 
                onClick={() => setShowArchived(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${showArchived ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
             >
                Archived
             </button>
           </div>
         </div>
         <ul className="divide-y divide-gray-200">
           {displayedJobs.length > 0 ? displayedJobs.map((job) => (
             <li key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex-1 min-w-0 pr-4">
                   <h4 onClick={() => setSelectedJob(job)} className="text-base font-semibold text-gray-900 truncate hover:text-indigo-600 cursor-pointer">{job.title}</h4>
                   <div className="mt-1 flex items-center text-sm text-gray-500">
                     <span>Posted {job.postedTime}</span>
                     <span className="mx-2">•</span>
                     <span>{job.type}</span>
                     <span className="mx-2">•</span>
                     <span className="font-medium text-gray-700">{formatStringCurrency(job.budget)}</span>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="text-center px-4 border-r border-gray-200">
                     <span className="block text-xl font-bold text-gray-900">{job.proposals}</span>
                     <span className="text-xs text-gray-500">Proposals</span>
                   </div>
                   <div className="text-center px-4 border-r border-gray-200">
                      <span className="block text-xl font-bold text-gray-900">0</span>
                      <span className="text-xs text-gray-500">Messaged</span>
                   </div>
                   <div>
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                       {job.status}
                     </span>
                   </div>
                   <button onClick={() => setSelectedJob(job)} className="ml-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                     <Settings className="h-5 w-5" />
                   </button>
                 </div>
               </div>
             </li>
           )) : (
             <li className="px-6 py-12 text-center text-gray-500">
               No {showArchived ? 'archived' : 'active'} jobs found.
             </li>
           )}
         </ul>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative animate-fade-in-up">
            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
            
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{selectedJob.type}</span>
                <span>{formatStringCurrency(selectedJob.budget)}</span>
                <span>Posted {selectedJob.postedTime}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedJob.description}</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Close
              </button>
              <button 
                onClick={() => navigate('/create-job', { state: { job: selectedJob, isEditing: true } })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit Job Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContractsTab = () => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionState, setActionState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleReleasePayment = () => {
    setActionState('loading');
    setTimeout(() => {
      setActionState('success');
      setTimeout(() => {
        setActionState('idle');
        setSelectedOrder(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
       {/* Active Contracts */}
       <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50 flex items-center">
             <FileCheck className="h-5 w-5 text-indigo-600 mr-2" />
             <h3 className="font-bold text-gray-900">Active Contracts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freelancer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (Escrow)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {MOCK_ORDERS.map(order => (
                   <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 overflow-hidden">
                               {order.freelancerName.charAt(0)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{order.freelancerName}</div>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{order.gigTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatPrice(order.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button 
                           onClick={() => setSelectedOrder(order)}
                           className="text-indigo-600 hover:text-indigo-900 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                         >
                           Manage
                         </button>
                      </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
       </div>

       {/* Manage Contract Modal */}
       {selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
           <div className="bg-white rounded-xl max-w-lg w-full p-6 relative animate-fade-in-up">
             <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
               <X className="h-5 w-5" />
             </button>
             
             <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Contract</h2>
             <p className="text-sm text-gray-500 mb-6">Order #{selectedOrder.id.split('-')[1]} • {selectedOrder.gigTitle}</p>

             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Escrow Balance</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(selectedOrder.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{selectedOrder.status}</span>
                </div>
             </div>

             <div className="space-y-3">
               <button 
                 onClick={handleReleasePayment}
                 disabled={actionState !== 'idle'}
                 className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all ${actionState === 'success' ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
               >
                 {actionState === 'loading' && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                 {actionState === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
                 {actionState === 'idle' ? 'Release Payment' : actionState === 'loading' ? 'Processing...' : 'Payment Released!'}
               </button>
               
               <button 
                 onClick={() => navigate('/messages')}
                 className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center"
               >
                 <MessageSquare className="h-4 w-4 mr-2" /> Send Message
               </button>

               <button className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg">
                 End Contract & Request Refund
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

const FinancialsTab = ({ user }: { user: any }) => {
  const { formatPrice } = useCurrency();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Invoices downloaded successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Spend (Lifetime)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(14500)}</p>
            <div className="mt-4">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="text-sm text-indigo-600 font-medium hover:underline flex items-center"
              >
                {isDownloading ? (
                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download className="h-3 w-3 mr-1" /> Download Invoices</>
                )}
              </button>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Funds in Escrow</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(1200)}</p>
            <p className="text-xs text-gray-400 mt-1">Held securely until you approve the work.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_TRANSACTIONS.map((txn, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ref: {txn.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                    {formatPrice(txn.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
    <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-5 w-0 flex-1">
      <dl>
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="text-lg font-medium text-gray-900">{value}</dd>
      </dl>
    </div>
  </div>
);

export default ClientDashboard;
