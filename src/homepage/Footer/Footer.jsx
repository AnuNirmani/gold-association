import './Footer.css';

const quickLinks = ['Home', 'About', 'Members', 'Events', 'News'];
const resources = ['Registration', 'Downloads', 'Gallery', 'Contact Us'];

function Footer() {
  const handleNewsletter = e => {
    e.preventDefault();
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="footer__logo">
            <svg className="footer-emblem" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" fill="#c9a227" stroke="#8a6a10" strokeWidth="1" />
              <ellipse cx="18" cy="19" rx="9" ry="7.5" fill="#7a5a0a" opacity="0.4" />
              <path d="M11 17 Q18 10 25 17" stroke="#8a6a10" strokeWidth="1.2" fill="none" />
              <path d="M9 15 L11 18 L18 14 L25 18 L27 15 L23 18 L18 13 L13 18 Z" fill="#0d0f1a" opacity="0.55" />
              <text x="18" y="28" textAnchor="middle" fill="#0d0f1a" fontSize="4.5" fontFamily="sans-serif" letterSpacing="0.5">ASSOC.</text>
            </svg>
            <div>
              <div className="footer-logo-name">Gold Association</div>
              <div className="footer-logo-tagline">Excellence in Trade</div>
            </div>
          </div>
          <p className="footer__desc">
            A premier organization dedicated to ethical practices, trusted member
            standards, and growth in the gold and jewelry trade.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Resources</h4>
          <ul>
            {resources.map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--contact">
          <h4>Contact Info</h4>
          <address className="footer__contact-list">
            <div className="contact-item">
              <span className="contact-icon" aria-hidden="true">📍</span>
              <span>123 Business District, Colombo</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon" aria-hidden="true">📞</span>
              <a href="tel:+94771234567">+94 77 123 4567</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon" aria-hidden="true">✉️</span>
              <a href="mailto:info@goldassociation.com">info@goldassociation.com</a>
            </div>
          </address>

          <div className="footer__newsletter">
            <h4>Newsletter</h4>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input type="email" placeholder="Enter your email" required autoComplete="email" />
              <button type="submit">Register</button>
            </form>
            <p>By subscribing, you agree to receive association updates.</p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 Gold Association. All rights reserved.</span>
        <nav className="footer__legal" aria-label="Legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
