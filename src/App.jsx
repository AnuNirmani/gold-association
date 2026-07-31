import './App.css';
import Navbar from './homepage/Navbar/Navbar';
import Hero from './homepage/Hero/Hero';
import StatsBar from './homepage/StatsBar/StatsBar';
import GoldPrices from './homepage/GoldPrices/GoldPrices';
import MembershipBenefits from './homepage/MembershipBenefits/MembershipBenefits';
import EventsNews from './homepage/EventsNews/EventsNews';
import CTA from './homepage/CTA/CTA';
import Footer from './homepage/Footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <GoldPrices />
      <MembershipBenefits />
      <EventsNews />
      <CTA />
      <Footer />
    </>
  );
}

export default App;
