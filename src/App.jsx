import { OutbreakProvider } from './context/OutbreakContext';
import { useOutbreak } from './context/useOutbreak';
import Navbar from './components/common/Navbar';
import OverviewDashboard from './components/dashboard/OverviewDashboard';
import GeospatialMap from './components/surveillance/GeospatialMap';
import EpidemicCurveWorkbench from './components/analytics/EpidemicCurveWorkbench';
import AlertCenter from './components/alerts/AlertCenter';
import ScenarioSimulator from './components/simulator/ScenarioSimulator';
import SitRepGenerator from './components/reports/SitRepGenerator';
import BroadcastModal from './components/alerts/BroadcastModal';
import CodeAstraPitchDeck from './components/codeastra/CodeAstraPitchDeck';
import { Radio, BookOpen } from 'lucide-react';

function OutbreakAppContent() {
  const { activeTab, setIsPitchDeckOpen } = useOutbreak();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && <OverviewDashboard />}
        {activeTab === 'map' && <GeospatialMap />}
        {activeTab === 'workbench' && <EpidemicCurveWorkbench />}
        {activeTab === 'alerts' && <AlertCenter />}
        {activeTab === 'simulator' && <ScenarioSimulator />}
        {activeTab === 'sitrep' && <SitRepGenerator />}
      </main>

      {/* Modals */}
      <BroadcastModal />
      <CodeAstraPitchDeck />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-slate-800">EPISENTINEL AI</span>
            <span>—</span>
            <span>Real-time Health Outbreak Detection & Alert System</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPitchDeckOpen(true)}
              className="text-slate-700 hover:text-slate-900 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
              <span>System Documentation</span>
            </button>
            <span>•</span>
            <span className="text-slate-500">Port 5174</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <OutbreakProvider>
      <OutbreakAppContent />
    </OutbreakProvider>
  );
}
