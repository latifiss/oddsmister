import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { getProviderLogo, bettingProviders, BettingProvider } from '@/utils/bettingProviders';

export const useBettingProvider = () => {
  const theme = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Function to detect current theme
    const detectTheme = () => {
      // Check for theme in localStorage
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setCurrentTheme('dark');
        return;
      }
      if (storedTheme === 'light') {
        setCurrentTheme('light');
        return;
      }
      
      // Check theme context
      if (theme) {
        const isDark = theme.mode === 'dark' || theme.isDark === true;
        setCurrentTheme(isDark ? 'dark' : 'light');
        return;
      }
      
      // Check body class
      const isDarkBody = document.body.classList.contains('dark-mode') || 
                        document.documentElement.classList.contains('dark');
      setCurrentTheme(isDarkBody ? 'dark' : 'light');
    };
    
    detectTheme();
    
    // Listen for theme change events
    const handleThemeChange = () => {
      detectTheme();
    };
    
    // Create a mutation observer to watch for class changes on body
    const observer = new MutationObserver(() => {
      detectTheme();
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [theme]);

  const getLogo = (providerId: string) => {
    return getProviderLogo(providerId, currentTheme);
  };

  const getProviderWithLogo = (providerId: string): BettingProvider & { logoUrl: string } => {
    const provider = bettingProviders.find(p => p.id === providerId);
    const logoUrl = getProviderLogo(providerId, currentTheme);
    
    return {
      ...provider!,
      logoUrl,
    };
  };

  return {
    getLogo,
    getProviderWithLogo,
    currentTheme,
    providers: bettingProviders,
  };
};