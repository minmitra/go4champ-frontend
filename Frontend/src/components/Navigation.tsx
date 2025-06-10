import './Navigation.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { FaSignInAlt } from 'react-icons/fa';
import { IoIosMoon } from 'react-icons/io';
import { IoSunny } from 'react-icons/io5';


type NavItem = {
  to?: string;
  label: React.ReactNode;
  isToggle?: boolean;
  isLogout?: boolean;
};

const Navigation = () => {
  const [menuOpen, setMenuopen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const menuRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const publicLinks: NavItem[] = [
    { to: '/', label: 'Home' },
    { label: darkMode ? <IoSunny size={20} /> : <IoIosMoon size={20} />, isToggle: true },
    { to: '/login', label: <FaSignInAlt size={20} /> },
  ];

  const privateLinks: NavItem[] = [
    { to: '/mainpage', label: 'Home' },
    { to: '/todaysworkouts', label: "Today's Workouts" },
    { to: '/workouts', label: 'Workouts' },
    { to: '/gamification', label: 'Gamification' },
    { to: '/nutrition', label: 'Nutrition' },
    { label: darkMode ? <IoSunny size={20} /> : <IoIosMoon size={20} />, isToggle: true },
    { to: '/myprofile', label: <MdAccountCircle size={20} /> },
    { label: <FaSignInAlt size={20} />, isLogout: true },
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
    if (menuOpen) {
      const timer = setTimeout(() => {
        linkRefs.current[0]?.focus?.();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

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
      <Link to="/" className="title" tabIndex={0}>
        Go4Champion
      </Link>

      <div
        className="menu"
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
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                  setMenuopen(false);
                  window.location.href = '/';
                }}
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