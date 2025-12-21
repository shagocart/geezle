
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './main/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import BrowseTalent from './main/BrowseTalent';
import BrowseJobs from './main/BrowseJobs';
import AdminDashboard from './dashboard/AdminDashboard';
import FreelancerDashboard from './dashboard/FreelancerDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import CreateJob from './create-job-post/CreateJob';
import CreateGig from './create-gig/CreateGig';
import KYCVerification from './kyc/KYCVerification';
import Messages from './messages/Messages';
import FreelancerProfile from './profile/FreelancerProfile';
import EditProfile from './profile/EditProfile';
import DeveloperDocs from './dashboard/DeveloperDocs';
import SupportWidget from './components/SupportWidget';
import GigDetail from './main/GigDetail';
import JobDetail from './main/JobDetail';
import { UserRole } from './types';
import { CurrencyProvider } from './context/CurrencyContext';
import { ContentProvider } from './context/ContentContext';
import { NotificationProvider } from './context/NotificationContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { MessageProvider } from './context/MessageContext';
import { UserProvider, useUser } from './context/UserContext';

// Inner App component to use hooks
const AppContent = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  // Hide Navbar/Footer on Admin Dashboard for full screen feel
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dev-docs');
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          {/* Browse Pages */}
          <Route path="/browse" element={<BrowseTalent />} />
          <Route path="/browse-jobs" element={<BrowseJobs />} />
          
          {/* Detail Pages */}
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Profiles */}
          <Route path="/profile/:id" element={<FreelancerProfile />} />
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />

          {/* Protected Common Routes */}
          <Route path="/kyc" element={
              <ProtectedRoute>
                <KYCVerification />
              </ProtectedRoute>
          } />

          <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Freelancer Routes */}
          <Route 
            path="/freelancer/dashboard" 
            element={
                <ProtectedRoute allowedRoles={[UserRole.FREELANCER]}>
                  <FreelancerDashboard />
                </ProtectedRoute>
            } 
          />
            <Route 
            path="/create-gig" 
            element={
                <ProtectedRoute allowedRoles={[UserRole.FREELANCER]}>
                  <CreateGig />
                </ProtectedRoute>
            } 
          />

          {/* Client Routes */}
            <Route 
            path="/client/dashboard" 
            element={
                <ProtectedRoute allowedRoles={[UserRole.EMPLOYER]}>
                  <ClientDashboard />
                </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-job" 
            element={
                <ProtectedRoute allowedRoles={[UserRole.EMPLOYER]}>
                  <CreateJob />
                </ProtectedRoute>
            } 
          />

          {/* Developer Documentation */}
          <Route path="/dev-docs" element={<DeveloperDocs />} />
          
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <SupportWidget />
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated } = useUser();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <UserProvider>
      <ContentProvider>
        <NotificationProvider>
          <CurrencyProvider>
            <FavoritesProvider>
              <MessageProvider>
                <AppContent />
              </MessageProvider>
            </FavoritesProvider>
          </CurrencyProvider>
        </NotificationProvider>
      </ContentProvider>
    </UserProvider>
  );
}

export default App;
