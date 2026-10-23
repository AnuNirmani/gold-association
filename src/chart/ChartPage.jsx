import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import PriceTicker from './PriceTicker/PriceTicker';
import MetalSelector from './MetalSelector/MetalSelector';
import PriceChart from './PriceChart/PriceChart';
import PriceStats from './PriceStats/PriceStats';
import { useLivePrices } from './livePricesContext';
import './ChartPage.css';

const EMPTY_SERIES = [];

function ChartPage() {
  const [searchParams] = useSearchParams();
  const activeMetal = searchParams.get('metal') || '24k';

  const [countdown, setCountdown] = useState(30);
  const [chartStats, setChartStats] = useState(null);
  const {
    metals: liveMetals,
    statsByMetal,
    seriesByMetal,
    karatIdByMetal,
    refreshedAt,
  } = useLivePrices();
  const activeMetalInfo = liveMetals.find((metal) => metal.id === activeMetal);
  const updatedTime = refreshedAt ? new Date(refreshedAt).toLocaleTimeString() : 'Waiting for backend';

  useEffect(() => {
    setCountdown(30);
    const t = setInterval(() => {
      setCountdown((seconds) => {
        return seconds <= 1 ? 30 : seconds - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [refreshedAt]);

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
            <div>Last updated: <strong className="just-now">{updatedTime}</strong></div>
            <div>Next update in <strong>{countdown}s</strong></div>
          </div>
        </div>

        <MetalSelector activeMetal={activeMetal} metals={liveMetals} />

        <div className="chart-page__grid">
          <PriceChart
            metal={activeMetal}
            metalName={activeMetalInfo?.name}
            karatId={karatIdByMetal[activeMetal]}
            latestPrice={activeMetalInfo?.price}
            latestUpdatedAt={activeMetalInfo?.updatedAt}
            refreshKey={refreshedAt}
            todaySeries={seriesByMetal[activeMetal] ?? EMPTY_SERIES}
            onStatistics={setChartStats}
          />
          <PriceStats
            metal={activeMetal}
            statsByMetal={statsByMetal}
            chartStats={chartStats}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ChartPage;
