import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Plus, 
  Search, 
  ChevronRight
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import PageHeader from '../components/common/PageHeader';

export default function AlertsPage() {
  const {
    alerts,
    updateAlertStatus
  } = useOutbreak();

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.disease.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Epidemiological Alert Center & Triage Queue"
        subtitle="Automated anomaly triage with CUSUM breach verification, multi-stream signal cross-validation, and clinical containment dispatch."
        badge={`${alerts.length} Incidents`}
        actions={
          <div className="flex items-center space-x-2">
            <Link
              to="/broadcast"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Center</span>
            </Link>

            {/* Direct Link to Dedicated Full-Screen Page - NO POPUP MODAL */}
            <Link
              to="/alerts/new"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Outbreak Alert</span>
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar (Apple Card) */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Severity Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY', 'WATCH'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition whitespace-nowrap cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'bg-[#f2f2f7] text-neutral-600 hover:text-black hover:bg-neutral-200/70'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : sev}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pathogen, zone..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-[#f2f2f7] border border-neutral-200/80 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100 text-xs">
          <span className="text-neutral-500 font-medium">Triage Status:</span>
          {['ALL', 'ACTIVE_TRIAGE', 'INVESTIGATING', 'DISPATCHED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4 font-mono">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-200 space-y-4"
            >
              {/* Alert Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    alert.severity === 'WARNING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    alert.severity === 'ADVISORY' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {alert.severity}
                  </span>
                  
                  <Link
                    to={`/alerts/${alert.id}`}
                    className="text-base font-bold text-neutral-900 hover:underline hover:text-black tracking-tight"
                  >
                    {alert.title}
                  </Link>
                </div>

                <div className="flex items-center space-x-3 text-xs text-neutral-500 font-mono">
                  <span>{alert.timestamp}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    alert.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    alert.status === 'DISPATCHED' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    alert.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Alert Body */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="md:col-span-3 space-y-2">
                  <p className="text-neutral-700 leading-relaxed">
                    {alert.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-neutral-500 pt-1">
                    <span>Pathogen: <strong className="text-neutral-900">{alert.disease}</strong></span>
                    <span>Surveillance Sector: <strong className="text-neutral-900">{alert.zone}</strong></span>
                    <span className="font-mono text-neutral-800 font-bold">
                      Early Lead Gained: +{alert.leadDaysAdvantage} Days
                    </span>
                  </div>
                </div>

                {/* Status Transition & Action Column */}
                <div className="flex flex-col justify-between items-start md:items-end gap-2 border-t md:border-t-0 md:border-l border-neutral-100 pt-3 md:pt-0 md:pl-4">
                  <div className="flex items-center space-x-2">
                    {alert.status === 'ACTIVE_TRIAGE' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'INVESTIGATING')}
                        className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 text-xs font-semibold transition cursor-pointer"
                      >
                        Start Investigation
                      </button>
                    )}
                    {alert.status === 'INVESTIGATING' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'DISPATCHED')}
                        className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 text-xs font-semibold transition cursor-pointer"
                      >
                        Mark Dispatched
                      </button>
                    )}
                    {alert.status === 'DISPATCHED' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'RESOLVED')}
                        className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition cursor-pointer"
                      >
                        Resolve Alert
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    {/* View Deep-Dive Full-Screen Page */}
                    <Link
                      to={`/alerts/${alert.id}`}
                      className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Inspect Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Direct link to dedicated Emergency Broadcast Page */}
                    <Link
                      to={`/broadcast?alertId=${alert.id}`}
                      className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Broadcast</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl text-neutral-500 text-sm">
            No alerts matching the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
