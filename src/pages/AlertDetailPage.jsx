import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  FileText
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import { DISEASES, SURVEILLANCE_ZONES } from '../constants/outbreakData';
import PageHeader from '../components/common/PageHeader';

export default function AlertDetailPage() {
  const { id } = useParams();
  const { alerts, updateAlertStatus } = useOutbreak();

  const alert = alerts.find(a => a.id === id) || alerts[0];

  if (!alert) {
    return (
      <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-neutral-900">Incident Not Found</h3>
        <p className="text-xs text-neutral-500">The requested outbreak incident does not exist or has been archived.</p>
        <Link
          to="/alerts"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Alerts Queue</span>
        </Link>
      </div>
    );
  }

  const zoneObj = SURVEILLANCE_ZONES.find(z => z.name === alert.zone) || SURVEILLANCE_ZONES[0];
  const diseaseObj = DISEASES.find(d => d.name === alert.disease) || DISEASES[0];

  return (
    <div className="space-y-6 sm:space-y-8 font-mono">
      <PageHeader
        title={alert.title}
        subtitle={`Incident ID: ${alert.id} • Registered ${alert.timestamp} • Lead Advantage: +${alert.leadDaysAdvantage} Days`}
        backTo="/alerts"
        backLabel="Back to Alerts Queue"
        badge={alert.severity}
        actions={
          <div className="flex items-center space-x-2">
            <Link
              to={`/broadcast?alertId=${alert.id}`}
              className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Emergency Broadcast</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Clinical Dossier & Signals (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incident Overview Card (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Epidemiological Case Dossier
            </h3>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {alert.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Pathogen</span>
                <span className="text-xs font-bold text-neutral-900">{alert.disease}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Surveillance Sector</span>
                <span className="text-xs font-bold text-neutral-900">{alert.zone}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Early Lead Time</span>
                <span className="text-xs font-bold text-neutral-900 font-mono">+{alert.leadDaysAdvantage} Days</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Triage Status</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                  alert.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  alert.status === 'DISPATCHED' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                  alert.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          </div>

          {/* Pathogen Biology & Transmission Profile */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Pathogen Profile & Clinical Indicators
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Category</span>
                <strong className="text-neutral-900">{diseaseObj.category}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Transmission Vector</span>
                <strong className="text-neutral-900">{diseaseObj.transmission}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-500 block text-[11px]">Incubation Period</span>
                <strong className="text-neutral-900">{diseaseObj.incubationDays}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-neutral-500">
                Syndromic Presentation
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {diseaseObj.symptoms.map((sym, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-800">
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Action Protocols */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Recommended Clinical Containment Protocols
            </h3>

            <div className="space-y-2.5">
              {(alert.recommendedActions || [
                diseaseObj.remedyProtocol,
                'Activate hospital surge capacity and negative-pressure wards',
                'Deploy field epidemiological team for biological confirmation'
              ]).map((action, i) => (
                <div key={i} className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-neutral-800 font-medium leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Triage Operations & Sector Telemetry */}
        <div className="space-y-6">
          
          {/* Triage Status Control (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Triage Lifecycle Management
            </h4>

            <div className="space-y-2">
              {[
                { status: 'ACTIVE_TRIAGE', label: '1. Active Triage' },
                { status: 'INVESTIGATING', label: '2. Under Investigation' },
                { status: 'DISPATCHED', label: '3. Response Dispatched' },
                { status: 'RESOLVED', label: '4. Resolved & Contained' }
              ].map((step) => (
                <button
                  key={step.status}
                  onClick={() => updateAlertStatus(alert.id, step.status)}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                    alert.status === step.status
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80'
                  }`}
                >
                  <span>{step.label}</span>
                  {alert.status === step.status && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Capacity Card (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Sector Catchment Health Capacity
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Population:</span>
                <strong className="text-neutral-900 font-mono">{zoneObj.population.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Hospitals:</span>
                <strong className="text-neutral-900">{zoneObj.hospitals} Facilities</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">ICU Capacity:</span>
                <strong className="text-neutral-900 font-mono">{zoneObj.icuOccupied} / {zoneObj.icuBeds} Beds</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Wastewater Node:</span>
                <strong className="text-neutral-900 truncate max-w-[170px]">{zoneObj.wastewaterPlant}</strong>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <Link
              to={`/broadcast?alertId=${alert.id}`}
              className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Emergency Warning</span>
            </Link>

            <Link
              to="/sitrep"
              className="w-full py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Official SitRep</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
