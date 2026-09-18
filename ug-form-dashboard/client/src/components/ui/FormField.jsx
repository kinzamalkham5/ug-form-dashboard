import React from 'react';

const FormField = ({ label, error, children }) => (
  <div className="mb-4">
    <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </div>
);

export const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

export default FormField;
