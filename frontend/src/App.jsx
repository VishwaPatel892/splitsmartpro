import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Groups from './pages/group/Groups.jsx';
import GroupDetail from './pages/group/GroupDetail.jsx';
import Balance from './pages/balance/Balance.jsx';
import ToastProvider from './components/common/Toast.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"             element={<Landing />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/groups"       element={<Groups />} />
        <Route path="/groups/:id"   element={<GroupDetail />} />
        <Route path="/balance/:groupId" element={<Balance />} />
      </Routes>

      {/* Global toast notification system */}
      <ToastProvider />
    </>
  );
}


