import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const COLORS = [
  '#0d5c3a', // Forest green
  '#16a34a', // Emerald
  '#3b82f6', // Sky blue
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#ec4899'  // Pink
];

export default function CropAreaChart({ fields }) {
  const [chartType, setChartType] = useState('pie'); // 'pie' | 'bar'
  const { t } = useTranslation();

  // Calculate crop distribution from registered fields
  const cropAggregation = fields.reduce((acc, f) => {
    const crop = f.crop || 'Other';
    const area = parseFloat(f.area) || 0;
    acc[crop] = (acc[crop] || 0) + area;
    return acc;
  }, {});

  const data = Object.entries(cropAggregation).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(1))
  }));

  const totalArea = data.reduce((sum, item) => sum + item.value, 0);

  if (fields.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col items-center justify-center min-h-[320px]">
        <Info className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-600">No registered fields yet</p>
        <p className="text-xs text-slate-400 mt-1">Add your first field to view crop distribution analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Crop Area by Type</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              Distribution
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('stats.totalLandArea')}: <span className="font-bold text-slate-800">{totalArea.toFixed(1)} {t('stats.ha')}</span>
          </p>
        </div>

        {/* Toggle Pie vs Bar */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              chartType === 'pie' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Donut</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              chartType === 'bar' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bar Chart</span>
          </button>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val} ha (${((val / totalArea) * 100).toFixed(1)}%)`, 'Area']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" ha" />
              <Tooltip
                formatter={(val) => [`${val} ha`, 'Cultivated Area']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend Badges */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-semibold text-slate-700">{item.name}:</span>
            <span className="font-bold text-slate-900">{item.value} ha</span>
            <span className="text-slate-400">({((item.value / totalArea) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
