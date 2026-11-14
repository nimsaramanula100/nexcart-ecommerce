import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Authentication state is shared with route guards, forms, and API requests through this provider.
// මෙම provider හරහා route ආරක්ෂක, පෝරම සහ API ඉල්ලීම් අතර login තත්ත්වය බෙදාගනී.
const AuthContext = createContext();

// Restore the cached user once, then expose async account actions to descendants.
// සුරැකි පරිශීලකයා ආරම්භයේදී ලබාගෙන async ගිණුම් ක්‍රියා පහළ components වෙත සපයයි.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexcart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // Login/register/profile calls update both React context and the persisted session.
  // login/register/profile ඉල්ලීම් React context සහ සුරැකි සැසිය දෙකම යාවත්කාලීන කරයි.
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('nexcart_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed. Check credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('nexcart_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexcart_user');
    localStorage.removeItem('nexcart_cart');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', profileData);
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('nexcart_user', JSON.stringify(updated));
      setLoading(false);
      return { success: true, user: updated };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Failed to update profile.';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
