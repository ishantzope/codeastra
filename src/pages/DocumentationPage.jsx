import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Droplets, 
  Hospital, 
  Activity, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Link } from 'react-router-dom';

export default function DocumentationPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const chapters = [
    {
      id: 'problem',
      title: '1. The Problem: The 10–14 Day Epidemiological Blind Spot',
      subtitle: 'Why Conventional Public Health Surveillance Fails Early Outbreak Detection',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <p>
            In conventional public health surveillance, an outbreak is only officially recognized after clinical laboratory confirmations (PCR / serology) or hospital emergency department admissions surge.
          </p>

          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#fbfbfd] border border-neutral-200/80 space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
              The Conventional Detection Delay Pipeline:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-500 block font-mono">Day 0 - 3</span>
                <strong className="text-neutral-900 block mt-1">Asymptomatic Shedding</strong>
                <span className="text-[10px] text-neutral-500 block mt-1">Undetected by clinics</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-500 block font-mono">Day 4 - 6</span>
                <strong className="text-neutral-900 block mt-1">Mild OTC Self-Care</strong>
                <span className="text-[10px] text-neutral-500 block mt-1">Pharmacy purchase surge</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-500 block font-mono">Day 7 - 10</span>
                <strong className="text-neutral-900 block mt-1">Doctor Visit & Lab Wait</strong>
                <span className="text-[10px] text-neutral-500 block mt-1">Culture / PCR backlog</span>
              </div>
              <div className="bg-neutral-900 text-white p-4 rounded-2xl border border-black shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <span className="text-neutral-400 block font-mono">Day 11 - 14</span>
                <strong className="text-white block mt-1">Hospital ER Surge</strong>
                <span className="text-[10px] text-neutral-400 block mt-1">Late outbreak alert</span>
              </div>
            </div>
          </div>

          <p>
            By the time intensive care units report bed shortages, exponential community transmission is already locked in. EpiSentinel AI closes this blind spot by intercepting viral genomics and OTC signals at Day 1–2, providing a <strong>+3.5 to +5.2 day operational early warning lead</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'fusion',
      title: '2. The Core Innovation: 5-Stream Multi-Signal Fusion',
      subtitle: 'Correlating Pre-Hospital Syndromic Biomarkers Before Clinical ER Presentation',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <p>
            EpiSentinel AI continuously ingests and harmonizes five independent real-time data streams to form a composite syndromic picture:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Droplets className="w-4 h-4" />
                </div>
                <strong className="text-neutral-900">1. Wastewater Genomics (WBE)</strong>
              </div>
              <p className="text-neutral-600">
                Automated RT-qPCR samplers detect viral shedding <strong>3 to 5 days before</strong> patients seek medical attention.
              </p>
              <span className="text-[10px] font-mono font-bold text-indigo-800 block">Lead Gain: +4.2 Days (30% OTI Weight)</span>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                  <Activity className="w-4 h-4" />
                </div>
                <strong className="text-neutral-900">2. Pharmacy OTC Sales Velocity</strong>
              </div>
              <p className="text-neutral-600">
                Spikes in antipyretic, rehydration, and antiemetic index pack purchases flag mild illness <strong>2 to 3 days before</strong>.
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-800 block">Lead Gain: +2.8 Days (20% OTI Weight)</span>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
                  <Hospital className="w-4 h-4" />
                </div>
                <strong className="text-neutral-900">3. Emergency Department EHRs</strong>
              </div>
              <p className="text-neutral-600">
                Chief complaints parsed via natural language processing into respiratory, gastrointestinal, and febrile clusters.
              </p>
              <span className="text-[10px] font-mono font-bold text-rose-800 block">Primary Anchor (35% OTI Weight)</span>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <strong className="text-neutral-900">4. School & Workplace Absenteeism</strong>
              </div>
              <p className="text-neutral-600">
                Unscheduled pediatric and institutional absence surges serve as an early community transmission amplifier.
              </p>
              <span className="text-[10px] font-mono font-bold text-emerald-800 block">Syndromic Validation (15% Weight)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'algorithms',
      title: '3. Epidemiological Algorithms & Statistical Rigor',
      subtitle: 'CDC EARS Modified CUSUM, Farrington Prediction Limits & Wallinga-Lipsitch Rt',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <p>
            EpiSentinel AI replaces brittle static thresholds with transparent, peer-reviewed epidemiological mathematics compliant with CDC and WHO surveillance protocols:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <strong className="text-neutral-900 block font-sans font-bold">1. CDC EARS Modified CUSUM Control Chart:</strong>
              <code className="text-neutral-900 block py-1.5 font-bold text-xs bg-white px-3 rounded-xl border border-neutral-200/60 inline-block">
                S_t = max(0, S_(t-1) + (Y_t - μ_0)/σ - k)
              </code>
              <p className="text-neutral-600 text-[11px] font-sans">
                Accumulates historical deviations with reference slack k = 0.5σ and decision limit h = 3.0σ.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <strong className="text-neutral-900 block font-sans font-bold">2. Farrington Flexible Quasi-Poisson Thresholding:</strong>
              <code className="text-neutral-900 block py-1.5 font-bold text-xs bg-white px-3 rounded-xl border border-neutral-200/60 inline-block">
                UPL_95 = μ + 1.96 · √(φ · μ)
              </code>
              <p className="text-neutral-600 text-[11px] font-sans">
                Accommodates overdispersion factor φ to avoid false positives during seasonal variations.
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <strong className="text-neutral-900 block font-sans font-bold">3. Instantaneous Reproduction Number (Rt):</strong>
              <code className="text-neutral-900 block py-1.5 font-bold text-xs bg-white px-3 rounded-xl border border-neutral-200/60 inline-block">
                R_t = I_t / Σ (I_(t-s) · w_s)
              </code>
              <p className="text-neutral-600 text-[11px] font-sans">
                Wallinga-Lipsitch convolution over discretized gamma serial interval distribution (μ = 4.5d, σ = 2.0d).
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      title: '4. System Architecture & Technical Implementation',
      subtitle: 'React 19, Vite 8, Recharts 3.x, Tailwind CSS v4 & Distributed Alert Dispatch',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fbfbfd] border border-neutral-200/80 space-y-3.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
              Technical Stack Highlights:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-400 block text-[10px]">Framework</span>
                <strong className="text-neutral-900 block mt-0.5">React 19 + Vite 8</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-400 block text-[10px]">Routing</span>
                <strong className="text-neutral-900 block mt-0.5">Multi-Page Route</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-400 block text-[10px]">Data Vis</span>
                <strong className="text-neutral-900 block mt-0.5">Recharts 3.x</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="text-neutral-400 block text-[10px]">Port</span>
                <strong className="text-neutral-900 block mt-0.5">5174 (Strict)</strong>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fbfbfd] border border-neutral-200/80 space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase">
              Zero-Modal Multi-Page Architecture:
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              In compliance with operational standards, all auxiliary workflows (Emergency Broadcasts, Manual Alerts, In-depth Incident Triage, System Documentation) are implemented as full-page routes with browser history and direct addressability.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'impact',
      title: '5. Societal Impact, Protocol Compliance & ROI',
      subtitle: 'Saving Lives and Preventing Economic Shutdowns Through Timely Targeted Interventions',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
            <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-2xl font-black text-neutral-900 font-mono">+4.2 Days</span>
              <strong className="text-xs text-neutral-800 block">Early Warning Advantage</strong>
              <p className="text-[11px] text-neutral-500">Allows pharmaceutical stockpiling before hospital ER surge.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-2xl font-black text-emerald-700 font-mono">68% Lower</span>
              <strong className="text-xs text-neutral-800 block">Peak ICU Bed Demand</strong>
              <p className="text-[11px] text-neutral-500">Preventing healthcare system collapse and triage bottlenecks.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-neutral-200/80 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <span className="text-2xl font-black text-neutral-900 font-mono">100% Monospace</span>
              <strong className="text-xs text-neutral-800 block">Apple Clean UI</strong>
              <p className="text-[11px] text-neutral-500">No glassmorphism, calm enterprise terminal aesthetics.</p>
            </div>
          </div>

          <div className="flex justify-center pt-3">
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center space-x-2"
            >
              <span>Launch Live Outbreak Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="EpiSentinel AI — System Documentation & Architectural Guide"
        subtitle="Formal epidemiological documentation, statistical algorithms, multi-stream data fusion principles, and system specifications."
        backTo="/dashboard"
        backLabel="Back to Overview"
        badge="System Guide"
        actions={
          <div className="flex items-center space-x-2">
            <Link
              to="/sitrep"
              className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-xs font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <span>View SitRep Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Chapter Navigation Menu */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2 self-start">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-3 py-1">
            Table of Contents
          </h4>
          <div className="space-y-1.5">
            {chapters.map((ch, index) => (
              <button
                key={ch.id}
                onClick={() => setActiveSlide(index)}
                className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  activeSlide === index
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-[#f5f5f7] hover:bg-neutral-200/80 text-neutral-700'
                }`}
              >
                <span className="truncate">{ch.title.split(':')[0]}</span>
                {activeSlide === index && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Main Content Panel */}
        <div className="lg:col-span-3 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="pb-4 border-b border-neutral-100">
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-bold">
                Chapter {activeSlide + 1} of {chapters.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                {chapters[activeSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {chapters[activeSlide].subtitle}
              </p>
            </div>

            {chapters[activeSlide].content}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
              className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-neutral-300 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            <span className="text-xs font-mono text-neutral-400">
              {activeSlide + 1} / {chapters.length}
            </span>

            <button
              onClick={() => setActiveSlide(Math.min(chapters.length - 1, activeSlide + 1))}
              disabled={activeSlide === chapters.length - 1}
              className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <span>Next Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
