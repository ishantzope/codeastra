import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useFarm();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center space-x-3 py-3 px-4 rounded-2xl shadow-xl bg-slate-900 text-white border border-slate-700/50 backdrop-blur-md animate-slideUp max-w-sm"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          
          <p className="text-xs sm:text-sm font-medium leading-snug flex-1">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
