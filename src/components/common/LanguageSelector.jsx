import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function LanguageSelector({ variant = 'default' }) {
  const { currentLang, setLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
          variant === 'light'
            ? 'bg-white/80 hover:bg-white text-slate-800 border-white/60 shadow-xs'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
        }`}
        aria-label="Select Language"
      >
        <span className="text-sm">{activeLang.flag}</span>
        <span className="hidden sm:inline font-bold">{activeLang.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Language</span>
            <Globe className="w-3 h-3 text-emerald-600" />
          </div>
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="font-semibold">{lang.native}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{lang.label}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
