import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage/HomePage';
import AboutPage from './about/AboutPage';
import ChartPage from './chart/ChartPage';
import EventsPage from './events/EventsPage';
import MembersPage from './members/MembersPage';
import NewsPage from './news/NewsPage';
import GalleryPage from './gallery/GalleryPage';
import ContactPage from './contact/ContactPage';
import PostPage from './content/PostPage';
import { LivePricesProvider } from './chart/LivePricesProvider';

function App() {
  return (
    <LivePricesProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:id" element={<MembersPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/posts/category/:categoryTypeId/post/:postId" element={<PostPage />} />
      </Routes>
    </LivePricesProvider>
  );
}

export default App;
