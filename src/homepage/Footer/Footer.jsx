import logoImg from '../../assets/logo.png';
import './Footer.css';

const quickLinks = ['Home', 'About', 'Members', 'Events', 'News'];
const resources  = ['Registration', 'Downloads', 'Gallery', 'Contact Us'];

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-ring">
              <img src={logoImg} alt="Gold Association logo" className="footer__logo-img" />
            </div>
            <div>
              <div className="footer__logo-name">Gold Association</div>
              <div className="footer__logo-sub">Excellence in Trade</div>
            </div>
          </div>
          <p className="footer__desc">
            A premier organization dedicated to ethical practices, trusted member standards,
            and growth in the gold and jewelry trade.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-btn" aria-label="Facebook">f</a>
            <a href="#" className="footer__social-btn" aria-label="LinkedIn">in</a>
            <a href="#" className="footer__social-btn" aria-label="Instagram">ig</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer__col">
          <div className="footer__col-title">Quick Links</div>
          <ul>
            {quickLinks.map(l => (
              <li key={l}><a href={l === 'Home' ? '/' : `/#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="footer__col">
          <div className="footer__col-title">Resources</div>
          <ul>
            {resources.map(l => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div className="footer__col">
          <div className="footer__col-title">Contact Info</div>
          <address className="footer__contacts">
            <div className="footer__contact-item"><span>📍</span><span>123 Business District, Colombo</span></div>
            <div className="footer__contact-item"><span>📞</span><a href="tel:+94771234567">+94 77 123 4567</a></div>
            <div className="footer__contact-item"><span>✉️</span><a href="mailto:info@goldassociation.com">info@goldassociation.com</a></div>
          </address>

          <div className="footer__newsletter">
            <div className="footer__col-title">Newsletter</div>
            <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required autoComplete="email" />
              <button type="submit">Register</button>
            </form>
            <p>By subscribing, you agree to receive association updates.</p>
          </div>
        </div>

      </div>

      <div className="footer__bottom">
        <span>© 2026 Gold Association. All rights reserved.</span>
        <nav className="footer__legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
