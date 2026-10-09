/**
 * Epidemiological Detection Algorithms & Mathematical Models
 * Implements CUSUM (CDC EARS), Farrington Thresholding, EpiEstim R_t, and Multi-Signal Fusion
 * Real-Time Health Outbreak Detection & Alert System
 */

/**
 * Modified CUSUM (Cumulative Sum) Algorithm
 * Standard CDC EARS (Early Aberration Reporting System) implementation
 * 
 * @param {Array<number>} values Time series of counts
 * @param {number} k Slack/allowance parameter (default 0.5 standard deviations)
 * @param {number} h Decision threshold limit (default 3.0 standard deviations)
 * @param {number} baselineDays Window length to calculate baseline (default 14)
 * @returns {Array<{ index: number, value: number, baselineMean: number, baselineStd: number, cusum: number, isAnomaly: boolean, threshold: number }>}
 */
export function calculateCUSUM(values, k = 0.5, h = 3.0, baselineDays = 14) {
  if (!values || values.length === 0) return [];

  const results = [];
  let currentCusum = 0;

  for (let i = 0; i < values.length; i++) {
    // Determine baseline window (prior days, up to baselineDays)
    const windowStart = Math.max(0, i - baselineDays);
    const window = values.slice(windowStart, i);

    let mean = 0;
    let std = 1;

    if (window.length >= 3) {
      mean = window.reduce((sum, v) => sum + v, 0) / window.length;
      const variance = window.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (window.length - 1);
      std = Math.max(Math.sqrt(variance), 1.0); // prevent division by zero or overly tiny variance
    } else {
      mean = values[0];
      std = Math.max(Math.sqrt(mean), 1.0);
    }

    const standardizedResidual = (values[i] - mean) / std;
    currentCusum = Math.max(0, currentCusum + standardizedResidual - k);

    const isAnomaly = currentCusum >= h;

    results.push({
      index: i,
      value: values[i],
      baselineMean: Math.round(mean * 10) / 10,
      baselineStd: Math.round(std * 10) / 10,
      cusum: Math.round(currentCusum * 100) / 100,
      threshold: h,
      isAnomaly,
      zScore: Math.round(standardizedResidual * 100) / 100,
    });
  }

  return results;
}

/**
 * Farrington Flexible Outbreak Thresholding
 * Models counts with quasi-Poisson dispersion and calculates upper 95% and 99% prediction limits
 * 
 * @param {Array<number>} values Time series of historical and current counts
 * @param {number} alpha Significance level (0.05 for 95% confidence, 0.01 for 99%)
 * @returns {Array<{ value: number, baseline: number, upperLimit95: number, upperLimit99: number, zScore: number, isAnomaly: boolean }>}
 */
export function calculateFarringtonThresholds(values, alpha = 0.05) {
  if (!values || values.length === 0) return [];

  const results = [];
  const baselineWindow = 14;

  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - baselineWindow);
    const window = values.slice(start, i);

    let mu = values[0];
    let dispersion = 1.2; // quasi-Poisson overdispersion factor

    if (window.length >= 3) {
      mu = window.reduce((a, b) => a + b, 0) / window.length;
      // quasi-poisson variance estimator
      const empiricalVar = window.reduce((a, b) => a + Math.pow(b - mu, 2), 0) / (window.length - 1);
      dispersion = Math.max(1.0, empiricalVar / Math.max(mu, 1));
    }

    const sigma = Math.sqrt(Math.max(mu * dispersion, 1));
    const upperLimit95 = Math.round((mu + 1.96 * sigma) * 10) / 10;
    const upperLimit99 = Math.round((mu + 2.58 * sigma) * 10) / 10;
    const zScore = Math.round(((values[i] - mu) / sigma) * 100) / 100;

    results.push({
      value: values[i],
      baseline: Math.round(mu * 10) / 10,
      upperLimit95,
      upperLimit99,
      zScore,
      isAnomaly: values[i] > upperLimit95,
      isSevereAnomaly: values[i] > upperLimit99,
    });
  }

  return results;
}

/**
 * Serial Interval Gamma Discretization for R_t Estimation
 * Standard epidemiological serial interval for respiratory / acute pathogens
 */
function getSerialIntervalWeights(length = 7, mean = 4.5, std = 2.0) {
  // Discretized gamma distribution approximation
  const weights = [];
  const k = Math.pow(mean / std, 2); // shape
  const theta = Math.pow(std, 2) / mean; // scale

  let sum = 0;
  for (let s = 1; s <= length; s++) {
    // simplified discrete gamma density
    const w = Math.pow(s, k - 1) * Math.exp(-s / theta);
    weights.push(w);
    sum += w;
  }
  return weights.map(w => w / sum); // normalize sum to 1
}

/**
 * Wallinga-Lipsitch / EpiEstim Instantaneous Reproduction Number (R_t)
 * R_t = I_t / sum_{s=1}^k (I_{t-s} * w_s)
 * 
 * @param {Array<number>} incidence Daily new cases time series
 * @param {number} windowDays Smoothing window
 * @returns {Array<{ day: number, incidence: number, rt: number, isEpidemic: boolean }>}
 */
export function estimateRt(incidence, windowDays = 5) {
  if (!incidence || incidence.length === 0) return [];

  const weights = getSerialIntervalWeights(7, 4.5, 2.0);
  const results = [];

  for (let t = 0; t < incidence.length; t++) {
    if (t < 3) {
      results.push({
        day: t,
        incidence: incidence[t],
        rt: 1.0,
        isEpidemic: false,
      });
      continue;
    }

    // Infectiousness denominator
    let totalInfectiousness = 0;
    for (let s = 1; s <= Math.min(t, weights.length); s++) {
      totalInfectiousness += incidence[t - s] * weights[s - 1];
    }

    // Smoothed numerator (rolling incidence over windowDays)
    const windowStart = Math.max(0, t - windowDays + 1);
    const windowCases = incidence.slice(windowStart, t + 1);
    const smoothedIncidence = windowCases.reduce((a, b) => a + b, 0) / windowCases.length;

    let rt = 1.0;
    if (totalInfectiousness > 0.5) {
      rt = smoothedIncidence / (totalInfectiousness + 0.1);
    } else {
      rt = incidence[t] > 0 ? 1.2 : 0.8;
    }

    // Dampen extreme outliers for statistical stability
    rt = Math.max(0.1, Math.min(4.5, rt));
    const roundedRt = Math.round(rt * 100) / 100;

    results.push({
      day: t,
      incidence: incidence[t],
      rt: roundedRt,
      isEpidemic: roundedRt > 1.0,
    });
  }

  return results;
}

/**
 * Multi-Signal Outbreak Threat Index (OTI) Fusion Model (0 - 100 scale)
 * Combines clinical, wastewater genomics, OTC pharmacy purchases, and absenteeism
 * 
 * @param {Object} signals { edZScore, wastewaterZScore, pharmacyZScore, absenteeismZScore }
 * @returns {{ score: number, alertLevel: string, leadDays: number, confidence: number }}
 */
export function computeOutbreakThreatIndex({
  edZScore = 0,
  wastewaterZScore = 0,
  pharmacyZScore = 0,
  absenteeismZScore = 0,
  rt = 1.0
}) {
  // Normalize z-scores to 0-100 sub-scores (0 at Z=0, 50 at Z=2.0, 100 at Z>=4.5)
  const zToScore = (z) => {
    if (z <= 0) return 5;
    return Math.min(100, Math.round(5 + (z / 4.0) * 95));
  };

  const edScore = zToScore(edZScore);
  const wwScore = zToScore(wastewaterZScore);
  const pharmScore = zToScore(pharmacyZScore);
  const absScore = zToScore(absenteeismZScore);

  // Dynamic weights based on early warning phase:
  // If wastewater is high while ED is low, boost wastewater weight to highlight early warning!
  let weightED = 0.35;
  let weightWW = 0.30;
  let weightPharm = 0.20;
  let weightAbs = 0.15;

  if (wastewaterZScore > 2.5 && edZScore < 1.5) {
    // Early emergence phase! Wastewater lead indicator dominance
    weightWW = 0.45;
    weightPharm = 0.25;
    weightED = 0.20;
    weightAbs = 0.10;
  }

  let composite = (edScore * weightED) + (wwScore * weightWW) + (pharmScore * weightPharm) + (absScore * weightAbs);

  // Multiplier bonus if R_t is high (epidemic acceleration)
  if (rt > 1.5) {
    composite = Math.min(100, composite * 1.15);
  }

  const score = Math.round(Math.min(100, Math.max(0, composite)));

  // Estimate early warning lead days gained
  let leadDays = 0;
  if (wastewaterZScore > 2.0 && edZScore < 2.0) {
    leadDays = Math.round((3.2 + (wastewaterZScore - edZScore) * 0.7) * 10) / 10;
  } else if (pharmacyZScore > 2.0 && edZScore < 2.0) {
    leadDays = Math.round((2.0 + (pharmacyZScore - edZScore) * 0.5) * 10) / 10;
  }

  // Determine Alert Level
  let alertLevel = 'NORMAL';
  if (score >= 75) {
    alertLevel = 'CRITICAL';
  } else if (score >= 55) {
    alertLevel = 'WARNING';
  } else if (score >= 38) {
    alertLevel = 'ADVISORY';
  } else if (score >= 22) {
    alertLevel = 'WATCH';
  }

  // Model confidence calculation (based on concordance across independent streams)
  const signalsExceedingThreshold = [edZScore > 1.8, wastewaterZScore > 1.8, pharmacyZScore > 1.8, absenteeismZScore > 1.8].filter(Boolean).length;
  const confidence = Math.min(99, Math.round(70 + signalsExceedingThreshold * 7.5));

  return {
    score,
    alertLevel,
    leadDays: Math.max(0, Math.min(6.5, leadDays)),
    confidence,
    subScores: {
      clinical: edScore,
      wastewater: wwScore,
      pharmacy: pharmScore,
      absenteeism: absScore
    }
  };
}
