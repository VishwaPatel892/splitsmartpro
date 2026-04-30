import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Groups from './pages/group/Groups.jsx';
import GroupDetail from './pages/group/GroupDetail.jsx';
import Balance from './pages/balance/Balance.jsx';
import Settle from './pages/settlement/Settle.jsx';
import Analytics from './pages/analytics/Analytics.jsx';
import Settings from './pages/settings/Settings.jsx';
import ProPlan from './pages/pro/ProPlan.jsx';
import ToastProvider from './components/common/Toast.jsx';

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('splitsmart_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/"             element={<Landing />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/groups"       element={<Groups />} />
        <Route path="/groups/:id"   element={<GroupDetail />} />
        <Route path="/balance/:groupId" element={<Balance />} />
        <Route path="/settle/:groupId"  element={<Settle />} />
        <Route path="/analytics"        element={<Analytics />} />
        <Route path="/settings"         element={<Settings />} />
        <Route path="/pro"              element={<ProPlan />} />
      </Routes>

      {/* Global toast notification system */}
      <ToastProvider />
    </>
  );
}


