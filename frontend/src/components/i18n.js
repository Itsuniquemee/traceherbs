// i18n.js - Simple multilingual support for English/Hindi
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    analytics: 'Analytics Dashboard',
    scan_qr: 'Scan Product QR Code',
    invalid_qr: 'Invalid or Unauthorized QR',
    recalled_qr: 'This batch has been recalled. Do not consume.',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    user_management: 'User Management',
    compliance_report: 'Generate Compliance Report',
    recall_simulation: 'Batch Recall Simulation',
    // ...add more keys as needed
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    analytics: 'एनालिटिक्स डैशबोर्ड',
    scan_qr: 'उत्पाद QR कोड स्कैन करें',
    invalid_qr: 'अमान्य या अनधिकृत QR',
    recalled_qr: 'इस बैच को वापस बुला लिया गया है। सेवन न करें।',
    login: 'लॉगिन',
    signup: 'साइन अप',
    logout: 'लॉगआउट',
    user_management: 'यूज़र प्रबंधन',
    compliance_report: 'अनुपालन रिपोर्ट जनरेट करें',
    recall_simulation: 'बैच रिकॉल सिमुलेशन',
    // ...add more keys as needed
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] || key;
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
