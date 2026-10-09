import { DISEASES, SURVEILLANCE_ZONES } from '../constants/outbreakData';
import { calculateCUSUM, calculateFarringtonThresholds, estimateRt, computeOutbreakThreatIndex } from './detectionAlgorithms';

let telemetryIdSeq = 0;

/**
 * Generates 30-day baseline time series for a given disease and zone
 */
export function generateBaselineHistory(diseaseId, zoneId, days = 30) {
  const disease = DISEASES.find(d => d.id === diseaseId) || DISEASES[0];
  const zone = SURVEILLANCE_ZONES.find(z => z.id === zoneId) || SURVEILLANCE_ZONES[0];

  const popFactor = zone.population / 350000;
  const history = [];

  for (let d = 0; d < days; d++) {
    // Normal baseline Poisson-like random fluctuation
    const noise = 0.85 + Math.random() * 0.3;
    const edCases = Math.max(1, Math.round(disease.baselineDailyRate * popFactor * noise));
    const wastewater = Math.max(10, Math.round(disease.baselineWastewaterCopies * popFactor * (0.9 + Math.random() * 0.25)));
    const pharmacy = Math.max(5, Math.round(disease.baselinePharmacyRate * popFactor * (0.85 + Math.random() * 0.3)));
    const absenteeism = Math.round((2.8 + Math.random() * 1.2) * 10) / 10;
    const ems = Math.max(2, Math.round(edCases * 0.4 * (0.9 + Math.random() * 0.2)));

    history.push({
      day: d + 1,
      date: new Date(Date.now() - (days - d - 1) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      edCases,
      wastewater,
      pharmacy,
      absenteeism,
      ems,
      zoneId,
      diseaseId
    });
  }

  return history;
}

/**
 * Injects an active outbreak surge into the most recent days of the history
 */
export function applyScenarioSurge(baselineHistory, scenario) {
  if (!scenario || scenario.id === 'scenario-baseline-normal') {
    return [...baselineHistory];
  }

  const modified = baselineHistory.map(item => ({ ...item }));
  const totalDays = modified.length;

  // Surge affects the last 7 to 9 days to create an authentic epidemic curve
  const outbreakDuration = 8;
  const startDayIndex = totalDays - outbreakDuration;

  for (let i = 0; i < outbreakDuration; i++) {
    const idx = startDayIndex + i;
    if (idx < 0 || idx >= totalDays) continue;

    const progress = i / (outbreakDuration - 1); // 0 to 1

    // 1. Wastewater surges FIRST (exponential ramp early, then plateau)
    // S-curve peaking around day 3-5
    const wwCurve = Math.pow(Math.sin((progress * Math.PI) / 2), 0.7);
    const wwMultiplier = 1.0 + (scenario.initialWastewaterMult - 1.0) * wwCurve;

    // 2. Pharmacy surges 2-3 days later (delayed progress)
    const pharmProgress = Math.max(0, (i - 1.5) / (outbreakDuration - 1.5));
    const pharmMultiplier = 1.0 + (scenario.initialPharmacyMult - 1.0) * Math.pow(pharmProgress, 1.2);

    // 3. Clinical ED admissions surge LAST (hospitalization lag, peaking near day 6-8)
    const edProgress = Math.max(0, (i - 3.2) / (outbreakDuration - 3.2));
    const edMultiplier = 1.0 + (scenario.initialEdMult - 1.0) * Math.pow(edProgress, 1.5);

    modified[idx].wastewater = Math.round(modified[idx].wastewater * wwMultiplier);
    modified[idx].pharmacy = Math.round(modified[idx].pharmacy * pharmMultiplier);
    modified[idx].edCases = Math.round(modified[idx].edCases * edMultiplier);
    modified[idx].absenteeism = Math.round((modified[idx].absenteeism * (1.0 + edProgress * 1.8)) * 10) / 10;
    modified[idx].ems = Math.round(modified[idx].ems * (1.0 + edProgress * 2.2));
  }

  return modified;
}

/**
 * Computes full analytical metrics from the history
 */
export function analyzeOutbreakData(history, diseaseId, zoneId) {
  if (!history || history.length === 0) return null;

  const edCounts = history.map(h => h.edCases);
  const wwCounts = history.map(h => h.wastewater);
  const pharmCounts = history.map(h => h.pharmacy);
  const absCounts = history.map(h => h.absenteeism);

  // 1. CUSUM on clinical cases
  const cusumResults = calculateCUSUM(edCounts, 0.5, 3.0, 14);

  // 2. Farrington Upper Confidence Limits
  const farringtonResults = calculateFarringtonThresholds(edCounts, 0.05);

  // 3. R_t Effective Reproduction Number
  const rtResults = estimateRt(edCounts, 4);

  // 4. Latest anomalies & Z-scores
  const latestCusum = cusumResults[cusumResults.length - 1];
  const latestFarrington = farringtonResults[farringtonResults.length - 1];
  const latestRt = rtResults[rtResults.length - 1]?.rt || 1.0;

  // Wastewater and Pharmacy Z-scores
  const wwBaselineMean = wwCounts.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
  const wwBaselineStd = Math.max(1, Math.sqrt(wwCounts.slice(0, 14).reduce((a, b) => a + Math.pow(b - wwBaselineMean, 2), 0) / 13));
  const wwZScore = Math.round(((wwCounts[wwCounts.length - 1] - wwBaselineMean) / wwBaselineStd) * 100) / 100;

  const pharmBaselineMean = pharmCounts.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
  const pharmBaselineStd = Math.max(1, Math.sqrt(pharmCounts.slice(0, 14).reduce((a, b) => a + Math.pow(b - pharmBaselineMean, 2), 0) / 13));
  const pharmZScore = Math.round(((pharmCounts[pharmCounts.length - 1] - pharmBaselineMean) / pharmBaselineStd) * 100) / 100;

  const absBaselineMean = absCounts.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
  const absZScore = Math.round(((absCounts[absCounts.length - 1] - absBaselineMean) / 0.8) * 100) / 100;

  // 5. Multi-Signal Outbreak Threat Index
  const oti = computeOutbreakThreatIndex({
    edZScore: latestFarrington?.zScore || 0,
    wastewaterZScore: wwZScore,
    pharmacyZScore: pharmZScore,
    absenteeismZScore: absZScore,
    rt: latestRt
  });

  // Combined chart dataset
  const chartData = history.map((item, idx) => ({
    day: item.day,
    date: item.date,
    edCases: item.edCases,
    wastewater: item.wastewater,
    pharmacy: item.pharmacy,
    absenteeism: item.absenteeism,
    baseline: farringtonResults[idx]?.baseline || item.edCases,
    upperLimit95: farringtonResults[idx]?.upperLimit95 || item.edCases * 1.5,
    cusum: cusumResults[idx]?.cusum || 0,
    cusumThreshold: 3.0,
    isAnomaly: farringtonResults[idx]?.isAnomaly || cusumResults[idx]?.isAnomaly,
    zScore: farringtonResults[idx]?.zScore || 0,
    rt: rtResults[idx]?.rt || 1.0
  }));

  return {
    chartData,
    oti,
    latestRt,
    latestCusum,
    latestFarrington,
    wwZScore,
    pharmZScore,
    absZScore,
    edZScore: latestFarrington?.zScore || 0
  };
}

/**
 * Generates synthetic live streaming telemetry items
 */
export function generateLiveTelemetryItem(diseaseId, zoneId, threatIndex = 50) {
  const disease = DISEASES.find(d => d.id === diseaseId) || DISEASES[0];
  const zone = SURVEILLANCE_ZONES.find(z => z.id === zoneId) || SURVEILLANCE_ZONES[0];

  const channels = ['ed_clinical', 'wastewater', 'pharmacy_otc', 'ems_dispatch', 'lab_pcr'];
  const channel = channels[Math.floor(Math.random() * channels.length)];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  const isHighThreat = threatIndex > 60;

  let title = '';
  let detail = '';
  let severity = 'NORMAL';
  let value = '';

  switch (channel) {
    case 'ed_clinical': {
      const isSyndromicSpike = isHighThreat && Math.random() > 0.35;
      const age = Math.floor(18 + Math.random() * 65);
      const symptom = disease.symptoms[Math.floor(Math.random() * disease.symptoms.length)];
      severity = isSyndromicSpike ? 'CRITICAL' : (isHighThreat ? 'WARNING' : 'NORMAL');
      title = `${zone.keyInstitutions[0]} — ER Triage Admission`;
      detail = `Patient Age ${age} admitted with acute ${symptom}. O2 Saturation: ${isSyndromicSpike ? '88%' : '97%'}. Rapid antigen pending.`;
      value = isSyndromicSpike ? 'Z = +3.6 (Surge)' : 'Z = +0.8';
      break;
    }
    case 'wastewater': {
      const copies = isHighThreat
        ? Math.round(disease.baselineWastewaterCopies * (2.5 + Math.random() * 3.5))
        : Math.round(disease.baselineWastewaterCopies * (0.8 + Math.random() * 0.4));
      severity = copies > disease.baselineWastewaterCopies * 2 ? 'CRITICAL' : (copies > disease.baselineWastewaterCopies * 1.4 ? 'WARNING' : 'NORMAL');
      title = `${zone.wastewaterPlant} — RT-qPCR Sampler`;
      detail = `Genomic RNA viral load: ${copies.toLocaleString()} copies/L. Flow normalized delta +${Math.round((copies / disease.baselineWastewaterCopies - 1) * 100)}% vs 14d baseline.`;
      value = `${copies} copies/L`;
      break;
    }
    case 'pharmacy_otc': {
      const packs = isHighThreat ? Math.floor(45 + Math.random() * 60) : Math.floor(12 + Math.random() * 15);
      severity = packs > 40 ? 'WARNING' : 'NORMAL';
      title = `Zone Retail Pharmacy Consortium — OTC Spike`;
      detail = `Antipyretic & ${disease.category.includes('Waterborne') ? 'Electrolyte/ORS' : 'Cough suppressant'} purchases at ${packs} units/hr. 3.2x baseline velocity.`;
      value = `${packs} packs/hr`;
      break;
    }
    case 'ems_dispatch': {
      severity = isHighThreat ? 'WARNING' : 'NORMAL';
      title = `Metropolitan 911 EMS Dispatch`;
      detail = `Priority-1 ambulance call dispatched to ${zone.name}: Acute respiratory distress / hyperpyrexia cluster in apartment complex.`;
      value = `ETA 4 min`;
      break;
    }
    case 'lab_pcr': {
      const ctVal = Math.round((18 + Math.random() * 15) * 10) / 10;
      const isPositive = isHighThreat ? Math.random() > 0.25 : Math.random() > 0.8;
      severity = isPositive ? 'CRITICAL' : 'NORMAL';
      title = `Central Reference Virology Lab — Multiplex PCR`;
      detail = `Target ${disease.code} (${disease.name}): ${isPositive ? `POSITIVE (Ct value: ${ctVal})` : 'NEGATIVE'}. Sequencing pipeline engaged.`;
      value = isPositive ? `POS (Ct ${ctVal})` : 'NEG';
      break;
    }
  }

  return {
    id: `telemetry-${Date.now()}-${++telemetryIdSeq}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: timeStr,
    channel,
    zoneId: zone.id,
    zoneName: zone.name,
    diseaseId: disease.id,
    diseaseName: disease.name,
    title,
    detail,
    severity,
    value
  };
}

/**
 * Pre-seeded initial alerts for immediate interactive demonstration
 */
export function getInitialAlerts() {
  return [
    {
      id: 'alt-001',
      title: 'CRITICAL: Exponential Wastewater Genomic Surge in Metro Central (Zone A)',
      disease: 'SARS-CoV-X (Novel Variant)',
      zone: 'Metro Central Core',
      severity: 'CRITICAL',
      status: 'ACTIVE_TRIAGE', // ACTIVE_TRIAGE, INVESTIGATING, DISPATCHED, RESOLVED
      timestamp: '14 minutes ago',
      leadDaysAdvantage: 4.2,
      summary: 'Central Reclamation Plant #1 detected 2,160 copies/L (Z = +3.82). Genomic signature matches novel aerosol clade SCV-26. Clinical hospitalizations still low but expected to spike in 72-96 hours.',
      metrics: {
        zScore: 3.82,
        cusum: 4.15,
        estimatedRt: 2.45,
        projectedCases7Days: 320
      },
      recommendedActions: [
        'Mobilize pre-positioned Oseltamivir & Paxlovid stocks to City General Hospital',
        'Issue Tier-2 High-Efficiency Mask Advisory on Metro Underground transit',
        'Alert ICU ward leads to prepare 25 negative pressure isolation beds'
      ],
      dispatchLog: []
    },
    {
      id: 'alt-002',
      title: 'HIGH: Waterborne Enteric Cluster in Riverside Basin (Zone B)',
      disease: 'Vibrio Cholerae (O1 El Tor)',
      zone: 'Riverside Basin & Industrial',
      severity: 'WARNING',
      status: 'INVESTIGATING',
      timestamp: '42 minutes ago',
      leadDaysAdvantage: 3.5,
      summary: 'Pharmacy OTC oral rehydration sales jumped 310%. Riverside Municipal ER logged 14 severe dehydration admissions in 6 hours. High correlation with Ward 4 canal overflow.',
      metrics: {
        zScore: 2.94,
        cusum: 3.40,
        estimatedRt: 2.10,
        projectedCases7Days: 95
      },
      recommendedActions: [
        'Dispatch Municipal Water Quality team to test and hyper-chlorinate Sector 4 reservoir',
        'Issue Immediate Boil-Water Advisory via public SMS cell broadcast',
        'Deploy mobile ORS and IV Ringer Lactate stations to riverside settlements'
      ],
      dispatchLog: [
        { time: '35m ago', note: 'Public Water Board alerted for valve closure' }
      ]
    },
    {
      id: 'alt-003',
      title: 'WATCH: Pediatric Syndromic Absenteeism Breach in North Suburbs',
      disease: 'Norovirus (GII.4 Cluster)',
      zone: 'North Suburban District',
      severity: 'WATCH',
      status: 'UNDER_REVIEW',
      timestamp: '2 hours ago',
      leadDaysAdvantage: 2.1,
      summary: 'Elementary School District 12 registered 14.2% unscheduled absences with acute vomiting & abdominal pain reports. Farrington 95% threshold exceeded.',
      metrics: {
        zScore: 2.12,
        cusum: 2.45,
        estimatedRt: 1.65,
        projectedCases7Days: 52
      },
      recommendedActions: [
        'Request cafeteria food surface swab collection by Environmental Health officers',
        'Advise deep chlorine disinfection in 3 school buildings over weekend'
      ],
      dispatchLog: []
    }
  ];
}
