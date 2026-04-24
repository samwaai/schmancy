# Schmancy

A Web Component UI library built on Lit, RxJS, and Tailwind CSS. Surfaces are glass. Depth is light. Interactions are physics.

## Agent runtime

For sandboxed-iframe agents (Claude Design, Claude Artifacts, any LLM that can
only write HTML), schmancy ships a single-URL runtime at `@mhmo91/schmancy/agent`.
Drop one `<script type="module">` tag and every `<schmancy-*>` element is
registered. No bundler, no bare specifiers, no npm install.

```html
<script type="module">
  import { $dialog, theme } from 'https://esm.sh/@mhmo91/schmancy/agent';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button>Hi</schmancy-button>
    <schmancy-skill></schmancy-skill>
  </schmancy-surface>
</schmancy-theme>
```

The `<schmancy-skill>` tag installs `window.schmancy` for runtime discovery:

- `window.schmancy.help()` — full manifest (CEM v1 shape).
- `window.schmancy.help('schmancy-button')` — one tag's attributes, events, slots, CSS parts.
- `window.schmancy.tokens()` — build-time-extracted list of `--schmancy-*` theme tokens.
- `window.schmancy.manifestUrl` — Blob URL; `fetch()` it for the same data.
- `window.schmancy.a11yAudit()` — walks the live DOM and reports ARIA / shadow-root / form-association status per instance.
- `window.schmancy.platformPrimitive('schmancy-dialog')` — map to the native element a component wraps (present when the component's JSDoc has `@platform`).
- `window.schmancy.capabilities()` — runtime feature probe (`popover`, `declarativeShadowDom`, `scopedRegistries`, `trustedTypes`, `cssRegisteredProperties`, `elementInternalsAria`, `formAssociated`, `adoptedStyleSheets`). Agents use this to adapt to the sandbox they're in rather than the one they expect.

Every enum-typed attribute carries a `values` array — e.g. `schmancy-button`'s `variant` ships `["elevated", "filled", "filled tonal", "tonal", "outlined", "text"]` so agents never have to parse `"'filled' | 'tonal' | ..."` strings.

The manifest is also emitted as a sibling file at `@mhmo91/schmancy/agent/manifest`
for tooling that prefers reading JSON from disk.

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
