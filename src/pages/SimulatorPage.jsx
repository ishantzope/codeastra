import React, { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import { HACKATHON_SCENARIOS, DISEASES, SURVEILLANCE_ZONES } from '../constants/outbreakData';
import { generateBaselineHistory, applyScenarioSurge } from '../services/simulationEngine';
import PageHeader from '../components/common/PageHeader';

export default function SimulatorPage() {
  const {
    selectedScenarioId,
    switchScenario,
    setRawHistory,
    selectedDiseaseId,
    selectedZoneId
  } = useOutbreak();

  // Custom simulation injection parameters
  const [customDiseaseId, setCustomDiseaseId] = useState(selectedDiseaseId);
  const [customZoneId, setCustomZoneId] = useState(selectedZoneId);
  const [customWastewaterMult, setCustomWastewaterMult] = useState(4.2);
  const [customPharmacyMult, setCustomPharmacyMult] = useState(3.0);
  const [customEdMult, setCustomEdMult] = useState(2.8);
  const [customRt, setCustomRt] = useState(2.2);

  const [injectionSuccess, setInjectionSuccess] = useState(false);

  const handleInjectCustom = () => {
    const customScenario = {
      id: `custom-${Date.now()}`,
      name: `Custom Injected Trajectory`,
      diseaseId: customDiseaseId,
      zoneId: customZoneId,
      summary: `Custom outbreak surge injected: Wastewater +${Math.round((customWastewaterMult - 1) * 100)}%, Pharmacy +${Math.round((customPharmacyMult - 1) * 100)}%, ED Cases +${Math.round((customEdMult - 1) * 100)}%.`,
      initialWastewaterMult: customWastewaterMult,
      initialPharmacyMult: customPharmacyMult,
      initialEdMult: customEdMult,
      targetRt: customRt,
      projectedLeadDays: 4.0
    };

    const base = generateBaselineHistory(customDiseaseId, customZoneId, 30);
    const surged = applyScenarioSurge(base, customScenario);
    setRawHistory(surged);

    setInjectionSuccess(true);
    setTimeout(() => setInjectionSuccess(false), 2500);
  };

  const handleResetBaseline = () => {
    switchScenario('scenario-baseline-normal');
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-mono">
      <PageHeader
        title="Outbreak Simulation & Scenario Injector"
        subtitle="Evaluate EpiSentinel's multi-stream aberration detection capabilities under authentic simulated disease trajectories or inject custom biological multipliers."
        badge="Operations Sandbox"
        actions={
          <button
            onClick={handleResetBaseline}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Clean Baseline</span>
          </button>
        }
      />

      {/* Confirmation Banner */}
      {injectionSuccess && (
        <div className="p-4 rounded-2xl sm:rounded-3xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-sm block text-emerald-950">Custom Surge Injected Successfully</span>
            Surveillance history and multi-signal control charts updated in real time.
          </div>
        </div>
      )}

      {/* Curated Pre-configured Benchmark Scenarios */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-mono">
          Curated Outbreak Benchmark Scenarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {HACKATHON_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                className={`p-6 rounded-2xl sm:rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-black shadow-md'
                    : 'bg-white hover:bg-neutral-50/80 text-neutral-900 border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold tracking-tight">{sc.name}</h4>
                    {isSelected && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500 text-white shrink-0">
                        ACTIVE SCENARIO
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {sc.summary}
                  </p>
                </div>

                <div className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
                  isSelected ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-500'
                }`}>
                  <span>Target Rt: {sc.targetRt}</span>
                  <span>Early Lead: +{sc.projectedLeadDays} Days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Synthetic Trajectory Injector Panel (Apple Card) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
        <div className="pb-3 border-b border-neutral-100">
          <h3 className="text-base font-bold text-neutral-900 tracking-tight font-mono">
            Custom Synthetic Trajectory Injector
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 font-mono">
            Manually calibrate biological signal deviations to test CUSUM and Farrington alert trigger thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Target Pathogen
            </label>
            <select
              value={customDiseaseId}
              onChange={(e) => setCustomDiseaseId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold focus:outline-none focus:border-black cursor-pointer font-mono"
            >
              {DISEASES.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Surveillance Sector
            </label>
            <select
              value={customZoneId}
              onChange={(e) => setCustomZoneId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold focus:outline-none focus:border-black cursor-pointer font-mono"
            >
              {SURVEILLANCE_ZONES.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Target Rt Reproduction Rate
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="4.0"
              value={customRt}
              onChange={(e) => setCustomRt(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2 rounded-2xl bg-neutral-50 border border-neutral-300 text-neutral-900 font-mono font-bold focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleInjectCustom}
              className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Inject Custom Surge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sliders for Multipliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Wastewater Multiplier</span>
              <span className="font-mono text-indigo-600">{customWastewaterMult}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={customWastewaterMult}
              onChange={(e) => setCustomWastewaterMult(parseFloat(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <span className="text-[10px] text-neutral-500 block">Viral copies shedding surge</span>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Pharmacy OTC Velocity</span>
              <span className="font-mono text-amber-600">{customPharmacyMult}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={customPharmacyMult}
              onChange={(e) => setCustomPharmacyMult(parseFloat(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <span className="text-[10px] text-neutral-500 block">Antipyretic / ORS purchase spike</span>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Clinical ED Surge</span>
              <span className="font-mono text-rose-600">{customEdMult}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={customEdMult}
              onChange={(e) => setCustomEdMult(parseFloat(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <span className="text-[10px] text-neutral-500 block">Emergency room admission increase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
