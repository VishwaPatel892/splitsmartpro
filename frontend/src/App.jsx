import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import ToastProvider from './components/common/Toast.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import AIAssistant from './components/common/AIAssistant.jsx';

export default function App() {
  // Restore persisted theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('splitsmart_theme');
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    } catch {/* storage unavailable */}
  }, []);

  return (
    <ErrorBoundary>
      <div className="pb-20 sm:pb-0">
        <AppRoutes />
        <BottomNav />
        {/* Global components */}
        <ToastProvider />
        <AIAssistant />
      </div>
    </ErrorBoundary>
  );
}
