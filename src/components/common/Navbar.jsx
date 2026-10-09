import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  LineChart, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Play, 
  Volume2, 
  VolumeX, 
  BookOpen,
  Radio,
  Send,
  ChevronDown
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { HACKATHON_SCENARIOS, ALERT_LEVELS } from '../../constants/outbreakData';

export default function Navbar() {
  const {
    selectedScenarioId,
    switchScenario,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    analytics,
    alerts
  } = useOutbreak();

  const activeAlertsCount = alerts.filter(a => a.status !== 'RESOLVED').length;
  const threatLevel = analytics?.oti?.alertLevel || 'NORMAL';
  const threatConfig = ALERT_LEVELS[threatLevel] || ALERT_LEVELS.NORMAL;

  const navLinks = [
    { to: '/dashboard', label: 'Overview', icon: Activity },
    { to: '/surveillance', label: 'GIS Map', icon: MapPin },
    { to: '/workbench', label: 'CUSUM', icon: LineChart },
    { 
      to: '/alerts', 
      label: 'Alerts', 
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    },
    { to: '/broadcast', label: 'Broadcast', icon: Send },
    { to: '/simulator', label: 'Simulator', icon: Sliders },
    { to: '/sitrep', label: 'SitRep', icon: FileText },
    { to: '/docs', label: 'Docs', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
      <div className="max-w-[1440px] mx-auto bg-white border border-neutral-200/90 rounded-2xl lg:rounded-full px-4 sm:px-6 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
          
          {/* Top Row / Left: Brand & Mobile Status */}
          <div className="flex items-center justify-between w-full lg:w-auto shrink-0">
            <Link to="/dashboard" className="flex items-center space-x-2.5 group py-0.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-neutral-900 text-white shadow-xs group-hover:bg-black transition-colors">
                <Radio className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-bold tracking-tight text-neutral-900 font-mono">
                    EPISENTINEL
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 font-medium">
                    PRO
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Surveillance Active
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Threat Badge */}
            <div className={`lg:hidden flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${threatConfig.bgClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              <span>{threatConfig.badge}</span>
            </div>
          </div>

          {/* Center: Apple Segmented Pill Navigation */}
          <nav className="flex items-center space-x-1 overflow-x-auto max-w-full py-0.5 px-1 bg-[#f2f2f7] rounded-full border border-neutral-200/60 scrollbar-none">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Spacious Rounded Playback & Threat Controls */}
          <div className="flex items-center space-x-2 flex-wrap justify-center lg:justify-end shrink-0">
            
            {/* Desktop Threat Badge */}
            <div className={`hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-colors ${threatConfig.bgClass}`}>
              <span className="w-2 h-2 rounded-full bg-current opacity-90 animate-pulse" />
              <span>{threatConfig.badge}</span>
              <span className="opacity-60 text-[10px]">({analytics?.oti?.score || 0})</span>
            </div>

            {/* Scenario Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                value={selectedScenarioId}
                onChange={(e) => switchScenario(e.target.value)}
                className="appearance-none bg-[#f2f2f7] hover:bg-neutral-200/70 border border-neutral-200/80 rounded-full px-3.5 py-1.5 pr-7 text-xs font-mono font-medium text-neutral-800 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[160px] truncate transition-colors"
                title="Select outbreak scenario"
              >
                {HACKATHON_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name.replace(/^[^:]+:\s*/, '')}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Stream Play/Pause Pill Button */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition cursor-pointer border ${
                isStreaming 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-2xs' 
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              {isStreaming ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>LIVE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-neutral-700" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            {/* Speed Multiplier Segmented Capsule */}
            <div className="flex items-center bg-[#f2f2f7] border border-neutral-200/80 rounded-full p-0.5 space-x-0.5 text-[11px] font-mono">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setStreamSpeed(spd)}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    streamSpeed === spd 
                      ? 'bg-white font-bold text-neutral-900 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Audio Mute Button */}
            <button
              onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
              title={audioAlertsEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 flex items-center justify-center transition cursor-pointer text-neutral-600 hover:text-neutral-900"
            >
              {audioAlertsEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-neutral-800" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
