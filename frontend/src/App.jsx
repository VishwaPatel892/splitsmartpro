import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing.jsx';
import Login from './pages/auth/Login.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

