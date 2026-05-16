# schmancy-fab

> Material 3 Floating Action Button. Faithful to the M3 spec
> (m3.material.io/components/floating-action-button) and the `md-fab`
> reference implementation (github.com/material-components/material-web):
> four colour variants, three sizes, an extended form, and a lowered
> elevation register. Adds schmancy's house `magnetic` pull + spring press.

## Usage
```html
<!-- Regular FAB (icon-only) -->
<schmancy-fab aria-label="Compose"><schmancy-icon>edit</schmancy-icon></schmancy-fab>

<!-- Extended FAB -->
<schmancy-fab label="Compose" variant="primary">
  <schmancy-icon>edit</schmancy-icon>
</schmancy-fab>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'surface' \| 'primary' \| 'secondary' \| 'tertiary'` | `'surface'` | M3 colour role. `surface` = `surface-containerHigh` container + `primary` icon; the others use the matching `*-container` / `*-onContainer` pair |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Container size: 40 / 56 / 96 dp. Ignored while extended |
| `label` | `string` | `''` | A non-empty value switches the FAB to its **extended** form (icon + text), exactly as `md-fab` derives extended from a truthy label |
| `extended` | `boolean` | `false` | Reflected mirror of "`label` is non-empty"; drives the extended geometry. Set automatically from `label` — read it, don't set it |
| `lowered` | `boolean` | `false` | M3 lowered FAB: elevation drops to level 1 (resting) / level 2 (hover) |

Per M3 guidance a FAB is **never disabled** — there is no `disabled`
property, matching `md-fab`.

## Slots
| Slot | Description |
|------|-------------|
| (default) | The icon, typically `<schmancy-icon>`. Auto-sized per FAB size (24dp; 36dp for `large`) and given `aria-hidden` when an accessible name is present |

## M3 tokens (exact)
| | small | medium | large | extended |
|--|--|--|--|--|
| container | 40×40 | 56×56 | 96×96 | 56 tall, content wide |
| shape (radius) | 12dp | 16dp | 28dp | 16dp |
| icon | 24dp | 24dp | 36dp | 24dp |

Extended paddings: `padding-inline-start: 16px`, `padding-inline-end: 20px`,
icon-to-label gap `12px` — verbatim from `md-fab`'s shared styles. Label is
the `label-large` type scale.

Elevation maps to schmancy's M3 elevation tokens
(`--schmancy-sys-elevation-*`): resting **level 3**, hover **level 4**;
lowered → resting **level 1**, hover **level 2**. Pressed elevation equals
resting per M3 (the press read is the state layer + spring scale).

State layer: hover `0.08`, focus/pressed `0.10`, tinted with the variant's
on-colour.

## Physics (schmancy house style)
- **magnetic** directive embedded (strength 3, radius 60px) — same pull as `schmancy-button`.
- Hover raises elevation per M3; active applies a spring `scale(0.96)`.
- `prefers-reduced-motion` removes the transition and the press scale.

## Examples
```html
<!-- Small surface FAB -->
<schmancy-fab size="small" aria-label="Add"><schmancy-icon>add</schmancy-icon></schmancy-fab>

<!-- Large tertiary FAB -->
<schmancy-fab size="large" variant="tertiary" aria-label="Create">
  <schmancy-icon>add</schmancy-icon>
</schmancy-fab>

<!-- Lowered extended secondary FAB -->
<schmancy-fab lowered label="New message" variant="secondary">
  <schmancy-icon>edit</schmancy-icon>
</schmancy-fab>
```
