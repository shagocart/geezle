
import React, { useState, useRef } from 'react';
import { Users, DollarSign, ShieldAlert, FileText, Settings, BarChart2, CheckCircle, XCircle, Search, Menu, X, Globe, Plus, Trash2, Edit2, RotateCcw, Percent, Calculator, Briefcase, User as UserIcon, Save, LayoutTemplate, MessageSquare, Server, Eye, Lock, Mail, Image as ImageIcon, ChevronDown, ChevronRight, CreditCard, Video, MoreHorizontal, Layers, Package, Tag, Filter, Check, Clock, RefreshCw, Upload, Sparkles } from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_DISPUTES, MOCK_KYC_DOCS, MOCK_GIGS, MOCK_JOBS, CATEGORIES } from '../constants';
import { Transaction, Dispute, KYCDocument, Currency, CommissionSettings, SMTPConfig, PaymentGateway, User, UserRole, Gig, Job, Category } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useContent } from '../context/ContentContext';
import { useMessages } from '../context/MessageContext';
import { useNotifications } from '../context/NotificationContext';

type Tab = 'overview' | 'users' | 'listings' | 'categories' | 'financials' | 'disputes' | 'kyc' | 'currencies' | 'gateways' | 'commissions' | 'cms' | 'communications' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Simulated Global State for Listings & Categories (initialized from constants)
  const [adminGigs, setAdminGigs] = useState<Gig[]>(MOCK_GIGS.map(g => ({...g, status: 'active'}))); 
  const [adminJobs, setAdminJobs] = useState<Job[]>(MOCK_JOBS);
  const [adminCategories, setAdminCategories] = useState<Category[]>(CATEGORIES.map((c, i) => ({ id: `cat-${i}`, name: c.name, icon: c.icon })));
  
  // KYC State
  const [kycDocs, setKycDocs] = useState<KYCDocument[]>(MOCK_KYC_DOCS);

  // Commission State
  const [commission, setCommission] = useState<CommissionSettings>({
    buyer: { type: 'percentage', value: 5, isActive: true }, 
    seller: { type: 'percentage', value: 20, isActive: true } 
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'users': return <UsersTab />;
      case 'listings': return <ListingsTab gigs={adminGigs} jobs={adminJobs} setGigs={setAdminGigs} setJobs={setAdminJobs} />;
      case 'categories': return <CategoriesTab categories={adminCategories} setCategories={setAdminCategories} />;
      case 'financials': return <FinancialsTab />;
      case 'disputes': return <DisputesTab />;
      case 'kyc': return <KYCTab docs={kycDocs} setDocs={setKycDocs} />;
      case 'currencies': return <CurrenciesTab />;
      case 'gateways': return <GatewaysTab />;
      case 'commissions': return <CommissionsTab commission={commission} setCommission={setCommission} />;
      case 'cms': return <ContentManagementTab />;
      case 'communications': return <CommunicationManagementTab />;
      case 'settings': return <SettingsTab />;
      default: return <div className="p-8 text-gray-500">This section is under development.</div>;
    }
  };

  const NavItem = ({ tab, icon: Icon, label, count }: { tab: Tab, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
      className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
        activeTab === tab ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${activeTab === tab ? 'text-indigo-400' : 'text-gray-400 group-hover:text-indigo-400'}`} />
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="bg-gray-900 group-hover:bg-gray-700 ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full text-gray-200">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Admin Console</span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-indigo-400">AtMyWorks</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Super Admin</p>
        </div>
        <nav className="mt-2 space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          <NavItem tab="overview" icon={BarChart2} label="Overview" />
          <NavItem tab="users" icon={Users} label="User Management" />
          <NavItem tab="listings" icon={Layers} label="Listings (Gigs/Jobs)" />
          <NavItem tab="categories" icon={Tag} label="Categories" />
          <NavItem tab="financials" icon={DollarSign} label="Financials & Escrow" />
          <NavItem tab="communications" icon={MessageSquare} label="Communication Mgmt" />
          <NavItem tab="gateways" icon={CreditCard} label="Payment Gateways" />
          <NavItem tab="currencies" icon={Globe} label="Currencies" />
          <NavItem tab="commissions" icon={Percent} label="Commission Fees" />
          <NavItem tab="cms" icon={LayoutTemplate} label="Pages & CMS" />
          <NavItem tab="disputes" icon={ShieldAlert} label="Disputes" count={3} />
          <NavItem tab="kyc" icon={FileText} label="KYC Approvals" count={kycDocs.filter(d => d.status === 'Pending').length} />
          <NavItem tab="settings" icon={Settings} label="Platform Settings" />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto h-screen relative">
         {renderContent()}
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

// --- Tabs Components ---

const KYCTab = ({ docs, setDocs }: { docs: KYCDocument[], setDocs: any }) => {
  const [selectedDoc, setSelectedDoc] = useState<KYCDocument | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const { addNotification } = useNotifications();

  const handleStatusUpdate = (status: 'Approved' | 'Rejected' | 'Resubmission Required') => {
    if (!selectedDoc) return;

    setDocs((prevDocs: KYCDocument[]) => prevDocs.map((doc: KYCDocument) => 
      doc.id === selectedDoc.id 
        ? { ...doc, status, adminNotes: adminNote } 
        : doc
    ));

    // Send notification to user (Simulated)
    addNotification({
      type: status === 'Approved' ? 'success' : 'alert',
      title: `KYC Verification ${status}`,
      message: status === 'Approved' 
        ? 'Your identity has been verified successfully.' 
        : `Your KYC verification was rejected. Reason: ${adminNote || 'Does not meet requirements.'}`,
    });

    setSelectedDoc(null);
    setAdminNote('');
  };

  const pendingDocs = docs.filter(d => d.status === 'Pending');
  const historyDocs = docs.filter(d => d.status !== 'Pending');

  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">KYC Management</h1>
      
      {/* Pending Queue */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-yellow-500" /> Pending Requests ({pendingDocs.length})
        </h2>
        <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
          {pendingDocs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending verification requests.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingDocs.map((doc) => (
                <li key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                         {doc.userName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{doc.userName} <span className="text-gray-400">({doc.userId})</span></p>
                        <p className="text-sm text-gray-500">{doc.type} • Submitted {doc.dateSubmitted}</p>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                      >
                        Review Application
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Verification History</h2>
        <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {historyDocs.map(doc => (
                 <tr key={doc.id}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.userName}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.dateSubmitted}</td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                       ${doc.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                         doc.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                       {doc.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{doc.adminNotes || '-'}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review KYC Submission</h2>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"><X className="h-5 w-5"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Document Preview */}
              <div className="bg-gray-100 rounded-lg p-2 border border-gray-200">
                <img src={selectedDoc.frontImage} alt="ID Document" className="w-full h-auto rounded object-contain" />
              </div>

              {/* Details & Actions */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">Applicant Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Full Name</span>
                      <span className="font-medium">{selectedDoc.fullName || selectedDoc.userName}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Nationality</span>
                      <span className="font-medium">{selectedDoc.nationality || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Date of Birth</span>
                      <span className="font-medium">{selectedDoc.dob || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Mobile</span>
                      <span className="font-medium">{selectedDoc.mobile || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-gray-500 text-xs uppercase">Address</span>
                      <span className="font-medium">{selectedDoc.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Required for Rejection)</label>
                  <textarea 
                    rows={3}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter reason for rejection or approval notes..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleStatusUpdate('Approved')}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" /> Approve & Verify User
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate('Resubmission Required')}
                      className="flex-1 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 flex items-center justify-center"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" /> Request Resubmission
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate('Rejected')}
                      className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center"
                    >
                      <XCircle className="h-5 w-5 mr-2" /> Reject Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ListingsTab = ({ gigs, jobs, setGigs, setJobs }: { gigs: Gig[], jobs: Job[], setGigs: any, setJobs: any }) => {
  const [view, setView] = useState<'gigs' | 'jobs'>('gigs');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const { formatPrice } = useCurrency();

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (view === 'gigs') {
      setGigs(gigs.map(g => g.id === editingItem.id ? { ...g, ...editForm } : g));
    } else {
      setJobs(jobs.map(j => j.id === editingItem.id ? { ...j, ...editForm } : j));
    }
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      if (view === 'gigs') setGigs(gigs.filter(g => g.id !== id));
      else setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const handleToggleStatus = (item: any) => {
    // Basic status toggle logic
    if (view === 'gigs') {
      const newStatus = item.status === 'suspended' ? 'active' : 'suspended';
      setGigs(gigs.map(g => g.id === item.id ? { ...g, status: newStatus } : g));
    } else {
      const newStatus = item.status === 'Suspended' ? 'Open' : 'Suspended';
      setJobs(jobs.map(j => j.id === item.id ? { ...j, status: newStatus } : j));
    }
  };

  const filteredData = (view === 'gigs' ? gigs : jobs).filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : (view === 'gigs' ? item.status === filterStatus : item.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Listings Management</h1>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button 
            onClick={() => setView('gigs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'gigs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
          >
            Gigs (Freelancers)
          </button>
          <button 
            onClick={() => setView('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'jobs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
          >
            Jobs (Clients)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${view}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            {view === 'gigs' ? (
              <>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="suspended">Suspended</option>
              </>
            ) : (
              <>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Suspended">Suspended</option>
              </>
            )}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{view === 'gigs' ? 'Freelancer' : 'Client'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{view === 'gigs' ? 'Price' : 'Budget'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {view === 'gigs' && item.image && (
                        <img src={item.image} alt="" className="h-10 w-10 rounded-md object-cover mr-3" />
                      )}
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={item.title}>{item.title}</div>
                        <div className="text-xs text-gray-500">{view === 'gigs' ? item.category : item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {view === 'gigs' ? item.freelancerName : item.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {view === 'gigs' ? formatPrice(item.price) : item.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${(item.status === 'active' || item.status === 'Open') ? 'bg-green-100 text-green-800' : 
                        (item.status === 'suspended' || item.status === 'Suspended') ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {item.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditClick(item)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleToggleStatus(item)} className="text-orange-600 hover:text-orange-900 bg-orange-50 p-2 rounded-full" title="Suspend/Activate">
                        <Lock className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">No listings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit {view === 'gigs' ? 'Gig' : 'Job'} Listing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  rows={3}
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{view === 'gigs' ? 'Price' : 'Budget'}</label>
                  <input 
                    type="text" // using text to handle string budget in jobs
                    value={view === 'gigs' ? editForm.price : editForm.budget} 
                    onChange={e => setEditForm(view === 'gigs' ? {...editForm, price: parseFloat(e.target.value) || 0} : {...editForm, budget: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    value={editForm.status} 
                    onChange={e => setEditForm({...editForm, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {view === 'gigs' ? (
                      <>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="suspended">Suspended</option>
                      </>
                    ) : (
                      <>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Suspended">Suspended</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoriesTab = ({ categories, setCategories }: { categories: Category[], setCategories: any }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', icon: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      setCategories([...categories, { id: `cat-${Date.now()}`, ...formData }]);
    }
    setFormData({ name: '', icon: '' });
    setIsAdding(false);
  };

  const handleEdit = (cat: Category) => {
    setFormData({ name: cat.name, icon: cat.icon });
    setEditingId(cat.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="py-6 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-sm text-gray-500">Manage listing categories and icons.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setFormData({ name: '', icon: '' }); setEditingId(null); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Digital Marketing"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Icon (Lucide Name)</label>
              <input 
                type="text" 
                required
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Megaphone"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center group hover:border-indigo-300 transition-colors">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 text-gray-600">
                {/* Dynamically checking icon is tricky in static setup, just showing text fallback or generic icon */}
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                <p className="text-xs text-gray-500 font-mono">{cat.icon}</p>
              </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(cat)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 className="h-4 w-4"/></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersTab = () => {
  // Mock users for admin list
  const [users, setUsers] = useState<User[]>([
    {
      id: 'free-1',
      name: 'Jane Freelancer',
      email: 'jane@example.com',
      role: UserRole.FREELANCER,
      avatar: 'https://picsum.photos/seed/freelancer/50/50',
      availability: 'Available',
      kycStatus: 'approved',
      introVideo: 'https://example.com/video.mp4'
    },
    {
      id: 'client-1',
      name: 'John Client',
      email: 'john@example.com',
      role: UserRole.EMPLOYER,
      avatar: 'https://picsum.photos/seed/client/50/50',
      availability: 'Available',
      kycStatus: 'none'
    }
  ]);

  const toggleAvailability = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, availability: u.availability === 'Available' ? 'Unavailable' : 'Available' } : u));
  };

  const removeVideo = (id: string) => {
    if(confirm('Are you sure you want to remove the intro video for this user?')) {
      setUsers(users.map(u => u.id === id ? { ...u, introVideo: undefined } : u));
    }
  };

  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {user.kycStatus || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === UserRole.FREELANCER && (
                    <button 
                      onClick={() => toggleAvailability(user.id)}
                      className={`px-2 py-1 text-xs rounded-full ${user.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {user.availability || 'Available'}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    {user.introVideo && (
                      <button onClick={() => removeVideo(user.id)} className="text-red-600 hover:text-red-900" title="Remove Intro Video">
                        <Video className="h-4 w-4" />
                      </button>
                    )}
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GatewaysTab = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    { id: '1', name: 'Stripe', code: 'stripe', isActive: true, description: 'Global credit card processing', config: { publicKey: 'pk_test_...', secretKey: 'sk_test_...', isSandbox: true } },
    { id: '2', name: 'PayPal', code: 'paypal', isActive: true, description: 'Popular global wallet', config: { publicKey: 'client_id...', secretKey: 'secret...', isSandbox: true } },
    { id: '3', name: 'PayStack', code: 'paystack', isActive: false, description: 'African payment solutions', config: { publicKey: '', secretKey: '', isSandbox: true } },
    { id: '4', name: 'PayMongo', code: 'paymongo', isActive: false, description: 'Philippines payment processing', config: { publicKey: '', secretKey: '', isSandbox: true } },
    { id: '5', name: 'Payoneer', code: 'payoneer', isActive: false, description: 'Cross-border payments', config: { publicKey: '', secretKey: '', isSandbox: true } },
    { id: '6', name: 'Adyen', code: 'adyen', isActive: false, description: 'Enterprise payment platform', config: { publicKey: '', secretKey: '', isSandbox: true } },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleGateway = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
  };

  const updateConfig = (id: string, field: string, value: any) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, config: { ...g.config, [field]: value } } : g));
  };

  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Gateways</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {gateways.map(gateway => (
          <div key={gateway.id} className={`bg-white rounded-xl shadow-sm border ${gateway.isActive ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'} transition-all`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                   <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${gateway.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      <CreditCard className="h-6 w-6" />
                   </div>
                   <div className="ml-4">
                     <h3 className="text-lg font-bold text-gray-900">{gateway.name}</h3>
                     <p className="text-sm text-gray-500">{gateway.description}</p>
                   </div>
                </div>
                <div className="flex items-center">
                   <label className="relative inline-flex items-center cursor-pointer mr-3">
                      <input type="checkbox" checked={gateway.isActive} onChange={() => toggleGateway(gateway.id)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                {editingId === gateway.id ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Public Key / Client ID</label>
                      <input 
                        type="text" 
                        value={gateway.config.publicKey}
                        onChange={(e) => updateConfig(gateway.id, 'publicKey', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Secret Key / Client Secret</label>
                      <input 
                        type="password" 
                        value={gateway.config.secretKey}
                        onChange={(e) => updateConfig(gateway.id, 'secretKey', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                       <label className="flex items-center text-xs text-gray-700">
                         <input 
                           type="checkbox"
                           checked={gateway.config.isSandbox}
                           onChange={(e) => updateConfig(gateway.id, 'isSandbox', e.target.checked)}
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                         />
                         Enable Sandbox / Test Mode
                       </label>
                       <div className="flex space-x-2">
                         <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1">Cancel</button>
                         <button onClick={() => setEditingId(null)} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Save</button>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${gateway.config.isSandbox ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                      {gateway.config.isSandbox ? 'Test Mode' : 'Live Mode'}
                    </div>
                    <button onClick={() => setEditingId(gateway.id)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      <Settings className="h-4 w-4 mr-1" /> Configure
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentManagementTab = () => {
  const { content, updateContent } = useContent();
  const [expandedSection, setExpandedSection] = useState<string>('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const handleUpdate = (section: string, field: string, value: any) => {
    updateContent(section, { [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate('branding', 'logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage CMS</h1>
          <p className="text-sm text-gray-500">Manage real-time content for the landing page.</p>
        </div>
        <button 
          onClick={() => alert('Changes saved live!')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          <Save className="h-4 w-4 mr-2" /> Publish Live
        </button>
      </div>

      <div className="space-y-4">
        
        {/* Branding & Logo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('branding')}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Global Branding & Logo</h3>
            </div>
            {expandedSection === 'branding' ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>
          
          {expandedSection === 'branding' && (
            <div className="p-6 space-y-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform Name (Text Logo)</label>
                  <input 
                    type="text" 
                    value={content.branding.logoText}
                    onChange={(e) => handleUpdate('branding', 'logoText', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo Image URL</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                      type="text" 
                      value={content.branding.logoUrl || ''}
                      onChange={(e) => handleUpdate('branding', 'logoUrl', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 border"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
                  </div>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Preview</label>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center h-24">
                    {content.branding.logoUrl ? (
                      <img src={content.branding.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                    ) : (
                      <span className="text-gray-400 italic">No logo image set. Using text fallback.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('search')}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">AI Search Configuration</h3>
            </div>
            {expandedSection === 'search' ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>
          
          {expandedSection === 'search' && (
            <div className="p-6 space-y-6 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  id="aiSearch"
                  type="checkbox"
                  checked={content.search.aiEnabled}
                  onChange={(e) => handleUpdate('search', 'aiEnabled', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="aiSearch" className="ml-2 block text-sm text-gray-900">Enable AI-Powered Suggestions</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popular Right Now (Keywords)</label>
                <p className="text-xs text-gray-500 mb-2">Separate multiple keywords with commas.</p>
                <textarea 
                  rows={3}
                  value={content.search.popularKeywords.join(', ')}
                  onChange={(e) => handleUpdate('search', 'popularKeywords', e.target.value.split(',').map(s => s.trim()))}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('hero')}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <ImageIcon className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Hero Section (Above Fold)</h3>
            </div>
            {expandedSection === 'hero' ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>
          
          {expandedSection === 'hero' && (
            <div className="p-6 space-y-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Main Headline</label>
                  <input 
                    type="text" 
                    value={content.landing.hero.title}
                    onChange={(e) => handleUpdate('landing.hero', 'title', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                  <textarea 
                    rows={3}
                    value={content.landing.hero.subtitle}
                    onChange={(e) => handleUpdate('landing.hero', 'subtitle', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary CTA Text</label>
                  <input 
                    type="text" 
                    value={content.landing.hero.primaryCtaText}
                    onChange={(e) => handleUpdate('landing.hero', 'primaryCtaText', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secondary CTA Text</label>
                  <input 
                    type="text" 
                    value={content.landing.hero.secondaryCtaText}
                    onChange={(e) => handleUpdate('landing.hero', 'secondaryCtaText', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Hero Image URL (Unsplash)</label>
                  <input 
                    type="text" 
                    value={content.landing.hero.image}
                    onChange={(e) => handleUpdate('landing.hero', 'image', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <img src={content.landing.hero.image} alt="Preview" className="mt-2 h-32 w-auto rounded border border-gray-200" />
                </div>
                <div className="flex items-center">
                  <input
                    id="showTrust"
                    type="checkbox"
                    checked={content.landing.hero.showTrustBadges}
                    onChange={(e) => handleUpdate('landing.hero', 'showTrustBadges', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showTrust" className="ml-2 block text-sm text-gray-900">Show Trust Badges / Stats</label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('features')}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <ShieldAlert className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Why Choose Us (Features)</h3>
            </div>
            {expandedSection === 'features' ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>
          
          {expandedSection === 'features' && (
             <div className="p-6 space-y-6 border-t border-gray-200">
               <div className="flex items-center mb-4">
                  <input
                    id="featEnabled"
                    type="checkbox"
                    checked={content.landing.whyChoose.enabled}
                    onChange={(e) => handleUpdate('landing.whyChoose', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featEnabled" className="ml-2 block text-sm font-medium text-gray-900">Enable Section</label>
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700">Section Title</label>
                  <input 
                    type="text" 
                    value={content.landing.whyChoose.title}
                    onChange={(e) => handleUpdate('landing.whyChoose', 'title', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
               </div>

               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-gray-500 uppercase">Features List</h4>
                 {content.landing.whyChoose.features.map((feature, idx) => (
                   <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-medium text-gray-500">Title</label>
                            <input 
                              type="text" 
                              value={feature.title}
                              // Note: Full array update logic would go here in a production app
                              // Simulating for now
                              readOnly
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm bg-gray-100"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500">Description</label>
                            <input 
                              type="text" 
                              value={feature.description}
                              readOnly
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm bg-gray-100"
                            />
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('cta')}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Final CTA</h3>
            </div>
            {expandedSection === 'cta' ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>
          
          {expandedSection === 'cta' && (
            <div className="p-6 space-y-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={content.landing.cta.title}
                  onChange={(e) => handleUpdate('landing.cta', 'title', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input 
                  type="text" 
                  value={content.landing.cta.subtitle}
                  onChange={(e) => handleUpdate('landing.cta', 'subtitle', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const CommissionsTab = ({ commission, setCommission }: { commission: CommissionSettings, setCommission: any }) => {
  const [testAmount, setTestAmount] = useState(100);

  // Calculation logic for simulation
  const calculateFees = (amount: number) => {
    let buyerFee = 0;
    let sellerFee = 0;

    if (commission.buyer.type === 'percentage') {
      buyerFee = amount * (commission.buyer.value / 100);
    } else {
      buyerFee = commission.buyer.value;
    }

    if (commission.seller.type === 'percentage') {
      sellerFee = amount * (commission.seller.value / 100);
    } else {
      sellerFee = commission.seller.value;
    }

    return {
      buyerTotal: amount + buyerFee,
      sellerNet: amount - sellerFee,
      buyerFee,
      sellerFee,
      platformRevenue: buyerFee + sellerFee
    };
  };

  const result = calculateFees(testAmount);

  return (
    <div className="py-6 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
          <p className="text-sm text-gray-500">Set platform service fees for buyers and freelancers.</p>
        </div>
        <button 
          onClick={() => alert('Settings Saved Successfully!')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Buyer Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Employer Fees (Buyer)</h3>
              <p className="text-xs text-gray-500">Charged on top of the contract amount.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setCommission({...commission, buyer: {...commission.buyer, type: 'percentage'}})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${commission.buyer.type === 'percentage' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Percentage (%)
                </button>
                <button 
                   onClick={() => setCommission({...commission, buyer: {...commission.buyer, type: 'fixed'}})}
                   className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${commission.buyer.type === 'fixed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Fixed Amount ($)
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {commission.buyer.type === 'percentage' ? 'Percentage Value (%)' : 'Fixed Value (USD)'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input 
                  type="number"
                  value={commission.buyer.value}
                  onChange={(e) => setCommission({...commission, buyer: {...commission.buyer, value: parseFloat(e.target.value)}})}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {commission.buyer.type === 'percentage' ? '%' : '$'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="buyerActive"
                checked={commission.buyer.isActive}
                onChange={(e) => setCommission({...commission, buyer: {...commission.buyer, isActive: e.target.checked}})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="buyerActive" className="text-sm text-gray-700">Enable Employer Fee</label>
            </div>
          </div>
        </div>

        {/* Seller Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Freelancer Fees (Seller)</h3>
              <p className="text-xs text-gray-500">Deducted from the freelancer's earnings.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setCommission({...commission, seller: {...commission.seller, type: 'percentage'}})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${commission.seller.type === 'percentage' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Percentage (%)
                </button>
                <button 
                   onClick={() => setCommission({...commission, seller: {...commission.seller, type: 'fixed'}})}
                   className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${commission.seller.type === 'fixed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Fixed Amount ($)
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {commission.seller.type === 'percentage' ? 'Percentage Value (%)' : 'Fixed Value (USD)'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input 
                  type="number"
                  value={commission.seller.value}
                  onChange={(e) => setCommission({...commission, seller: {...commission.seller, value: parseFloat(e.target.value)}})}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {commission.seller.type === 'percentage' ? '%' : '$'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="sellerActive"
                checked={commission.seller.isActive}
                onChange={(e) => setCommission({...commission, seller: {...commission.seller, isActive: e.target.checked}})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="sellerActive" className="text-sm text-gray-700">Enable Freelancer Fee</label>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator / Calculator */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-indigo-400 mr-2" />
          <h3 className="text-xl font-bold">Fee Simulator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Test Contract Amount ($)</label>
            <input 
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
              className="block w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
               <span className="block text-xs text-gray-400 uppercase tracking-wide">Employer Pays</span>
               <span className="block text-2xl font-bold mt-1 text-blue-400">${result.buyerTotal.toFixed(2)}</span>
               <span className="block text-xs text-gray-500 mt-1">
                 Contract + ${result.buyerFee.toFixed(2)} Fee
               </span>
             </div>
             
             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
               <span className="block text-xs text-gray-400 uppercase tracking-wide">Freelancer Gets</span>
               <span className="block text-2xl font-bold mt-1 text-green-400">${result.sellerNet.toFixed(2)}</span>
               <span className="block text-xs text-gray-500 mt-1">
                 Contract - ${result.sellerFee.toFixed(2)} Fee
               </span>
             </div>

             <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
               <span className="block text-xs text-indigo-300 uppercase tracking-wide">Platform Revenue</span>
               <span className="block text-2xl font-bold mt-1 text-white">${result.platformRevenue.toFixed(2)}</span>
               <span className="block text-xs text-indigo-300/70 mt-1">
                 Total collected fees
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialsTab = () => {
  const { formatPrice } = useCurrency();
  return (
  <div className="py-6 px-4 sm:px-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Financials & Escrow</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
        Export Report
      </button>
    </div>
    <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {MOCK_TRANSACTIONS.map((txn: Transaction) => (
            <tr key={txn.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.user}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatPrice(txn.amount)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={txn.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                 {txn.status === 'Pending' && txn.type === 'Withdrawal' && (
                    <div className="flex space-x-2 justify-end">
                       <button className="text-green-600 hover:text-green-900">Approve</button>
                       <button className="text-red-600 hover:text-red-900">Reject</button>
                    </div>
                 )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

const CurrenciesTab = () => {
  const { currencies, addCurrency, updateCurrency, deleteCurrency, toggleCurrencyActive } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', symbol: '', rate: 1 });

  const handleAdd = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.symbol) {
      addCurrency({ ...newCurrency, code: newCurrency.code.toUpperCase(), isActive: true });
      setNewCurrency({ code: '', name: '', symbol: '', rate: 1 });
      setIsAdding(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Currency Management</h1>
          <p className="text-sm text-gray-500">Manage supported currencies and exchange rates (Base: USD).</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Currency
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700">Code (e.g. JPY)</label>
              <input 
                type="text" 
                value={newCurrency.code} 
                onChange={e => setNewCurrency({...newCurrency, code: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                value={newCurrency.name} 
                onChange={e => setNewCurrency({...newCurrency, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Symbol</label>
              <input 
                type="text" 
                value={newCurrency.symbol} 
                onChange={e => setNewCurrency({...newCurrency, symbol: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Rate (1 USD = ?)</label>
              <input 
                type="number" 
                value={newCurrency.rate} 
                step="0.01"
                onChange={e => setNewCurrency({...newCurrency, rate: parseFloat(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button 
              onClick={handleAdd}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (vs USD)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currencies.map((currency) => (
              <tr key={currency.code}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{currency.code} ({currency.symbol})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currency.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   <div className="flex items-center">
                     <input 
                       type="number" 
                       step="0.01"
                       defaultValue={currency.rate}
                       onBlur={(e) => updateCurrency(currency.code, { rate: parseFloat(e.target.value) })}
                       className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border px-2 py-1"
                       disabled={currency.code === 'USD'}
                     />
                     {currency.code !== 'USD' && <span className="ml-2 text-xs text-gray-400">Auto-updates prices</span>}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <button 
                     onClick={() => toggleCurrencyActive(currency.code)}
                     disabled={currency.code === 'USD'}
                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currency.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} ${currency.code !== 'USD' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                   >
                     {currency.isActive ? 'Active' : 'Inactive'}
                   </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {currency.code !== 'USD' && (
                    <button 
                      onClick={() => { if(window.confirm('Delete this currency?')) deleteCurrency(currency.code); }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DisputesTab = () => {
  const { formatPrice } = useCurrency();
  return (
  <div className="py-6 px-4 sm:px-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Dispute Resolution Center</h1>
    <div className="space-y-4">
      {MOCK_DISPUTES.map((dispute: Dispute) => (
        <div key={dispute.id} className="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3">
                 <h3 className="text-lg font-medium text-gray-900">{dispute.ticketId}</h3>
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    dispute.status === 'Open' ? 'bg-red-100 text-red-800' : 
                    dispute.status === 'Escalated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                 }`}>
                   {dispute.status}
                 </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Claimant: <span className="font-semibold">{dispute.claimant}</span> vs Respondent: <span className="font-semibold">{dispute.respondent}</span>
              </p>
              <p className="mt-2 text-sm text-gray-800"><span className="font-medium">Reason:</span> {dispute.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatPrice(dispute.amount)}</p>
              <p className="text-xs text-gray-500">{dispute.date}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              View Evidence
            </button>
             <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">
              Resolve Dispute
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

const OverviewTab = () => {
  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Users" value="12,345" icon={Users} color="bg-blue-100 text-blue-600" />
        <StatsCard title="Total Revenue" value="$45,200" icon={DollarSign} color="bg-green-100 text-green-600" />
        <StatsCard title="Active Disputes" value={MOCK_DISPUTES.filter(d => d.status === 'Open').length} icon={ShieldAlert} color="bg-red-100 text-red-600" />
        <StatsCard title="Pending KYC" value={MOCK_KYC_DOCS.filter(d => d.status === 'Pending').length} icon={FileText} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Activity</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <BarChart2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Activity Chart Visualization Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunicationManagementTab = () => {
  const [smtp, setSmtp] = useState<SMTPConfig>({
    host: 'smtp.example.com',
    port: 587,
    user: 'admin@atmyworks.com',
    pass: '********',
    fromEmail: 'noreply@atmyworks.com',
    fromName: 'AtMyWorks Support',
    encryption: 'tls'
  });

  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Communication Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" /> SMTP Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Host</label>
            <input type="text" value={smtp.host} onChange={e => setSmtp({...smtp, host: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Port</label>
            <input type="number" value={smtp.port} onChange={e => setSmtp({...smtp, port: parseInt(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Encryption</label>
            <select value={smtp.encryption} onChange={e => setSmtp({...smtp, encryption: e.target.value as any})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" value={smtp.user} onChange={e => setSmtp({...smtp, user: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={smtp.pass} onChange={e => setSmtp({...smtp, pass: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm">Save Configuration</button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div className="py-6 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h1>
      <div className="bg-white rounded-lg shadow border border-gray-200 max-w-3xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h3 className="text-base font-bold text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Temporarily disable the platform for all users.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h3 className="text-base font-bold text-gray-900">Allow New Registrations</h3>
                <p className="text-sm text-gray-500">Enable or disable new user sign-ups.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
        <div className="p-6">
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white overflow-hidden shadow rounded-lg p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-lg font-medium text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
