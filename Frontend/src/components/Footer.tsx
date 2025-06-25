import React, { useState } from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const [showMember, setShowMember] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLanguages(false);
  };

  return (
    <footer className="footer">
      
      {/* Mitglied werden */}
      <div className="footer-section">
        <div className="footer-header" onClick={() => setShowMember(!showMember)}>
          <p style={{ fontWeight: 'bold' }}>{t('membership')}</p>
          <p className={`arrow ${showMember ? 'open' : ''}`}>&#9660;</p>
        </div>
        {showMember && (
          <div className="footer-content">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        )}
      </div>

      {/* Kontakt */}
      <div className="footer-section">
        <div className="footer-header" onClick={() => setShowContact(!showContact)}>
          <p style={{ fontWeight: 'bold' }}>{t('contact')}</p>
          <p className={`arrow ${showContact ? 'open' : ''}`}>&#9660;</p>
        </div>
        {showContact && (
          <div className="footer-content">
            <p>
              Go4Champion Customer Support:<br />
              +49 37482847
            </p>
            <p>Monday to Friday, 10 AM – 6 PM</p>
          </div>
        )}
      </div>

      {/* Sprache */}
      <div className="footer-section">
        <div className="footer-header" onClick={() => setShowLanguages(!showLanguages)}>
         <p style={{ fontWeight: 'bold' }}>{t('language')}</p>
          <p className={`arrow ${showLanguages ? 'open' : ''}`}>&#9660;</p>
        </div>
        {showLanguages && (
          <div className="footer-content">
            <button className="lang-button" onClick={() => changeLanguage('en')}>English</button>
            <button className="lang-button" onClick={() => changeLanguage('de')}>Deutsch</button>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
