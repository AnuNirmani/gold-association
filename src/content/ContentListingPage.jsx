import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePosts from './usePosts';
import { postLink } from './postsApi';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import './ContentListingPage.css';

function ContentListingPage({ eyebrow, title, highlight, intro, categoryTypeId }) {
  const [page, setPage] = useState(1);
  const { posts: items, loading, error, retry } = usePosts(categoryTypeId, page);
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
          {loading && <p role="status">Loading posts…</p>}
          {error && <div role="alert"><p>{error}</p><button className="btn-primary" onClick={retry}>Try again</button></div>}
          {!loading && !error && items.length === 0 && <p>No posts found.</p>}
          <div className="listing-grid" aria-busy={loading}>
            {items.map(item => (
              <article className="listing-card" key={item.post_id}>
                {item.image && <img className="listing-card__image" src={item.image} alt={item.title} />}
                <div className="listing-card__body">
                  <div className="listing-card__meta">
                    <span>{item.sub_topic}</span>
                    <span>{item.year}</span>
                  </div>
                  <h2><Link to={postLink(item)}>{item.title}</Link></h2>
                  <p>{item.excerpt.length > 240 ? `${item.excerpt.slice(0, 240)}…` : item.excerpt}</p>
                  <Link to={postLink(item)}>Read more →</Link>
                </div>
              </article>
            ))}
          </div>
          <nav className="listing-pagination" aria-label="Posts pagination">
            <button className="btn-primary" disabled={loading || page === 1} onClick={() => setPage(value => value - 1)}>Previous</button>
            <span>Page {page}</span>
            <button className="btn-primary" disabled={loading || !!error || items.length < 12} onClick={() => setPage(value => value + 1)}>Next</button>
          </nav>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContentListingPage;
