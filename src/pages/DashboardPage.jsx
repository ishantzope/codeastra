import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  BedDouble, 
  Droplets, 
  Send, 
  ArrowRight, 
  Activity, 
  Layers,
  ShieldAlert,
  ChevronRight
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
import { useOutbreak } from '../context/useOutbreak';
import StatCard from '../components/common/StatCard';
import { ALERT_LEVELS } from '../constants/outbreakData';

export default function DashboardPage() {
  const {
    analytics,
    currentScenario,
    currentDisease,
    currentZone,
    alerts,
    telemetryFeed
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
    <div className="space-y-6 sm:space-y-8">
      
      {/* Executive Command Strip (Apple Card, Spacious & Focused) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500 mb-1.5 flex-wrap gap-y-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-neutral-800 uppercase tracking-wider">{currentZone.name} ({currentZone.code})</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-700">{currentDisease.name}</span>
            <span className="text-neutral-300">•</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${threatConfig.bgClass}`}>
              {threatConfig.name}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 font-mono">
            {threatLevel === 'CRITICAL' && 'Critical Epidemic Cluster Imminent — Emergency Bio-Surveillance Active'}
            {threatLevel === 'WARNING' && 'Outbreak Trajectory Accelerated — Concordant Secondary Signals'}
            {threatLevel === 'ADVISORY' && 'Pre-Hospital Syndromic Cluster Detected — Early Lead Gained'}
            {threatLevel === 'WATCH' && 'Surveillance Watch Active — Low-Level Pathogen Anomaly'}
            {threatLevel === 'NORMAL' && 'Nominal Baseline Surveillance — Stable Poisson Bounds'}
          </h1>
          
          <p className="text-xs text-neutral-500 mt-1 max-w-3xl line-clamp-1 font-mono">
            {currentScenario.summary}
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/workbench"
            className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-200/80 transition shadow-2xs"
          >
            Analytics
          </Link>
          <Link
            to="/surveillance"
            className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-200/80 transition shadow-2xs"
          >
            GIS Map
          </Link>
          <Link
            to="/broadcast"
            className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </Link>
        </div>
      </div>

      {/* 5 High-Density Surveillance KPI Cards (Clean, Apple-Style Typography) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        
        {/* Metric 1: Threat Index (OTI) */}
        <StatCard
          title="Threat Index (OTI)"
          value={`${otiScore} / 100`}
          subvalue={threatConfig.name}
          icon={ShieldAlert}
          iconColor="rose"
          trend={otiScore >= 70 ? 'CRITICAL' : otiScore >= 40 ? 'ELEVATED' : 'STABLE'}
          trendDirection={otiScore >= 50 ? 'up' : 'down'}
          trendType={otiScore >= 70 ? 'danger' : otiScore >= 40 ? 'warning' : 'success'}
        />

        {/* Metric 2: Early Warning Gain */}
        <StatCard
          title="Early Warning Gain"
          value={`+${leadDays} Days`}
          subvalue="vs Clinical ER visits"
          icon={Clock}
          iconColor="sky"
          trend="+1.2d"
          trendDirection="up"
          trendType="info"
        />

        {/* Metric 3: Reproduction Number */}
        <StatCard
          title="Reproduction (Rt)"
          value={latestRt}
          subvalue={latestRt > 1.0 ? 'Exponential Spread' : 'Decelerating'}
          icon={TrendingUp}
          iconColor={latestRt > 1.0 ? 'rose' : 'emerald'}
          trend={latestRt > 1.0 ? 'Rt > 1.0' : 'Rt < 1.0'}
          trendDirection={latestRt > 1.0 ? 'up' : 'down'}
          trendType={latestRt > 1.0 ? 'danger' : 'success'}
        />

        {/* Metric 4: Wastewater Genomics */}
        <StatCard
          title="Wastewater (WBE)"
          value={`${analytics?.latestWastewater || 450} cp/L`}
          subvalue="Viral Copies / Liter"
          icon={Droplets}
          iconColor="indigo"
          trend={`+${analytics?.pctAboveBaseline?.wastewater || 0}%`}
          trendDirection="up"
          trendType="warning"
        />

        {/* Metric 5: ICU Bed Pressure */}
        <StatCard
          title="ICU Occupancy"
          value={`${currentZone.icuOccupied} / ${currentZone.icuBeds}`}
          subvalue={`${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}% Sector Pressure`}
          icon={BedDouble}
          iconColor="amber"
          trend={`${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%`}
          trendDirection="up"
          trendType="danger"
        />
      </div>

      {/* Primary Chart: Prominent Multi-Stream Anomaly Divergence Timeline */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight font-mono">
                Multi-Stream Anomaly Divergence Timeline (14 Days)
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Comparative normalized index (0–100%) tracking early wastewater genomic shedding and OTC sales against lagging clinical ER admissions.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono text-neutral-600 bg-neutral-100 border border-neutral-200/80">
              Normalized Index (0–100%)
            </span>
            <Link
              to="/workbench"
              className="text-xs font-semibold text-neutral-700 hover:text-black transition flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-neutral-100"
            >
              <span>Workbench</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recharts Canvas with Generous Height & Spacious Legend */}
        <div className="h-[360px] sm:h-[400px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 12, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e4e4e7" strokeOpacity={0.7} />
              <XAxis 
                dataKey="date" 
                stroke="#a1a1aa" 
                tick={{ fontSize: 11, fill: '#71717a' }} 
                tickLine={false}
                axisLine={{ stroke: '#e4e4e7' }}
              />
              <YAxis 
                stroke="#a1a1aa" 
                tick={{ fontSize: 11, fill: '#71717a' }} 
                tickLine={false}
                axisLine={false}
                unit="%" 
                domain={[0, 100]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e5ea',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#1d1d1f',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  padding: '12px 14px'
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="left"
                wrapperStyle={{ paddingBottom: '20px', paddingTop: '0px', fontSize: '12px', fontFamily: 'monospace' }} 
              />

              <ReferenceLine 
                y={50} 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                label={{ value: 'Aberration Threshold (50%)', fill: '#64748b', fontSize: 10, position: 'insideTopRight' }} 
              />

              {/* Wastewater Genomic Shedding Line (Soft Indigo) */}
              <Line
                type="monotone"
                dataKey="wastewater"
                name="Wastewater Genomics (Leading: +4.2d)"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#6366f1' }}
                activeDot={{ r: 6 }}
              />

              {/* OTC Pharmacy Sales Velocity (Soft Amber) */}
              <Line
                type="monotone"
                dataKey="pharmacy"
                name="Pharmacy OTC Velocity (Leading: +2.8d)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: '#f59e0b' }}
                activeDot={{ r: 6 }}
              />

              {/* Hospital Emergency Department Admissions (Soft Rose) */}
              <Line
                type="monotone"
                dataKey="hospitalED"
                name="Clinical ED Admissions (Lagging Anchor)"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={{ r: 3.5, fill: '#f43f5e' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Lower Section: High-Priority Incidents & Real-Time Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        
        {/* Left: High-Priority Incidents (Apple Card, Clean List Divider Layout) */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-mono">
                  High-Priority Incident Queue
                </h3>
              </div>
              <Link
                to="/alerts"
                className="text-xs text-neutral-600 hover:text-black font-semibold flex items-center space-x-1 transition px-3 py-1 rounded-full hover:bg-neutral-100 font-mono"
              >
                <span>View All ({alerts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Subtle Divider List */}
            <div className="divide-y divide-neutral-100 font-mono">
              {criticalAlerts.length > 0 ? (
                criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="py-3.5 first:pt-0 last:pb-0 space-y-2 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border shrink-0 ${
                          alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          alert.severity === 'WARNING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {alert.severity}
                        </span>
                        <Link 
                          to={`/alerts/${alert.id}`}
                          className="text-xs font-bold text-neutral-900 hover:underline truncate"
                        >
                          {alert.title}
                        </Link>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {alert.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                        Lead Gain: <strong className="text-neutral-800">+{alert.leadDaysAdvantage}d</strong>
                      </span>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/alerts/${alert.id}`}
                          className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold transition border border-neutral-200/80"
                        >
                          Inspect
                        </Link>
                        <Link
                          to={`/broadcast?alertId=${alert.id}`}
                          className="px-3 py-1 rounded-full bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold flex items-center space-x-1.5 transition shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Broadcast</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-neutral-500 text-xs font-mono">
                  No active critical alerts. System in nominal state.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>WHO IHR (2005) & CDC EARS compliant</span>
            <Link
              to="/sitrep"
              className="text-neutral-800 hover:text-black font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-full hover:bg-neutral-100"
            >
              <span>SitRep Report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right: Live Syndromic Waterfall Telemetry (Apple Card) */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-mono">
                  Real-Time Syndromic Telemetry Stream
                </h3>
              </div>
              <span className="flex items-center space-x-1.5 text-xs text-neutral-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Continuous Feed</span>
              </span>
            </div>

            {/* Clean Feed List with subtle divider */}
            <div className="divide-y divide-neutral-100 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
              {telemetryFeed.slice(0, 7).map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-neutral-700"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-neutral-400 text-[10px] whitespace-nowrap shrink-0">
                      {item.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      item.source?.includes('Wastewater') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      item.source?.includes('Pharmacy') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      item.source?.includes('Hospital') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}>
                      {item.source}
                    </span>
                    <span className="text-neutral-900 font-medium truncate">
                      {item.metric}: <strong className="text-neutral-900">{item.value}</strong> {item.unit}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border shrink-0 ${
                    item.anomalyLevel === 'ANOMALY_HIGH'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}>
                    Z={item.zScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Automated RT-qPCR & EHR Ingestion Node</span>
            <Link to="/simulator" className="text-neutral-800 hover:text-black font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-full hover:bg-neutral-100">
              <span>Inject Scenario</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
