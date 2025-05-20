import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [showMember, setShowMember] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="footer">
      {/* Mitglied werden */}
      <div className="footer-section">
        <div
          className="footer-header"
          onClick={() => setShowMember(!showMember)}
        >
          <span>Membership</span>
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
        <div
          className="footer-header"
          onClick={() => setShowContact(!showContact)}
        >
          <span>Contact</span>
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
    </footer>
  );
};

export default Footer;
