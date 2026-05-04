# Schmancy

A Web Component UI library built on Lit, RxJS, and Tailwind CSS. Surfaces are glass. Depth is light. Interactions are physics.

## Agent runtime

For sandboxed-iframe agents (Claude Design, Claude Artifacts, any LLM that can
only write HTML), schmancy ships a single-URL runtime at `@mhmo91/schmancy/agent`.
Drop one `<script type="module">` tag and every `<schmancy-*>` element is
registered. No bundler, no bare specifiers, no npm install.

```html
<script type="module">
  import 'https://esm.sh/@mhmo91/schmancy/agent';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button>Hi</schmancy-button>
  </schmancy-surface>
</schmancy-theme>
```

The same entry re-exports the full library surface for in-page script
code (`theme`, `area`, `state`, `show`, `lazy`, every directive, every
service, `SchmancyElement`). Import from the same URL.

For introspection — every tag's attributes, events, slots, CSS parts,
plus the enum `values` array on every typed attribute (so agents don't
have to parse `"'filled' | 'tonal' | ..."` strings) — read the static
manifest at `@mhmo91/schmancy/agent/manifest`. It's a JSON file, shape
follows Custom Elements Manifest v1.

## Install

```bash
npm install @mhmo91/schmancy
```

```typescript
import '@mhmo91/schmancy'
import { magnetic, cursorGlow, gravity } from '@mhmo91/schmancy/directives'
```

## Use with Claude Code

Schmancy ships a Claude Code plugin (manifest at `.claude-plugin/plugin.json`,
skill source under `skills/schmancy/`). The npm tarball includes both, so
after `npm install @mhmo91/schmancy`, point Claude at the package directory
when launching:

```
claude --plugin-dir node_modules/@mhmo91/schmancy
```

Set a shell alias / `.envrc` so every session in the project picks it up.
After editing plugin files, run `/reload-plugins` inside the session.

Claude now knows every Schmancy component, foundation pattern, and
convention; the skill activates automatically when you work on schmancy
code — no CLAUDE.md edits, no symlinks.

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

- **Foundations** — [Area](./skills/schmancy/area.md) · [State](./skills/schmancy/state.md) · [Mixins (SchmancyElement)](./skills/schmancy/mixins.md) · [Theme](./skills/schmancy/theme.md) · [Directives](./skills/schmancy/directives.md)
- **Atoms** — [Typography](./skills/schmancy/typography.md) · [Icons](./skills/schmancy/icons.md) · [Button](./skills/schmancy/button.md) · [Surface](./skills/schmancy/surface.md) · [Divider](./skills/schmancy/divider.md) · [Avatar](./skills/schmancy/avatar.md)
- **Composites (by job)** — Forms, Navigation, Overlays, Interaction, Feedback, Display
- **Utilities** — [Animation](./skills/schmancy/animation.md) · [Audio](./skills/schmancy/audio.md) · [Discovery](./skills/schmancy/discovery.md) · [RxJS Utils](./skills/schmancy/rxjs-utils.md) · [Utils](./skills/schmancy/utils.md)

**Full component index:** [skills/schmancy/INDEX.md](./skills/schmancy/INDEX.md) — the single-file map with every tag, service, and convention. Written primarily for AI agents; humans welcome.

## Tech Stack

[Lit](https://lit.dev) · [RxJS](https://rxjs.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Blackbird](./src/utils/animation.ts)

## License

Apache-2.0
