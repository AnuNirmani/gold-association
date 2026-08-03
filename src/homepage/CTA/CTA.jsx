import ctaImg from '../../assets/cta.jpg';
import './CTA.css';

function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-card"
          style={{ backgroundImage: `url(${ctaImg})` }}>
          <div className="cta-overlay">
            <h3 className="cta-heading">Become a Verified Member Today</h3>
            <p className="cta-sub">Get listed, access events, and build trust with customers.</p>
            <div className="cta-actions">
              <a href="#membership" className="btn-primary">Apply Now</a>
              <a href="#contact" className="btn-secondary cta-ghost-btn">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
