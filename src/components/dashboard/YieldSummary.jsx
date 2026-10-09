import React from 'react';
import { TrendingUp, Scale, Sprout, Award } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function YieldSummary({ fields, activities }) {
  const { t } = useTranslation();
  // Harvest activities
  const harvestLogs = activities.filter((a) => a.type === 'Harvest');

  // Simple estimates per crop type (metric tonnes / ha standard averages)
  const yieldEstimates = [
    { crop: 'Wheat', benchmark: '4.2 t/ha', expected: (4.5 * 4.2).toFixed(1), harvestWindow: 'Mar 2027', status: 'Growing' },
    { crop: 'Rice (Paddy)', benchmark: '5.1 t/ha', expected: (6.2 * 5.1).toFixed(1), harvestWindow: 'Nov 2026', status: 'Ripening' },
    { crop: 'Cotton', benchmark: '2.4 t/ha', expected: (3.8 * 2.4).toFixed(1), harvestWindow: 'Dec 2026', status: 'Boll Form' },
    { crop: 'Tomato', benchmark: '18.0 t/ha', expected: (2.0 * 18.0).toFixed(1), harvestWindow: 'Oct–Dec 2026', status: 'Picking Active' }
  ];

  const totalProjected = yieldEstimates.reduce((sum, c) => sum + parseFloat(c.expected), 0);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t('yield.title')}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              Seasonal Focus
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
            {t('yield.season')}
          </span>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold">{t('yield.estTotal')}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">
              {totalProjected.toFixed(1)}{' '}
              <span className="text-xs font-semibold text-slate-500">{t('yield.tonnes')}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold">{t('yield.loggedPickings')}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">
              {harvestLogs.length}{' '}
              <span className="text-xs font-semibold text-slate-500">{t('yield.pickingsCount')}</span>
            </p>
          </div>
        </div>

        {/* Benchmark breakdown list */}
        <div className="mt-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t('yield.targets')}
          </p>
          {yieldEstimates.map((item) => (
            <div
              key={item.crop}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-bold text-slate-800">{item.crop}</span>
                <span className="text-slate-400">({item.benchmark})</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900">{item.expected} t</span>
                <span className="text-[10px] text-slate-500 ml-1.5 block sm:inline">Due: {item.harvestWindow}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1 text-emerald-800 font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>{t('yield.productivityIndex')}</span>
        </span>
      </div>
    </div>
  );
}
