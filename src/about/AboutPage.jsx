import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import membersImg from '../assets/members.jpg';
import './AboutPage.css';

const values = [
  {
    icon: '◇',
    title: 'Integrity',
    description: 'Encouraging honest dealings and responsible practices throughout the trade.',
  },
  {
    icon: '✦',
    title: 'Trust',
    description: 'Helping members build lasting confidence with customers and one another.',
  },
  {
    icon: '◎',
    title: 'Community',
    description: 'Bringing people together to share knowledge, opportunities, and support.',
  },
];

function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-container">
            <p className="about-eyebrow">ABOUT THE ASSOCIATION</p>
            <h1 id="about-title">A stronger future for the <span>gold trade.</span></h1>
            <p>
              We bring people in the gold and jewelry trade together around
              shared standards, trusted relationships, and a commitment to
              excellence.
            </p>
          </div>
        </section>

        <section className="about-story about-container" aria-labelledby="about-story-title">
          <div className="about-story__image">
            <img src={membersImg} alt="Jewelry and gold trade professionals" />
            <span>Excellence in trade</span>
          </div>
          <div className="about-story__content">
            <p className="about-eyebrow">WHO WE ARE</p>
            <h2 id="about-story-title">United by a shared standard of excellence</h2>
            <p>
              The Gold Association is a community for people and businesses
              working in the gold and jewelry trade. We aim to support a
              professional, informed, and connected industry.
            </p>
            <p>
              Through member connections, industry updates, and opportunities
              to learn, we help our community grow while keeping trust and
              responsible practice at the heart of the work.
            </p>
            <a href="/members" className="btn-primary">Meet our members</a>
          </div>
        </section>

        <section className="about-purpose" aria-label="Our purpose">
          <div className="about-container about-purpose__grid">
            <article>
              <span className="about-purpose__icon" aria-hidden="true">◎</span>
              <p className="about-eyebrow">OUR MISSION</p>
              <h2>Support a trusted and thriving trade</h2>
              <p>
                Connect industry professionals, encourage ethical business,
                and make knowledge and opportunity more accessible to members.
              </p>
            </article>
            <article>
              <span className="about-purpose__icon" aria-hidden="true">✦</span>
              <p className="about-eyebrow">OUR VISION</p>
              <h2>Confidence at every connection</h2>
              <p>
                Build an industry where strong relationships, professional
                standards, and shared progress help the whole community flourish.
              </p>
            </article>
          </div>
        </section>

        <section className="about-values about-container" aria-labelledby="about-values-title">
          <div className="about-values__heading">
            <p className="about-eyebrow">WHAT GUIDES US</p>
            <h2 id="about-values-title">The values behind our work</h2>
            <p>These principles shape how we serve members and strengthen our industry.</p>
          </div>
          <div className="about-values__grid">
            {values.map(value => (
              <article className="about-value card" key={value.title}>
                <span className="about-value__icon" aria-hidden="true">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-join">
          <div className="about-container about-join__inner">
            <div>
              <p className="about-eyebrow">BE PART OF THE COMMUNITY</p>
              <h2>Let’s build a stronger trade together.</h2>
            </div>
            <a href="/#membership" className="btn-gold">Explore membership</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;
