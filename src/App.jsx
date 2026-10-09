import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OutbreakProvider } from './context/OutbreakContext';
import AppLayout from './layouts/AppLayout';

import DashboardPage from './pages/DashboardPage';
import SurveillancePage from './pages/SurveillancePage';
import WorkbenchPage from './pages/WorkbenchPage';
import AlertsPage from './pages/AlertsPage';
import ManualAlertPage from './pages/ManualAlertPage';
import AlertDetailPage from './pages/AlertDetailPage';
import BroadcastPage from './pages/BroadcastPage';
import SimulatorPage from './pages/SimulatorPage';
import SitRepPage from './pages/SitRepPage';
import DocumentationPage from './pages/DocumentationPage';

export default function App() {
  return (
    <OutbreakProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="surveillance" element={<SurveillancePage />} />
            <Route path="workbench" element={<WorkbenchPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="alerts/new" element={<ManualAlertPage />} />
            <Route path="alerts/:id" element={<AlertDetailPage />} />
            <Route path="broadcast" element={<BroadcastPage />} />
            <Route path="simulator" element={<SimulatorPage />} />
            <Route path="sitrep" element={<SitRepPage />} />
            <Route path="docs" element={<DocumentationPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OutbreakProvider>
  );
}
