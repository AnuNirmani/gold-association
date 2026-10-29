import { events, news } from '../../content/contentData';
import './EventsNews.css';

function EventsNews() {
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
            {events.map(ev => (
              <div key={ev.id} className="en-event-item">
                <div>
                  <div className="en-event-name">{ev.title}</div>
                  <div className="en-event-meta">{ev.topic} · {ev.year}</div>
                </div>
                <a href="/events" className="btn-primary en-register-btn">Details</a>
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
            {news.map(item => (
              <article key={item.id} className="en-news-item">
                <div className="en-news-img-wrap">
                  <img src={item.image} alt={item.title} className="en-news-img" />
                </div>
                <div className="en-news-body">
                  <div className="en-news-meta">{item.topic} · {item.year}</div>
                  <div className="en-news-title">{item.title}</div>
                  <a href="/news" className="en-readmore">Read more →</a>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default EventsNews;
