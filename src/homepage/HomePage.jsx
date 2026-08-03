import Navbar from './Navbar/Navbar';
import Hero from './Hero/Hero';
import StatsBar from './StatsBar/StatsBar';
import GoldPrices from './GoldPrices/GoldPrices';
import MembershipBenefits from './MembershipBenefits/MembershipBenefits';
import EventsNews from './EventsNews/EventsNews';
import CTA from './CTA/CTA';
import Footer from './Footer/Footer';

function HomePage() {
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

export default HomePage;
