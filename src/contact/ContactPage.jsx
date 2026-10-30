import { useState } from 'react';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import './ContactPage.css';

function ContactPage() {
  const [draftOpened, setDraftOpened] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Name: ${data.get('name').trim()}\nEmail: ${data.get('email').trim()}\nPhone: ${data.get('phone').trim()}\nGold type: ${data.get('goldType')}`;
    window.location.href = `mailto:info@goldassociation.com?subject=${encodeURIComponent('Gold enquiry')}&body=${encodeURIComponent(body)}`;
    setDraftOpened(true);
  }

  return (
    <>
      <Navbar />
      <main className="contact-page">
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-container">
            <p className="contact-eyebrow">LET'S CONNECT</p>
            <h1 id="contact-title">Contact <span>us.</span></h1>
            <p>Have a question about gold or our association? We’re here to help you take the next step.</p>
          </div>
        </section>

        <section className="contact-container contact-layout" aria-label="Contact details and enquiry form">
          <aside className="contact-details">
            <p className="contact-eyebrow">GET IN TOUCH</p>
            <h2>A conversation built on trust.</h2>
            <p>Share your details and the type of gold you’re interested in, or reach us directly using the details below.</p>
            <address>
              <div><span className="contact-details__label">EMAIL US</span><a href="mailto:info@goldassociation.com">info@goldassociation.com</a></div>
              <div><span className="contact-details__label">CALL US</span><a href="tel:+94771234567">+94 77 123 4567</a></div>
              <div><span className="contact-details__label">VISIT US</span><p>123 Business District, Colombo</p></div>
            </address>
          </aside>

          <div className="contact-form-card card">
            <h2>Make an enquiry</h2>
            <p>All fields are required.</p>
            <form onSubmit={handleSubmit}>
              <div className="contact-field">
                <label htmlFor="contact-name">Full name</label>
                <input id="contact-name" name="name" autoComplete="name" placeholder="Enter your full name" required maxLength={120} pattern=".*\S.*" />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email address</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-phone">Phone number</label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. +94 77 123 4567" required maxLength={30} pattern="[+0-9() .\-]{7,30}" title="Enter a phone number using 7–30 characters: digits, spaces, +, parentheses, dots or hyphens." />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-gold">Gold type</label>
                <select id="contact-gold" name="goldType" defaultValue="" required>
                  <option value="" disabled>Select a gold type</option>
                  <option value="24K">24K gold</option>
                  <option value="22K">22K gold</option>
                  <option value="21K">21K gold</option>
                  <option value="18K">18K gold</option>
                  <option value="Other / Not sure">Other / Not sure</option>
                </select>
              </div>
              <p className="contact-form-note" id="contact-email-note">This opens your email app with your enquiry ready to send.</p>
              <button className="btn-gold contact-submit" type="submit" aria-describedby="contact-email-note">Prepare enquiry <span aria-hidden="true">→</span></button>
              {draftOpened && <p className="contact-status" role="status">Your email app was requested. Send the draft there to complete your enquiry. If it did not open, email info@goldassociation.com directly.</p>}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContactPage;
