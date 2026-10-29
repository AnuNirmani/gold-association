import ContentListingPage from '../content/ContentListingPage';
import { events } from '../content/contentData';

function EventsPage() {
  return (
    <ContentListingPage
      eyebrow="EVENTS"
      title="Meet, learn, and"
      highlight="connect."
      intro="Explore gatherings and learning opportunities for the gold and jewelry trade community."
      items={events}
    />
  );
}

export default EventsPage;
