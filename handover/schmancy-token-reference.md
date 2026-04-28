# schmancy token reference

Every token your design can lean on, grouped by what it's for. Use the **Tailwind class** column when styling — every system token is exposed as a Tailwind utility, so reach for `bg-primary-default` or `text-surface-on` before the raw CSS variable. The CSS variable column is the fallback for properties Tailwind doesn't cover (e.g. `box-shadow`, `transition-duration`).

Source of truth: `src/theme/theme.interface.ts` in this repo. The flat list of every `--schmancy-sys-*` property name also ships in the static manifest at `dist/agent/schmancy.manifest.json` under the `tokens` field.

> **Never use raw hex** (`#6200ee`) **or arbitrary values** (`bg-[#ff0000]`). Both defeat theming — the whole palette is regenerated from `<schmancy-theme color="…">` and your hardcoded color won't follow scheme switches.

## Color tokens

### Primary, secondary, tertiary

The brand-color family + two complement families. Each has four roles: the default fill, an "on" color for text on top of that fill, a softer container variant, and an "on-container" color for text on the container.

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--schmancy-sys-color-primary-default` | `bg-primary-default` / `text-primary-default` / `border-primary-default` | Primary action button fills, active-state highlights |
| `--schmancy-sys-color-primary-on` | `bg-primary-on` / `text-primary-on` | Text/icons sitting on `primary-default` |
| `--schmancy-sys-color-primary-container` | `bg-primary-container` / `text-primary-container` | Softer primary surfaces — selected chips, info banners |
| `--schmancy-sys-color-primary-onContainer` | `text-primary-onContainer` | Text/icons on `primary-container` |
| `--schmancy-sys-color-primary-fixed` | `bg-primary-fixed` | Primary fill that stays the same in light/dark schemes |
| `--schmancy-sys-color-primary-fixedDim` | `bg-primary-fixedDim` | Subdued variant of `primary-fixed` |
| `--schmancy-sys-color-primary-onFixed` | `text-primary-onFixed` | Text on `primary-fixed` |
| `--schmancy-sys-color-primary-onFixedVariant` | `text-primary-onFixedVariant` | Secondary text on `primary-fixed` |

Same eight roles exist for `secondary-*` and `tertiary-*`. Replace `primary` with `secondary` / `tertiary` in any token name above.

### Surface

The neutral background family — what everything else sits on. Schmancy uses Material 3's surface tonal levels.

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--schmancy-sys-color-surface-default` | `bg-surface-default` | Default page background |
| `--schmancy-sys-color-surface-bright` | `bg-surface-bright` | Brighter than default — emphasis surface |
| `--schmancy-sys-color-surface-dim` | `bg-surface-dim` | Dimmer than default — recessed surface |
| `--schmancy-sys-color-surface-container` | `bg-surface-container` | Cards, sheets, base "lifted" surface |
| `--schmancy-sys-color-surface-containerLowest` | `bg-surface-containerLowest` | Most-recessed container tier |
| `--schmancy-sys-color-surface-containerLow` | `bg-surface-containerLow` | App bar, low-emphasis surfaces |
| `--schmancy-sys-color-surface-containerHigh` | `bg-surface-containerHigh` | Prominent cards, hover state |
| `--schmancy-sys-color-surface-containerHighest` | `bg-surface-containerHighest` | Top of the elevation stack |
| `--schmancy-sys-color-surface-on` | `text-surface-on` | Default text color on any surface |
| `--schmancy-sys-color-surface-onVariant` | `text-surface-onVariant` | Secondary / muted text |
| `--schmancy-sys-color-surface-tint` | — | Tint applied to elevated surfaces |

### Inverse

For "this is the opposite scheme from the rest of the page" surfaces — typically used in toasts, snackbars, contrast-mode tooltips.

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--schmancy-sys-color-inverse-surface` | `bg-inverse-surface` | Snackbar / toast background |
| `--schmancy-sys-color-inverse-onSurface` | `text-inverse-onSurface` | Text on `inverse-surface` |
| `--schmancy-sys-color-inverse-primary` | `text-inverse-primary` | Primary-coloured text on `inverse-surface` |

### Outline

Borders, dividers, and form-control strokes.

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--schmancy-sys-color-outline` | `border-outline` | Default 1px border |
| `--schmancy-sys-color-outlineVariant` | `border-outline-variant` | Quieter dividers (between list rows, table cells) |

### Status

Error, success, warning, info — each has the same four-role structure as primary/secondary/tertiary.

| Family | Default | On | Container | OnContainer |
|---|---|---|---|---|
| **Error** | `bg-error-default` | `text-error-on` | `bg-error-container` | `text-error-onContainer` |
| **Success** | `bg-success-default` | `text-success-on` | `bg-success-container` | `text-success-onContainer` |
| **Warning** | `bg-warning-default` | `text-warning-on` | `bg-warning-container` | `text-warning-onContainer` |
| **Info** | `bg-info-default` | `text-info-on` | `bg-info-container` | `text-info-onContainer` |

### Utility

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--schmancy-sys-color-scrim` | `bg-scrim` | Modal/sheet backdrop overlay |
| `--schmancy-sys-color-shadow` | — | Drop-shadow color (use via `--schmancy-sys-elevation-*` instead of directly) |

## Typography tokens

15 typescale slots — each combines font-size, line-height, weight, letter-spacing.

| CSS variable | Use via `<schmancy-typography>` |
|---|---|
| `--schmancy-sys-typescale-display-large` | `preset="display-lg"` or `type="display" token="lg"` |
| `--schmancy-sys-typescale-display-medium` | `preset="display-md"` |
| `--schmancy-sys-typescale-display-small` | `preset="display-sm"` |
| `--schmancy-sys-typescale-headline-large` | `preset="heading-lg"` |
| `--schmancy-sys-typescale-headline-medium` | `preset="heading-md"` |
| `--schmancy-sys-typescale-headline-small` | `preset="heading-sm"` |
| `--schmancy-sys-typescale-title-large` | `preset="title-lg"` |
| `--schmancy-sys-typescale-title-medium` | `preset="title-md"` |
| `--schmancy-sys-typescale-title-small` | `preset="title-sm"` |
| `--schmancy-sys-typescale-body-large` | `preset="body-lg"` |
| `--schmancy-sys-typescale-body-medium` | `preset="body-md"` |
| `--schmancy-sys-typescale-body-small` | `preset="body-sm"` |
| `--schmancy-sys-typescale-label-large` | `preset="label-lg"` |
| `--schmancy-sys-typescale-label-medium` | `preset="label-md"` |
| `--schmancy-sys-typescale-label-small` | `preset="label-sm"` or `preset="caption"` |

For semantic HTML (heading levels in the accessibility tree) add `as="h1".."h6" | "p" | "span" | "div"`:

```html
<schmancy-typography preset="heading-md" as="h2">Section title</schmancy-typography>
```

## Shape tokens

Border-radius scale.

| CSS variable | Tailwind class | Default value |
|---|---|---|
| `--schmancy-sys-shape-corner-none` | `rounded-none` | 0 |
| `--schmancy-sys-shape-corner-extraSmall` | `rounded` | 4px |
| `--schmancy-sys-shape-corner-small` | `rounded-md` | 8px |
| `--schmancy-sys-shape-corner-medium` | `rounded-lg` | 12px |
| `--schmancy-sys-shape-corner-large` | `rounded-xl` | 16px |
| `--schmancy-sys-shape-corner-extraLarge` | `rounded-2xl` | 28px |
| `--schmancy-sys-shape-corner-full` | `rounded-full` | 9999px |

## Spacing tokens

12-step spacing scale. Use Tailwind utilities directly (`p-4`, `gap-6`, `mt-2`) — they map to these tokens.

| CSS variable | Tailwind |
|---|---|
| `--schmancy-sys-spacing-0`..`12` | `p-0` / `p-1` / … / `p-12`, also `m-*`, `gap-*`, `space-y-*` |

## Elevation tokens

Six elevation tiers (Material 3). Use as a `box-shadow` value.

| CSS variable | Tier | Typical use |
|---|---|---|
| `--schmancy-sys-elevation-0` | Flat | Default — no shadow |
| `--schmancy-sys-elevation-1` | +1dp | Outlined cards, raised buttons |
| `--schmancy-sys-elevation-2` | +3dp | Default cards, app bar |
| `--schmancy-sys-elevation-3` | +6dp | Default dialog, FAB |
| `--schmancy-sys-elevation-4` | +8dp | Modal nav drawer |
| `--schmancy-sys-elevation-5` | +12dp | Lifted dialog, menu hover |

## Motion tokens

### Durations

| CSS variable | Default | Use for |
|---|---|---|
| `--schmancy-sys-motion-duration-short1`..`short4` | 50–200ms | Hover states, ripple, tooltip |
| `--schmancy-sys-motion-duration-medium1`..`medium4` | 250–400ms | Card flip, sheet slide, dialog |
| `--schmancy-sys-motion-duration-long1`..`long4` | 450–600ms | Full-screen transitions |
| `--schmancy-sys-motion-duration-extraLong1`..`extraLong4` | 700–1000ms | Hero transitions, splash |

### Easings

| CSS variable | Use for |
|---|---|
| `--schmancy-sys-motion-easing-standard` | Default — most UI transitions |
| `--schmancy-sys-motion-easing-standard-accelerate` | Element exiting / leaving viewport |
| `--schmancy-sys-motion-easing-standard-decelerate` | Element entering / arriving |
| `--schmancy-sys-motion-easing-emphasized` | Emphasized motion (hero) — start slow, end fast then slow |
| `--schmancy-sys-motion-easing-emphasized-accelerate` | Emphasized exit |
| `--schmancy-sys-motion-easing-emphasized-decelerate` | Emphasized enter |
| `--schmancy-sys-motion-easing-linear` | Progress indicators, loading rails |
| `--schmancy-sys-motion-easing-legacy` | Material 2 cubic-bezier — backwards compatibility only |

## State tokens

Opacity multipliers for interactive states.

| CSS variable | Default | Use for |
|---|---|---|
| `--schmancy-sys-state-hover-opacity` | 0.08 | Hover overlay |
| `--schmancy-sys-state-focus-opacity` | 0.10 | Focus-visible outline / overlay |
| `--schmancy-sys-state-pressed-opacity` | 0.12 | Active / pressed overlay |
| `--schmancy-sys-state-dragged-opacity` | 0.16 | Drag handle |
| `--schmancy-sys-state-disabled-opacity` | 0.38 | Disabled foreground |
| `--schmancy-sys-state-disabled-container-opacity` | 0.12 | Disabled background |

## What to avoid

- **`--schmancy-ref-palette-*` tokens.** These are the raw tonal palette (52 tokens — primary-0 through primary-100, etc.) used internally to derive the system tokens above. Never reference them directly; reference the system tokens that wrap them.
- **Hardcoded hex** anywhere (`#6200ee`, `#ff0000`).
- **Tailwind arbitrary values** (`bg-[#ff0000]`, `text-[#000]`).

Both bypass theming and break when `<schmancy-theme color="…" scheme="…">` regenerates the palette.

## Programmatic access

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@{{version}}/dist/agent/schmancy.manifest.json
```

The manifest's `tokens: string[]` field lists every `--schmancy-sys-*` property name. Fetch the JSON, read the field, verify a token exists before referencing it in CSS. No browser runtime required — this is static data ingestible by any consumer.
