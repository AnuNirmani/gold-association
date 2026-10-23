import { createContext, useContext } from 'react';

export const LivePricesContext = createContext(null);

export function useLivePrices() {
  const context = useContext(LivePricesContext);
  if (!context) {
    throw new Error('useLivePrices must be used inside LivePricesProvider');
  }
  return context;
}
