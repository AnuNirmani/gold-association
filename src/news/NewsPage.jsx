import ContentListingPage from '../content/ContentListingPage';
import { POST_CATEGORIES } from '../content/postsApi';

function NewsPage() {
  return (
    <ContentListingPage
      eyebrow="NEWS"
      title="The latest from"
      highlight="our community."
      intro="Read association updates and news relevant to the gold and jewelry trade."
      categoryTypeId={POST_CATEGORIES.news}
    />
  );
}

export default NewsPage;
