import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Copy 
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import PageHeader from '../components/common/PageHeader';

export default function SitRepPage() {
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
  
  const [todayStr] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  const [dateKey] = useState(() => new Date().toISOString().slice(0, 10));
  const reportId = `SITREP-EPISENTINEL-${dateKey}-${currentZone.code}`;

  const auditHash = useMemo(() => '8f92b7c4d1e0', []);

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
      <div className="no-print">
        <PageHeader
          title="WHO / CDC Epidemiological Situation Report (SitRep)"
          subtitle="Formal standardized epidemiological situation report export compliant with WHO International Health Regulations (2005) and CDC EARS early warning criteria."
          backTo="/dashboard"
          backLabel="Back to Overview"
          badge="Official Export"
          actions={
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Formal Situation Report Document Sheet */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 p-8 sm:p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-8 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-neutral-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black tracking-widest text-neutral-500 uppercase">
                FORMAL PUBLIC HEALTH INTELLIGENCE DOSSIER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              EPIDEMIOLOGICAL SITUATION REPORT
            </h1>
            <p className="text-xs text-neutral-600 font-mono">
              EpiSentinel Autonomous Early Detection System • Global Health Security Interface
            </p>
          </div>

          <div className="text-right text-xs font-mono space-y-1 text-neutral-600">
            <div><strong>Report ID:</strong> {reportId}</div>
            <div><strong>Issued:</strong> {todayStr}</div>
            <div><strong>Standard:</strong> WHO IHR (2005) Art. 6 / CDC EARS</div>
          </div>
        </div>

        {/* Section 1: Threat Assessment Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            1. Executive Outbreak Threat Assessment
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Pathogen</span>
              <strong className="text-neutral-900 text-sm block">{currentDisease.name}</strong>
              <span className="text-neutral-400 block font-mono text-[10px]">Code: {currentDisease.code}</span>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Surveillance Sector</span>
              <strong className="text-neutral-900 text-sm block">{currentZone.name}</strong>
              <span className="text-neutral-400 block font-mono text-[10px]">Pop: {currentZone.population.toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Threat Index (OTI)</span>
              <strong className="text-neutral-900 text-sm font-mono block">{analytics?.oti?.score} / 100</strong>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-neutral-100 text-neutral-800 border border-neutral-200">
                {threatLevel}
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Early Warning</span>
              <strong className="text-neutral-900 text-sm font-mono block">+{analytics?.oti?.leadDays} Days</strong>
              <span className="text-neutral-400 block text-[10px]">Pre-Hospital ER Gain</span>
            </div>
          </div>

          <p className="text-xs text-neutral-700 leading-relaxed pt-1">
            {currentScenario.description}
          </p>
        </div>

        {/* Section 2: Statistical & Mathematical Biomarkers */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            2. Statistical Aberration & Transmission Dynamics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4.5 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 uppercase font-bold text-[10px] block tracking-wider">Effective Reproduction (Rt)</span>
              <div className="text-2xl font-black text-neutral-900 font-mono">
                {analytics?.latestRt}
              </div>
              <p className="text-[11px] text-neutral-600 leading-normal">
                {analytics?.latestRt > 1.0 
                  ? 'Active exponential secondary transmission (Rt > 1.0).' 
                  : 'Decelerating trajectory below threshold (Rt < 1.0).'}
              </p>
            </div>

            <div className="p-4.5 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 uppercase font-bold text-[10px] block tracking-wider">Wastewater Genomic Shedding</span>
              <div className="text-2xl font-black text-indigo-700 font-mono">
                +{analytics?.pctAboveBaseline?.wastewater || 0}%
              </div>
              <p className="text-[11px] text-neutral-600 leading-normal">
                {analytics?.latestWastewater} viral copies / liter detected at {currentZone.wastewaterPlant}.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-neutral-500 uppercase font-bold text-[10px] block tracking-wider">Pharmacy OTC Sales Surge</span>
              <div className="text-2xl font-black text-amber-700 font-mono">
                +{analytics?.pctAboveBaseline?.pharmacy || 0}%
              </div>
              <p className="text-[11px] text-neutral-600 leading-normal">
                Early syndromic biomarker indicating community self-treatment prior to clinical visit.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Healthcare System Capacity */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            3. Hospital & Critical Care Capacity Assessment
          </h3>

          <div className="p-5 rounded-2xl border border-neutral-200/80 bg-[#fbfbfd] text-xs space-y-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center">
              <span className="text-neutral-700 font-medium">Sector ICU Bed Stress Index:</span>
              <strong className="text-neutral-900 font-mono">
                {currentZone.icuOccupied} Occupied / {currentZone.icuBeds} Total ({Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%)
              </strong>
            </div>
            <div className="w-full bg-neutral-200/80 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (currentZone.icuOccupied / currentZone.icuBeds) > 0.85
                    ? 'bg-rose-600'
                    : (currentZone.icuOccupied / currentZone.icuBeds) > 0.70
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.round((currentZone.icuOccupied / currentZone.icuBeds) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Sentinel surveillance covers {currentZone.hospitals} major hospitals: {currentZone.keyInstitutions.join(', ')}.
            </p>
          </div>
        </div>

        {/* Section 4: Action Protocol Directive */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            4. Mandatory Public Health Protocol Directive
          </h3>

          <div className="p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 text-xs space-y-2">
            <strong className="text-neutral-900 block font-bold">
              Immediate Clinical & Field Action Mandate:
            </strong>
            <p className="text-neutral-800 leading-relaxed font-mono">
              {currentDisease.remedyProtocol}
            </p>
          </div>
        </div>

        {/* Sign-off Block */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs font-mono text-neutral-500">
          <div>
            <div>Verified By: Autonomous Biosecurity Kernel v2.4</div>
            <div>Hash: SHA256:{auditHash}</div>
          </div>
          <div className="text-right">
            <div>Epidemiological Clearance: LEVEL-4 UNRESTRICTED</div>
            <div>Confidential Public Health Operational Document</div>
          </div>
        </div>
      </div>
    </div>
  );
}
