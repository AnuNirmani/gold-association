import { useState, useEffect } from 'react';
import './Navbar.css';

const navLinks = ['Home', 'About', 'Members', 'Events', 'News', 'Gallery', 'Downloads', 'Contact'];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo">
          <svg className="logo-emblem" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="23" fill="#c9a227" stroke="#8a6a10" strokeWidth="1.5" />
            <ellipse cx="24" cy="26" rx="12" ry="10" fill="#7a5a0a" opacity="0.4" />
            <path d="M17 28 Q24 18 31 28" stroke="#8a6a10" strokeWidth="1.5" fill="none" />
            <path d="M14 22 L17 28 L24 24 L31 28 L34 22 L30 26 L24 20 L18 26 Z" fill="#0d0f1a" opacity="0.6" />
            <text x="24" y="36" textAnchor="middle" fill="#0d0f1a" fontSize="6" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">ASSOC.</text>
          </svg>
          <div className="logo-text">
            <span className="logo-name">GOLD</span>
            <span className="logo-sub">ASSOCIATION</span>
          </div>
        </a>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          {navLinks.map(link => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <a href="#membership" className="navbar__cta">Be a Member</a>
      </div>
    </nav>
  );
}

export default Navbar;
