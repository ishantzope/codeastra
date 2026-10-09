import React from 'react';
import { 
  Activity, 
  MapPin, 
  LineChart, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  BookOpen,
  Zap,
  Radio
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { HACKATHON_SCENARIOS, ALERT_LEVELS } from '../../constants/outbreakData';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    selectedScenarioId,
    switchScenario,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    setIsPitchDeckOpen,
    analytics,
    alerts
  } = useOutbreak();

  const activeAlertsCount = alerts.filter(a => a.status !== 'RESOLVED').length;
  const threatLevel = analytics?.oti?.alertLevel || 'NORMAL';
  const threatConfig = ALERT_LEVELS[threatLevel] || ALERT_LEVELS.NORMAL;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'map', label: 'Geospatial GIS', icon: MapPin },
    { id: 'workbench', label: 'CUSUM Workbench', icon: LineChart },
    { 
      id: 'alerts', 
      label: 'Alert Center', 
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    },
    { id: 'simulator', label: 'Scenario Injector', icon: Sliders },
    { id: 'sitrep', label: 'WHO SitRep', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
      {/* Top Banner with clean light styling & Live status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-md shadow-rose-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-wider text-slate-900">
                EPISENTINEL <span className="text-rose-600">AI</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700">
                Live Sentinel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-Time Syndromic & Wastewater Outbreak Early Detection Engine
            </p>
          </div>
        </div>

        {/* Center / Right: Live Status, Scenario Selector & Simulation Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Threat Pill */}
          <div className={`px-3 py-1 rounded-xl border flex items-center space-x-2 ${threatConfig.bgClass}`}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: threatConfig.color }} />
            <span className="text-xs font-black tracking-wide">
              {threatConfig.badge}
            </span>
            <span className="text-xs opacity-75 font-mono font-bold">
              ({analytics?.oti?.score || 0}/100)
            </span>
          </div>

          {/* Quick Scenario Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-500 font-semibold mr-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Scenario:
            </span>
            <select
              value={selectedScenarioId}
              onChange={(e) => switchScenario(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[210px] truncate"
            >
              {HACKATHON_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-white text-slate-900">
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stream Controls */}
          <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              title={isStreaming ? 'Pause Real-Time Stream' : 'Resume Real-Time Stream'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isStreaming ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            {/* Speeds */}
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setStreamSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  streamSpeed === spd ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}

            <button
              onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
              title={audioAlertsEnabled ? 'Mute Audio Alerts' : 'Enable Audio Alerts'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                audioAlertsEnabled ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {audioAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* System Architecture / Overview Button */}
          <button
            onClick={() => setIsPitchDeckOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-300" />
            <span>Architecture & Guide</span>
          </button>

        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
