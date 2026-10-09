import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  BarChart, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine, 
  ResponsiveContainer,
  Scatter
} from 'recharts';
import { 
  Activity, 
  Sliders, 
  TrendingUp, 
  AlertCircle, 
  BookOpen, 
  Info,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';
import { calculateCUSUM, calculateFarringtonThresholds, estimateRt } from '../../services/detectionAlgorithms';

export default function EpidemicCurveWorkbench() {
  const {
    rawHistory,
    currentDisease,
    currentZone,
    analytics
  } = useOutbreak();

  // Interactive Algorithm Parameter Sliders
  const [slackK, setSlackK] = useState(0.5); // CUSUM k slack
  const [thresholdH, setThresholdH] = useState(3.0); // CUSUM h decision limit
  const [baselineDays, setBaselineDays] = useState(14); // window length
  const [activeChartTab, setActiveChartTab] = useState('epicurve'); // epicurve, cusum, rt

  // Recalculate CUSUM and Farrington based on interactive slider values
  const analyzedDataset = useMemo(() => {
    if (!rawHistory || rawHistory.length === 0) return [];

    const edCounts = rawHistory.map(h => h.edCases);
    const cusumRes = calculateCUSUM(edCounts, slackK, thresholdH, baselineDays);
    const farringtonRes = calculateFarringtonThresholds(edCounts, 0.05);
    const rtRes = estimateRt(edCounts, 4);

    return rawHistory.map((item, idx) => ({
      day: item.day,
      date: item.date,
      edCases: item.edCases,
      baseline: farringtonRes[idx]?.baseline || item.edCases,
      upperLimit95: farringtonRes[idx]?.upperLimit95 || item.edCases * 1.5,
      upperLimit99: farringtonRes[idx]?.upperLimit99 || item.edCases * 2.0,
      cusum: cusumRes[idx]?.cusum || 0,
      thresholdH: thresholdH,
      isCusumAnomaly: cusumRes[idx]?.isAnomaly,
      isFarringtonAnomaly: farringtonRes[idx]?.isAnomaly,
      zScore: farringtonRes[idx]?.zScore || 0,
      rt: rtRes[idx]?.rt || 1.0,
      anomalyPoint: (cusumRes[idx]?.isAnomaly || farringtonRes[idx]?.isAnomaly) ? item.edCases : null
    }));
  }, [rawHistory, slackK, thresholdH, baselineDays]);

  const anomalyCount = analyzedDataset.filter(d => d.isCusumAnomaly || d.isFarringtonAnomaly).length;

  return (
    <div className="space-y-6">
      
      {/* Workbench Header & Parameter Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Epidemiological Surveillance & CUSUM Analytics Workbench
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              CDC EARS-compliant Cumulative Sum control charting, Farrington quasi-Poisson prediction intervals, and Wallinga-Lipsitch R_t estimation.
            </p>
          </div>

          {/* Chart View Toggle Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveChartTab('epicurve')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeChartTab === 'epicurve' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Epidemic Curve (Farrington)
            </button>
            <button
              onClick={() => setActiveChartTab('cusum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeChartTab === 'cusum' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Cumulative Sum (CUSUM)
            </button>
            <button
              onClick={() => setActiveChartTab('rt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeChartTab === 'rt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Reproduction Rate (R_t)
            </button>
          </div>
        </div>

        {/* Dynamic Parameter Sliders Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Slider 1: Slack k */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">CUSUM Slack Allowance (k)</span>
              <span className="font-mono text-sky-700 font-bold">{slackK.toFixed(2)} σ</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={slackK}
              onChange={(e) => setSlackK(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Absorbs routine Poisson baseline variation. CDC standard: 0.5σ.
            </p>
          </div>

          {/* Slider 2: Threshold h */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Decision Threshold Limit (h)</span>
              <span className="font-mono text-rose-700 font-bold">{thresholdH.toFixed(1)} σ</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.1"
              value={thresholdH}
              onChange={(e) => setThresholdH(parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Flags outbreak alarm when C_t crosses h. Lower = earlier; higher = fewer false alarms.
            </p>
          </div>

          {/* Slider 3: Baseline Window */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Historical Window (Baseline)</span>
              <span className="font-mono text-amber-800 font-bold">{baselineDays} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="21"
              step="1"
              value={baselineDays}
              onChange={(e) => setBaselineDays(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Rolling window to estimate empirical baseline mean & standard deviation.
            </p>
          </div>

        </div>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs">
        
        {/* Chart 1: Epidemic Curve (Farrington) */}
        {activeChartTab === 'epicurve' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Epidemic Curve with Quasi-Poisson 95% Upper Prediction Limit
                </h3>
                <p className="text-xs text-slate-500">
                  Observed daily clinical incidence vs expected baseline. Points crossing the dashed red line represent statistically aberrant outbreak clusters.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                {anomalyCount} Aberrant Days Detected
              </span>
            </div>

            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#0f172a'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  {/* Daily Cases Bar */}
                  <Bar
                    dataKey="edCases"
                    name="Observed Clinical Cases (ED)"
                    fill="#3b82f6"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />

                  {/* Farrington Expected Baseline */}
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Expected Rolling Baseline (μ)"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={false}
                  />

                  {/* Farrington 95% Upper Prediction Limit */}
                  <Line
                    type="monotone"
                    dataKey="upperLimit95"
                    name="Farrington 95% Upper Limit (UPL)"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />

                  {/* Anomaly Points Scatter */}
                  <Scatter
                    dataKey="anomalyPoint"
                    name="Outbreak Anomaly (Z > 2.0)"
                    fill="#e11d48"
                    shape="cross"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: CUSUM Cumulative Sum Control Chart */}
        {activeChartTab === 'cusum' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  CDC EARS Cumulative Sum (CUSUM) Control Chart
                </h3>
                <p className="text-xs text-slate-500">
                  Accumulates deviations from baseline. When the cumulative sum breaches decision limit h = {thresholdH}σ, an early warning alert is triggered.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-bold text-xs">
                Decision Threshold: h = {thresholdH}
              </span>
            </div>

            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="σ" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#0f172a'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  {/* CUSUM Cumulative Value */}
                  <Line
                    type="monotone"
                    dataKey="cusum"
                    name="Cumulative Sum C_t"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0284c7' }}
                    activeDot={{ r: 7 }}
                  />

                  {/* Threshold Limit Line h */}
                  <ReferenceLine
                    y={thresholdH}
                    stroke="#e11d48"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ value: `DECISION LIMIT (h = ${thresholdH}σ)`, fill: '#e11d48', fontSize: 11, position: 'top' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: R_t Effective Reproduction Number */}
        {activeChartTab === 'rt' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Instantaneous Effective Reproduction Number (R_t) Timeline
                </h3>
                <p className="text-xs text-slate-500">
                  Estimated via Wallinga-Lipsitch serial interval convolution. R_t &gt; 1.0 (shaded red) confirms epidemic propagation.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${
                (analytics?.latestRt || 1) > 1.0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Latest R_t: {analytics?.latestRt || 1.0}
              </span>
            </div>

            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 3.5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#0f172a'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  <Line
                    type="monotone"
                    dataKey="rt"
                    name="Effective Reproduction Number (R_t)"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#d97706' }}
                  />

                  {/* Epidemic Demarcation Line R_t = 1.0 */}
                  <ReferenceLine
                    y={1.0}
                    stroke="#e11d48"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ value: 'EPIDEMIC THRESHOLD (R_t = 1.0)', fill: '#e11d48', fontSize: 11, position: 'right' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Algorithm Theory Cards (Light Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: CUSUM Theory */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Modified CUSUM Formulation</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
            S_t = max(0, S_{'{t-1}'} + (Y_t - μ)/σ - k)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Accumulates standardized residuals while subtracting reference slack <code className="text-sky-700 font-semibold">k</code>. Triggers timely alert once <code className="text-rose-700 font-semibold">S_t &gt; h</code> without waiting for massive single-day spikes.
          </p>
        </div>

        {/* Card 2: Farrington Prediction */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Farrington Quasi-Poisson Interval</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
            UPL_95 = μ + 1.96 · √(φ · μ)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Models epidemiological case counts with overdispersion factor <code className="text-rose-700 font-semibold">φ</code> to prevent false positives during seasonal variations while isolating true aberrant surges.
          </p>
        </div>

        {/* Card 3: EpiEstim R_t */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Wallinga-Lipsitch R_t Estimation</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
            R_t = I_t / Σ_{'{s=1}'}^k (I_{'{t-s}'} · w_s)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Calculates transmission velocity by convolving incident cases with a discretized gamma serial interval distribution (<code className="text-amber-800 font-semibold">μ = 4.5d, σ = 2.0d</code>).
          </p>
        </div>

      </div>

    </div>
  );
}
