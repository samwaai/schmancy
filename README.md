# Schmancy

A Web Component UI library built on Lit, RxJS, and Tailwind CSS. Surfaces are glass. Depth is light. Interactions are physics.

## For AI consumers — the static manifest

AI tools that author or audit designs against schmancy (Claude Design's source ingestion, IDE tooling, build pipelines) read the static manifest:

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy/dist/agent/schmancy.manifest.json
```

The manifest is the integration point. It carries every component declaration with `tagName`, `summary`, `description`, `whenToUse`, `attributes` (extracted enum `values[]`), `events`, `slots`, `examples`, `platformPrimitive`. It also ships a structured `rules[]` array (16 entries with `id` / `scope` / `severity` / `validator` ids) and a flat `tokens: string[]` of every `--schmancy-sys-*` CSS custom property.

Every enum-typed attribute carries a `values` array — e.g. `schmancy-button`'s `variant` ships `["elevated", "filled", "filled tonal", "tonal", "outlined", "text"]` so consumers never parse TS union strings.

For the agent-facing rules and copy-pasteable usage, see [`handover/claude-design-brief.md`](./handover/claude-design-brief.md).

## Distribution bundle

Standalone HTML and one-page demos can load schmancy without a bundler:

```html
<script type="module">
  import { $dialog, theme } from 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy/dist/agent/schmancy.agent.js';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button>Hi</schmancy-button>
  </schmancy-surface>
</schmancy-theme>
```

One script tag side-effect-registers every `<schmancy-*>` element and exposes the imperative service surface (`$dialog`, `sheet`, `$notify`, `theme`, `area`, etc.). No npm install, no bare specifiers.

> **Note:** earlier versions installed a `window.schmancy.*` runtime introspection surface (`<schmancy-skill>` element, `help()` / `tokens()` / `findFor()` / `capabilities()` helpers). That surface was removed because no shipping consumer used it — Claude Artifacts is CSP-blocked from loading the bundle, Claude Design's LLM is server-side, Claude Code reads TypeScript types. The static manifest above is the actual integration point.

## Install

```bash
npm install @mhmo91/schmancy
```

```typescript
import '@mhmo91/schmancy'
import { magnetic, cursorGlow, gravity } from '@mhmo91/schmancy/directives'
```

## Use with Claude Code

Schmancy ships a Claude Code plugin. In any Claude Code session, run:

```
/plugin install https://github.com/samwaai/schmancy
```

Claude now knows every Schmancy component, foundation pattern, and convention in your project. The skill activates automatically when you work on schmancy code — no CLAUDE.md edits, no symlinks.

## Quick Start

```html
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-area name="root" .default=${lazy(() => import('./home.page'))}>
      <schmancy-route when="home-page" .component=${lazy(() => import('./home.page'))} />
    </schmancy-area>
  </schmancy-surface>
</schmancy-theme>
```

## Design: Luminous Glass

| Surface | Opacity | Blur | Purpose |
|---------|---------|------|---------|
| `solid` | 92% | — | Dense glass, high readability |
| `subtle` | 78% | 8px | Frosted panel (default) |
| `glass` | 55% | 16px | Overlays, dialogs, dropdowns |
| `luminous` | 42% | 20px | Hero panels with glow halo |

## Docs

Schmancy is organized in four layers:

- **Foundations** — [Area](./skills/schmancy/area.md) · [Store](./skills/schmancy/store.md) · [Mixins ($LitElement)](./skills/schmancy/mixins.md) · [Theme](./skills/schmancy/theme.md) · [Directives](./skills/schmancy/directives.md)
- **Atoms** — [Typography](./skills/schmancy/typography.md) · [Icons](./skills/schmancy/icons.md) · [Button](./skills/schmancy/button.md) · [Surface](./skills/schmancy/surface.md) · [Divider](./skills/schmancy/divider.md) · [Avatar](./skills/schmancy/avatar.md)
- **Composites (by job)** — Forms, Navigation, Overlays, Interaction, Feedback, Display
- **Utilities** — [Animation](./skills/schmancy/animation.md) · [Audio](./skills/schmancy/audio.md) · [Discovery](./skills/schmancy/discovery.md) · [RxJS Utils](./skills/schmancy/rxjs-utils.md) · [Utils](./skills/schmancy/utils.md)

**Full component index:** [skills/schmancy/INDEX.md](./skills/schmancy/INDEX.md) — the single-file map with every tag, service, and convention. Written primarily for AI agents; humans welcome.

## Tech Stack

[Lit](https://lit.dev) · [RxJS](https://rxjs.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Blackbird](./src/utils/animation.ts)

## License

Apache-2.0
