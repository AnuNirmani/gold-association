import ContentListingPage from '../content/ContentListingPage';
import { POST_CATEGORIES } from '../content/postsApi';

function EventsPage() {
  return (
    <ContentListingPage
      eyebrow="EVENTS"
      title="Meet, learn, and"
      highlight="connect."
      intro="Explore gatherings and learning opportunities for the gold and jewelry trade community."
      categoryTypeId={POST_CATEGORIES.events}
    />
  );
}

export default EventsPage;
