# Schmancy

A Web Component UI library built on Lit, RxJS, and Tailwind CSS. Surfaces are glass. Depth is light. Interactions are physics.

## Install

```bash
npm install @mhmo91/schmancy
```

```typescript
import '@mhmo91/schmancy'
import { magnetic, cursorGlow, gravity } from '@mhmo91/schmancy/directives'
```

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

- **Foundations** — [Area](./ai/area.md) · [Store](./ai/store.md) · [Mixins ($LitElement)](./ai/mixins.md) · [Theme](./ai/theme.md) · [Directives](./ai/directives.md)
- **Atoms** — [Typography](./ai/typography.md) · [Icons](./ai/icons.md) · [Button](./ai/button.md) · [Surface](./ai/surface.md) · [Divider](./ai/divider.md) · [Avatar](./ai/avatar.md)
- **Composites (by job)** — Forms, Navigation, Overlays, Interaction, Feedback, Display
- **Utilities** — [Animation](./ai/animation.md) · [Audio](./ai/audio.md) · [Discovery](./ai/discovery.md) · [RxJS Utils](./ai/rxjs-utils.md) · [Utils](./ai/utils.md)

**Full component index:** [ai/INDEX.md](./ai/INDEX.md) — the single-file map with every tag, service, and convention. Written primarily for AI agents; humans welcome.

## Tech Stack

[Lit](https://lit.dev) · [RxJS](https://rxjs.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Blackbird](./src/utils/animation.ts)

## License

Apache-2.0
