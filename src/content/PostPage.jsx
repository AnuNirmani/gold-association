import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import { fetchPostByCategoryAndId } from './postsApi';
import './ContentListingPage.css';

export default function PostPage() {
  const { categoryTypeId, postId } = useParams();
  const key = `${categoryTypeId}/${postId}`;
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const current = result?.key === key && result?.attempt === attempt ? result : null;

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 15000);
    fetchPostByCategoryAndId(categoryTypeId, postId, { signal: controller.signal })
      .then(post => {
        if (!controller.signal.aborted) setResult({ key, attempt, post });
      })
      .catch(error => {
        if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
        setResult({ key, attempt, error: controller.signal.reason === 'timeout'
          ? 'Request timed out. Please try again.'
          : error instanceof TypeError ? 'Unable to connect to the posts API. Check the backend connection.' : error.message });
      })
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [categoryTypeId, postId, key, attempt]);

  return (
    <>
      <Navbar />
      <main className="listing-page">
        <section className="listing-hero">
          <div className="listing-container">
            <p className="listing-eyebrow">POST</p>
            <h1>{current?.post?.title ?? 'Post details'}</h1>
            {current?.post && <p>{current.post.sub_topic}{current.post.year != null && ` · ${current.post.year}`}</p>}
          </div>
        </section>
        <section className="listing-container listing-content" aria-busy={!current}>
          {!current && <p role="status">Loading post…</p>}
          {current?.error && <div role="alert"><p>{current.error}</p><button className="btn-primary" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>}
          {current?.post && (
            <article className="post-detail">
              {current.post.image && <img className="post-detail__image" src={current.post.image} alt={current.post.title} />}
              <div className="post-detail__description" dangerouslySetInnerHTML={{ __html: current.post.description }} />
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
