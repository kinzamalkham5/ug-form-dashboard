import React from 'react';

const STYLES = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const Badge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
      STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200'
    }`}
  >
    {status}
  </span>
);

export default Badge;
