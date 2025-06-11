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
          <span>{t('membership')}</span>
          <span className={`arrow ${showMember ? 'open' : ''}`}>&#9660;</span>
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
          <span>{t('contact')}</span>
          <span className={`arrow ${showContact ? 'open' : ''}`}>&#9660;</span>
        </div>
        {showContact && (
          <div className="footer-content">
            <p>
              <strong>Go4Champion Customer Support:</strong><br />
              +49 37482847
            </p>
            <small>Monday to Friday, 10 AM – 6 PM</small>
          </div>
        )}
      </div>

      {/* Sprache */}
      <div className="footer-section">
        <div className="footer-header" onClick={() => setShowLanguages(!showLanguages)}>
          <span>{t('language')}</span>
          <span className={`arrow ${showLanguages ? 'open' : ''}`}>&#9660;</span>
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
