import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/lib/api';
import { socket } from '@/lib/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.token) {
            // Set initial user from storage
            setUser(parsedUser);
            
            // Immediately fetch latest profile to get fresh permissions
            try {
              const response = await api.get('/auth/profile');
              const freshUser = { ...parsedUser, ...response.data };
              setUser(freshUser);
              
              const isPersistent = !!localStorage.getItem('user');
              const storage = isPersistent ? localStorage : sessionStorage;
              storage.setItem('user', JSON.stringify(freshUser));
            } catch (err) {
              console.error('Failed to refresh profile:', err);
              // If token is invalid, logout
              if (err.response?.status === 401) {
                logout();
              }
            }
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleUsersUpdated = async () => {
      try {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          const response = await api.get('/auth/profile');
          const parsedUser = JSON.parse(storedUser);
          const freshUser = { ...parsedUser, ...response.data };
          setUser(freshUser);
          const isPersistent = !!localStorage.getItem('user');
          const storage = isPersistent ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (err) {
        console.error('Failed to auto-refresh profile on websocket event:', err);
      }
    };

    socket.on("users_updated", handleUsersUpdated);
    return () => {
      socket.off("users_updated", handleUsersUpdated);
    };
  }, []);

  const login = async (email, password, role, rememberMe = true) => {
    const response = await api.post('/auth/login', { email, password, role });
    const userData = response.data;
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
    return userData;
  };

  const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const googleLogin = async (accessToken, rememberMe = true) => {
    const response = await api.post('/auth/google', { accessToken });
    const userData = response.data;
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  const hasPermission = (featureId, action) => {
    if (!user) return false;
    
    // Admin bypass
    if (user.role?.toLowerCase() === 'admin' || user.permissions === 'all') {
      return true;
    }

    if (!user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }

    const permission = user.permissions.find(p => p.featureId === featureId);
    if (!permission) return false;

    if (action === 'view') {
      return permission.viewScope !== 'none';
    }

    return !!permission.actions?.[action];
  };

  const updateUser = (data) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      const isPersistent = !!localStorage.getItem('user');
      const storage = isPersistent ? localStorage : sessionStorage;
      try {
        storage.setItem('user', JSON.stringify(updated));
      } catch (error) {
        console.warn('Storage quota exceeded, stripping avatar from storage...');
        const { avatar, ...updatedWithoutAvatar } = updated;
        storage.setItem('user', JSON.stringify(updatedWithoutAvatar));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, updateUser, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);