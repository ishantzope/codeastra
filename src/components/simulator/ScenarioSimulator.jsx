import React, { useState } from 'react';
import { 
  Sliders, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Droplets, 
  Pill, 
  Hospital, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { HACKATHON_SCENARIOS, DISEASES, SURVEILLANCE_ZONES } from '../../constants/outbreakData';
import { generateBaselineHistory, applyScenarioSurge } from '../../services/simulationEngine';

export default function ScenarioSimulator() {
  const {
    selectedScenarioId,
    switchScenario,
    currentScenario,
    setRawHistory,
    selectedDiseaseId,
    selectedZoneId,
    analytics,
    setActiveTab
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
      name: `Custom Simulated Outbreak`,
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
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Sliders className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Outbreak Simulation & Scenario Injector
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Evaluate EpiSentinel's early aberration detection capabilities under authentic simulated disease trajectories. Test single-variable spikes or choose from curated multi-district outbreak benchmark scenarios.
        </p>
      </div>

      {/* Curated Pre-configured Scenarios */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Curated Outbreak Benchmark Scenarios
          </h3>
          <button
            onClick={handleResetBaseline}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Clean Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HACKATHON_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            const disease = DISEASES.find(d => d.id === sc.diseaseId);
            const zone = SURVEILLANCE_ZONES.find(z => z.id === sc.zoneId);

            return (
              <div
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{sc.name}</h4>
                  {sc.projectedLeadDays > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
                      +{sc.projectedLeadDays}d Lead Time
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Normal
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {sc.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Target Zone: <strong className="text-slate-800">{zone?.name}</strong></span>
                  <div className="flex items-center space-x-1.5 font-bold text-rose-600">
                    <span>{isSelected ? 'Currently Active' : 'Inject Scenario'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Synthetic Anomaly Injector */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Custom Outbreak Parameter Injector
            </h3>
            <p className="text-xs text-slate-500">
              Customize epidemiological parameters to stress-test CUSUM sensitivity and alert generation.
            </p>
          </div>

          {injectionSuccess && (
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Outbreak Surge Injected!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Selectors */}
          <div className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Pathogen</label>
              <select
                value={customDiseaseId}
                onChange={(e) => setCustomDiseaseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer font-medium"
              >
                {DISEASES.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Metropolitan Sector</label>
              <select
                value={customZoneId}
                onChange={(e) => setCustomZoneId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer font-medium"
              >
                {SURVEILLANCE_ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name} (Pop: {z.population.toLocaleString()})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Wastewater Multiplier */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" /> Wastewater Shedding Surge
                </span>
                <span className="font-mono text-sky-700 font-bold">{customWastewaterMult.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={customWastewaterMult}
                onChange={(e) => setCustomWastewaterMult(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Pharmacy OTC Multiplier */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-amber-600" /> Pharmacy OTC Antipyretic Surge
                </span>
                <span className="font-mono text-amber-700 font-bold">{customPharmacyMult.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.2"
                value={customPharmacyMult}
                onChange={(e) => setCustomPharmacyMult(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Clinical ED Admissions Multiplier */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-rose-600" /> Hospital ER Surge Multiplier
                </span>
                <span className="font-mono text-rose-700 font-bold">{customEdMult.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.2"
                value={customEdMult}
                onChange={(e) => setCustomEdMult(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Injection Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Injecting triggers real-time CUSUM recalculation across all tabs and models.
          </span>
          <button
            onClick={handleInjectCustom}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Inject Custom Synthetic Outbreak</span>
          </button>
        </div>
      </div>

    </div>
  );
}
