import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  trendDirection = 'up',
  trendType = 'default', // 'danger', 'warning', 'success', 'info', 'default'
  iconColor = 'default',  // 'rose', 'sky', 'indigo', 'amber', 'emerald', 'default'
  onClick
}) {
  // Apple-like subtle semantic tint for icons
  const iconBgClasses = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200'
  };

  // Determine trend color
  const getTrendBadgeClass = () => {
    if (trendType === 'danger' || (trend && (trend.includes('CRITICAL') || trend.includes('+')) && !trend.includes('Days'))) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (trendType === 'warning' || (trend && trend.includes('ELEVATED'))) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (trendType === 'success' || (trend && (trend.includes('STABLE') || trend.includes('Nominal')))) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (trendType === 'info' || (trend && trend.includes('Days'))) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    return 'bg-neutral-100 text-neutral-700 border-neutral-200';
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-neutral-300' : ''
      }`}
    >
      {/* Top Row: Title + Apple Rounded Icon Chip */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${iconBgClasses[iconColor] || iconBgClasses.default}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Prominent Monospace Metric (Apple Pro typography, no wrapping) */}
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-mono whitespace-nowrap truncate">
          {value}
        </div>

        {/* Restrained Subtitle & Trend Pill */}
        {(subvalue || trend) && (
          <div className="mt-2 flex items-center space-x-2 text-xs font-mono truncate flex-wrap gap-y-1">
            {trend && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${getTrendBadgeClass()}`}>
                {trendDirection === 'up' ? '↑' : '↓'} {trend}
              </span>
            )}
            {subvalue && (
              <span className="truncate text-neutral-500 text-[11px]">
                {subvalue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
