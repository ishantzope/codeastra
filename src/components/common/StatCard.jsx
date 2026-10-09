import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  trendDirection = 'up',
  statusColor = 'rose',
  leadBadge,
  onClick
}) {
  const colorMap = {
    rose: {
      border: 'border-rose-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      trendUp: 'text-rose-600',
      trendDown: 'text-emerald-600'
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      trendUp: 'text-amber-700',
      trendDown: 'text-emerald-600'
    },
    cyan: {
      border: 'border-sky-200 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      trendUp: 'text-sky-700',
      trendDown: 'text-emerald-600'
    },
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      trendUp: 'text-rose-600',
      trendDown: 'text-emerald-600'
    },
    purple: {
      border: 'border-purple-200 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      trendUp: 'text-purple-700',
      trendDown: 'text-emerald-600'
    }
  };

  const scheme = colorMap[statusColor] || colorMap.rose;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
            {subvalue && <span className="text-xs text-slate-500 font-medium">{subvalue}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center space-x-1 font-semibold">
            <span className={trendDirection === 'up' ? scheme.trendUp : scheme.trendDown}>
              {trendDirection === 'up' ? '▲' : '▼'} {trend}
            </span>
            <span className="text-slate-400 text-[11px] font-normal">vs 14d baseline</span>
          </div>
        )}
        {leadBadge && (
          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${scheme.badge}`}>
            {leadBadge}
          </span>
        )}
      </div>
    </div>
  );
}
