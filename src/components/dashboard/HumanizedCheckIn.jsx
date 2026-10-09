import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Smile,
  Sprout,
  Droplets,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';

export default function HumanizedCheckIn() {
  const { t, currentLang, speakText, stopSpeaking, isSpeaking, speakingText } = useTranslation();
  const { user } = useAuth();
  const { fields, activities, addToast } = useFarm();
  const [selectedFeeling, setSelectedFeeling] = useState('thriving');

  const hour = new Date().getHours();
  let timeGreeting = t('greetings.morning');
  let TimeIcon = Sunrise;
  let timeNote = 'Early hours are great for scouting weed growth and checking drip line pressure.';

  if (hour >= 12 && hour < 17) {
    timeGreeting = t('greetings.afternoon');
    TimeIcon = Sun;
    timeNote = 'Midday sun is high. Optimal period to rest and let the crops absorb sunlight.';
  } else if (hour >= 17) {
    timeGreeting = t('greetings.evening');
    TimeIcon = Moon;
    timeNote = 'Golden hour over the fields. Wonderful time to log today’s irrigation or fertiliser work.';
  }

  const wisdomText = t('humanTouch.todayTip');

  const handleFarmerMood = (moodKey, toastMsg) => {
    setSelectedFeeling(moodKey);
    addToast(toastMsg);
  };

  const handleAudioToggle = () => {
    if (isSpeaking && speakingText === wisdomText) {
      stopSpeaking();
    } else {
      speakText(wisdomText);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/90 via-amber-50/40 to-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm relative overflow-hidden">
      {/* Decorative organic leaf pattern in corner */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 rounded-full bg-emerald-200/20 blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        
        {/* Left: Warm Contextual Greeting */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <TimeIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {timeGreeting}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {timeGreeting}, <span className="text-emerald-900">{user.name || 'Farmer'}</span>! 👋
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
            {t('greetings.subtitle', {
              count: fields.length,
              area: fields.reduce((sum, f) => sum + (parseFloat(f.area) || 0), 0).toFixed(1),
              farm: user.farmName || 'Agrove Family Farm'
            })}
          </p>

          <p className="text-xs text-emerald-800/80 italic font-medium flex items-center space-x-1 pt-0.5">
            <span>🌿</span>
            <span>{timeNote}</span>
          </p>
        </div>

        {/* Right: Farm Heartbeat & Quick Mood Check-in */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          {/* Heartbeat Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold shadow-2xs border border-emerald-200/60">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('humanTouch.vibeHealthy')}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sky-100/90 text-sky-900 text-xs font-bold shadow-2xs border border-sky-200/60">
              <Droplets className="w-3.5 h-3.5 text-sky-700" />
              <span>{t('humanTouch.vibeWater')}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold shadow-2xs border border-amber-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('humanTouch.vibePestFree')}</span>
            </div>
          </div>

          {/* Quick Check-in Interaction */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">How are your crops today?</span>
            <button
              onClick={() => handleFarmerMood('thriving', 'Wonderful! May your harvest be abundant 🌱')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                selectedFeeling === 'thriving'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>🌱 Thriving</span>
            </button>
            <button
              onClick={() => handleFarmerMood('thirsty', 'Noted! Remember to check drip line schedules 💧')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                selectedFeeling === 'thirsty'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>💧 Needs Water</span>
            </button>
            <button
              onClick={() => handleFarmerMood('ready', 'Exciting times! Check yield benchmark tools 🌾')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                selectedFeeling === 'ready'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>🌾 Ready</span>
            </button>
          </div>
        </div>

      </div>

      {/* Farmer's Wisdom Banner with Listen Button */}
      <div className="mt-4 pt-3.5 border-t border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold text-emerald-950 shrink-0">{t('humanTouch.wisdomTitle')}:</span>
          <span className="text-slate-600 font-medium line-clamp-1">{wisdomText}</span>
        </div>

        <button
          onClick={handleAudioToggle}
          className={`self-start sm:self-auto px-3 py-1 rounded-xl font-bold flex items-center space-x-1.5 transition text-[11px] shrink-0 ${
            isSpeaking && speakingText === wisdomText
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 border border-emerald-200'
          }`}
          title="Listen in your selected language"
        >
          {isSpeaking && speakingText === wisdomText ? (
            <>
              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('humanTouch.stopAudio')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('humanTouch.speakGuide')}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
