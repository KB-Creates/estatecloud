import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    storeName: "PropNest",
    currency: "PKR - Pakistani Rupee",
    taxRate: 0,
    accentColor: "#eab308",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    try {
      const response = await api.get('/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.accentColor);
      document.documentElement.style.setProperty('--sidebar-primary', settings.accentColor);
      // For Shadcn v4/Tailwind v4 with oklch, it might be tricky if it expects oklch.
      // But standard CSS variables usually work as overrides.
    }
  }, [settings.accentColor]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const getCurrencySymbol = () => {
    if (!settings.currency) return '$';
    
    // Explicit mappings
    if (settings.currency.includes('PKR')) return '₨. ';
    if (settings.currency.includes('EUR')) return '€ ';
    if (settings.currency.includes('AED')) return 'AED. ';
    if (settings.currency.includes('SAR')) return 'SR. ';
    if (settings.currency.includes('USD')) return '$';

    const parts = settings.currency.split(' ');
    if (parts[0].length <= 3) return parts[0]; 
    return ''; 
  };

  const getCurrencyCode = () => {
    if (!settings.currency) return 'USD';
    const match = settings.currency.match(/[A-Z]{3}/);
    return match ? match[0] : 'USD';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';

    const format = settings.dateFormat || '(MM/DD/YYYY)';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    let datePart = `${month}/${day}/${year}`; // Default MM/DD/YYYY
    if (format.includes('DD/MM/YYYY')) datePart = `${day}/${month}/${year}`;
    else if (format.includes('YYYY/MM/DD')) datePart = `${year}/${month}/${day}`;

    return `${datePart} - ${timeString}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings, getCurrencySymbol, getCurrencyCode, formatDate }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
