'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface AuthContextType {
  role: string | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // Manually decode the JWT token and check if it's expired
  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;

      const decoded = JSON.parse(atob(tokenParts[1]));
      const expirationTime = decoded.exp * 1000; 
      return Date.now() > expirationTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const savedRole = Cookies.get('role');

    if (accessToken && savedRole) {
      if (isTokenExpired(accessToken)) {
        logout();
      } else {
        setRole(savedRole);
        setAccessToken(accessToken);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, role } = data;

    if (rememberMe) {
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      Cookies.set('role', role, { expires: 7 });
    } else {
      Cookies.set('accessToken', accessToken);
      Cookies.set('role', role);
    }

    setRole(role);
    setAccessToken(accessToken);
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('role');
    setRole(null);
    setAccessToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ role, loading, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
