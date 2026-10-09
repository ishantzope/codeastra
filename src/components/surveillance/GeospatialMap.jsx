import React, { useState } from 'react';
import { 
  MapPin, 
  Hospital, 
  Droplets, 
  Users, 
  BedDouble, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Navigation,
  Info
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { SURVEILLANCE_ZONES, DISEASES } from '../../constants/outbreakData';

export default function GeospatialMap() {
  const {
    selectedZoneId,
    handleSelectZone,
    selectedDiseaseId,
    handleSelectDisease,
    currentDisease,
    analytics,
    alerts
  } = useOutbreak();

  const [hoveredZoneId, setHoveredZoneId] = useState(null);

  // Active inspected zone
  const activeZone = SURVEILLANCE_ZONES.find(z => z.id === (hoveredZoneId || selectedZoneId)) || SURVEILLANCE_ZONES[0];

  const zonePolygons = [
    {
      id: 'zone-a',
      name: 'Metro Central Core',
      points: '400,220 580,210 630,340 540,420 380,380 360,280',
      labelX: 490,
      labelY: 310,
      pinX: 480,
      pinY: 300,
      hospitalPos: { x: 440, y: 280 },
      wwPos: { x: 530, y: 350 }
    },
    {
      id: 'zone-b',
      name: 'Riverside Basin & Industrial',
      points: '160,340 360,280 380,380 430,500 240,560 140,460',
      labelX: 270,
      labelY: 430,
      pinX: 280,
      pinY: 420,
      hospitalPos: { x: 230, y: 400 },
      wwPos: { x: 320, y: 480 }
    },
    {
      id: 'zone-c',
      name: 'North Suburban District',
      points: '320,60 560,50 580,210 400,220 310,160',
      labelX: 440,
      labelY: 130,
      pinX: 430,
      pinY: 130,
      hospitalPos: { x: 480, y: 120 },
      wwPos: { x: 380, y: 150 }
    },
    {
      id: 'zone-d',
      name: 'East Tech & Airport Corridor',
      points: '580,50 820,70 880,240 760,320 630,340 580,210',
      labelX: 720,
      labelY: 190,
      pinX: 710,
      pinY: 180,
      hospitalPos: { x: 740, y: 160 },
      wwPos: { x: 670, y: 240 }
    },
    {
      id: 'zone-e',
      name: 'West Greenhills Township',
      points: '80,180 310,160 360,280 160,340 90,260',
      labelX: 200,
      labelY: 240,
      pinX: 190,
      pinY: 230,
      hospitalPos: { x: 180, y: 220 },
      wwPos: { x: 230, y: 270 }
    },
    {
      id: 'zone-f',
      name: 'South Harbor & Maritime Docks',
      points: '540,420 690,390 820,440 780,580 490,580 430,500',
      labelX: 620,
      labelY: 490,
      pinX: 630,
      pinY: 480,
      hospitalPos: { x: 670, y: 460 },
      wwPos: { x: 570, y: 520 }
    },
    {
      id: 'zone-g',
      name: 'Old Historic Ward',
      points: '340,320 440,310 450,390 370,410',
      labelX: 400,
      labelY: 360,
      pinX: 400,
      pinY: 355,
      hospitalPos: { x: 390, y: 350 },
      wwPos: { x: 420, y: 375 }
    },
    {
      id: 'zone-h',
      name: 'University & Research Park',
      points: '760,320 920,290 940,450 820,440 690,390 630,340',
      labelX: 800,
      labelY: 370,
      pinX: 790,
      pinY: 360,
      hospitalPos: { x: 820, y: 350 },
      wwPos: { x: 740, y: 380 }
    }
  ];

  // Clean Light Mode Fills
  const getZoneFillColor = (zoneId) => {
    const isSelected = selectedZoneId === zoneId;
    const isHovered = hoveredZoneId === zoneId;

    if (zoneId === 'zone-a' && selectedDiseaseId === 'sars-cov-x') {
      return isSelected ? '#fee2e2' : '#fecaca'; // soft rose
    }
    if (zoneId === 'zone-b' && selectedDiseaseId === 'vibrio-cholerae') {
      return isSelected ? '#ffedd5' : '#fed7aa'; // soft orange
    }
    if (zoneId === 'zone-g' && selectedDiseaseId === 'dengue-denv3') {
      return isSelected ? '#fef3c7' : '#fde68a'; // soft amber
    }

    if (isSelected) return '#e0f2fe'; // soft sky blue
    if (isHovered) return '#f1f5f9';
    return '#f8fafc'; // crisp light off-white
  };

  const getZoneStrokeColor = (zoneId) => {
    if (zoneId === 'zone-a' && selectedDiseaseId === 'sars-cov-x') return '#e11d48';
    if (zoneId === 'zone-b' && selectedDiseaseId === 'vibrio-cholerae') return '#ea580c';
    if (zoneId === 'zone-g' && selectedDiseaseId === 'dengue-denv3') return '#d97706';
    if (selectedZoneId === zoneId) return '#0284c7';
    return '#cbd5e1';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Metropolitan Geospatial Outbreak GIS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-district vector heatmaps, wastewater sampling nodes, and hospital bed stress indices.
          </p>
        </div>

        {/* Pathogen Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Pathogen Layer:</span>
          <select
            value={selectedDiseaseId}
            onChange={(e) => handleSelectDisease(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            {DISEASES.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vector SVG Map (Takes 2 Columns on desktop) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          
          {/* Map Header Status Overlays */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>8 Active Sectors</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                <Hospital className="w-3.5 h-3.5 text-rose-600" />
                <span>12 Sentinel Hospitals</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>8 RT-qPCR Samplers</span>
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              Coordinate System: EPSG-4326 (WGS84)
            </div>
          </div>

          {/* SVG Map Canvas (Crisp Cartographic Light Mode) */}
          <div className="relative w-full aspect-[16/10] bg-slate-50/70 rounded-2xl border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
            
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-full select-none"
            >
              <defs>
                <linearGradient id="riverGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
                </linearGradient>

                <filter id="glowRedLight" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* River Canal Path */}
              <path
                d="M 60,120 Q 220,240 340,320 T 480,480 Q 580,540 850,590"
                fill="none"
                stroke="url(#riverGradLight)"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 60,120 Q 220,240 340,320 T 480,480 Q 580,540 850,590"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="3"
                strokeDasharray="8 6"
                opacity="0.9"
              />

              {/* Render District Polygons */}
              {zonePolygons.map((zp) => {
                const zone = SURVEILLANCE_ZONES.find(z => z.id === zp.id);
                const isSelected = selectedZoneId === zp.id;
                const isHovered = hoveredZoneId === zp.id;
                const isCritical = (zp.id === 'zone-a' && selectedDiseaseId === 'sars-cov-x') ||
                                   (zp.id === 'zone-b' && selectedDiseaseId === 'vibrio-cholerae');

                return (
                  <g key={zp.id} className="cursor-pointer transition-all duration-300">
                    <polygon
                      points={zp.points}
                      fill={getZoneFillColor(zp.id)}
                      stroke={getZoneStrokeColor(zp.id)}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                      strokeLinejoin="round"
                      onMouseEnter={() => setHoveredZoneId(zp.id)}
                      onMouseLeave={() => setHoveredZoneId(null)}
                      onClick={() => handleSelectZone(zp.id)}
                      className="transition-all duration-200"
                    />

                    {/* Zone Name Label (Crisp Dark Text) */}
                    <text
                      x={zp.labelX}
                      y={zp.labelY}
                      fill="#0f172a"
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {zone?.name || zp.name}
                    </text>

                    {/* Zone ID Subtext */}
                    <text
                      x={zp.labelX}
                      y={zp.labelY + 16}
                      fill={isSelected ? '#0284c7' : '#64748b'}
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      POP: {zone ? (zone.population / 1000).toFixed(0) + 'k' : ''}
                    </text>

                    {/* Hospital Marker */}
                    <g
                      transform={`translate(${zp.hospitalPos.x - 10}, ${zp.hospitalPos.y - 10})`}
                      className="pointer-events-none"
                    >
                      <rect width="20" height="20" rx="4" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
                      <path d="M 10,4 L 10,16 M 4,10 L 16,10" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                    </g>

                    {/* Wastewater Sampler Marker */}
                    <g
                      transform={`translate(${zp.wwPos.x - 8}, ${zp.wwPos.y - 8})`}
                      className="pointer-events-none"
                    >
                      <circle cx="8" cy="8" r="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="3" fill="#0284c7" />
                    </g>

                    {/* Outbreak Epicenter Pulsating Radar Rings */}
                    {isCritical && (
                      <g transform={`translate(${zp.pinX}, ${zp.pinY})`} className="pointer-events-none">
                        <circle cx="0" cy="0" r="45" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.4" className="animate-ping" />
                        <circle cx="0" cy="0" r="28" fill="rgba(225, 29, 72, 0.2)" stroke="#e11d48" strokeWidth="2.5" />
                        <circle cx="0" cy="0" r="8" fill="#e11d48" filter="url(#glowRedLight)" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 text-[11px] space-y-1.5 shadow-sm text-slate-800">
              <span className="font-bold text-slate-900 block mb-1">GIS Symbology</span>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600 animate-ping" />
                <span className="text-rose-700 font-semibold">Active Outbreak Epicenter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-white border border-rose-600 flex items-center justify-center text-[9px] text-rose-600 font-bold">+</span>
                <span className="text-slate-700">Sentinel Hospital (ICU)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-600" />
                <span className="text-slate-700">Wastewater RT-qPCR Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-1.5 rounded-full bg-sky-500" />
                <span className="text-slate-700">River Drainage Pipeline</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Click any sector to focus surveillance and drill down.</span>
            <span>Selected Zone: <strong className="text-slate-900">{activeZone.name}</strong></span>
          </div>
        </div>

        {/* Right Column: Zone Detailed Inspector Drawer */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Drawer Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {activeZone.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  activeZone.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  activeZone.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {activeZone.riskLevel} RISK
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
                {activeZone.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeZone.density} • Census Population: <strong>{activeZone.population.toLocaleString()}</strong>
              </p>
            </div>

            {/* ICU Bed Capacity Gauge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-rose-600" /> Regional ICU Surge
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {activeZone.icuOccupied} / {activeZone.icuBeds} Beds ({Math.round((activeZone.icuOccupied / activeZone.icuBeds) * 100)}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeZone.icuOccupied / activeZone.icuBeds > 0.85 ? 'bg-rose-600' :
                    activeZone.icuOccupied / activeZone.icuBeds > 0.65 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.round((activeZone.icuOccupied / activeZone.icuBeds) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Buffer Remaining: <strong className="text-slate-800">{activeZone.icuBeds - activeZone.icuOccupied} beds</strong></span>
                <span>Threshold: 85%</span>
              </div>
            </div>

            {/* Wastewater Node Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs text-sky-700 font-bold">
                <Droplets className="w-4 h-4" />
                <span>Genomic Wastewater Sampler</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                {activeZone.wastewaterPlant}
              </p>
              <p className="text-[11px] text-slate-500">
                Automated continuous ISCO flow sampler with 24h multiplex RT-qPCR assay cycle.
              </p>
            </div>

            {/* Sentinel Institutions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Sentinel Healthcare Facilities:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeZone.keyInstitutions.map((inst, i) => (
                  <li key={i} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <Hospital className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate text-slate-800 font-medium">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vulnerabilities Assessment */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Environmental Vulnerability:
              </span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                {activeZone.vulnerabilities}
              </p>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => handleSelectZone(activeZone.id)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Lock Surveillance Focus to {activeZone.name}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
