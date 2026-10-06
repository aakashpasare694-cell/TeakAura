import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { adminCheckAuth, adminLogin as apiLogin, adminLogout as apiLogout } from '../utils/api';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      try {
        const res = await adminCheckAuth();
        if (res && res.authenticated) {
          setAdmin(res.admin);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await apiLogin(email, pass);
    setAdmin(res.admin);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
