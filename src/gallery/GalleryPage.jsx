import ContentListingPage from '../content/ContentListingPage';
import { POST_CATEGORIES } from '../content/postsApi';

function GalleryPage() {
  return (
    <ContentListingPage
      eyebrow="GALLERY"
      title="Moments from"
      highlight="our community."
      intro="Explore highlights from our association and the gold and jewelry trade."
      categoryTypeId={POST_CATEGORIES.news}
    />
  );
}

export default GalleryPage;
