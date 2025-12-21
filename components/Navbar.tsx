
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User as UserIcon, Globe, MessageSquare, Info, CheckCircle, AlertCircle, Search, Sparkles, TrendingUp } from 'lucide-react';
import { UserRole } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useNotifications } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { useContent } from '../context/ContentContext';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const { currencies, currentCurrency, setCurrency } = useCurrency();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();

  // Search State
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const isRole = (role: UserRole) => user?.role === role;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left Side: Logo & Search */}
          <div className="flex flex-1 items-center gap-6 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {content.branding.logoUrl ? (
                <img 
                  src={content.branding.logoUrl} 
                  alt={content.branding.logoText} 
                  className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-105" 
                />
              ) : (
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  {content.branding.logoText}
                </span>
              )}
            </Link>

            {/* AI Search Bar (Hidden on small mobile) */}
            <div className="flex-1 max-w-lg hidden sm:block relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                
                {/* AI Search Suggestions Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    {/* Header */}
                    {content.search.aiEnabled && !searchQuery && (
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center">
                          <Sparkles className="h-3 w-3 mr-1.5" /> Popular Right Now
                        </span>
                        <span className="text-[10px] text-gray-400">AI Trends</span>
                      </div>
                    )}

                    {/* Suggestions List */}
                    <div className="py-2">
                      {!searchQuery ? (
                        // Default Trending View
                        content.search.popularKeywords.map((keyword, idx) => (
                          <Link 
                            key={idx} 
                            to={`/browse?q=${keyword}`} 
                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm group transition-colors"
                            onClick={() => setIsSearchFocused(false)}
                          >
                            <TrendingUp className="h-4 w-4 text-gray-400 mr-3 group-hover:text-indigo-500" />
                            <span className="font-medium">{keyword}</span>
                          </Link>
                        ))
                      ) : (
                        // Filtered/Autocomplete View (Simulated)
                        content.search.popularKeywords
                          .filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((keyword, idx) => (
                            <Link 
                              key={idx} 
                              to={`/browse?q=${keyword}`} 
                              className="flex items-center px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm group transition-colors"
                              onClick={() => setIsSearchFocused(false)}
                            >
                              <Search className="h-4 w-4 text-gray-400 mr-3 group-hover:text-indigo-500" />
                              <span className="font-medium">{keyword}</span>
                            </Link>
                          ))
                      )}
                      
                      {searchQuery && content.search.popularKeywords.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                         <div className="px-4 py-3 text-sm text-gray-500">
                           Press Enter to search for "{searchQuery}"
                         </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Navigation & User */}
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-6">
              {!isRole(UserRole.ADMIN) && (
                <>
                  <NavLink to="/browse">Find Talent</NavLink>
                  <NavLink to="/browse-jobs">Find Work</NavLink>
                </>
              )}
              {isRole(UserRole.ADMIN) && <NavLink to="/admin">Admin Console</NavLink>}
              {isRole(UserRole.EMPLOYER) && <NavLink to="/client/dashboard">Dashboard</NavLink>}
              {isRole(UserRole.FREELANCER) && <NavLink to="/freelancer/dashboard">Dashboard</NavLink>}
              
              {/* Currency */}
              <div className="relative flex items-center">
                <Globe className="h-4 w-4 text-gray-500 absolute left-2 pointer-events-none" />
                <select
                  value={currentCurrency.code}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="pl-8 pr-8 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer hover:bg-gray-50 appearance-none"
                >
                  {currencies.filter(c => c.isActive).map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auth Buttons / User Profile */}
            <div className="flex items-center space-x-4 ml-4">
              {user ? (
                <>
                  <Link to="/messages" className="p-2 rounded-full text-gray-400 hover:text-indigo-600 transition-colors relative hidden sm:block">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-600 transition-colors relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                      )}
                    </button>

                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                            Mark all read
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div 
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-indigo-50/50' : ''}`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">
                                    {notif.type === 'message' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                                    {notif.type === 'alert' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                    {notif.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                    {notif.type === 'info' && <Info className="h-4 w-4 text-gray-500" />}
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{notif.timestamp}</p>
                                  </div>
                                  {!notif.isRead && <span className="h-2 w-2 bg-indigo-600 rounded-full mt-2"></span>}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 pl-4 md:border-l border-gray-200">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gray-900 max-w-[100px] truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="relative group">
                      <Link to={user.role === UserRole.FREELANCER ? `/profile/${user.id}` : '/profile/edit'} className="block h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-indigo-300 transition-all">
                        {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" alt="avatar"/> : <UserIcon className="h-5 w-5" />}
                      </Link>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                        <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <Link to="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/auth/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 text-sm">
                    Log In
                  </Link>
                  <Link to="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar (visible only on small screens below Logo row) */}
        <div className="pb-4 sm:hidden">
           <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
           </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/browse" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Find Talent</Link>
             <Link to="/browse-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Find Work</Link>
             {user && <Link to="/messages" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Messages</Link>}
             {user ? (
               <>
                 <Link to="/profile/edit" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Profile Settings</Link>
                 <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                   Logout
                 </button>
               </>
             ) : (
               <>
                <Link to="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">Log In</Link>
                <Link to="/auth/signup" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">Sign Up</Link>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
