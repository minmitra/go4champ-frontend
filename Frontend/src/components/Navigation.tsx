import './Navigation.css'; 
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { IoSunny } from 'react-icons/io5';
import { IoIosMoon } from 'react-icons/io';
import { useAuthenti } from '../context/AuthentiContext';
import { useTranslation } from 'react-i18next';
import { FaHome } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";

type NavItem = {
  to?: string;
  label: React.ReactNode;
  isToggle?: boolean; 
  isLogout?: boolean; 
};

const Navigation = () => {
  const [menuOpen, setMenuopen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const { isAuthenticated, logout } = useAuthenti();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

      //Safe Area: Theme-Farbe für Systemstatusleiste anpassen dark/light
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) {
      const darkThemeColor = "#000000";
      const lightThemeColor = "#0f172a"; 

      metaThemeColor.setAttribute('content', darkMode ? darkThemeColor : lightThemeColor);
    }

  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setMenuopen(false);
    navigate('/login');
  };

  const privateLinks: NavItem[] = [
     { to: '/workouts', label: "My Workouts" },
    { to: '/challenges', label: "Challenges" },
     { to: '/mycoach', label: "My Coach" },
    { to: '/nutrition', label: t('nutrition') },
    { label: darkMode ? <IoSunny size={20} /> : <IoIosMoon size={20} />, isToggle: true },
     { to: '/faq', label:<FaQuestionCircle size={20} /> },
    { to: '/myprofile', label: <MdAccountCircle size={20} /> },
         { to: '/mainpage', label: <FaHome size={20}  /> },
    { label: "LOGOUT" , isLogout: true },
  ];

  const publicLinks: NavItem[] = [
    { to: '/faq', label: <FaQuestionCircle size={20} /> },
    { label: darkMode ? <IoSunny size={20} /> : <IoIosMoon size={20} />, isToggle: true },
     { to: '/', label:  <FaHome size={20} /> },
    { to: '/login', label: "LOGIN" },
  ];

  const allLinks = isAuthenticated ? privateLinks : publicLinks;

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuopen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (menuOpen && allLinks.length > 0) {
      const timer = setTimeout(() => {
        linkRefs.current[0]?.focus?.();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [menuOpen, allLinks]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!allLinks.length) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % allLinks.length;
      linkRefs.current[nextIndex]?.focus?.();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + allLinks.length) % allLinks.length;
      linkRefs.current[prevIndex]?.focus?.();
    } else if (e.key === 'Escape' && menuOpen) {
      e.preventDefault();
      setMenuopen(false);
      (menuRef.current?.querySelector('.menu') as HTMLElement)?.focus();
    } else if ((e.key === 'Enter' || e.key === ' ') && allLinks[index]?.isToggle) {
      e.preventDefault();
      setDarkMode(prev => !prev);
    }
  };

  return (
    <nav ref={menuRef}> 
      <Link to={isAuthenticated ? "/mainpage" : "/"} className="title" tabIndex={0}>
        Go4Champion
      </Link>

      <div
        className={`menu ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuopen(!menuOpen)}
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setMenuopen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? 'open' : ''} role="menubar">
        {allLinks.map((item, index) => (
          <li key={item.to || index} role="none">
            {'to' in item && item.to ? (
              <NavLink
                to={item.to}
                role="menuitem"
                tabIndex={0}
                ref={(el) => { linkRefs.current[index] = el }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => setMenuopen(false)}
              >
                {item.label}
              </NavLink>
            ) : item.isLogout ? (
              <div
                className="navlink-like"
                role="menuitem"
                tabIndex={0}
                ref={(el) => { linkRefs.current[index] = el }}
                onClick={handleLogout}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {item.label}
              </div>
            ) : ( 
              <div
                className="navlink-like"
                role="menuitem"
                tabIndex={0}
                ref={(el) => { linkRefs.current[index] = el }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => setDarkMode(prev => !prev)}
              >
                {item.label}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;