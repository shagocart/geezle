
import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Briefcase, DollarSign, Clock, PlusCircle, Star, Package, Settings, FileText, ChevronRight, X, Loader2, Download, ExternalLink } from 'lucide-react';
import { MOCK_JOBS, MOCK_GIGS, MOCK_ORDERS, MOCK_TRANSACTIONS } from '../constants';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useUser } from '../context/UserContext';
import GigCard from '../components/GigCard';

type Tab = 'overview' | 'gigs' | 'orders' | 'financials';

const FreelancerDashboard: React.FC = () => {
  const { user } = useUser();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Interactive States
  const [statsGig, setStatsGig] = useState<any | null>(null);

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
    <div className="min-h-screen bg-gray-50 relative">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your gigs, orders, and earnings.</p>
            </div>
            <Link to="/create-gig" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
              <PlusCircle className="h-4 w-4 mr-2" /> Create New Gig
            </Link>
          </div>
          <div className="flex space-x-2 pb-4 overflow-x-auto">
            <NavItem tab="overview" label="Overview" icon={Briefcase} />
            <NavItem tab="gigs" label="My Gigs" icon={Package} />
            <NavItem tab="orders" label="Orders & Sales" icon={FileText} />
            <NavItem tab="financials" label="Earnings" icon={DollarSign} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KYC Alert */}
        {user.kycStatus !== 'approved' && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm flex justify-between items-center">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">Identity Verification Required</p>
                <p className="text-sm text-yellow-600">You must complete KYC verification to withdraw funds.</p>
              </div>
            </div>
            <Link to="/kyc" className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600">Verify Now</Link>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab user={user} />}
        {activeTab === 'gigs' && <GigsTab setStatsGig={setStatsGig} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'financials' && <FinancialsTab user={user} />}

      </div>

      {/* Stats Modal */}
      {statsGig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setStatsGig(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gig Performance</h3>
            <div className="flex items-center space-x-3 mb-6 bg-gray-50 p-3 rounded-lg">
              <img src={statsGig.image} className="w-12 h-12 rounded-lg object-cover" alt="gig" />
              <div>
                <p className="font-medium text-gray-900 line-clamp-1 text-sm">{statsGig.title}</p>
                <p className="text-sm text-indigo-600 font-bold">{formatPrice(statsGig.price)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-semibold">Impressions</p>
                 <p className="text-xl font-bold text-gray-900 mt-1">1,245</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-semibold">Clicks</p>
                 <p className="text-xl font-bold text-gray-900 mt-1">142</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-semibold">Orders</p>
                 <p className="text-xl font-bold text-gray-900 mt-1">8</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-semibold">Conversion</p>
                 <p className="text-xl font-bold text-gray-900 mt-1">5.6%</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---

const OverviewTab = ({ user }: { user: any }) => {
  const { formatPrice } = useCurrency();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Net Income" value={formatPrice(user.balance || 0)} icon={DollarSign} color="bg-green-100 text-green-600" />
        <StatsCard title="Active Orders" value="3" icon={Briefcase} color="bg-blue-100 text-blue-600" />
        <StatsCard title="Avg. Selling Price" value={formatPrice(120)} icon={Star} color="bg-yellow-100 text-yellow-600" />
        <StatsCard title="Completion Rate" value="98%" icon={CheckCircle} color="bg-indigo-100 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-3 font-medium">Gig</th>
                  <th className="pb-3 font-medium">Buyer</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_ORDERS.filter(o => o.status === 'Active').map(order => (
                  <tr key={order.id}>
                    <td className="py-3 pr-4 max-w-xs truncate font-medium text-gray-900">{order.gigTitle}</td>
                    <td className="py-3 text-gray-600">{order.clientName}</td>
                    <td className="py-3 text-gray-600">{order.dueDate}</td>
                    <td className="py-3 font-medium">{formatPrice(order.amount)}</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {MOCK_ORDERS.filter(o => o.status === 'Active').length === 0 && (
              <p className="text-center py-6 text-gray-400">No active orders right now.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Jobs</h3>
          <ul className="space-y-4">
            {MOCK_JOBS.slice(0, 3).map(job => (
              <li key={job.id} className="group cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h4>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                   <span>{job.type}</span>
                   <span className="mx-1">•</span>
                   <span>{job.budget}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/browse-jobs" className="block mt-4 text-sm text-indigo-600 font-medium hover:underline">View All Jobs &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

const GigsTab = ({ setStatsGig }: { setStatsGig: (gig: any) => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {MOCK_GIGS.map(gig => (
        <div key={gig.id} className="relative group">
           <GigCard gig={gig} />
           <div className="absolute top-2 left-2 flex space-x-1 z-10">
             <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold uppercase rounded shadow-sm">Active</span>
           </div>
           
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl space-x-3 pointer-events-none z-20">
             <Link 
               to="/create-gig" 
               className="pointer-events-auto px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transform hover:scale-105 transition-transform"
             >
               Edit
             </Link>
             <button 
               onClick={() => setStatsGig(gig)}
               className="pointer-events-auto px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transform hover:scale-105 transition-transform"
             >
               Stats
             </button>
           </div>
        </div>
      ))}
      <Link 
        to="/create-gig" 
        className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 p-6 min-h-[300px] hover:bg-gray-50 hover:border-gray-400 hover:text-indigo-500 transition-all cursor-pointer bg-white"
      >
         <PlusCircle className="h-10 w-10 mb-2" />
         <span className="font-medium">Create New Gig</span>
      </Link>
    </div>
  </div>
);

const OrdersTab = () => {
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState('All Orders');
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (filter === 'All Orders') return true;
    return order.status === filter;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Order Management</h3>
        <div className="flex space-x-2">
           <select 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1.5 pl-3 pr-8"
           >
             <option value="All Orders">All Orders</option>
             <option value="Active">Active</option>
             <option value="Delivered">Delivered</option>
             <option value="Completed">Completed</option>
             <option value="Cancelled">Cancelled</option>
           </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gig / Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id.split('-')[1]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{order.gigTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatPrice(order.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setShowDetail(order.id)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  No orders found matching "{filter}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal Sim */}
      {showDetail && (
        <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-8 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
             <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-indigo-600" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Order Details #{showDetail.split('-')[1]}</h3>
             <p className="text-gray-500 mt-2 mb-6">This is a mock detail view. In a real application, this would take you to a dedicated order management page.</p>
             <button 
               onClick={() => setShowDetail(null)}
               className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
             >
               Close Details
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FinancialsTab = ({ user }: { user: any }) => {
  const { formatPrice } = useCurrency();
  const [withdrawState, setWithdrawState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [downloadState, setDownloadState] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleWithdraw = () => {
    if (withdrawState !== 'idle') return;
    setWithdrawState('processing');
    setTimeout(() => {
      setWithdrawState('success');
      setTimeout(() => setWithdrawState('idle'), 3000);
    }, 1500);
  };

  const handleDownload = () => {
    if (downloadState !== 'idle') return;
    setDownloadState('processing');
    setTimeout(() => {
      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Withdrawal Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Available for Withdrawal</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(user.balance || 0)}</h2>
          <button 
            onClick={handleWithdraw}
            disabled={withdrawState !== 'idle' || (user.balance || 0) <= 0}
            className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center
              ${withdrawState === 'success' ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              ${(user.balance || 0) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {withdrawState === 'processing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {withdrawState === 'processing' ? 'Processing...' : withdrawState === 'success' ? 'Request Sent ✓' : 'Withdraw Funds'}
          </button>
          <p className="mt-2 text-xs text-gray-400 text-center">Protected by Admin Approval</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Pending Clearance</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(450)}</h2>
          <p className="mt-4 text-sm text-gray-500">Funds are held in escrow until order completion + 7 days clearance.</p>
        </div>

        {/* Download Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Earnings (Lifetime)</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(12450)}</h2>
          <button 
            onClick={handleDownload}
            disabled={downloadState !== 'idle'}
            className={`mt-4 w-full border text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center
               ${downloadState === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white border-gray-300 hover:bg-gray-50'}
            `}
          >
            {downloadState === 'processing' ? (
               <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating PDF...</>
            ) : downloadState === 'success' ? (
               <><CheckCircle className="h-4 w-4 mr-2" /> Downloaded ✓</>
            ) : (
               <><Download className="h-4 w-4 mr-2" /> Download Statement</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
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
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${txn.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'Withdrawal' ? '-' : '+'}{formatPrice(txn.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.status === 'Completed' ? 'bg-green-100 text-green-800' : txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
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
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start">
    <div className={`p-3 rounded-lg ${color} mr-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Active': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Disputed': 'bg-orange-100 text-orange-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>
      {status}
    </span>
  );
};

export default FreelancerDashboard;
