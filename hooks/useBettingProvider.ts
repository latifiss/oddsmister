import { useEffect, useState, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { getProviderLogo, bettingProviders, BettingProvider } from '@/utils/bettingProviders';

interface AppTheme {
  mode?: 'light' | 'dark';
  isDark?: boolean;
}

export const useBettingProvider = () => {
  const theme = useTheme() as AppTheme;
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const detectTheme = () => {
      const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setCurrentTheme(storedTheme);
        return;
      }

      if (theme) {
        const isDark = theme.mode === 'dark' || theme.isDark === true;
        setCurrentTheme(isDark ? 'dark' : 'light');
        return;
      }

      if (typeof document !== 'undefined') {
        const isDarkBody = document.body.classList.contains('dark-mode') || 
                          document.documentElement.classList.contains('dark');
        setCurrentTheme(isDarkBody ? 'dark' : 'light');
      }
    };
    
    detectTheme();
    
    const handleThemeChange = () => detectTheme();

    const observer = new MutationObserver(() => detectTheme());
    
    if (typeof document !== 'undefined') {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
    
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange); 
    
    return () => {
      observer.disconnect();
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [theme]);

  const getLogo = useMemo(() => (providerId: string) => {
    return getProviderLogo(providerId, currentTheme);
  }, [currentTheme]);

  const getProviderWithLogo = useMemo(() => (providerId: string): BettingProvider & { logoUrl: string } => {
    const provider = bettingProviders.find(p => p.id === providerId);
    const logoUrl = getProviderLogo(providerId, currentTheme);
    
    return {
      ...(provider || bettingProviders[0]), 
      logoUrl,
    };
  }, [currentTheme]);

  return {
    getLogo,
    getProviderWithLogo,
    currentTheme,
    providers: bettingProviders,
  };
};