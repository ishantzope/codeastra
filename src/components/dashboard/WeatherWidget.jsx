import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { useTranslation } from '../../context/LanguageContext';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchWeather = () => {
    setLoading(true);
    weatherService.getWeatherData().then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading || !weather) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex items-center justify-center min-h-[220px]">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Fetching agro-weather insights...</span>
        </div>
      </div>
    );
  }

  const isOptimal = weather.sprayStatusColor === 'emerald';

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40 relative z-10">
        <div className="flex items-center space-x-2">
          <CloudSun className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold">{t('weather.title')}</h3>
        </div>
        <button
          onClick={fetchWeather}
          className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/40 transition"
          title="Refresh weather"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Temperature & Conditions */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{weather.temperature}°C</span>
          <div>
            <p className="text-base font-semibold text-emerald-200">{weather.condition}</p>
            <p className="text-xs text-emerald-400/80">{t('weather.station')}</p>
          </div>
        </div>

        {/* Agronomic Spray Recommendation Pill */}
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-2xl border text-xs font-bold ${
            isOptimal
              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
              : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
          }`}
        >
          {isOptimal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <span>{isOptimal ? t('weather.optimal') : t('weather.caution')}</span>
        </div>
      </div>

      {/* Micro metrics: Humidity, Wind, Rain */}
      <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-emerald-800/40 relative z-10 text-xs">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <span className="block text-[10px] text-emerald-300/80 uppercase font-semibold">
              {t('weather.humidity')}
            </span>
            <span className="font-bold text-white">{weather.humidity}%</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="block text-[10px] text-emerald-300/80 uppercase font-semibold">
              {t('weather.wind')}
            </span>
            <span className="font-bold text-white">{weather.windSpeed} km/h</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <CloudRain className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="block text-[10px] text-emerald-300/80 uppercase font-semibold">
              {t('weather.rainChance')}
            </span>
            <span className="font-bold text-white">{weather.precipitation} mm</span>
          </div>
        </div>
      </div>

      {/* 5-Day Outlook */}
      {weather.forecast && (
        <div className="mt-4 pt-3 border-t border-emerald-800/40 flex justify-between text-xs">
          {weather.forecast.map((day) => (
            <div key={day.date} className="text-center px-1">
              <span className="block text-[10px] text-emerald-300/70 font-semibold">{day.date}</span>
              <span className="font-bold text-white text-xs">{day.max}°</span>
              <span className="block text-[10px] text-emerald-400/60">{day.min}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
