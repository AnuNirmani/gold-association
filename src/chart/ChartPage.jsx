import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import PriceTicker from './PriceTicker/PriceTicker';
import MetalSelector from './MetalSelector/MetalSelector';
import PriceChart from './PriceChart/PriceChart';
import PriceStats from './PriceStats/PriceStats';
import { metals as fallbackMetals } from './metalData';
import { fetchChartLiveMetals } from './livePricesApi';
import './ChartPage.css';

function ChartPage() {
  const [searchParams] = useSearchParams();
  const activeMetal = searchParams.get('metal') || '24k';

  const [countdown, setCountdown] = useState(30);
  const [liveMetals, setLiveMetals] = useState(fallbackMetals);

  useEffect(() => {
    let ignore = false;

    const hydratePrices = async () => {
      const rows = await fetchChartLiveMetals();
      if (!ignore) {
        setLiveMetals(rows);
      }
    };

    hydratePrices();
    setCountdown(30);

    const t = setInterval(() => {
      setCountdown((seconds) => {
        if (seconds <= 1) {
          hydratePrices();
          return 30;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => {
      ignore = true;
      clearInterval(t);
    };
  }, []);

  return (
    <>
      <Navbar />
      <PriceTicker metals={liveMetals} />
      <main className="chart-page">
        <div className="chart-page__header">
          <div>
            <div className="chart-page__title-row">
              <h1>
                Sri Lanka Gold Market —{' '}
                <span className="title-gold">Live Prices (LKR)</span>
              </h1>
              <span className="live-badge">LIVE</span>
            </div>
            <p className="chart-page__subtitle">
              Updated every 30 seconds · LKR only · Reference prices
            </p>
          </div>
          <div className="chart-page__update-info">
            <div>Last updated: <strong className="just-now">just now</strong></div>
            <div>Next update in <strong>{countdown}s</strong></div>
          </div>
        </div>

        <MetalSelector activeMetal={activeMetal} metals={liveMetals} />

        <div className="chart-page__grid">
          <PriceChart metal={activeMetal} />
          <PriceStats metal={activeMetal} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ChartPage;
