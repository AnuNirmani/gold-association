import { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import './Navbar.css';

const navLinks = ['Home', 'About', 'Members', 'Events', 'News', 'Gallery', 'Downloads', 'Contact'];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const close = () => setDrawerOpen(false);

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <a href="/" className="navbar__logo">
            <img src={logoImg} alt="Gold Association" className="logo-img" />
          </a>

          <nav className="navbar__links" aria-label="Main navigation">
            {navLinks.map(link => (
              <a
                key={link}
                className="nav-link"
                href={link === 'Home' ? '/' : `/#${link.toLowerCase()}`}
              >
                {link}
              </a>
            ))}
            <a href="/#membership" className="navbar__cta">Be a Member</a>
          </nav>

          <button className="navbar__hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            ☰
          </button>
        </div>
      </header>

      <div className={`mobile-drawer${drawerOpen ? ' mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__head">
          <span>Menu</span>
          <button onClick={close} aria-label="Close menu">✕</button>
        </div>
        <div className="mobile-drawer__links">
          {navLinks.map(link => (
            <a key={link} href={link === 'Home' ? '/' : `/#${link.toLowerCase()}`} onClick={close}>
              {link}
            </a>
          ))}
          <a href="/#membership" className="mobile-drawer__cta" onClick={close}>Be a Member</a>
        </div>
      </div>

      {drawerOpen && <div className="mobile-overlay" onClick={close} aria-hidden="true" />}
    </>
  );
}

export default Navbar;
