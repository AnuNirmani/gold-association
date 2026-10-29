import ContentListingPage from '../content/ContentListingPage';
import { news } from '../content/contentData';

function NewsPage() {
  return (
    <ContentListingPage
      eyebrow="NEWS"
      title="The latest from"
      highlight="our community."
      intro="Read association updates and news relevant to the gold and jewelry trade."
      items={news}
    />
  );
}

export default NewsPage;
