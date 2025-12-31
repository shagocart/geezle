
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { GcoinService } from '../services/gcoin'; // Import GcoinService

interface AdminCreds {
  email: string;
  password: string;
  username: string;
  avatar?: string; // ADDED: Persist admin avatar
}

const DEFAULT_ADMIN_CREDS: AdminCreds = {
  email: 'admin@geezle.com',
  password: 'admin12345',
  username: 'admin'
};

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  switchRole: () => void; 
  updateAdminProfile: (creds: Partial<AdminCreds>) => void;
  getAdminProfile: () => AdminCreds;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getAdminCreds = (): AdminCreds => {
      const stored = localStorage.getItem('geezle_admin_creds');
      return stored ? JSON.parse(stored) : DEFAULT_ADMIN_CREDS;
  };

  useEffect(() => {
      if (!localStorage.getItem('geezle_admin_creds')) {
          localStorage.setItem('geezle_admin_creds', JSON.stringify(DEFAULT_ADMIN_CREDS));
      }
  }, []);

  // Helper to ensure wallet exists upon user session start
  const initWallet = async (userId: string) => {
      try {
          const wallet = await GcoinService.getWallet(userId);
          // Sync balance to user object if needed for UI speed
          updateUser({ gcoinBalance: wallet.balance });
      } catch (e) {
          console.error("Failed to init wallet", e);
      }
  };

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === UserRole.ADMIN) {
        const creds = getAdminCreds();
        if (email.toLowerCase() === creds.email.toLowerCase() && password === creds.password) {
             const adminUser: User = {
                id: 'admin-1',
                name: creds.username,
                email: creds.email,
                role: UserRole.ADMIN,
                // Use stored avatar or generate default
                avatar: creds.avatar || `https://ui-avatars.com/api/?name=${creds.username}&background=000&color=fff`,
                kycStatus: 'approved',
                gcoinBalance: 0
            };
            setUser(adminUser);
            localStorage.setItem('geezle_user', JSON.stringify(adminUser));
            initWallet(adminUser.id);
            return true;
        }
        return false;
    }

    const storedUser = localStorage.getItem('geezle_user');
    let userToSet: User;

    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email === email && parsed.role !== UserRole.ADMIN) {
            userToSet = parsed;
        } else {
            userToSet = createMockUser(email, role);
        }
    } else {
        userToSet = createMockUser(email, role);
    }

    userToSet.role = role; 
    setUser(userToSet);
    localStorage.setItem('geezle_user', JSON.stringify(userToSet));
    initWallet(userToSet.id);
    return true;
  };

  const createMockUser = (email: string, role: UserRole): User => ({
      id: 'u1',
      name: email.split('@')[0] || 'User',
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0D8ABC&color=fff`,
      kycStatus: 'approved',
      gcoinBalance: 0,
      followersCount: 12,
      followingCount: 45
  });

  const signup = (email: string, name: string, role: UserRole) => {
      const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
          kycStatus: 'none', 
          joinDate: new Date().toISOString(),
          gcoinBalance: 0
      };

      setUser(newUser);
      localStorage.setItem('geezle_user', JSON.stringify(newUser));
      initWallet(newUser.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('geezle_user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        localStorage.setItem('geezle_user', JSON.stringify(updated));
        return updated;
    });
  };

  const switchRole = () => {
      if (!user || user.role === UserRole.ADMIN) return;
      const newRole = user.role === UserRole.FREELANCER ? UserRole.EMPLOYER : UserRole.FREELANCER;
      updateUser({ role: newRole });
  };

  const updateAdminProfile = (updates: Partial<AdminCreds>) => {
      const current = getAdminCreds();
      const newCreds = { ...current, ...updates };
      localStorage.setItem('geezle_admin_creds', JSON.stringify(newCreds));
      
      // Real-time update for current session
      if (user?.role === UserRole.ADMIN) {
          const userUpdates: Partial<User> = {};
          if (updates.username) userUpdates.name = updates.username;
          if (updates.email) userUpdates.email = updates.email;
          if (updates.avatar) userUpdates.avatar = updates.avatar;
          
          if (Object.keys(userUpdates).length > 0) {
              updateUser(userUpdates);
          }
      }
  };

  useEffect(() => {
    const stored = localStorage.getItem('geezle_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        initWallet(u.id);
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        signup, 
        logout, 
        updateUser,
        switchRole,
        updateAdminProfile,
        getAdminProfile: getAdminCreds
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
