import { useEffect, useState } from 'react';
import { metals as metalCatalog } from './metalData';
import { fetchChartLiveMetals } from './livePricesApi';
import { LivePricesContext } from './livePricesContext';

const REFRESH_INTERVAL_MS = 30_000;

const initialSnapshot = {
  metals: metalCatalog.map((metal) => ({
    ...metal,
    price: null,
    changePercent: null,
    up: null,
    updatedAt: null,
  })),
  statsByMetal: {},
  seriesByMetal: {},
  karatIdByMetal: {},
  refreshedAt: null,
  isLoading: true,
};

export function LivePricesProvider({ children }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const refresh = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const liveData = await fetchChartLiveMetals();
        if (isMounted) {
          setSnapshot({
            ...initialSnapshot,
            ...liveData,
            refreshedAt: Date.now(),
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Unable to load live metal prices:', error);
        if (isMounted) {
          setSnapshot((current) => ({ ...current, isLoading: false }));
        }
      } finally {
        isFetching = false;
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <LivePricesContext.Provider value={snapshot}>
      {children}
    </LivePricesContext.Provider>
  );
}
