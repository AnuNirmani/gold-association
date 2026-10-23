import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage/HomePage';
import ChartPage from './chart/ChartPage';
import { LivePricesProvider } from './chart/LivePricesProvider';

function App() {
  return (
    <LivePricesProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </LivePricesProvider>
  );
}

export default App;
