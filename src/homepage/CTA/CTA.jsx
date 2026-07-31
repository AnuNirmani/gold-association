import './CTA.css';

function CTA() {
  return (
    <section className="cta">
      <div className="cta__bokeh" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="cta__inner">
        <h2>Become a Verified Member Today</h2>
        <p>Get listed, access events, and build trust with customers.</p>
        <div className="cta__actions">
          <a href="#membership" className="cta__btn cta__btn--dark">Apply Now</a>
          <a href="#contact" className="cta__btn cta__btn--outline">Contact Us</a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
