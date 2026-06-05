import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeAndLangContext = createContext();

export function ThemeAndLangProvider({ children }) {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || i18n.language || 'fr';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lng) => {
    setLanguage(lng);
    localStorage.setItem('appLanguage', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  useEffect(() => {
    // Set initial dir based on i18n language and persisted value
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ThemeAndLangContext.Provider value={{ theme, toggleTheme, changeLanguage, currentLang: language }}>
      {children}
    </ThemeAndLangContext.Provider>
  );
}

export function useThemeAndLang() {
  return useContext(ThemeAndLangContext);
}
