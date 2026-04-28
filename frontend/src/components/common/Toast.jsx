import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ICONS = {
  success: <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />,
  error: <XCircle className="w-4 h-4 shrink-0 text-rose-400" />,
  info: <Info className="w-4 h-4 shrink-0 text-indigo-400" />,
};

const COLORS = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-rose-500/30 bg-rose-500/10',
  info: 'border-indigo-500/30 bg-indigo-500/10',
};

function ToastItem({ id, message, type = 'info', onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-white shadow-xl shadow-black/30 transition-all duration-300 min-w-[280px] max-w-sm',
        COLORS[type],
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      )}
    >
      {ICONS[type]}
      <span className="flex-1 font-medium leading-snug">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 300); }}
        className="text-white/40 hover:text-white transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Global toast state (module-level singleton)
let _setToasts = null;

export function toast(message, type = 'info') {
  if (_setToasts) {
    const id = Date.now() + Math.random();
    _setToasts((prev) => [...prev, { id, message, type }]);
  }
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _setToasts = setToasts;
    return () => { _setToasts = null; };
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
}
