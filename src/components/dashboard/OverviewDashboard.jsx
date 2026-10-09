import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  BedDouble, 
  Droplets, 
  Pill, 
  Hospital, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { useOutbreak } from '../../context/useOutbreak';
import StatCard from '../common/StatCard';
import { ALERT_LEVELS } from '../../constants/outbreakData';

export default function OverviewDashboard() {
  const {
    analytics,
    currentScenario,
    currentDisease,
    currentZone,
    alerts,
    telemetryFeed,
    setActiveTab,
    setBroadcastModalAlert,
    updateAlertStatus
  } = useOutbreak();

  const threatLevel = analytics?.oti?.alertLevel || 'NORMAL';
  const threatConfig = ALERT_LEVELS[threatLevel] || ALERT_LEVELS.NORMAL;
  const leadDays = analytics?.oti?.leadDays || 3.8;
  const latestRt = analytics?.latestRt || 1.0;
  const otiScore = analytics?.oti?.score || 45;

  // Active critical alerts
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'WARNING').slice(0, 3);

  // Normalize multi-stream comparison data for chart (0 to 100 relative index)
  const chartData = (analytics?.chartData || []).slice(-14).map((d) => {
    const normWw = Math.min(100, Math.round((d.wastewater / (currentDisease.baselineWastewaterCopies * 3)) * 100));
    const normPharm = Math.min(100, Math.round((d.pharmacy / (currentDisease.baselinePharmacyRate * 2.5)) * 100));
    const normEd = Math.min(100, Math.round((d.edCases / (currentDisease.baselineDailyRate * 2.5)) * 100));

    return {
      date: d.date,
      wastewater: normWw,
      pharmacy: normPharm,
      hospitalED: normEd,
      rawEd: d.edCases,
      rawWw: d.wastewater,
      rawPharm: d.pharmacy,
      isAnomaly: d.isAnomaly
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Threat Banner (Clean Light Surface) */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Live Syndromic Fusion Engine
              </span>
              <span className="text-xs font-semibold text-slate-500">
                District: <strong className="text-slate-900">{currentZone.name}</strong>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Pathogen: <strong className="text-slate-900">{currentDisease.name}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {threatLevel === 'CRITICAL' && '🚨 Critical Epidemic Outbreak Imminent'}
              {threatLevel === 'WARNING' && '⚠️ Outbreak Trajectory Accelerated'}
              {threatLevel === 'ADVISORY' && '⚡ Pre-Hospital Syndromic Cluster Detected'}
              {threatLevel === 'WATCH' && '🔍 Surveillance Watch Active: Low-Level Anomaly'}
              {threatLevel === 'NORMAL' && '✅ Baseline Nominal: No Aberrant Pathogen Signatures'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentScenario.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-sky-600" />
                <span className="text-slate-600">Early Warning Gain:</span>
                <strong className="text-sky-700 font-mono font-bold">+{leadDays} Days Advance Notice</strong>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-slate-600">Model Confidence:</span>
                <strong className="text-amber-700 font-mono font-bold">{analytics?.oti?.confidence || 88}%</strong>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Activity className="w-4 h-4 text-rose-600" />
                <span className="text-slate-600">Reproduction Rate R_t:</span>
                <strong className={`font-mono font-bold ${latestRt > 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {latestRt}
                </strong>
              </div>
            </div>
          </div>

          {/* Outbreak Threat Meter Circle */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-3xl p-6 min-w-[200px] text-center shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Threat Index
            </span>
            <div className="relative flex items-center justify-center my-2">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke={threatConfig.color}
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * otiScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 font-mono">{otiScore}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">/ 100</span>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: threatConfig.color }}>
              {threatConfig.name}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Outbreak Threat Index (OTI)"
          value={`${otiScore}/100`}
          subvalue={threatConfig.badge}
          icon={ShieldAlert}
          trend={otiScore > 50 ? '+34%' : '-4%'}
          trendDirection={otiScore > 50 ? 'up' : 'down'}
          statusColor={otiScore > 70 ? 'rose' : otiScore > 40 ? 'amber' : 'emerald'}
          leadBadge="Multi-Source Fusion"
          onClick={() => setActiveTab('workbench')}
        />

        <StatCard
          title="Effective R_t (Velocity)"
          value={latestRt}
          subvalue={latestRt > 1.0 ? 'Exponential Spread' : 'Controlled'}
          icon={TrendingUp}
          trend={latestRt > 1.0 ? '+0.65' : '-0.12'}
          trendDirection={latestRt > 1.0 ? 'up' : 'down'}
          statusColor={latestRt > 1.5 ? 'rose' : latestRt > 1.0 ? 'amber' : 'emerald'}
          leadBadge="EpiEstim Algorithm"
          onClick={() => setActiveTab('workbench')}
        />

        <StatCard
          title="Early Warning Advance"
          value={`+${leadDays} Days`}
          subvalue="Wastewater vs Hospital Lag"
          icon={Clock}
          trend="Saved ICU Capacity"
          trendDirection="down"
          statusColor="cyan"
          leadBadge="Leading Indicator"
          onClick={() => setActiveTab('simulator')}
        />

        <StatCard
          title="Regional ICU Bed Surge"
          value={`${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%`}
          subvalue={`${currentZone.icuOccupied} / ${currentZone.icuBeds} Beds`}
          icon={BedDouble}
          trend={threatLevel === 'CRITICAL' ? '+18%' : 'Nominal'}
          trendDirection="up"
          statusColor={currentZone.icuOccupied / currentZone.icuBeds > 0.8 ? 'rose' : 'purple'}
          leadBadge="Hospital Surveillance"
          onClick={() => setActiveTab('map')}
        />
      </div>

      {/* Multi-Stream Early Warning Chart */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                <Droplets className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Multi-Stream Lead-Time Discrepancy (Early Warning Advantage)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Observe how <strong className="text-sky-700">Wastewater Genomic Viral Copies</strong> (Blue) spike <strong>3 to 5 days ahead</strong> of <strong className="text-amber-700">Pharmacy OTC Sales</strong> (Amber) and <strong className="text-rose-600">Hospital Emergency Admissions</strong> (Red).
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              Last 14 Days Telemetry
            </span>
            <button
              onClick={() => setActiveTab('workbench')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition cursor-pointer"
            >
              <span>Deep CUSUM Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recharts Multi-Stream Graph (Clean Light Palette) */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 110]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  color: '#0f172a'
                }}
                formatter={(value, name, item) => {
                  if (name === 'Wastewater Genomic RNA') return [`${value}% (Raw: ${item.payload.rawWw.toLocaleString()} copies/L)`, name];
                  if (name === 'Pharmacy OTC Sales') return [`${value}% (Raw: ${item.payload.rawPharm} packs/day)`, name];
                  if (name === 'Hospital ER Admissions') return [`${value}% (Raw: ${item.payload.rawEd} cases)`, name];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {/* Wastewater: Early leading curve (Cyan / Blue) */}
              <Line
                type="monotone"
                dataKey="wastewater"
                name="Wastewater Genomic RNA (Leading +4d)"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0284c7' }}
                activeDot={{ r: 7 }}
              />

              {/* Pharmacy: Secondary curve (Amber) */}
              <Line
                type="monotone"
                dataKey="pharmacy"
                name="Pharmacy OTC Sales (Leading +2d)"
                stroke="#d97706"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#d97706' }}
              />

              {/* Hospital ER Admissions: Lagging clinical curve (Red) */}
              <Line
                type="monotone"
                dataKey="hospitalED"
                name="Hospital ER Admissions (Lagging)"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{ r: 4, fill: '#e11d48' }}
              />

              <ReferenceLine y={75} stroke="#e11d48" strokeDasharray="3 3" label={{ value: 'CRITICAL THRESHOLD', fill: '#e11d48', fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Actionable Protocols & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Automated Action Protocols & Active Alert Triage */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Automated Response Protocol Dispatch
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-rose-700 hover:text-rose-800 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>All Alerts ({alerts.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              EpiSentinel has synthesized algorithmic evidence and generated immediate non-pharmaceutical and clinical intervention protocols:
            </p>

            <div className="space-y-3">
              {criticalAlerts.length > 0 ? (
                criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {alert.severity}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                          {alert.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      {alert.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 text-[11px] text-sky-700 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Lead: +{alert.leadDaysAdvantage} days</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {alert.status === 'ACTIVE_TRIAGE' && (
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'INVESTIGATING')}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => setBroadcastModalAlert(alert)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Broadcast Protocol</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No active critical alerts. System in nominal state.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Protocol adherence compliant with WHO IHR (2005) & CDC EARS guidelines.
            </span>
            <button
              onClick={() => setActiveTab('sitrep')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <span>Generate Official SitRep</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Live Syndromic Waterfall Telemetry */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Activity className="w-4 h-4 animate-pulse" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Real-Time Sensor Telemetry Stream
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live Ingestion (5 Channels)
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Ingesting sub-hourly feeds from Wastewater RT-qPCR samplers, Hospital EHRs, Pharmacy POS systems, and EMS dispatch:
            </p>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {telemetryFeed.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                      <span className="font-bold text-slate-900 truncate">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {item.detail}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      item.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Sampling Latency: <strong className="text-slate-900 font-mono">&lt; 850ms</strong></span>
            <span>Packet Integrity: <strong className="text-emerald-700 font-mono font-bold">100%</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
}
