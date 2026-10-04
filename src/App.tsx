/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EsgProvider, useEsg } from './context/EsgContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GuidedTour } from './components/common/GuidedTour';
import { LoginModal } from './components/common/LoginModal';
import { AccessDenied403 } from './components/common/AccessDenied403';

// Modules
import { DashboardView } from './components/modules/overview/DashboardView';
import { GisMapView } from './components/modules/overview/GisMapView';
import { SdgHeatmapView } from './components/modules/overview/SdgHeatmapView';
import { LandingView } from './components/modules/overview/LandingView';

import { OrgHierarchyView } from './components/modules/governance/OrgHierarchyView';
import { DataCollectionView } from './components/modules/collection/DataCollectionView';
import { AnalyticsEngineView } from './components/modules/analytics/AnalyticsEngineView';
import { AssuranceWorkflowView } from './components/modules/assurance/AssuranceWorkflowView';
import { EsgCalculatorHubView } from './components/modules/calculator/EsgCalculatorHubView';
import { AiCopilotView } from './components/modules/copilot/AiCopilotView';
import { AdminMastersView } from './components/modules/admin/AdminMastersView';

const MainLayout: React.FC = () => {
  const { activeModule, activeSubtab, isAuthenticated, isModuleAuthorized, isSubtabAuthorized } = useEsg();

  // Landing page comes first when opening the app, or whenever user selects hero-landing or is unauthenticated
  if (!isAuthenticated || (activeModule === 'overview' && activeSubtab === 'hero-landing')) {
    return (
      <div className="min-h-screen bg-[#f8faf9] text-[#191c1c] flex flex-col font-sans">
        <LandingView />
        <GuidedTour />
        <LoginModal />
      </div>
    );
  }

  // Enterprise RBAC Guard: If user lacks statutory clearance for module/subtab, show 403 page
  const hasAccess = isModuleAuthorized(activeModule) && isSubtabAuthorized(activeModule, activeSubtab);

  const renderModuleContent = () => {
    if (!hasAccess) {
      return (
        <AccessDenied403
          attemptedModule={activeModule}
          attemptedSubtab={activeSubtab}
        />
      );
    }

    switch (activeModule) {
      case 'overview':
        if (activeSubtab === 'gis-map') return <GisMapView />;
        if (activeSubtab === 'sdg-heatmap') return <SdgHeatmapView />;
        if (activeSubtab === 'hero-landing') return <LandingView />;
        return <DashboardView />;

      case 'governance':
        return <OrgHierarchyView />;

      case 'collection':
        return <DataCollectionView />;

      case 'calculator':
        return <EsgCalculatorHubView />;

      case 'analytics':
        return <AnalyticsEngineView />;

      case 'assurance':
        return <AssuranceWorkflowView />;

      case 'copilot':
        return <AiCopilotView />;

      case 'admin':
        return <AdminMastersView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Fixed Sticky Enterprise Top Bar */}
      <Header />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 pt-16">
        <Sidebar />

        {/* Content Area with dynamic left margin matching sidebar */}
        <main className="flex-1 ml-64 p-6 transition-all duration-300 max-w-[1700px]">
          {renderModuleContent()}
        </main>
      </div>

      {/* Interactive Tour & Login Modal */}
      <GuidedTour />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <EsgProvider>
      <MainLayout />
    </EsgProvider>
  );
}
