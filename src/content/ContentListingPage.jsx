import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import './ContentListingPage.css';

function ContentListingPage({ eyebrow, title, highlight, intro, items }) {
  return (
    <>
      <Navbar />
      <main className="listing-page">
        <section className="listing-hero" aria-labelledby="listing-title">
          <div className="listing-container">
            <p className="listing-eyebrow">{eyebrow}</p>
            <h1 id="listing-title">{title} <span>{highlight}</span></h1>
            <p>{intro}</p>
          </div>
        </section>

        <section className="listing-container listing-content" aria-label={`${eyebrow} list`}>
          <div className="listing-grid">
            {items.map(item => (
              <article className="listing-card" key={item.id}>
                <img className="listing-card__image" src={item.image} alt="" />
                <div className="listing-card__body">
                  <div className="listing-card__meta">
                    <span>{item.topic}</span>
                    <span>{item.year}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContentListingPage;
