import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  ClipboardList,
  CalendarDays,
  Lightbulb,
  ShieldAlert,
  FileDown,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { useTranslation } from '../../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, closeSidebar }) {
  const { user } = useAuth();
  const { fields, activities, resetDemoData } = useFarm();
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'fields',
      label: t('nav.fields'),
      icon: Sprout,
      badge: fields.length
    },
    {
      id: 'activities',
      label: t('nav.activities'),
      icon: ClipboardList,
      badge: activities.length
    },
    {
      id: 'timeline',
      label: t('nav.timeline'),
      icon: CalendarDays,
      badge: 'Stream'
    },
    {
      id: 'advisory',
      label: t('nav.advisory'),
      icon: Lightbulb,
      badge: 'Live'
    },
    {
      id: 'admin',
      label: t('nav.admin'),
      icon: ShieldAlert,
      badge: user.role === 'admin' ? 'Active' : 'Admin',
      adminOnly: true
    },
    {
      id: 'export',
      label: t('nav.export'),
      icon: FileDown,
      badge: 'CSV'
    },
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: UserCheck,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 h-full lg:h-[calc(100vh-61px)] w-64 bg-white border-r border-emerald-900/10 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Farm Quick Header with Warm Friendly Badge */}
          <div className="p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-amber-50/50 border border-emerald-200/60 shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                🌾
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-bold text-emerald-950 truncate">{user.farmName || 'Agrove Family Farm'}</p>
                </div>
                <p className="text-[11px] text-emerald-800/80 truncate font-medium">{user.location || 'Punjab, India'}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-200/40 flex items-center justify-between text-[10px] text-emerald-900 font-semibold">
              <span>{fields.length} parcels registered</span>
              <span className="text-emerald-700">● Live syncing</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0d5c3a] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-100'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Reset Seed Data & Version info */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={resetDemoData}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Reset to default seed fields, logs, and advisories"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('nav.resetDemo')}</span>
          </button>

          <div className="px-3 text-[10px] text-slate-400 text-center font-medium">
            Agrove Portal · {t('nav.tagline')}
          </div>
        </div>
      </aside>
    </>
  );
}
