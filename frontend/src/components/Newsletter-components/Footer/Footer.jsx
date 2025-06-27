import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import SubscriptionForm from '../shared/SubscriptionForm';

import logo from "../../../assets/lit-logo.png";
import emailIcon from "../../../assets/email-logo.svg";
import linkedinIcon from "../../../assets/linkedin-logo.svg";
import instagramIcon from "../../../assets/instagram-logo.svg";
import twitterIcon from "../../../assets/twitter-logo.svg";
// import googlePlayIcon from "../../../assets/google-play.png";
// import appStoreBadge from "../../../assets/app-store.png";
import googlePlayBadge from "../../../assets/googlePlayBadge.png";
import appStoreBadge from "../../../assets/app-store-badge.svg";



const Footer = () => {
  const [email, setEmail] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleSubscribe = () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-logo-section dropdown-container" ref={dropdownRef}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="footer-logo-wrapper">
              <img src={logo} alt="LIT Logo" className="footer-logo" />
            </div>
            {dropdownOpen && (
              <div className="footer-dropdown">
                <Link to="/admin/login?redirect=newsletters" className="dropdown-item">Newsletters</Link>
                <Link to="/admin/login?redirect=ecommerce" className="dropdown-item">Ecommerce</Link>
              </div>
            )}
          </div>

          <div className="footer-main-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Services</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        <div className="footer-secondary">
          <div className="footer-join-section">
            <h3>Join our Community</h3>
            <SubscriptionForm
              inputClassName="footer-email-input"
              buttonClassName="footer-subscribe-btn"
              containerClassName="footer-email-container"
            />
          </div>

          <div className="footer-contact-section">
            <div className="footer-contact-item">
              <span>Email</span>
              <a href="mailto:info@luxuryintaste.com">
                <img src={emailIcon} alt="Email" />
              </a>
            </div>
            <div className="footer-contact-item">
              <span>LinkedIn</span>
              <a href="https://www.linkedin.com/company/luxury-in-taste-lit/" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
            </div>
            <div className="footer-contact-item">
              <span>Instagram</span>
              <a href="https://www.instagram.com/luxuryintaste" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" />
              </a>
            </div>
            <div className="footer-contact-item">
              <span>Twitter</span>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="Twitter" />
              </a>
            </div>
          </div>

          {/* ✅ Updated Footer Store Buttons */}
          <div className="footer-store-buttons">
            <a 
              href="https://play.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="store-button google-play"
            >
              <img src={googlePlayBadge} alt="Get it on Google Play" />
            </a>
            <a 
              href="https://www.apple.com/app-store/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="store-button app-store"
            >
              <img src={appStoreBadge} alt="Download on the App Store" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">© 2024 Luxury In Taste. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
