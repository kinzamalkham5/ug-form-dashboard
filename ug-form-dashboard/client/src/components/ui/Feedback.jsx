import React from 'react';
import { X, Inbox } from 'lucide-react';

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
};

export const EmptyState = ({ title = 'Nothing here yet', subtitle }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-slate-400">
    <Inbox size={36} />
    <p className="text-sm font-medium text-slate-500">{title}</p>
    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
  </div>
);

export const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500" />
    {label}
  </div>
);
