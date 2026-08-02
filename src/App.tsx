import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DevLensAssistant } from './components/DevLensAssistant';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { ScanView } from './components/ScanView';
import { ComponentsView } from './components/ComponentsView';
import { CodeQualityView } from './components/CodeQualityView';
import { DesignView } from './components/DesignView';
import { PerformanceView } from './components/PerformanceView';
import { AccessibilityView } from './components/AccessibilityView';
import { DependenciesView } from './components/DependenciesView';
import { GitView } from './components/GitView';
import { MLDashboardView } from './components/MLDashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ImportProjectModal } from './components/ImportProjectModal';

import { PageType, Project, ScanResult } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  // State loaded from localStorage or empty
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('devlens_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [scanResultMap, setScanResultMap] = useState<Record<string, ScanResult>>(() => {
    try {
      const saved = localStorage.getItem('devlens_scan_results');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    try {
      const saved = localStorage.getItem('devlens_projects');
      const list = saved ? JSON.parse(saved) : [];
      return list.length > 0 ? list[0] : null;
    } catch {
      return null;
    }
  });

  const [scanResult, setScanResult] = useState<ScanResult | null>(() => {
    try {
      const savedResults = localStorage.getItem('devlens_scan_results');
      const map = savedResults ? JSON.parse(savedResults) : {};
      const savedProjects = localStorage.getItem('devlens_projects');
      const list = savedProjects ? JSON.parse(savedProjects) : [];
      if (list.length > 0 && map[list[0].id]) {
        return map[list[0].id];
      }
    } catch {}
    return null;
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('devlens_projects');
      const list = saved ? JSON.parse(saved) : [];
      return list.length === 0;
    } catch {
      return true;
    }
  });

  const [assistantOpen, setAssistantOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('devlens_projects', JSON.stringify(projects));
      localStorage.setItem('devlens_scan_results', JSON.stringify(scanResultMap));
    } catch {}
  }, [projects, scanResultMap]);

  const handleSelectProject = (proj: Project) => {
    setActiveProject(proj);
    if (scanResultMap[proj.id]) {
      setScanResult(scanResultMap[proj.id]);
    }
  };

  const handleImportSuccess = (newProj: Project, newScanResult: ScanResult) => {
    setProjects((prev) => [newProj, ...prev.filter((p) => p.id !== newProj.id)]);
    setScanResultMap((prev) => ({ ...prev, [newProj.id]: newScanResult }));
    setActiveProject(newProj);
    setScanResult(newScanResult);
    setIsImportModalOpen(false);
    setCurrentPage('dashboard');
  };

  const handleTriggerQuickScan = () => {
    setCurrentPage('scan');
  };

  const renderMainContent = () => {
    if (!activeProject || !scanResult) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
            DL
          </div>
          <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
            No Repository Loaded
          </h2>
          <p className="text-xs text-[#888] font-mono max-w-md leading-relaxed">
            Please import a GitHub repository link or select local project files to begin client-side machine learning analysis.
          </p>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Import GitHub Repo / Local Files
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            activeProject={activeProject}
            onSelectProject={handleSelectProject}
            onNavigate={setCurrentPage}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        );
      case 'scan':
        return (
          <ScanView
            activeProject={activeProject}
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onUpdateScanResult={(newResult) => {
              setScanResult(newResult);
              setScanResultMap((prev) => ({ ...prev, [newResult.projectId]: newResult }));
              setActiveProject((prev) =>
                prev
                  ? {
                      ...prev,
                      healthScore: newResult.scores.health,
                      performanceScore: newResult.scores.performance,
                      designScore: newResult.scores.designConsistency,
                      accessibilityScore: newResult.scores.accessibility,
                      maintainabilityScore: newResult.scores.maintainability,
                      debtScore: newResult.scores.technicalDebt,
                      totalLinesOfCode: newResult.metrics.totalLOC,
                      componentCount: newResult.metrics.totalComponents,
                      totalFiles: newResult.metrics.totalFiles,
                    }
                  : null
              );
            }}
          />
        );
      case 'components':
        return (
          <ComponentsView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'code-quality':
        return (
          <CodeQualityView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'design':
        return (
          <DesignView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'performance':
        return (
          <PerformanceView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'accessibility':
        return (
          <AccessibilityView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'dependencies':
        return (
          <DependenciesView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'git':
        return (
          <GitView scanResult={scanResult} onNavigate={setCurrentPage} />
        );
      case 'ml-models':
        return (
          <MLDashboardView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView scanResult={scanResult} onNavigate={setCurrentPage} />
        );
      case 'reports':
        return (
          <ReportsView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
      case 'settings':
        return <SettingsView onNavigate={setCurrentPage} />;
      default:
        return (
          <DashboardView
            scanResult={scanResult}
            onNavigate={setCurrentPage}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0B]">
        {/* Top App Header */}
        <Header
          projects={projects}
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          onTriggerQuickScan={handleTriggerQuickScan}
          onOpenAssistant={() => setAssistantOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          currentPage={currentPage}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-[#0A0A0B]">
          {renderMainContent()}
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-8 border-t border-[#222224] bg-[#0E0E10] flex items-center justify-between px-4 text-[10px] font-mono text-[#555] flex-shrink-0 z-10 select-none">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              <span>
                SCANNER ACTIVE: {scanResult ? `${scanResult.metrics.totalFiles} FILES PROCESSED` : 'AWAITING IMPORT'}
              </span>
            </div>
            <div className="hidden sm:block">MEMORY: 412MB</div>
            <div className="hidden sm:block">LATENCY: 12ms</div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-400 font-semibold">CLIENT-SIDE ML MODE</span>
            <span>DEVLENS ML CORE v1.2</span>
          </div>
        </footer>
      </div>

      {/* Import Repository Modal */}
      <ImportProjectModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        isInitialSetup={projects.length === 0}
      />

      {/* Embedded Gemini AI Drawer */}
      {scanResult && (
        <DevLensAssistant
          isOpen={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          scanResult={scanResult}
        />
      )}
    </div>
  );
}
