import React, { createContext, useContext, ReactNode } from 'react';
import { Language } from '../types/language';

interface LanguageContextType {
  language: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): Language => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context.language;
};

interface LanguageProviderProps {
  children: ReactNode;
  language: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, language }) => {
  return (
    <LanguageContext.Provider value={{ language }}>
      {children}
    </LanguageContext.Provider>
  );
};

