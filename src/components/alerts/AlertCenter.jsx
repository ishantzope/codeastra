import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  UserCheck, 
  Radio, 
  X
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { DISEASES, SURVEILLANCE_ZONES } from '../../constants/outbreakData';

export default function AlertCenter() {
  const {
    alerts,
    updateAlertStatus,
    addAlertActionLog,
    createManualAlert,
    setBroadcastModalAlert,
    broadcastLog
  } = useOutbreak();

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Alert Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualDisease, setManualDisease] = useState(DISEASES[0].name);
  const [manualZone, setManualZone] = useState(SURVEILLANCE_ZONES[0].name);
  const [manualSeverity, setManualSeverity] = useState('WARNING');
  const [manualSummary, setManualSummary] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.disease.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateManual = (e) => {
    e.preventDefault();
    if (!manualTitle) return;

    createManualAlert({
      title: manualTitle,
      disease: manualDisease,
      zone: manualZone,
      severity: manualSeverity,
      summary: manualSummary || 'Syndromic surveillance team manually flagged cluster anomalies.',
      actions: [
        'Collect confirmatory nasopharyngeal / biological samples for RT-PCR verification',
        'Initiate backward contact tracing in sentinel catchment zone',
        'Audit hospital negative pressure isolation beds'
      ]
    });

    setIsManualModalOpen(false);
    setManualTitle('');
    setManualSummary('');
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Center Header & Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Epidemiological Alert Center & Triage Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated anomaly triage with CUSUM breach verification and multi-channel protocol dispatch.
            </p>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Field Outbreak Alert</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Severity Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {sev === 'ALL' ? 'All Alerts' : sev}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by pathogen, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-3xl p-6 border transition-all ${
                alert.status === 'RESOLVED'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                  : 'bg-sky-50/40 border-sky-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Alert Core Info */}
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}>
                      {alert.severity}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      Status: {alert.status.replace('_', ' ')}
                    </span>

                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {alert.timestamp}
                    </span>

                    {alert.leadDaysAdvantage && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        Lead Gain: +{alert.leadDaysAdvantage} Days Early
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {alert.summary}
                    </p>
                  </div>

                  {/* Epidemiological Metrics Grid */}
                  {alert.metrics && (
                    <div className="flex flex-wrap items-center gap-4 bg-white/90 p-3 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Z-Score</span>
                        <strong className="text-rose-700 font-mono">+{alert.metrics.zScore} σ</strong>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">CUSUM Score</span>
                        <strong className="text-sky-700 font-mono">{alert.metrics.cusum} σ</strong>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estimated R_t</span>
                        <strong className="text-amber-800 font-mono">{alert.metrics.estimatedRt}</strong>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">7-Day Projected Cases</span>
                        <strong className="text-slate-900 font-mono">~{alert.metrics.projectedCases7Days}</strong>
                      </div>
                    </div>
                  )}

                  {/* Recommended Action Protocols */}
                  {alert.recommendedActions && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Recommended Non-Pharmaceutical & Clinical Interventions:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {alert.recommendedActions.map((rec, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-rose-600 font-bold">▪</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dispatch Log if any */}
                  {alert.dispatchLog && alert.dispatchLog.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <span className="font-semibold text-slate-800">Dispatch Audit History:</span>
                      {alert.dispatchLog.map((log, i) => (
                        <div key={i} className="text-[11px] font-mono text-emerald-700">
                          [{log.time}] {log.note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                  {alert.status === 'ACTIVE_TRIAGE' && (
                    <button
                      onClick={() => {
                        updateAlertStatus(alert.id, 'INVESTIGATING');
                        addAlertActionLog(alert.id, 'Investigation acknowledged by Epidemiologist on duty');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Acknowledge & Investigate</span>
                    </button>
                  )}

                  <button
                    onClick={() => setBroadcastModalAlert(alert)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Emergency Broadcast</span>
                  </button>

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => {
                        updateAlertStatus(alert.id, 'RESOLVED');
                        addAlertActionLog(alert.id, 'Outbreak cluster declared contained and resolved');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Matching Alerts</h3>
            <p className="text-xs">No active alerts match current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Broadcast Delivery Log */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
            <Radio className="w-4 h-4" />
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Recent Emergency Notification Broadcasts
          </h3>
        </div>

        <div className="space-y-2">
          {broadcastLog.map((bc) => (
            <div
              key={bc.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{bc.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {bc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target: {bc.recipientGroup} ({bc.channel})
                </p>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-500">
                Reach: <strong className="text-slate-900">{bc.reachCount.toLocaleString()}</strong> • {bc.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Alert Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Log Field Outbreak Anomaly</h3>
              <p className="text-xs text-slate-500 mt-1">
                Public health field officers can log verified syndromic spikes manually.
              </p>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unusual Respiratory Distress Cluster in Dormitories"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pathogen / Syndrome</label>
                  <select
                    value={manualDisease}
                    onChange={(e) => setManualDisease(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {DISEASES.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metropolitan Sector</label>
                  <select
                    value={manualZone}
                    onChange={(e) => setManualZone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {SURVEILLANCE_ZONES.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity Tier</label>
                  <select
                    value={manualSeverity}
                    onChange={(e) => setManualSeverity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="CRITICAL">CRITICAL (Emergency)</option>
                    <option value="WARNING">WARNING (High Alert)</option>
                    <option value="WATCH">WATCH (Surveillance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Observations Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe initial symptoms, age demographics, and suspect transmission route..."
                  value={manualSummary}
                  onChange={(e) => setManualSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Submit & Trigger Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
