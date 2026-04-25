import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}
