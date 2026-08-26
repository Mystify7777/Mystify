# Mystify Observatory

The implementation repository for Mystify Observatory, a portfolio operating system built around Recruiter, Explorer, and Engineer lenses.

## Foundation

Issue #1 establishes the implementation baseline only. It intentionally does not implement the Observatory modes or feature applications.

### Stack

- Next.js + TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- ESLint + Prettier

### Source layout

```text
src/
├── app/                 # Next.js application entrypoints
├── components/          # Shared UI and shell primitives
├── data/                # Canonical registry/domain models
├── features/            # Feature-specific implementations
├── lib/                 # Shared non-domain utilities
└── state/               # Shared session/application state
```

The architecture follows the Master Context v2 rule that domain truth is not duplicated in presentation layers.

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run type-check
npm run lint
npm run format:check
npm run build
```

The feature backlog is maintained in GitHub Issues, beginning with issue #1 and proceeding through the dependency order defined there.
