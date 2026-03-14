# Architecture

This project uses a feature-first Clean Architecture structure.

## Goals

- Keep business rules independent from UI details.
- Isolate data access behind repository contracts.
- Keep feature code cohesive and easy to evolve in small commits.
- Make user-story development incremental and traceable.

## Top-Level Layout

- `src/core`
  - App-level composition and entry pages.
- `src/shared`
  - Cross-feature utilities and reusable presentation primitives.
- `src/features`
  - Feature modules that own their own data, domain, and presentation layers.

## File Explorer Module

`src/features/file-explorer`

- `data`
  - `database/fileData.json`: file-tree dataset.
  - `repository_impl/StaticFileTreeRepository.ts`: repository implementation for local JSON.
- `domain`
  - `entities/FileNode.ts`: domain model for files/folders.
  - `repository/FileTreeRepository.ts`: repository contract.
  - `services/fileTreeTraversal.ts`: recursive traversal helpers (visible flattening, search, filtering, path building).
  - `usecase/*`: orchestration for tree retrieval, visibility, search/filter, and breadcrumb path.
- `presentation`
  - `hooks/useFileExplorer.ts`: feature controller state (expand/collapse, selection, focus, keyboard nav, search).
  - `components/*`: explorer UI (tree, properties panel, search bar, icons).

## Dependency Direction

- `presentation` can depend on `domain` and feature `data` implementations.
- `domain` must not depend on `presentation`.
- `data` implements `domain` contracts.
- `core` composes features and routes/pages.

## Implemented Stories

- Story 1: Recursive tree rendering with expand/collapse.
- Story 2: Selection state and properties panel metadata.
- Story 3: Keyboard accessibility (`Up/Down`, `Right/Left`, `Enter`).
- Story 4 (Wildcard): Breadcrumb path context in properties panel.
- Story 5 (Bonus): Search + filtered tree + auto-expand for deep matches.

## Extension Guidance

- Add new product capabilities under `src/features/<feature-name>`.
- Add to `src/shared` only after true cross-feature reuse appears.
- Keep domain logic framework-agnostic and testable.
- Prefer new user stories as separate commits for audit-ready history.
