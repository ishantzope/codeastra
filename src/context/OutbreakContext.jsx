import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DISEASES, SURVEILLANCE_ZONES, HACKATHON_SCENARIOS, ALERT_LEVELS } from '../constants/outbreakData';
import { generateBaselineHistory, applyScenarioSurge, analyzeOutbreakData, generateLiveTelemetryItem, getInitialAlerts } from '../services/simulationEngine';
import { OutbreakContext } from './outbreakContextDef';

export function OutbreakProvider({ children }) {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, map, workbench, alerts, simulator, sitrep
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [broadcastModalAlert, setBroadcastModalAlert] = useState(null);

  // Active filters & scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState('scenario-wastewater-respiratory');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('sars-cov-x');
  const [selectedZoneId, setSelectedZoneId] = useState('zone-a');

  // Simulation controls
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState(1); // 1x, 2x, 5x
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(false);
  const [tick, setTick] = useState(0);

  // Base data state
  const [rawHistory, setRawHistory] = useState(() => {
    const base = generateBaselineHistory('sars-cov-x', 'zone-a', 30);
    const scenario = HACKATHON_SCENARIOS.find(s => s.id === 'scenario-wastewater-respiratory');
    return applyScenarioSurge(base, scenario);
  });

  // Real-time telemetry feed
  const [telemetryFeed, setTelemetryFeed] = useState(() => {
    const initial = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateLiveTelemetryItem('sars-cov-x', 'zone-a', 75));
    }
    return initial;
  });

  // Alerts queue
  const [alerts, setAlerts] = useState(() => getInitialAlerts());
  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: 'bc-init-1',
      timestamp: '25m ago',
      title: 'Tier-2 Masking Advisory Broadcast',
      channel: 'SMS Gateway & WHO IHR Node',
      reachCount: 142500,
      recipientGroup: 'Metro Public Health Directorate & Emergency Medical Services',
      status: 'DELIVERED'
    }
  ]);

  // Current scenario object
  const currentScenario = useMemo(() => {
    return HACKATHON_SCENARIOS.find(s => s.id === selectedScenarioId) || HACKATHON_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Current disease object
  const currentDisease = useMemo(() => {
    return DISEASES.find(d => d.id === selectedDiseaseId) || DISEASES[0];
  }, [selectedDiseaseId]);

  // Current zone object
  const currentZone = useMemo(() => {
    return SURVEILLANCE_ZONES.find(z => z.id === selectedZoneId) || SURVEILLANCE_ZONES[0];
  }, [selectedZoneId]);

  // Derived analysis metrics
  const analytics = useMemo(() => {
    return analyzeOutbreakData(rawHistory, selectedDiseaseId, selectedZoneId);
  }, [rawHistory, selectedDiseaseId, selectedZoneId]);

  // Handle Scenario Switch
  const switchScenario = useCallback((scenarioId) => {
    const scenario = HACKATHON_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenarioId(scenarioId);
    setSelectedDiseaseId(scenario.diseaseId);
    setSelectedZoneId(scenario.zoneId);

    const base = generateBaselineHistory(scenario.diseaseId, scenario.zoneId, 30);
    const surged = applyScenarioSurge(base, scenario);
    setRawHistory(surged);

    // Prepend a high-impact alert for the selected scenario if not baseline
    if (scenarioId !== 'scenario-baseline-normal') {
      const disease = DISEASES.find(d => d.id === scenario.diseaseId);
      const zone = SURVEILLANCE_ZONES.find(z => z.id === scenario.zoneId);

      const newAlert = {
        id: `alt-${Date.now()}`,
        title: `CRITICAL DETECTED: ${scenario.name.replace(/^[^:]+:\s*/, '')}`,
        disease: disease?.name || 'Pathogen Emergence',
        zone: zone?.name || 'Zone Metro',
        severity: 'CRITICAL',
        status: 'ACTIVE_TRIAGE',
        timestamp: 'Just now (Real-time Detection)',
        leadDaysAdvantage: scenario.projectedLeadDays,
        summary: scenario.summary,
        metrics: {
          zScore: 3.85,
          cusum: 4.20,
          estimatedRt: scenario.targetRt,
          projectedCases7Days: 280
        },
        recommendedActions: [
          disease?.remedyProtocol || 'Deploy rapid epidemiological field investigation unit',
          'Enforce contact tracing and syndromic sentinel reporting in primary care centers',
          'Coordinate ICU ventilator reserves and IV medical supplies'
        ],
        dispatchLog: []
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 7)]);
    }
  }, []);

  // Handle disease change
  const handleSelectDisease = useCallback((diseaseId) => {
    setSelectedDiseaseId(diseaseId);
    const base = generateBaselineHistory(diseaseId, selectedZoneId, 30);
    setRawHistory(base);
  }, [selectedZoneId]);

  // Handle zone change
  const handleSelectZone = useCallback((zoneId) => {
    setSelectedZoneId(zoneId);
    const base = generateBaselineHistory(selectedDiseaseId, zoneId, 30);
    setRawHistory(base);
  }, [selectedDiseaseId]);

  // Real-time ticking engine
  useEffect(() => {
    if (!isStreaming) return;

    const intervalMs = Math.max(800, 2600 / streamSpeed);

    const interval = setInterval(() => {
      setTick(prev => prev + 1);

      // Generate new real-time telemetry event
      const newItem = generateLiveTelemetryItem(
        selectedDiseaseId,
        selectedZoneId,
        analytics?.oti?.score || 50
      );

      setTelemetryFeed(prev => [newItem, ...prev.slice(0, 24)]);

      // Audio beep effect if enabled and critical alert
      if (audioAlertsEnabled && newItem.severity === 'CRITICAL') {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } catch {
          // AudioContext might be restricted until user interaction
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, selectedDiseaseId, selectedZoneId, analytics, audioAlertsEnabled]);

  // Alert Actions
  const updateAlertStatus = useCallback((alertId, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  }, []);

  const addAlertActionLog = useCallback((alertId, note) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          dispatchLog: [...(a.dispatchLog || []), { time: 'Just now', note }]
        };
      }
      return a;
    }));
  }, []);

  const sendEmergencyBroadcast = useCallback((broadcastData) => {
    const entry = {
      id: `bc-${Date.now()}`,
      timestamp: 'Just now',
      title: broadcastData.title,
      channel: broadcastData.channel || 'SMS & Health Authority Siren',
      reachCount: broadcastData.reachCount || 250000,
      recipientGroup: broadcastData.recipientGroup || 'All Municipal Health Directors & General Public',
      status: 'DELIVERED',
      message: broadcastData.message
    };
    setBroadcastLog(prev => [entry, ...prev]);

    // If linked to an alert, mark dispatched
    if (broadcastData.alertId) {
      updateAlertStatus(broadcastData.alertId, 'DISPATCHED');
      addAlertActionLog(broadcastData.alertId, `Broadcast dispatched via ${broadcastData.channel}`);
    }
  }, [updateAlertStatus, addAlertActionLog]);

  const createManualAlert = useCallback((customAlert) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      title: customAlert.title || 'Manually Logged Outbreak Warning',
      disease: customAlert.disease || currentDisease.name,
      zone: customAlert.zone || currentZone.name,
      severity: customAlert.severity || 'WARNING',
      status: 'ACTIVE_TRIAGE',
      timestamp: 'Just now (Manual Entry)',
      leadDaysAdvantage: 3.0,
      summary: customAlert.summary || 'Public health field officer submitted anomalous case cluster.',
      metrics: {
        zScore: 3.1,
        cusum: 3.5,
        estimatedRt: 1.85,
        projectedCases7Days: 85
      },
      recommendedActions: customAlert.actions || [
        'Deploy field rapid verification team',
        'Collect clinical specimens for genomic sequencing',
        'Isolate symptomatic index cases'
      ],
      dispatchLog: []
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, [currentDisease, currentZone]);

  const value = {
    activeTab,
    setActiveTab,
    isPitchDeckOpen,
    setIsPitchDeckOpen,
    broadcastModalAlert,
    setBroadcastModalAlert,
    selectedScenarioId,
    switchScenario,
    currentScenario,
    selectedDiseaseId,
    handleSelectDisease,
    currentDisease,
    selectedZoneId,
    handleSelectZone,
    currentZone,
    rawHistory,
    setRawHistory,
    analytics,
    telemetryFeed,
    alerts,
    updateAlertStatus,
    addAlertActionLog,
    createManualAlert,
    sendEmergencyBroadcast,
    broadcastLog,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    tick
  };

  return (
    <OutbreakContext.Provider value={value}>
      {children}
    </OutbreakContext.Provider>
  );
}
