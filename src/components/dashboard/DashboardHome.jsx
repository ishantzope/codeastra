import React from 'react';
import {
  Sprout,
  PlusCircle,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  TrendingUp,
  ClipboardList
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { useTranslation } from '../../context/LanguageContext';
import CropAreaChart from './CropAreaChart';
import YieldSummary from './YieldSummary';
import WeatherWidget from './WeatherWidget';
import HumanizedCheckIn from './HumanizedCheckIn';

export default function DashboardHome({
  onOpenFieldModal,
  onOpenActivityModal,
  onOpenExportModal,
  setActiveTab
}) {
  const { fields, activities } = useFarm();
  const { t } = useTranslation();

  const totalArea = fields.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0);
  const recentActivities = activities.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Humanized Heartbeat & Greeting Section */}
      <HumanizedCheckIn />

      {/* Quick Action CTA Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Quick Farming Shortcuts</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenFieldModal}
            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm rounded-xl border border-emerald-200 flex items-center justify-center space-x-1.5 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{t('actions.addField')}</span>
          </button>

          <button
            onClick={onOpenActivityModal}
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#0d5c3a] hover:bg-[#08432a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center space-x-1.5 transition"
          >
            <Layers className="w-4 h-4" />
            <span>{t('actions.logActivity')}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>{t('actions.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cultivated Area */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm flex flex-col justify-between hover:border-emerald-700/30 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('stats.totalLandArea')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalArea.toFixed(1)}{' '}
              <span className="text-xs font-semibold text-slate-500">{t('stats.ha')}</span>
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center mt-1">
              {t('stats.acrossPlots', { count: fields.length })}
            </span>
          </div>
        </div>

        {/* Active Fields */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm flex flex-col justify-between hover:border-emerald-700/30 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('stats.activeFields')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{fields.length}</p>
            <button
              onClick={() => setActiveTab('fields')}
              className="text-[11px] text-emerald-800 hover:underline font-bold flex items-center mt-1"
            >
              {t('stats.manageFields')} <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Logged Operations */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm flex flex-col justify-between hover:border-emerald-700/30 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('stats.recordedTasks')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activities.length}</p>
            <button
              onClick={() => setActiveTab('activities')}
              className="text-[11px] text-emerald-800 hover:underline font-bold flex items-center mt-1"
            >
              {t('stats.viewActivityLog')} <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Projected Harvest */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm flex flex-col justify-between hover:border-emerald-700/30 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('stats.estProductivity')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              4.8 <span className="text-xs font-semibold text-slate-500">{t('stats.tHaAvg')}</span>
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center mt-1">
              {t('stats.topTierYield')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop Area Chart */}
        <div className="lg:col-span-7">
          <CropAreaChart fields={fields} />
        </div>

        {/* Right Column: Weather Widget */}
        <div className="lg:col-span-5">
          <WeatherWidget />
        </div>
      </div>

      {/* Secondary Row: Yield Summary & Recent Farm Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Yield Summary */}
        <div className="lg:col-span-5">
          <YieldSummary fields={fields} activities={activities} />
        </div>

        {/* Right Column: Recent Activities Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t('activities.recentTitle')}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Records
                </span>
              </div>
              <button
                onClick={() => setActiveTab('activities')}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center"
              >
                {t('activities.fullLog')} ({activities.length}) <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  {t('activities.noActivities')}
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {act.type === 'Irrigation' && '💧'}
                        {act.type === 'Sowing' && '🌱'}
                        {act.type === 'Fertiliser' && '🧪'}
                        {act.type === 'Pesticide' && '🛡️'}
                        {act.type === 'Harvest' && '🌾'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {t('types.' + act.type) || act.type}
                          </span>
                          <span className="text-xs font-bold text-slate-400">·</span>
                          <span className="text-xs font-semibold text-emerald-900">{act.fieldName}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-700">
                            {act.crop}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium">{act.details || act.notes}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-slate-500 block">{act.date}</span>
                      {act.cost > 0 && (
                        <span className="text-xs font-extrabold text-slate-700">₹{act.cost}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tracking verified field entries</span>
            <button
              onClick={onOpenActivityModal}
              className="font-bold text-emerald-800 hover:underline"
            >
              {t('actions.logActivity')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
