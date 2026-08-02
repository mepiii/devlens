export type PageType =
  | 'dashboard'
  | 'projects'
  | 'scan'
  | 'components'
  | 'code-quality'
  | 'design'
  | 'performance'
  | 'accessibility'
  | 'dependencies'
  | 'git'
  | 'ml-models'
  | 'analytics'
  | 'reports'
  | 'settings';

export interface Project {
  id: string;
  name: string;
  framework: 'React' | 'Next.js' | 'Vue' | 'Nuxt' | 'Angular' | 'Svelte' | 'Astro';
  repository: string;
  branch: string;
  lastScanDate: string;
  healthScore: number;
  performanceScore: number;
  designScore: number;
  accessibilityScore: number;
  maintainabilityScore: number;
  debtScore: number;
  totalLinesOfCode: number;
  componentCount: number;
  totalFiles: number;
  issueCount: number;
  isSample?: boolean;
}

export interface ComponentMetric {
  id: string;
  name: string;
  path: string;
  linesOfCode: number;
  cyclomaticComplexity: number;
  reusabilityScore: number; // 0-100
  duplicateSimilarity?: number; // 0-100
  duplicateOf?: string;
  isOversized: boolean;
  isUnused: boolean;
  category: 'Button' | 'Card' | 'Form' | 'Layout' | 'Modal' | 'Navigation' | 'Data Table' | 'Misc';
  propsCount: number;
  reRenderHotspot: boolean;
}

export interface RefactoringSuggestion {
  id: string;
  componentName: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  type: 'component_split' | 'memoization' | 'dead_code' | 'design_token' | 'accessibility' | 'prop_drilling';
  explanation: string;
  shapImpact: number; // impact on model maintainability score
  beforeCode: string;
  afterCode: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0 to 1
  category: 'code' | 'design' | 'performance' | 'deps' | 'git';
  shapValue: number;
  description: string;
}

export interface ModelPrediction {
  modelName: 'Random Forest' | 'XGBoost' | 'LightGBM' | 'CatBoost' | 'CodeBERT / Vector Search';
  target: string;
  prediction: string | number;
  confidence: number; // 0-100%
  status: 'passed' | 'warning' | 'risk';
}

export interface ColorToken {
  hex: string;
  usages: number;
  mappedToken?: string;
  isOutlier: boolean;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  usages: number;
  isScaleCompliant: boolean;
}

export interface DependencyMetric {
  name: string;
  currentVersion: string;
  latestVersion: string;
  healthScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  weeklyDownloads: string;
  license: string;
  vulnerabilities: number;
  isOutdated: boolean;
}

export interface CommitActivity {
  week: string;
  commits: number;
  additions: number;
  deletions: number;
  maintainabilityIndex: number;
}

export interface ScanResult {
  projectId: string;
  projectName: string;
  timestamp: string;
  scores: {
    health: number;
    performance: number;
    designConsistency: number;
    accessibility: number;
    maintainability: number;
    technicalDebt: number;
    overallQuality: number;
  };
  metrics: {
    totalLOC: number;
    totalFiles: number;
    totalComponents: number;
    duplicateComponentsCount: number;
    oversizedComponentsCount: number;
    unusedComponentsCount: number;
    technicalDebtHours: number;
    debtCostUSD: number;
    bundleEstimatedSizeMB: number;
    wcagScore: number;
  };
  components: ComponentMetric[];
  refactorings: RefactoringSuggestion[];
  featureImportances: FeatureImportance[];
  modelPredictions: ModelPrediction[];
  colors: ColorToken[];
  typography: TypographyToken[];
  dependencies: DependencyMetric[];
  gitActivity: CommitActivity[];
}
