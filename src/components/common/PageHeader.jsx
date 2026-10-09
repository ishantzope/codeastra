import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  badge,
  actions,
  children
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4 font-mono transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {backTo && (
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-600 hover:text-black font-semibold transition cursor-pointer mb-1 group px-2.5 py-1 rounded-full hover:bg-neutral-100"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{backLabel}</span>
            </button>
          )}

          <div className="flex items-center space-x-3 flex-wrap gap-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white border border-neutral-900 shadow-2xs">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto flex-wrap gap-y-2">
            {actions}
          </div>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
