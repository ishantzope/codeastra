import React, { useState, useMemo } from 'react';
import { 
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
  TrendingUp 
} from 'lucide-react';
import { useOutbreak } from '../context/useOutbreak';
import { calculateCUSUM, calculateFarringtonThresholds, estimateRt } from '../services/detectionAlgorithms';
import PageHeader from '../components/common/PageHeader';

export default function WorkbenchPage() {
  const {
    rawHistory
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
      <PageHeader
        title="Epidemiological Surveillance & CUSUM Analytics Workbench"
        subtitle="CDC EARS-compliant Cumulative Sum control charting, Farrington quasi-Poisson prediction intervals, and Wallinga-Lipsitch reproduction rate (Rt) estimation."
        badge="Statistical Workbench"
        actions={
          <div className="flex items-center space-x-1 bg-[#f2f2f7] p-1 rounded-full border border-neutral-200/80">
            <button
              onClick={() => setActiveChartTab('epicurve')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                activeChartTab === 'epicurve'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              1. Farrington Epicurve
            </button>
            <button
              onClick={() => setActiveChartTab('cusum')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                activeChartTab === 'cusum'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              2. CDC EARS CUSUM
            </button>
            <button
              onClick={() => setActiveChartTab('rt')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                activeChartTab === 'rt'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              3. Wallinga-Lipsitch Rt
            </button>
          </div>
        }
      />

      {/* Interactive Mathematical Sliders (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Slack k */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Reference Slack (k)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-neutral-100 text-neutral-900 border border-neutral-200">
              k = {slackK}σ
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.1"
            value={slackK}
            onChange={(e) => setSlackK(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-500 leading-snug">
            Absorbs background Poisson noise. Lower values increase sensitivity to subtle emerging trends.
          </p>
        </div>

        {/* Slider 2: Decision Threshold h */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Decision Limit (h)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
              h = {thresholdH}σ
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="5.0"
            step="0.2"
            value={thresholdH}
            onChange={(e) => setThresholdH(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-500 leading-snug">
            Aberration threshold. When cumulative sum exceeds h, an outbreak alert is flagged.
          </p>
        </div>

        {/* Slider 3: Rolling Baseline Window */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Baseline Window (Days)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-neutral-100 text-neutral-900 border border-neutral-200">
              {baselineDays} Days
            </span>
          </div>
          <input
            type="range"
            min="7"
            max="28"
            step="1"
            value={baselineDays}
            onChange={(e) => setBaselineDays(parseInt(e.target.value))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-500 leading-snug">
            Historical training window used to calculate expected mean μ and variance σ.
          </p>
        </div>
      </div>

      {/* Main Chart Canvas (Apple Card) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4 font-mono">
        
        {/* Chart 1: Epidemic Curve with Farrington Upper Prediction Limit */}
        {activeChartTab === 'epicurve' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  Farrington Flexible Quasi-Poisson Epicurve (Daily Clinical ED Cases)
                </h3>
                <p className="text-xs text-neutral-500">
                  Compares observed daily incidence against Farrington rolling baseline and 95% Upper Prediction Limit (UPL).
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-900 font-bold text-xs font-mono self-start sm:self-auto">
                {anomalyCount} Aberrant Days Flagged
              </span>
            </div>

            <div className="h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e5ea',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1d1d1f',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  {/* Daily Cases Bar (Soft Slate) */}
                  <Bar
                    dataKey="edCases"
                    name="Observed Clinical Cases (ED)"
                    fill="#64748b"
                    opacity={0.8}
                    radius={[6, 6, 0, 0]}
                  />

                  {/* Farrington Expected Baseline (Dotted Slate Line) */}
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Expected Rolling Baseline (μ)"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                  />

                  {/* Farrington 95% Upper Prediction Limit (Soft Amber Line) */}
                  <Line
                    type="monotone"
                    dataKey="upperLimit95"
                    name="Farrington 95% Upper Limit (UPL)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={false}
                  />

                  {/* Anomaly Points Scatter (Soft Crimson Marker) */}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  CDC EARS Cumulative Sum (CUSUM) Control Chart
                </h3>
                <p className="text-xs text-neutral-500">
                  Accumulates deviations from baseline. When cumulative sum breaches decision limit h = {thresholdH}σ, an early alert is triggered.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs font-mono self-start sm:self-auto">
                Threshold: h = {thresholdH}σ
              </span>
            </div>

            <div className="h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.7} />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 11 }} unit="σ" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e5ea',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1d1d1f',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  <ReferenceLine
                    y={thresholdH}
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ value: `Alert Threshold (h=${thresholdH}σ)`, fill: '#e11d48', fontSize: 11, position: 'top' }}
                  />

                  {/* CUSUM Cumulative Statistic (Soft Indigo Line) */}
                  <Line
                    type="monotone"
                    dataKey="cusum"
                    name="CUSUM St (Cumulative Sum)"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Wallinga-Lipsitch Reproduction Rate (Rt) */}
        {activeChartTab === 'rt' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  Instantaneous Reproduction Number (Rt)
                </h3>
                <p className="text-xs text-neutral-500">
                  Calculated using discretized gamma serial interval distribution (mean 4.5 days, std 2.0 days).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs font-mono self-start sm:self-auto">
                Epidemic Threshold: Rt = 1.0
              </span>
            </div>

            <div className="h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyzedDataset} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.7} />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 11 }} domain={[0, 4]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e5ea',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1d1d1f',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  <ReferenceLine
                    y={1.0}
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{ value: 'Rt = 1.0 (Critical Replacement Line)', fill: '#d97706', fontSize: 11 }}
                  />

                  {/* Rt Line (Soft Ocean/Sky) */}
                  <Line
                    type="monotone"
                    dataKey="rt"
                    name="Instantaneous Rt"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 3.5, fill: '#0284c7' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Mathematical Principles Reference Cards (Apple Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <span>CDC EARS Modified CUSUM</span>
          </div>
          <code className="text-xs block bg-neutral-50 border border-neutral-200/80 text-neutral-900 p-2.5 rounded-xl font-mono">
            S_t = max(0, S_(t-1) + (Y_t - μ)/σ - k)
          </code>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Accumulates positive deviations from rolling mean. Flags abnormal clustering even when single-day peaks do not breach traditional static thresholds.
          </p>
        </div>

        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase">
            <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5" />
            </span>
            <span>Farrington Quasi-Poisson</span>
          </div>
          <code className="text-xs block bg-neutral-50 border border-neutral-200/80 text-neutral-900 p-2.5 rounded-xl font-mono">
            UPL_95 = μ + 1.96 · √(φ · μ)
          </code>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Incorporates overdispersion factor φ to handle high biological variance and weekly reporting seasonality without triggering false positive alerts.
          </p>
        </div>

        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase">
            <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span>Wallinga-Lipsitch Rt</span>
          </div>
          <code className="text-xs block bg-neutral-50 border border-neutral-200/80 text-neutral-900 p-2.5 rounded-xl font-mono">
            R_t = I_t / Σ (I_(t-s) · w_s)
          </code>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Convolves current daily incident cases against the probability distribution of secondary generation infections to monitor reproductive velocity.
          </p>
        </div>
      </div>
    </div>
  );
}
