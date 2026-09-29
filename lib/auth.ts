/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '@/types';

interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const getUser = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    
    return decoded;
  } catch (error) {
    removeToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getUser();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN';
};

export const isGuide = (): boolean => {
  const user = getUser();
  return user?.role === 'GUIDE';
};

export const isTourist = (): boolean => {
  const user = getUser();
  return user?.role === 'TOURIST';
};

export const hasRole = (roles: UserRole[]): boolean => {
  const user = getUser();
  return user ? roles.includes(user.role) : false;
};