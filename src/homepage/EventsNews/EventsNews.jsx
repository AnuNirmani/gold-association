import news1Img from '../../assets/news-1.jpg';
import news2Img from '../../assets/news-2.jpg';
import './EventsNews.css';

const events = [
  { name: 'Jewelry Trade Workshop',  date: 'Mar 10', location: 'Colombo' },
  { name: 'Gold Standards Seminar',  date: 'Apr 05', location: 'Kandy' },
  { name: 'Member Networking Night', date: 'Apr 22', location: 'Galle' },
];

const news = [
  { id: 1, cat: 'Industry Update', date: 'Dec 21', title: 'New Regulations and Standards',    img: news1Img },
  { id: 2, cat: 'Association',     date: 'Dec 22', title: 'Membership Growth & New Benefits', img: news2Img },
];

function EventsNews() {
  return (
    <section className="en-section" id="events">
      <div className="en-inner">

        {/* Events */}
        <div className="card en-card">
          <div className="en-card__head">
            <h3 className="en-card__title">Upcoming Events</h3>
            <a href="#" className="en-viewall">View all →</a>
          </div>
          <div className="en-events">
            {events.map(ev => (
              <div key={ev.name} className="en-event-item">
                <div>
                  <div className="en-event-name">{ev.name}</div>
                  <div className="en-event-meta">{ev.date} • {ev.location}</div>
                </div>
                <a href="#" className="btn-primary en-register-btn">Register</a>
              </div>
            ))}
          </div>
        </div>

        {/* News */}
        <div className="card en-card">
          <div className="en-card__head">
            <h3 className="en-card__title">Latest News</h3>
            <a href="#" className="en-viewall">View all →</a>
          </div>
          <div className="en-news">
            {news.map(item => (
              <article key={item.id} className="en-news-item">
                <div className="en-news-img-wrap">
                  <img src={item.img} alt={item.title} className="en-news-img" />
                </div>
                <div className="en-news-body">
                  <div className="en-news-meta">{item.cat} • {item.date}</div>
                  <div className="en-news-title">{item.title}</div>
                  <a href="#" className="en-readmore">Read more →</a>
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
