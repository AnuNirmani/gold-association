import './EventsNews.css';

const events = [
  { name: 'Jewelry Trade Workshop', date: 'Mar 10', location: 'Colombo' },
  { name: 'Gold Standards Seminar', date: 'Apr 05', location: 'Kandy' },
  { name: 'Member Networking Night', date: 'Apr 22', location: 'Galle' },
];

const news = [
  {
    id: 1,
    category: 'Industry Update',
    date: 'Dec 21',
    title: 'New Regulations and Standards',
    img: 'https://images.unsplash.com/photo-1610375461369-d613b564f4c4?auto=format&fit=crop&w=160&h=120&q=80',
  },
  {
    id: 2,
    category: 'Association',
    date: 'Dec 22',
    title: 'Membership Growth & New Benefits',
    img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=160&h=120&q=80',
  },
];

function EventsNews() {
  return (
    <section className="eventsnews" id="events">
      <div className="eventsnews__inner">
        <div className="eventsnews__col">
          <div className="col__header">
            <h2>Upcoming Events</h2>
            <a href="#" className="col__viewall">View all →</a>
          </div>
          <div className="events-list">
            {events.map(ev => (
              <div className="event-item" key={ev.name}>
                <div className="event-info">
                  <strong>{ev.name}</strong>
                  <span>{ev.date} • {ev.location}</span>
                </div>
                <a href="#" className="event-register">Register</a>
              </div>
            ))}
          </div>
        </div>

        <div className="eventsnews__col">
          <div className="col__header">
            <h2>Latest News</h2>
            <a href="#" className="col__viewall">View all →</a>
          </div>
          <div className="news-list">
            {news.map(item => (
              <div className="news-item" key={item.id}>
                <img src={item.img} alt={item.title} className="news-img" />
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-category">{item.category}</span>
                    <span className="news-dot">•</span>
                    <span className="news-date">{item.date}</span>
                  </div>
                  <strong>{item.title}</strong>
                  <a href="#" className="news-link">Read more →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventsNews;
