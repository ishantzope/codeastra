import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  dashboard: 'Overview',
  surveillance: 'Geospatial GIS',
  workbench: 'CUSUM Workbench',
  alerts: 'Alert Center',
  new: 'Create Alert',
  broadcast: 'Emergency Broadcast',
  simulator: 'Scenario Injector',
  sitrep: 'WHO SitRep',
  docs: 'System Documentation'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="no-print">
      <div className="inline-flex items-center space-x-2 text-xs text-neutral-500 font-mono px-4 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex-wrap">
        <Link to="/dashboard" className="flex items-center space-x-1 text-neutral-600 hover:text-black transition">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = ROUTE_LABELS[value] || (value.startsWith('alt-') ? `Incident ${value}` : decodeURIComponent(value));

          return (
            <React.Fragment key={to}>
              <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
              {isLast ? (
                <span className="text-neutral-900 font-bold">
                  {label}
                </span>
              ) : (
                <Link to={to} className="text-neutral-600 hover:text-black transition">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
