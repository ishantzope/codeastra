import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Layers, 
  FileCode2, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import { DISEASES, SURVEILLANCE_ZONES } from '../constants/outbreakData';
import PageHeader from '../components/common/PageHeader';

export default function ManualAlertPage() {
  const navigate = useNavigate();
  const { createManualAlert } = useOutbreak();

  const [title, setTitle] = useState('Anomalous Syndromic Cluster Detected');
  const [disease, setDisease] = useState(DISEASES[0].name);
  const [zone, setZone] = useState(SURVEILLANCE_ZONES[0].name);
  const [severity, setSeverity] = useState('WARNING');
  const [summary, setSummary] = useState(
    'Rapid wastewater viral copy elevation observed across municipal outfall with concordant antipyretic OTC sales spikes. Immediate field team sampling recommended.'
  );

  const [wastewaterMult, setWastewaterMult] = useState(3.5);
  const [pharmacyMult, setPharmacyMult] = useState(2.4);
  const [clinicalMult, setClinicalMult] = useState(1.2);

  const [actions, setActions] = useState([
    'Collect confirmatory nasopharyngeal / biological samples for RT-qPCR sequencing',
    'Audit municipal hospital negative pressure ICU bed readiness',
    'Issue preliminary health alert to regional Chief Medical Officers'
  ]);
  const [newActionText, setNewActionText] = useState('');

  const selectedZoneObj = SURVEILLANCE_ZONES.find(z => z.name === zone) || SURVEILLANCE_ZONES[0];
  const selectedDiseaseObj = DISEASES.find(d => d.name === disease) || DISEASES[0];

  const handleAddAction = (e) => {
    e.preventDefault();
    if (newActionText.trim()) {
      setActions([...actions, newActionText.trim()]);
      setNewActionText('');
    }
  };

  const handleRemoveAction = (index) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createManualAlert({
      title: title.trim(),
      disease,
      zone,
      severity,
      summary: summary.trim(),
      actions
    });

    navigate('/alerts');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Field Outbreak Alert"
        subtitle="Dedicated operational workflow to configure and register a formal epidemiological incident alert into the multi-stream surveillance system."
        backTo="/alerts"
        backLabel="Back to Alerts Queue"
        badge="New Incident Workflow"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Fields (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Identification */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200/80">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span>1. Incident Classification & Scope</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Alert Title / Headline
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cluster of Acute Viral Gastroenteritis in Zone B"
                  className="w-full px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#fbfbfd] border border-neutral-300/80 text-neutral-900 text-xs focus:outline-none focus:border-black font-semibold shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Target Pathogen
                  </label>
                  <select
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-[#fbfbfd] border border-neutral-300/80 text-neutral-900 text-xs font-bold focus:outline-none focus:border-black cursor-pointer shadow-xs"
                  >
                    {DISEASES.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Surveillance Sector
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-[#fbfbfd] border border-neutral-300/80 text-neutral-900 text-xs font-bold focus:outline-none focus:border-black cursor-pointer shadow-xs"
                  >
                    {SURVEILLANCE_ZONES.map(z => (
                      <option key={z.id} value={z.name}>
                        {z.name} ({z.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Severity Tier
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-[#fbfbfd] border border-neutral-300/80 text-neutral-900 text-xs font-bold focus:outline-none focus:border-black cursor-pointer shadow-xs"
                  >
                    <option value="CRITICAL">CRITICAL EMERGENCY</option>
                    <option value="WARNING">WARNING (Tier-3)</option>
                    <option value="ADVISORY">ADVISORY (Tier-2)</option>
                    <option value="WATCH">WATCH (Tier-1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Clinical & Syndromic Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe observed syndromic anomalies, laboratory findings, or early warnings..."
                  className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-[#fbfbfd] border border-neutral-300/80 text-neutral-900 text-xs focus:outline-none focus:border-black leading-relaxed shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Stream Signal Deviations */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200/80">
                <Layers className="w-4 h-4" />
              </span>
              <span>2. Multi-Signal Anomaly Multipliers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700">Wastewater Viral Load</span>
                  <span className="font-mono font-bold text-indigo-700">{wastewaterMult}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={wastewaterMult}
                  onChange={(e) => setWastewaterMult(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block font-mono">
                  +{Math.round((wastewaterMult - 1) * 100)}% above baseline
                </span>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700">Pharmacy OTC Velocity</span>
                  <span className="font-mono font-bold text-amber-700">{pharmacyMult}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={pharmacyMult}
                  onChange={(e) => setPharmacyMult(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block font-mono">
                  +{Math.round((pharmacyMult - 1) * 100)}% above baseline
                </span>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700">Hospital ED Surge</span>
                  <span className="font-mono font-bold text-rose-700">{clinicalMult}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={clinicalMult}
                  onChange={(e) => setClinicalMult(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block font-mono">
                  +{Math.round((clinicalMult - 1) * 100)}% above baseline
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Recommended Containment Protocols */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200/80">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span>3. Recommended Containment Actions</span>
            </h3>

            <div className="space-y-2.5">
              {actions.map((act, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 text-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <span className="text-neutral-800 font-medium">{act}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(index)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-rose-600 hover:bg-neutral-200 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  placeholder="Add custom response protocol..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#fbfbfd] border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-black shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAction}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Incident Payload Preview & Dispatch Actions */}
        <div className="space-y-6">
          
          {/* Catchment & Impact Overview */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Sector Impact Estimation
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Catchment Population:</span>
                <strong className="text-neutral-900 font-mono">{selectedZoneObj.population.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Sentinel Hospitals:</span>
                <strong className="text-neutral-900 font-mono">{selectedZoneObj.hospitals} Facilities</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">ICU Bed Pressure:</span>
                <strong className="text-neutral-900 font-mono">{selectedZoneObj.icuOccupied}/{selectedZoneObj.icuBeds} ({Math.round((selectedZoneObj.icuOccupied / selectedZoneObj.icuBeds) * 100)}%)</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Est. Early Lead Gain:</span>
                <strong className="text-neutral-900 font-mono text-emerald-700">+{selectedDiseaseObj.earlyWarningLeadDays} Days</strong>
              </div>
            </div>
          </div>

          {/* JSON Payload Preview */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Payload Preview</span>
              </h4>
              <span className="text-[10px] font-mono text-neutral-400">RFC-7946 GeoJSON</span>
            </div>

            <pre className="p-4 rounded-2xl bg-[#1d1d1f] text-neutral-300 font-mono text-[10px] overflow-x-auto max-h-56 leading-relaxed">
{JSON.stringify({
  eventType: "EPIDEMIOLOGICAL_ALERT",
  id: "alt-manual-staged",
  timestamp: "LIVE_STAGING_BUFFER",
  headline: title,
  pathogen: disease,
  sector: zone,
  severity,
  multipliers: {
    wastewater: wastewaterMult,
    pharmacy: pharmacyMult,
    edSurge: clinicalMult
  },
  actionCount: actions.length
}, null, 2)}
            </pre>
          </div>

          {/* Submit Actions */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Alert to Surveillance Queue</span>
            </button>

            <Link
              to="/alerts"
              className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs"
            >
              <span>Cancel & Discard</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
