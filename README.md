# Monorepo Task List

A small task app built twice inside one monorepo. Both frontends use the same Convex data and shared shadcn/ui components, which makes the repository useful for testing workspace boundaries instead of pretending a starter template is a product.

[Open the side-by-side comparison](https://tasks-monorepo.experiments.kigo.ke)

## Apps and packages

| Path | Purpose |
| --- | --- |
| `apps/web` | First task-list interface |
| `apps/web2` | Second interface over the same task data |
| `apps/overview` | Displays both deployed apps side by side |
| `packages/backend` | Convex schema and task functions |
| `packages/ui` | Shared shadcn/ui components |
| `packages/eslint-config` | Shared ESLint rules |
| `packages/typescript-config` | Shared TypeScript settings |

The two task apps can create, update, complete, and delete the same records. Changes in one appear in the other through Convex subscriptions.

## Run it locally

The workspace uses Bun and Turborepo.

```bash
bun install
bun run --cwd packages/backend setup
bun run dev
```

Convex writes `NEXT_PUBLIC_CONVEX_URL` for the apps during setup. The three Next.js apps need separate ports when you run them together.

## Checks

```bash
bun run lint
bun run typecheck
bun run build
```

## Add a shared component

Run the shadcn CLI from the repository root and target one of the web apps.

```bash
bunx shadcn@latest add button -c apps/web
```

The component is written to `packages/ui` and imported through `@workspace/ui`.
