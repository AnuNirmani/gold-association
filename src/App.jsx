import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage/HomePage';
import ChartPage from './chart/ChartPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chart" element={<ChartPage />} />
    </Routes>
  );
}

export default App;
