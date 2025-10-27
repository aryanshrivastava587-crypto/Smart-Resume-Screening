import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from a previous session
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (storedUsers[email] && storedUsers[email].password === pass) {
      const loggedInUser = { email, name: storedUsers[email].name };
      setUser(loggedInUser);
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (storedUsers[email]) {
      // User already exists
      return false;
    }
    storedUsers[email] = { name, password: pass };
    localStorage.setItem('users', JSON.stringify(storedUsers));
    // Automatically log in after signup
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
