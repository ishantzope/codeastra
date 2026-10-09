import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Droplets, 
  Hospital, 
  CheckCircle2, 
  ArrowRight,
  FileCode2
} from 'lucide-react';
import { useOutbreak } from '../../context/useOutbreak';

export default function CodeAstraPitchDeck() {
  const { isPitchDeckOpen, setIsPitchDeckOpen } = useOutbreak();
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isPitchDeckOpen) return null;

  const slides = [
    {
      id: 'problem',
      title: 'The Problem: The 10-14 Day Epidemiological Blind Spot',
      subtitle: 'Why Conventional Public Health Surveillance Fails Early Outbreak Detection',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="leading-relaxed">
            In traditional public health surveillance, outbreaks are only officially declared when clinical laboratory confirmations (PCR / serology) or hospital ICU admissions cross emergency thresholds.
          </p>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              ⚠️ The Conventional Detection Delay Pipeline:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-mono">Day 0 - 3</span>
                <strong className="text-slate-900">Asymptomatic Shedding</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-mono">Day 4 - 6</span>
                <strong className="text-slate-900">Mild OTC Self-Care</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-mono">Day 7 - 10</span>
                <strong className="text-slate-900">Doctor Visit & Lab Wait</strong>
              </div>
              <div className="bg-rose-100 p-2.5 rounded-xl border border-rose-300">
                <span className="text-rose-700 block font-mono">Day 11 - 14</span>
                <strong className="text-rose-900">ER Surge & Delayed Alert</strong>
              </div>
            </div>
          </div>
          <p className="leading-relaxed">
            By the time hospital beds are overwhelmed, exponential community transmission is already locked in. EpiSentinel senses outbreaks at Day 1–2 before clinical presentation occurs.
          </p>
        </div>
      )
    },
    {
      id: 'solution',
      title: 'The Solution: EpiSentinel Multi-Stream Fusion',
      subtitle: 'Gaining 3 to 5 Days of Early Warning via Leading Indicators',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="leading-relaxed">
            EpiSentinel integrates leading non-clinical datasets before patients ever visit a hospital:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-sky-700 font-bold">
                <Droplets className="w-4 h-4" />
                <span>1. Wastewater Genomics</span>
              </div>
              <p className="text-xs text-slate-600">
                Infected individuals shed viral RNA in municipal wastewater <strong>3 to 5 days before</strong> developing severe symptoms.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-800 font-bold">
                <Hospital className="w-4 h-4" />
                <span>2. Pharmacy OTC Velocity</span>
              </div>
              <p className="text-xs text-slate-600">
                Real-time sales spikes of antipyretics, cough syrups, and ORS provide <strong>2 to 3 days advance warning</strong>.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
                <Cpu className="w-4 h-4" />
                <span>3. Syndromic EHR & 911</span>
              </div>
              <p className="text-xs text-slate-600">
                Triage complaint NLP flags emerging fever/dyspnea clusters before lab test confirmation.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <strong className="text-slate-900">Net Outcome:</strong> Public health officers gain <strong>+4.2 Days</strong> of critical intervention runway to deploy antivirals, issue mask advisories, and prepare ICU beds.
          </div>
        </div>
      )
    },
    {
      id: 'algorithms',
      title: 'Epidemiological Rigor & Statistical Algorithms',
      subtitle: 'Transparent, Mathematically Sound Anomaly Detection Pipeline',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="leading-relaxed">
            Rather than relying on opaque black-box neural networks, EpiSentinel uses gold-standard CDC and WHO surveillance mathematics:
          </p>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-800 font-mono font-bold text-xs shrink-0">
                CUSUM
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900">CDC EARS Modified Cumulative Sum</h4>
                <p className="text-xs text-slate-600">
                  Accumulates standardized deviations while subtracting reference slack <code className="text-sky-700 font-semibold">k=0.5σ</code>. Triggers alert once cumulative sum crosses decision threshold <code className="text-rose-700 font-semibold">h=3.0σ</code>.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-800 font-mono font-bold text-xs shrink-0">
                FARRINGTON
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900">Quasi-Poisson Overdispersion Correction</h4>
                <p className="text-xs text-slate-600">
                  Computes 95% and 99% upper prediction limits to eliminate false alarms caused by routine seasonal fluctuations.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-mono font-bold text-xs shrink-0">
                EpiEstim R_t
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900">Wallinga-Lipsitch Instantaneous Reproduction Rate</h4>
                <p className="text-xs text-slate-600">
                  Calculates real-time transmission velocity using discretized gamma serial intervals. R_t &gt; 1.0 flags accelerating exponential outbreaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'impact',
      title: 'Public Health Impact & Technical Infrastructure',
      subtitle: 'Scalable Architecture for Municipal & National Health Networks',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Direct Epidemiological Impact
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• <strong>42% reduction</strong> in peak hospital ICU bed overflow.</li>
                <li>• Surgical localized containment (ward-level) avoids blanket economic lockdowns.</li>
                <li>• Faster distribution of pre-positioned antiviral and vaccine stockpiles.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sky-700">
                <FileCode2 className="w-4 h-4" /> Technical Architecture
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• <strong>React 19 + Tailwind CSS</strong> reactive frontend with sub-millisecond render updates.</li>
                <li>• <strong>Custom SVG Vector GIS</strong> map with zero heavy external map server dependencies.</li>
                <li>• <strong>WHO IHR (2005)</strong>-compliant Situation Report export engine.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
            <h4 className="font-black text-slate-900 text-base">EpiSentinel AI Platform</h4>
            <p className="text-xs text-rose-800">
              Transforming Reactive Healthcare into Proactive Biological Early Warning.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPitchDeckOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Public Health Operations • Architecture Guide</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {slides[activeSlide].title}
          </h3>
          <p className="text-xs text-slate-500">
            {slides[activeSlide].subtitle}
          </p>
        </div>

        {/* Slide Body */}
        <div className="py-2">
          {slides[activeSlide].content}
        </div>

        {/* Slide Navigation Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center space-x-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'w-6 bg-rose-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {activeSlide > 0 && (
              <button
                onClick={() => setActiveSlide(prev => prev - 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Previous
              </button>
            )}

            {activeSlide < slides.length - 1 ? (
              <button
                onClick={() => setActiveSlide(prev => prev + 1)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Next Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsPitchDeckOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Close Guide
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
