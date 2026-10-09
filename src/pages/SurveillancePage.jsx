import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Hospital, 
  Droplets, 
  BedDouble, 
  Activity, 
  Send 
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import { SURVEILLANCE_ZONES, DISEASES } from '../constants/outbreakData';
import PageHeader from '../components/common/PageHeader';

export default function SurveillancePage() {
  const {
    selectedZoneId,
    handleSelectZone,
    selectedDiseaseId,
    handleSelectDisease,
    analytics
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
      points: '100,140 320,60 360,280 160,340 60,240',
      labelX: 200,
      labelY: 190,
      pinX: 210,
      pinY: 180,
      hospitalPos: { x: 180, y: 220 },
      wwPos: { x: 240, y: 140 }
    },
    {
      id: 'zone-f',
      name: 'South Harbor & Maritime Docks',
      points: '430,500 680,480 750,590 480,600 240,560',
      labelX: 520,
      labelY: 550,
      pinX: 510,
      pinY: 540,
      hospitalPos: { x: 450, y: 560 },
      wwPos: { x: 610, y: 530 }
    },
    {
      id: 'zone-g',
      name: 'Old Historic Ward',
      points: '380,380 540,420 480,500 380,460',
      labelX: 450,
      labelY: 440,
      pinX: 445,
      pinY: 430,
      hospitalPos: { x: 410, y: 440 },
      wwPos: { x: 460, y: 460 }
    },
    {
      id: 'zone-h',
      name: 'University & Research Park',
      points: '630,340 760,320 840,460 680,480 540,420',
      labelX: 710,
      labelY: 410,
      pinX: 700,
      pinY: 400,
      hospitalPos: { x: 660, y: 430 },
      wwPos: { x: 740, y: 380 }
    }
  ];

  // Subtle Cartographic Fills with Apple Restraint
  const getZoneFillColor = (zoneId) => {
    const isSelected = selectedZoneId === zoneId;
    const isHovered = hoveredZoneId === zoneId;

    if (isSelected) return '#18181b'; // dark solid for selected sector
    if (isHovered) return '#e4e4e7';  // light hover
    
    // Check if zone has active risk level
    const zoneObj = SURVEILLANCE_ZONES.find(z => z.id === zoneId);
    if (zoneObj?.riskLevel === 'CRITICAL') return '#ffe4e6'; // subtle soft rose
    if (zoneObj?.riskLevel === 'HIGH') return '#fef3c7';     // subtle soft amber
    if (zoneObj?.riskLevel === 'WATCH') return '#e0f2fe';    // subtle soft sky

    return '#f4f4f5'; // clean neutral off-white
  };

  const getZoneStrokeColor = (zoneId) => {
    if (selectedZoneId === zoneId) return '#09090b';
    const zoneObj = SURVEILLANCE_ZONES.find(z => z.id === zoneId);
    if (zoneObj?.riskLevel === 'CRITICAL') return '#f43f5e';
    if (zoneObj?.riskLevel === 'HIGH') return '#f59e0b';
    if (zoneObj?.riskLevel === 'WATCH') return '#0284c7';
    return '#a1a1aa';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metropolitan Geospatial Outbreak GIS"
        subtitle="Real-time multi-district vector heatmaps, wastewater sampling nodes, and hospital bed stress indices in strict monochrome cartography."
        badge="Cartographic GIS"
        actions={
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-neutral-600">Pathogen Layer:</span>
            <select
              value={selectedDiseaseId}
              onChange={(e) => handleSelectDisease(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-black cursor-pointer"
            >
              {DISEASES.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vector SVG Map (Takes 2 Columns on desktop) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-neutral-200 p-4 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          
          {/* Map Header Status Overlays */}
          <div className="flex items-center justify-between z-10 mb-3 flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
                <span>8 Active Sectors</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium">
                <Hospital className="w-3.5 h-3.5 text-neutral-900" />
                <span>12 Sentinel Hospitals</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium">
                <Droplets className="w-3.5 h-3.5 text-neutral-900" />
                <span>8 RT-qPCR Samplers</span>
              </span>
            </div>

            <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200">
              EPSG-4326 (WGS84)
            </div>
          </div>

          {/* SVG Map Canvas (Crisp Cartographic Light Mode) */}
          <div className="relative w-full aspect-[16/10] bg-neutral-50 rounded-xl border border-neutral-200 p-2 overflow-hidden flex items-center justify-center">
            
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-full select-none cursor-pointer"
            >
              {/* Background Map Grid */}
              <defs>
                <pattern id="mono-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e4e4e7" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="1000" height="620" fill="url(#mono-grid)" />

              {/* River Vector (Monochrome Hatched Waterway) */}
              <path
                d="M 50 480 Q 200 420, 380 430 T 700 500 T 980 520"
                fill="none"
                stroke="#a1a1aa"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M 50 480 Q 200 420, 380 430 T 700 500 T 980 520"
                fill="none"
                stroke="#71717a"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Surveillance Sector Polygons */}
              {zonePolygons.map((poly) => {
                const isSelected = selectedZoneId === poly.id;
                const fillColor = getZoneFillColor(poly.id);
                const strokeColor = getZoneStrokeColor(poly.id);
                const zoneObj = SURVEILLANCE_ZONES.find(z => z.id === poly.id);

                return (
                  <g
                    key={poly.id}
                    onClick={() => handleSelectZone(poly.id)}
                    onMouseEnter={() => setHoveredZoneId(poly.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    className="transition-all duration-200"
                  >
                    {/* Zone Boundary Polygon */}
                    <polygon
                      points={poly.points}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isSelected ? 'none' : '4 2'}
                      className="transition-colors duration-200"
                    />

                    {/* Zone ID & Name Label */}
                    {/* Zone ID & Name Label */}
                    <text
                      x={poly.labelX}
                      y={poly.labelY}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#09090b'}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {poly.name}
                    </text>
                    <text
                      x={poly.labelX}
                      y={poly.labelY + 14}
                      textAnchor="middle"
                      fill={isSelected ? '#d4d4d8' : '#71717a'}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      [{zoneObj?.riskLevel || 'NOMINAL'}]
                    </text>

                    {/* Hospital Marker (Subtle Rose Tint) */}
                    <circle
                      cx={poly.hospitalPos.x}
                      cy={poly.hospitalPos.y}
                      r="7.5"
                      fill="#fff1f2"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    <text
                      x={poly.hospitalPos.x}
                      y={poly.hospitalPos.y + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#e11d48"
                    >
                      H
                    </text>

                    {/* Wastewater Node Marker (Subtle Indigo Tint) */}
                    <circle
                      cx={poly.wwPos.x}
                      cy={poly.wwPos.y}
                      r="6.5"
                      fill="#e0e7ff"
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                    <text
                      x={poly.wwPos.x}
                      y={poly.wwPos.y + 3}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#4f46e5"
                    >
                      W
                    </text>

                    {/* Anomaly Pulsing Ring if Selected or Critical */}
                    {(isSelected || zoneObj?.riskLevel === 'CRITICAL') && (
                      <circle
                        cx={poly.pinX}
                        cy={poly.pinY}
                        r="18"
                        fill="none"
                        stroke="#09090b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-neutral-900 border border-neutral-900" />
                <span>Selected Sector</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-neutral-600 border border-neutral-700" />
                <span>Critical Surge</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-neutral-200 border border-neutral-300" />
                <span>Baseline Stable</span>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500">
              <span>H = Sentinel ICU</span>
              <span>W = RT-qPCR Outfall</span>
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Sector Inspector Panel (Apple Card) */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6 font-mono">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="pb-3 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
                  Sector Inspection Telemetry
                </span>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                  activeZone.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  activeZone.riskLevel === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  activeZone.riskLevel === 'WATCH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {activeZone.riskLevel}
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight mt-1.5 font-mono">
                {activeZone.name}
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Jurisdiction Code: {activeZone.code} • Catchment: {activeZone.population.toLocaleString()} Residents
              </p>
            </div>

            {/* Capacity & Genomic Stat Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center space-x-1.5 text-xs text-neutral-600 font-medium mb-1">
                  <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                  <span>ICU Bed Stress</span>
                </div>
                <div className="text-lg font-bold text-neutral-900 font-mono">
                  {activeZone.icuOccupied} / {activeZone.icuBeds}
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${Math.round((activeZone.icuOccupied / activeZone.icuBeds) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  {Math.round((activeZone.icuOccupied / activeZone.icuBeds) * 100)}% Occupancy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center space-x-1.5 text-xs text-neutral-600 font-medium mb-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Genomic Load</span>
                </div>
                <div className="text-lg font-bold text-neutral-900 font-mono">
                  {analytics?.latestWastewater || 450}
                </div>
                <span className="text-[10px] text-neutral-500 font-mono block mt-1">
                  Copies/L (+{analytics?.pctAboveBaseline?.wastewater || 0}%)
                </span>
              </div>
            </div>

            {/* Wastewater Plant & Institutions */}
            <div className="space-y-2.5 text-xs text-neutral-700">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  Effluent Station Node
                </div>
                <div className="font-semibold text-neutral-900">
                  {activeZone.wastewaterPlant}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Continuous automated peristaltic autosampler with microfluidic RT-qPCR sequencing.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  Key Healthcare & Critical Sites
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-800">
                  {activeZone.keyInstitutions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  Epidemiological Vulnerability
                </div>
                <p className="text-neutral-700 leading-relaxed text-[11px]">
                  {activeZone.vulnerabilities}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              to={`/broadcast`}
              className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Advisory to {activeZone.name}</span>
            </Link>

            <Link
              to="/workbench"
              className="w-full py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-900 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Launch Sector CUSUM Workbench</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
