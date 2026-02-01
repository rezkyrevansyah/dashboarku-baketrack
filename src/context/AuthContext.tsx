'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFullData, Profile } from '@/services/api';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check for existing session and configuration
  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check Configuration
      const configUrl = localStorage.getItem('baketrack_api_url');
      // If no config and not on setup page, redirect
      if (!configUrl && window.location.pathname !== '/setup') {
         router.push('/setup');
         setLoading(false);
         return;
      }

      // 2. Check Auth
      const storedAuth = localStorage.getItem('baketrack_auth');
      if (storedAuth === 'true') {
        try {
          // If "logged in", we try to fetch data to confirm and get profile
          // Optimistically set logged in to avoid flicker, but real verification is fetching data
          setIsLoggedIn(true);
          const data = await fetchFullData();
          if (data && data.profile) {
            setUser(data.profile);
          } else {
            // If fetch fails heavily, maybe logout? For now keep it simple.
          }
        } catch (e) {
            console.error(e);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (inputEmail: string, inputPass: string): Promise<boolean> => {
    // Do NOT set global loading to true here. 
    // This prevents ClientLayout from unmounting the LoginPage while checking credentials.
    try {
      const data = await fetchFullData();
      if (!data) {
        return false;
      }

      // Support generic single profile OR multi-profile array
      const profilesToCheck = data.profiles || (data.profile ? [data.profile] : []);

      if (profilesToCheck.length === 0) {
          console.warn("No profiles found in spreadsheet.");
      }

      // Find matching user
      const foundUser = profilesToCheck.find(p => {
          const emailMatch = (p.email || '').toLowerCase() === inputEmail.toLowerCase() || inputEmail.toLowerCase() === 'admin';
          // Direct string comparison for password as requested
          // Ensure both are strings to handle numeric passwords from spreadsheet
          const passMatch = String(p.password || '') === String(inputPass); 
          return emailMatch && passMatch;
      });
      
      if (foundUser) {
         setUser(foundUser);
         setIsLoggedIn(true);
         localStorage.setItem('baketrack_auth', 'true');
         // We might want to store the email to know WHICH user to load next time, 
         // but for now simple bool is enough as we fetch all profiles anyway.
         return true;
      }

      return false;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('baketrack_auth');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
