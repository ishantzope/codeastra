import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Radio, 
  CheckCircle2, 
  Building2, 
  ShieldAlert,
  Smartphone,
  Globe
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';

export default function BroadcastModal() {
  const {
    broadcastModalAlert,
    setBroadcastModalAlert,
    sendEmergencyBroadcast,
    currentDisease,
    currentZone
  } = useOutbreak();

  if (!broadcastModalAlert) return null;

  const [channel, setChannel] = useState('sms');
  const [recipientGroup, setRecipientGroup] = useState('citizens');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const defaultMessage = `[URGENT HEALTH ADVISORY - EPISENTINEL] Outbreak alert for ${broadcastModalAlert.disease} in ${broadcastModalAlert.zone}. Immediate precautionary protocols activated: ${broadcastModalAlert.recommendedActions?.[0] || 'Observe syndromic precautions'}. Seek immediate medical evaluation if experiencing symptoms.`;
  const [message, setMessage] = useState(defaultMessage);

  const channels = [
    { id: 'sms', name: 'Public SMS Cell Broadcast', icon: Smartphone, reach: '340,000 Citizens', latency: '4.2s' },
    { id: 'hospital_webhook', name: 'ICU & Hospital EHR Webhook', icon: Building2, reach: '12 Facilities', latency: '350ms' },
    { id: 'water_board', name: 'Municipal Sanitation Board Directive', icon: ShieldAlert, reach: '8 Plants', latency: '1.2s' },
    { id: 'who_ihr', name: 'WHO IHR Event Information Site', icon: Globe, reach: 'Global Public Health Nodes', latency: '800ms' }
  ];

  const handleSend = () => {
    sendEmergencyBroadcast({
      alertId: broadcastModalAlert.id,
      title: `${channel.toUpperCase()} Broadcast: ${broadcastModalAlert.disease}`,
      channel: channels.find(c => c.id === channel)?.name || channel,
      reachCount: channel === 'sms' ? 340000 : 12,
      recipientGroup: recipientGroup === 'citizens' ? 'Metropolitan Population & First Responders' : 'Chief Medical Officers & Clinical Directors',
      message
    });

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastModalAlert(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Close Button */}
        <button
          onClick={() => setBroadcastModalAlert(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Emergency Outbreak Notification Broadcast</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dispatch Public Health Directive
          </h3>
          <p className="text-xs text-slate-500">
            Targeting: <strong className="text-slate-800">{broadcastModalAlert.zone}</strong> • Pathogen: <strong className="text-rose-700">{broadcastModalAlert.disease}</strong>
          </p>
        </div>

        {broadcastSent ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Broadcast Dispatched Successfully!</h4>
            <p className="text-xs text-emerald-800 font-medium">
              Notification routed to gateway. Delivery acknowledgments recorded in SitRep.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Channel Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Dispatch Gateway Channel:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channels.map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = channel === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setChannel(ch.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <h4 className="font-bold text-slate-900">{ch.name}</h4>
                        <p className="text-[11px] text-slate-500">Reach: {ch.reach}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Notification Payload:</span>
                <span className="text-[11px] font-mono text-slate-400">{message.length} characters</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none leading-relaxed font-mono resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setBroadcastModalAlert(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Authorize & Send Emergency Broadcast</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
