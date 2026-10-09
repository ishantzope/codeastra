import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  Smartphone, 
  Building2, 
  ShieldAlert, 
  Globe, 
  CheckCircle2, 
  Radio, 
  History
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import PageHeader from '../components/common/PageHeader';

export default function BroadcastPage() {
  const [searchParams] = useSearchParams();
  const alertIdParam = searchParams.get('alertId');

  const {
    alerts,
    sendEmergencyBroadcast,
    broadcastLog,
    currentDisease,
    currentZone
  } = useOutbreak();

  // Find associated alert or default to first critical alert
  const selectedAlert = alerts.find(a => a.id === alertIdParam) || alerts[0] || {
    id: 'alt-generic',
    disease: currentDisease.name,
    zone: currentZone.name,
    severity: 'WARNING',
    recommendedActions: [currentDisease.remedyProtocol]
  };

  const [activeAlertId, setActiveAlertId] = useState(selectedAlert.id);
  const currentActiveAlert = alerts.find(a => a.id === activeAlertId) || selectedAlert;

  const [channel, setChannel] = useState('sms');
  const [recipientGroup, setRecipientGroup] = useState('citizens');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const buildAdvisoryMessage = (alt) => 
    `[URGENT HEALTH ADVISORY - EPISENTINEL] Outbreak alert for ${alt.disease} in ${alt.zone}. Immediate precautionary protocols activated: ${alt.recommendedActions?.[0] || 'Observe syndromic precautions'}. Seek immediate medical evaluation if experiencing symptoms.`;

  const [message, setMessage] = useState(() => buildAdvisoryMessage(selectedAlert));

  const handleSelectAlert = (altId) => {
    setActiveAlertId(altId);
    const target = alerts.find(a => a.id === altId);
    if (target) {
      setMessage(buildAdvisoryMessage(target));
    }
  };

  const channels = [
    { 
      id: 'sms', 
      name: 'Public SMS Cell Broadcast', 
      icon: Smartphone, 
      reach: '340,000 Citizens', 
      latency: '4.2s',
      desc: 'Cell broadcast protocol delivered directly to mobile towers in the target zone.'
    },
    { 
      id: 'hospital_webhook', 
      name: 'ICU & Hospital EHR Webhook', 
      icon: Building2, 
      reach: '12 Facilities', 
      latency: '350ms',
      desc: 'HL7 / FHIR emergency webhook dispatched to chief medical officers & triage desks.'
    },
    { 
      id: 'water_board', 
      name: 'Municipal Sanitation Board Directive', 
      icon: ShieldAlert, 
      reach: '8 Treatment Plants', 
      latency: '1.2s',
      desc: 'Automated water treatment plant dosing & reservoir chlorine booster directive.'
    },
    { 
      id: 'who_ihr', 
      name: 'WHO IHR Event Information Gateway', 
      icon: Globe, 
      reach: 'Global Public Health Nodes', 
      latency: '800ms',
      desc: 'Article 6 alert dispatched under International Health Regulations (2005).'
    }
  ];

  const handleSend = () => {
    const selectedChannelObj = channels.find(c => c.id === channel);
    
    sendEmergencyBroadcast({
      alertId: currentActiveAlert.id,
      title: `${selectedChannelObj?.name || channel}: ${currentActiveAlert.disease}`,
      channel: selectedChannelObj?.name || channel,
      reachCount: channel === 'sms' ? 340000 : channel === 'hospital_webhook' ? 12 : 8,
      recipientGroup: recipientGroup === 'citizens' ? 'Metropolitan Population & First Responders' : 'Chief Medical Officers & Clinical Directors',
      message
    });

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 2500);
  };

  const handleInsertTag = (tag) => {
    setMessage(prev => `${prev} ${tag}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-mono">
      <PageHeader
        title="Emergency Multi-Channel Broadcast Center"
        subtitle="Dedicated operational terminal to compose, review, and dispatch life-saving public health advisories across telecommunication and hospital networks."
        backTo="/alerts"
        backLabel="Back to Alerts"
        badge="Multi-Channel Gateway"
      />

      {/* Confirmation Banner */}
      {broadcastSent && (
        <div className="p-4 rounded-2xl sm:rounded-3xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-sm block text-emerald-950">Broadcast Successfully Transmitted</span>
            Advisory dispatched across network nodes. Target reach verified with low latency confirmation.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Broadcast Composer (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Target Incident Selector (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </span>
              <span>1. Target Epidemiological Incident</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Link to Outbreak Alert
                </label>
                <select
                  value={activeAlertId}
                  onChange={(e) => handleSelectAlert(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-bold focus:outline-none focus:border-black cursor-pointer"
                >
                  {alerts.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.severity}] {a.title} ({a.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Target Location & Pathogen</span>
                <span className="text-xs font-bold text-neutral-900 mt-0.5">
                  {currentActiveAlert.zone} • {currentActiveAlert.disease}
                </span>
              </div>
            </div>
          </div>

          {/* Channel Selector (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </span>
              <span>2. Select Transmission Channel</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id)}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-neutral-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold">{ch.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <p className={`text-[11px] leading-snug ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {ch.desc}
                    </p>

                    <div className={`flex items-center justify-between text-[10px] font-mono pt-1 border-t ${
                      isSelected ? 'border-neutral-700 text-neutral-400' : 'border-neutral-200 text-neutral-500'
                    }`}>
                      <span>Reach: {ch.reach}</span>
                      <span>Latency: {ch.latency}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recipient Group Targeting */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Target Audience Group
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRecipientGroup('citizens')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    recipientGroup === 'citizens'
                      ? 'bg-neutral-900 text-white border-black font-bold shadow-2xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80'
                  }`}
                >
                  <span className="block font-bold">1. General Population & First Responders</span>
                  <span className={`text-[10px] ${recipientGroup === 'citizens' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Civilian SMS & Municipal Public Advisory
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientGroup('clinical_directors')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    recipientGroup === 'clinical_directors'
                      ? 'bg-neutral-900 text-white border-black font-bold shadow-2xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80'
                  }`}
                >
                  <span className="block font-bold">2. Chief Medical Officers & Hospital Directors</span>
                  <span className={`text-[10px] ${recipientGroup === 'clinical_directors' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Clinical ICU EHR Gateway Dispatch
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Message Composer (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </span>
                <span>3. Advisory Content Composer</span>
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                {message.length} Characters
              </span>
            </div>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono leading-relaxed"
              />

              <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-600">Insert Macro:</span>
                <button
                  type="button"
                  onClick={() => handleInsertTag(`[EMERGENCY HOTLINE: 108]`)}
                  className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[11px] font-mono transition cursor-pointer"
                >
                  +Hotline
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag(`[ZONE QUARANTINE ACTIVE]`)}
                  className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[11px] font-mono transition cursor-pointer"
                >
                  +Quarantine
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag(`[DRINK BOILED WATER ONLY]`)}
                  className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[11px] font-mono transition cursor-pointer"
                >
                  +Water Advisory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transmission Preview, Authorization & Log */}
        <div className="space-y-6">
          
          {/* Live Mobile Push Preview Card (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Live Terminal Push Preview
            </h4>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2 border border-black shadow-md font-mono">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>CELL BROADCAST SYSTEM</span>
                </span>
                <span>NOW</span>
              </div>
              <p className="text-xs text-neutral-100 leading-snug font-mono">
                {message}
              </p>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-[10px] font-mono text-neutral-400">
                <span>SECTOR: {currentActiveAlert.zone.toUpperCase()}</span>
                <span>AUTH: EPISENTINEL</span>
              </div>
            </div>
          </div>

          {/* Dispatch Authorization Button (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            <div className="text-xs text-neutral-600 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Target Channel:</span>
                <strong className="text-neutral-900">{channels.find(c => c.id === channel)?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Audience Reach:</span>
                <strong className="text-neutral-900 font-mono">{channels.find(c => c.id === channel)?.reach}</strong>
              </div>
              <div className="flex justify-between">
                <span>Gateway Latency:</span>
                <strong className="text-neutral-900 font-mono">{channels.find(c => c.id === channel)?.latency}</strong>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="w-full py-3.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-2xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Authorize & Transmit Broadcast</span>
            </button>
          </div>

          {/* Transmission History Log (Apple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Dispatch History</span>
              </h4>
              <span className="text-[10px] font-mono text-neutral-400">
                {broadcastLog.length} Sent
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto text-xs font-mono">
              {broadcastLog.map((bc) => (
                <div key={bc.id} className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-[11px] truncate">{bc.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {bc.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>{bc.channel}</span>
                    <span>{bc.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
