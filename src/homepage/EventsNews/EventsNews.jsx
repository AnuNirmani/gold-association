import usePosts from '../../content/usePosts';
import { POST_CATEGORIES, postLink } from '../../content/postsApi';
import './EventsNews.css';

function EventsNews() {
  const eventList = usePosts(POST_CATEGORIES.events);
  const newsList = usePosts(POST_CATEGORIES.news);
  const events = eventList.posts.slice(0, 3);
  const news = newsList.posts.slice(0, 3);
  return (
    <section className="en-section" id="events">
      <div className="en-inner">

        {/* Events */}
        <div className="card en-card">
          <div className="en-card__head">
            <h3 className="en-card__title">Upcoming Events</h3>
            <a href="/events" className="en-viewall">View all →</a>
          </div>
          <div className="en-events">
            <ListStatus list={eventList} />
            {events.map(ev => (
              <div key={ev.post_id} className="en-event-item">
                <div>
                  <div className="en-event-name">{ev.title}</div>
                  <div className="en-event-meta">{ev.sub_topic} · {ev.year}</div>
                </div>
                <a href={postLink(ev)} className="btn-primary en-register-btn">Details</a>
              </div>
            ))}
          </div>
        </div>

        {/* News */}
        <div className="card en-card">
          <div className="en-card__head">
            <h3 className="en-card__title">Latest News</h3>
            <a href="/news" className="en-viewall">View all →</a>
          </div>
          <div className="en-news">
            <ListStatus list={newsList} />
            {news.map(item => (
              <article key={item.post_id} className="en-news-item">
                <div className="en-news-img-wrap">
                  <img src={item.image} alt={item.title} className="en-news-img" />
                </div>
                <div className="en-news-body">
                  <div className="en-news-meta">{item.sub_topic} · {item.year}</div>
                  <div className="en-news-title">{item.title}</div>
                  <a href={postLink(item)} className="en-readmore">Read more →</a>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ListStatus({ list }) {
  if (list.loading) return <p role="status">Loading posts...</p>;
  if (list.error) return <div role="alert"><p>{list.error}</p><button onClick={list.retry}>Try again</button></div>;
  return list.posts.length === 0 ? <p>No posts found.</p> : null;
}

export default EventsNews;
