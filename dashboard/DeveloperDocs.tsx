
import React, { useState } from 'react';
import { Database, Server, Layout, FileCode, GitBranch, Shield, Lock, Activity, Layers } from 'lucide-react';

type Tab = 'wireframes' | 'schema' | 'api' | 'components';

const DeveloperDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('wireframes');

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2 w-full ${
        activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block fixed h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">AtMyWorks</h2>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-8">Technical Specifications</p>
        <nav>
          <NavItem tab="wireframes" label="UX Flows & Wireframes" icon={Layout} />
          <NavItem tab="schema" label="PostgreSQL Schema" icon={Database} />
          <NavItem tab="api" label="API Endpoints" icon={Server} />
          <NavItem tab="components" label="Component Specs" icon={Layers} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {activeTab === 'wireframes' && <WireframesView />}
        {activeTab === 'schema' && <SchemaView />}
        {activeTab === 'api' && <ApiView />}
        {activeTab === 'components' && <ComponentsView />}
      </div>
    </div>
  );
};

// --- Views ---

const WireframesView = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">UX Flows & Wireframes</h1>
      <p className="text-gray-600 mb-8">High-level architectural flows demonstrating the interaction between Freelancers, Clients, and the Admin Authority system.</p>
    </div>

    {/* Order & Escrow Flow */}
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <Lock className="h-5 w-5 mr-2 text-indigo-600" />
        Secure Escrow & Order Flow
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm relative">
        {/* Step 1 */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full md:w-48 text-center z-10">
          <p className="font-bold text-blue-800">Client</p>
          <p className="mt-2 text-blue-600">Places Order & Funds Escrow</p>
        </div>
        <Arrow />
        {/* Step 2 */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg w-full md:w-48 text-center z-10">
          <p className="font-bold text-yellow-800">System (Escrow)</p>
          <p className="mt-2 text-yellow-600">Funds Locked</p>
        </div>
        <Arrow />
        {/* Step 3 */}
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg w-full md:w-48 text-center z-10">
          <p className="font-bold text-purple-800">Freelancer</p>
          <p className="mt-2 text-purple-600">Submits Work</p>
        </div>
        <Arrow />
        {/* Step 4 */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg w-full md:w-48 text-center relative z-10">
          <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">Admin Control</div>
          <p className="font-bold text-red-800">Client/Admin</p>
          <p className="mt-2 text-red-600">Approves Release</p>
        </div>
      </div>
    </div>

    {/* Admin Control Hierarchy */}
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-indigo-600" />
        Admin Authority Hierarchy
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-100 p-2 rounded mb-3 font-bold text-center">Data Level</div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Edit any user profile field</li>
            <li>Delete/Hide gigs instantly</li>
            <li>View private messages (Audit)</li>
            <li>Modify DB credentials</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-100 p-2 rounded mb-3 font-bold text-center">Financial Level</div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Force release escrow</li>
            <li>Force refund to client</li>
            <li>Approve withdrawals</li>
            <li>Set commission rates</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-100 p-2 rounded mb-3 font-bold text-center">Content Level</div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Manage Homepage CMS</li>
            <li>Update Terms & Privacy</li>
            <li>Blog Management</li>
            <li>Email Templates</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Profile Enhancement Wireframe */}
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Enhancement Layout (Wireframe)</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="h-24 bg-gray-100 rounded-lg flex items-center px-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300"></div>
          <div className="flex-1 space-y-2">
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
            <div className="w-32 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-indigo-100 rounded"></div>
        </div>
        
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-1/3 space-y-4">
            <div className="h-32 bg-gray-50 rounded-lg border border-gray-200 p-4">
              <span className="text-xs font-bold text-gray-400">INTRO VIDEO</span>
              <div className="mt-2 h-16 bg-gray-200 rounded flex items-center justify-center">Play</div>
            </div>
            <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-4">
              <span className="text-xs font-bold text-gray-400">AVAILABILITY</span>
              <div className="mt-2 w-full h-8 bg-green-100 rounded"></div>
            </div>
          </div>
          {/* Main */}
          <div className="flex-1 space-y-4">
             <div className="h-32 bg-gray-50 rounded-lg border border-gray-200 p-4">
               <span className="text-xs font-bold text-gray-400">WORK EXPERIENCE (Timeline)</span>
             </div>
             <div className="h-32 bg-gray-50 rounded-lg border border-gray-200 p-4">
               <span className="text-xs font-bold text-gray-400">CERTIFICATIONS (Verified Badge)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SchemaView = () => {
  const sql = `
-- USERS & AUTHENTICATION
CREATE TYPE user_role AS ENUM ('admin', 'employer', 'freelancer');
CREATE TYPE kyc_status AS ENUM ('none', 'pending', 'approved', 'rejected');
CREATE TYPE availability_status AS ENUM ('available', 'unavailable');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_suspended BOOLEAN DEFAULT FALSE,
  
  -- Profile Enhancements
  title VARCHAR(150),
  bio TEXT,
  location VARCHAR(100),
  availability availability_status DEFAULT 'available',
  intro_video_url TEXT,
  
  -- Financials
  wallet_balance DECIMAL(12,2) DEFAULT 0.00,
  escrow_balance DECIMAL(12,2) DEFAULT 0.00,
  
  -- Verification
  kyc_status kyc_status DEFAULT 'none',
  kyc_documents JSONB -- Stores URLs to ID images safely
);

-- PROFILE DETAILS (1:Many)
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(100),
  title VARCHAR(100),
  start_date DATE,
  end_date DATE,
  description TEXT,
  is_verified_by_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150),
  issuer VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  credential_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);

-- GIGS & JOBS
CREATE TABLE gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  images JSONB, -- Array of image URLs
  status VARCHAR(20) DEFAULT 'active', -- active, paused, admin_blocked
  created_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS & ESCROW
CREATE TYPE order_status AS ENUM ('active', 'delivered', 'completed', 'cancelled', 'disputed');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id),
  client_id UUID REFERENCES users(id),
  freelancer_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  escrow_status VARCHAR(20) DEFAULT 'funded', -- funded, released, refunded
  status order_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  
  -- Admin Oversight
  admin_notes TEXT,
  dispute_id UUID
);

-- TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50), -- deposit, withdrawal, escrow_release, service_fee
  status VARCHAR(20), -- pending, completed, failed
  reference_id UUID, -- links to order_id or external_payment_id
  created_at TIMESTAMP DEFAULT NOW()
);

-- MESSAGING
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  attachments JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ADMIN AUDIT LOGS
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100),
  target_table VARCHAR(50),
  target_id UUID,
  changes JSONB, -- Previous vs New values
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
  `;

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">PostgreSQL Schema Design</h1>
      <p className="text-gray-600 mb-6">Normalized schema optimized for data integrity, financial security (Escrow), and admin audit trails.</p>
      <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-700">
          schema.sql
        </div>
        <pre className="p-6 pt-10 overflow-x-auto text-sm font-mono text-blue-100">
          {sql}
        </pre>
      </div>
    </div>
  );
};

const ApiView = () => {
  const endpoints = [
    { method: 'POST', url: '/api/v1/auth/login', desc: 'Authenticate user and return JWT + Role.' },
    { method: 'GET', url: '/api/v1/users/profile', desc: 'Get current user profile.' },
    { method: 'PUT', url: '/api/v1/users/profile', desc: 'Update profile (Bio, Video, Availability).' },
    { method: 'POST', url: '/api/v1/users/kyc', desc: 'Upload KYC documents for admin review.' },
    { method: 'GET', url: '/api/v1/gigs', desc: 'Search and filter gigs.' },
    { method: 'POST', url: '/api/v1/orders', desc: 'Create order and initialize Escrow.' },
    { method: 'POST', url: '/api/v1/orders/{id}/deliver', desc: 'Freelancer submits work.' },
    { method: 'POST', url: '/api/v1/orders/{id}/approve', desc: 'Client releases Escrow.' },
    { method: 'POST', url: '/api/v1/admin/users/{id}/suspend', desc: 'Admin: Ban/Suspend user.', tag: 'Admin' },
    { method: 'POST', url: '/api/v1/admin/escrow/{id}/force-release', desc: 'Admin: Override escrow lock.', tag: 'Admin' },
    { method: 'GET', url: '/api/v1/admin/analytics', desc: 'Admin: Platform stats.', tag: 'Admin' },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">API Endpoint Specifications</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {endpoints.map((ep, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                    ep.method === 'POST' ? 'bg-green-100 text-green-800' : 
                    ep.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ep.method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{ep.url}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ep.desc}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ep.tag === 'Admin' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Shield className="h-3 w-3 mr-1" /> Admin Only
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Authenticated</span>
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

const ComponentsView = () => {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frontend Component Specifications</h1>
        <p className="text-gray-600">Reusable UI definitions ensuring consistency and scalability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GigCard */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">GigCard</h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Display</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Props:</span> title, price, rating, reviews, image, author</p>
            <p><span className="font-semibold">Features:</span> Hover effects, Like button (heart), Badge for "Pro"</p>
            <p><span className="font-semibold">States:</span> Loading (Skeleton), Active, Paused (Admin view)</p>
          </div>
        </div>

        {/* FileUpload */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">FileUpload</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Form Input</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Props:</span> acceptTypes (img/pdf/video), maxSize, multiple</p>
            <p><span className="font-semibold">Features:</span> Drag & Drop, Progress Bar, Preview Thumbnail</p>
            <p><span className="font-semibold">Security:</span> Client-side type check, Virus scan hook</p>
          </div>
        </div>

        {/* EscrowStatus */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">EscrowStatus</h3>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Financial</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Props:</span> amount, stage (funded/released), releaseDate</p>
            <p><span className="font-semibold">Features:</span> Visual timeline, Admin override button (if admin)</p>
          </div>
        </div>

        {/* AdminActionPanel */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">AdminActionPanel</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Admin</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Props:</span> targetId, type (user/gig/order)</p>
            <p><span className="font-semibold">Actions:</span> Suspend, Delete, Refund, View Logs</p>
            <p><span className="font-semibold">Requirement:</span> Must confirm with modal before execution.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const Arrow = () => (
  <div className="hidden md:flex text-gray-300">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </div>
);

export default DeveloperDocs;
