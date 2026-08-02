# DevLens

Client-side ML-powered code analysis platform. Computes cyclomatic complexity, detects duplicate components, evaluates design token consistency, and predicts technical debt costs — all in the browser with zero Python dependencies.

## Overview

Analyzes source code ASTs directly in the browser using a pure TypeScript ML engine. Supports GitHub repository import and local folder upload. Computes cyclomatic complexity, coupling indices, design token consistency, and technical debt costs using decision tree models, Jaccard similarity, and SHAP attribution — no server-side processing required.

## Core Architecture

```mermaid
flowchart LR
    User -->|imports| Frontend["Vite SPA (TypeScript)"]
    Frontend -->|GitHub API proxy| Express["Express server.ts"]
    Frontend -->|parses| AST["AST Parser"]
    Frontend -->|features| Engine["ML Engine"]
    Engine -->|complexity| Cyclo["Cyclomatic Analyzer"]
    Engine -->|duplicates| Jaccard["Jaccard Similarity"]
    Engine -->|debt| SHAP["SHAP Attribution"]
    Engine -->|tokens| Design["Token Consistency"]
    Frontend -->|renders| Dashboard["Dashboard Views"]
```

## System Components

| Component | Responsibility |
|---|---|
| `src/lib/mlEngine.ts` | Client-side ML engine — decision trees, Jaccard, SHAP |
| `src/lib/projectImporter.ts` | GitHub API and local file system import |
| `src/App.tsx` | Main shell and state manager |
| `src/components/` | Dashboard, Scan, Import, CodeQuality, DevLensAssistant views |
| `server.ts` | Express backend — GitHub API proxy and static serving |
| `src/types.ts` | Shared TypeScript interfaces |

## Repository Layout

| Directory | Purpose |
|---|---|
| `src/lib/` | ML engine and project importer |
| `src/components/` | UI view components |
| `src/` | App shell, types, entry point |
| `server.ts` | Express dev/prod server |

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Language | TypeScript | Type-safe implementation |
| Build | Vite | Bundler and dev server |
| Runtime | Bun / Node.js | Execution environment |
| Backend | Express | GitHub API proxy, static serving |
| ML | Pure TypeScript | Decision trees, Jaccard, SHAP |
| UI | React | Component framework |

## Requirements

- Node.js 18+ or Bun
- npm or bun

## Configuration

| File | Purpose |
|---|---|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript compiler options |
| `server.ts` | Express server configuration |
| `.env.example` | Environment variable template |

## Getting Started

```bash
cd devlens
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`

## Development

```bash
npm run dev       # Vite dev server + Express
npm run build     # Production build (Vite + esbuild)
npm run start     # Production server
```

## Request / Data Flow

```mermaid
sequenceDiagram
    participant App
    participant Importer
    participant MLEngine
    participant Dashboard

    User->>App: Import GitHub repo
    App->>Importer: Fetch repository files
    Importer-->>App: Source code tree
    App->>MLEngine: Parse ASTs, extract features
    MLEngine->>MLEngine: Compute complexity, Jaccard, SHAP
    MLEngine-->>App: Feature matrix + predictions
    App->>Dashboard: Render quality scores, debt estimates
    Dashboard-->>User: Interactive analysis views
```
