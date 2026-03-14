# SecureVault Dashboard

A high-performance, cyber-themed file explorer built with React + TypeScript using a feature-first Clean Architecture approach.

## Live Goals Covered

- Recursive tree explorer for deeply nested folders
- File selection and metadata inspection panel
- Full keyboard navigation for power users
- Wildcard feature: breadcrumb location context
- Bonus feature: search + filter with automatic folder expansion

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Setup Instructions

```bash
# 1) Install dependencies
npm install

# 2) Start development server
npm run dev

# 3) Build for production
npm run build
```

## Design File

- Figma (view-only):

## Data Source

- Root dataset: `data.json`
- Runtime dataset used by the app: `src/features/file-explorer/data/database/fileData.json`

The JSON schema is unchanged (`id`, `name`, `type`, optional `size`, optional `children`).
Additional nodes were added for deeper nesting and performance testing.

## Recursive Strategy

The explorer tree uses recursive rendering and recursive traversal helpers.

### Rendering recursion

- `TreeNode` renders one node, and if a folder is expanded it recursively renders child `TreeNode` components.
- This allows the UI to handle arbitrary depth (2 levels or 20+ levels) without changing component structure.

### Domain recursion

Domain service `fileTreeTraversal.ts` contains recursive algorithms for:

- flattening visible nodes for keyboard navigation
- searching nodes and collecting ancestor folders to auto-expand
- filtering tree branches while preserving hierarchy
- resolving full node path for breadcrumb display

This keeps recursion logic centralized and reusable across user stories.

## Wildcard Feature: Breadcrumb Path Context

### What was added

A breadcrumb path is shown in the properties panel for the selected item.

Example:
`01_Legal_Department > Active_Cases > Doe_vs_MegaCorp_Inc > Case_Summary_Draft_v3.docx`

### Why this adds business value

- Reduces navigation errors in deep hierarchies
- Improves confidence before opening/downloading files
- Speeds up verification workflows for legal and audit teams

## User Stories Implemented

### Story 1: Recursive Tree

- Renders nested folder/file structure from JSON
- Expand/collapse folder behavior
- Works with deep nested trees

### Story 2: File Details & Inspection

- Click to select nodes
- Properties panel shows Name, Type, and Size

### Story 3: Keyboard Accessibility

- `ArrowUp/ArrowDown`: move focus through visible items
- `ArrowRight`: expand folder
- `ArrowLeft`: collapse folder
- `Enter`: select focused file

### Story 4 (Wildcard): Breadcrumb

- Displays full location path for selected node

### Story 5 (Bonus): Search & Filter

- Search filters visible tree nodes
- Matching deep items force ancestor folders to auto-expand
- Match highlighting + match count in footer

## Project Architecture

See: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Submission Notes

- Commit history is split by setup and user-story milestones.
- Component libraries like Material UI/Chakra/Bootstrap are not used.
