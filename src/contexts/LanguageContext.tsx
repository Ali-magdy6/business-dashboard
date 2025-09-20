import { createContext, useContext, ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { translations, TranslationKeys } from '../lib/translations';

interface LanguageContextType {
  t: (key: TranslationKeys) => string;
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { language, setLanguage } = useStore();
  
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key;
  };
  
  const isRTL = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ t, language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
