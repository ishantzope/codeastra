import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Radio, BookOpen, Send } from 'lucide-react';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-mono selection:bg-neutral-900 selection:text-white">
      {/* Floating Apple-Style Header (No Glassmorphism) */}
      <Navbar />

      {/* Main Spacious Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Dynamic Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Dynamic Routed Page Content */}
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </main>

      {/* Apple UI Footer (Rounded & Clean) */}
      <footer className="no-print mt-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 font-mono">
        <div className="max-w-[1440px] mx-auto bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-neutral-900">EPISENTINEL AI</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-500">Autonomous Epidemic Intelligence</span>
          </div>

          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <Link
              to="/docs"
              className="text-neutral-600 hover:text-black font-medium flex items-center space-x-1.5 transition px-2.5 py-1 rounded-full hover:bg-neutral-100"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Documentation</span>
            </Link>
            <span className="text-neutral-300">•</span>
            <Link
              to="/broadcast"
              className="text-neutral-600 hover:text-black font-medium flex items-center space-x-1.5 transition px-2.5 py-1 rounded-full hover:bg-neutral-100"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Node</span>
            </Link>
            <span className="text-neutral-300">•</span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 text-[10px]">
              CDC EARS / WHO IHR Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
