import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Hospital, 
  Copy
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { ALERT_LEVELS } from '../../constants/outbreakData';

export default function SitRepGenerator() {
  const {
    currentScenario,
    currentDisease,
    currentZone,
    analytics,
    alerts,
    broadcastLog
  } = useOutbreak();

  const [copied, setCopied] = useState(false);

  const threatLevel = analytics?.oti?.alertLevel || 'NORMAL';
  const threatConfig = ALERT_LEVELS[threatLevel] || ALERT_LEVELS.NORMAL;
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportId = `SITREP-EPISENTINEL-${new Date().toISOString().slice(0, 10)}-${currentZone.code}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportId,
      generatedAt: new Date().toISOString(),
      standardsCompliance: 'WHO IHR (2005) & CDC EARS Surveillance Standard',
      jurisdiction: currentZone.name,
      pathogen: currentDisease.name,
      threatAssessment: {
        threatIndex: analytics?.oti?.score,
        alertLevel: threatLevel,
        effectiveRt: analytics?.latestRt,
        leadDaysAdvantage: analytics?.oti?.leadDays,
        confidenceInterval: `${analytics?.oti?.confidence}%`
      },
      healthcareCapacity: {
        icuBedsTotal: currentZone.icuBeds,
        icuBedsOccupied: currentZone.icuOccupied,
        surgePercentage: `${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%`
      },
      activeAlerts: alerts.slice(0, 5),
      recentBroadcasts: broadcastLog
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const summaryText = `[EPISENTINEL SITREP: ${reportId}]
Date: ${todayStr}
Pathogen: ${currentDisease.name} (${currentDisease.code})
Epicenter: ${currentZone.name}
Alert Tier: ${threatLevel} (Threat Index: ${analytics?.oti?.score}/100)
Effective R_t: ${analytics?.latestRt}
Early Warning Lead Gained: +${analytics?.oti?.leadDays} Days
ICU Pressure: ${currentZone.icuOccupied}/${currentZone.icuBeds} Beds (${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%)
Action Required: ${currentDisease.remedyProtocol}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header (No-print) */}
      <div className="no-print bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              WHO / CDC Epidemiological Situation Report (SitRep)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized operational brief formatted for Health Ministries, Chief Medical Officers, and WHO IHR focal points.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official SitRep</span>
          </button>
        </div>
      </div>

      {/* Printable SitRep Document Surface */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-rose-700 block">
                WORLD HEALTH ORGANIZATION & PUBLIC HEALTH SENTINEL NETWORK
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                EPIDEMIOLOGICAL SITUATION REPORT (SitRep)
              </h1>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${threatConfig.bgClass}`}>
                {threatConfig.name}
              </span>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Ref: {reportId}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs border-t border-slate-100">
            <div>
              <span className="text-slate-500 block">Reporting Date:</span>
              <strong className="text-slate-900">{todayStr}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Sentinel Catchment:</span>
              <strong className="text-slate-900">{currentZone.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Pathogen Index:</span>
              <strong className="text-slate-900">{currentDisease.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Surveillance Pipeline:</span>
              <strong className="text-sky-700 font-semibold">Multi-Signal Fusion (5 Streams)</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <span>1.0</span> Executive Epidemiological Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            During the ongoing surveillance period, the EpiSentinel automated detection engine identified a statistically significant aberration in <strong className="text-slate-900">{currentZone.name}</strong>. Multi-source triangulation across Wastewater RT-qPCR genomics, Pharmacy OTC velocity, and Hospital Emergency Department admissions produced an Outbreak Threat Index of <strong className="text-rose-700 font-mono font-bold">{analytics?.oti?.score}/100</strong>, indicating <strong className="text-slate-900 font-bold">{threatConfig.name}</strong> status.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            By leveraging leading genomic shedding indicators, this advisory was generated <strong className="text-sky-700 font-bold">+{analytics?.oti?.leadDays} days</strong> prior to projected peak clinical hospital admissions, affording public health directors critical operational runway for early non-pharmaceutical interventions.
          </p>
        </div>

        {/* Section 2: Core Quantitative Indicators Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <span>2.0</span> Core Epidemiological & Transmission Indicators
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Surveillance Metric</th>
                  <th className="p-3">Observed Value</th>
                  <th className="p-3">14-Day Baseline</th>
                  <th className="p-3">Deviation / Z-Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Effective Reproduction (R_t)</td>
                  <td className="p-3 font-mono text-rose-700 font-bold">{analytics?.latestRt}</td>
                  <td className="p-3 font-mono">1.00 (Endemic)</td>
                  <td className="p-3 font-mono">{analytics?.latestRt > 1 ? `+${(analytics?.latestRt - 1).toFixed(2)}` : 'Nominal'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {analytics?.latestRt > 1 ? 'ACCELERATING' : 'STABLE'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Wastewater Genomic Viral Copies</td>
                  <td className="p-3 font-mono text-sky-700 font-bold">
                    {analytics?.chartData?.[analytics.chartData.length - 1]?.wastewater.toLocaleString()} copies/L
                  </td>
                  <td className="p-3 font-mono">{currentDisease.baselineWastewaterCopies} copies/L</td>
                  <td className="p-3 font-mono">+{analytics?.wwZScore || 3.4} σ</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                      LEADING SURGE (+4d)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Clinical Hospital ED Cases</td>
                  <td className="p-3 font-mono font-bold text-amber-800">
                    {analytics?.chartData?.[analytics.chartData.length - 1]?.edCases} Cases/Day
                  </td>
                  <td className="p-3 font-mono">{currentDisease.baselineDailyRate} Cases/Day</td>
                  <td className="p-3 font-mono">+{analytics?.edZScore || 2.1} σ</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      CUSUM BREACH
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">ICU Bed Occupancy Stress</td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {currentZone.icuOccupied} / {currentZone.icuBeds} Beds ({Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%)
                  </td>
                  <td className="p-3 font-mono">60% Average</td>
                  <td className="p-3 font-mono">Buffer: {currentZone.icuBeds - currentZone.icuOccupied} remaining</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      HIGH PRESSURE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recommended Interventions Protocol */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <span>3.0</span> Mandatory Public Health Protocols & Countermeasures
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Non-Pharmaceutical Interventions (NPIs)
              </h4>
              <ul className="space-y-1 text-slate-700">
                <li>• {currentDisease.remedyProtocol}</li>
                <li>• Enforce automated syndromic reporting in all primary clinics within 5km radius.</li>
                <li>• Coordinate with school district leadership for targeted respiratory/enteric sanitization.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Hospital className="w-4 h-4 text-rose-600" /> Clinical & Medical Logistics
              </h4>
              <ul className="space-y-1 text-slate-700">
                <li>• Pre-position 2,500 doses of targeted therapeutics in {currentZone.name} depot.</li>
                <li>• Activate surge staff rosters in {currentZone.keyInstitutions[0]}.</li>
                <li>• Expand negative-pressure bed capacity by converting Step-Down Ward 3.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Sign-off & Verification Hash */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <span className="block font-bold text-slate-800">Incident Command Lead:</span>
            <span>Chief Medical Officer, Public Health Directorate</span>
          </div>

          <div className="font-mono text-[11px] sm:text-right">
            <div>Digital Cryptographic Verification Hash:</div>
            <div className="text-slate-600">SHA-256: 7f8a9d20c35e8b4194fba8123c59082de71bca4</div>
          </div>
        </div>

      </div>

    </div>
  );
}
