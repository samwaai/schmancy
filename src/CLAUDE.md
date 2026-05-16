# Schmancy library source — agent brief

This file lives in the source tree. It tells you what's specific to
**authoring schmancy components**. For the public surface (every tag,
every service, every convention downstream consumers see), the
authoritative docs are in `skills/schmancy/`. Cross-link rather than
duplicate — those docs are checked into the npm tarball and rendered
by the Claude Code plugin. Drift here means drift everywhere.

## Where to read first

- `skills/schmancy/INDEX.md` — full catalog of public tags and services.
- `skills/schmancy/SKILL.md` — non-negotiable conventions every consumer follows.
- `skills/schmancy/mixins.md` — `SchmancyElement` base class (what every component extends).
- `skills/schmancy/state.md` — `state()` factory + `<schmancy-context>` scoping.
- `skills/schmancy/overlay.md` — `show()` + `confirm()` + `prompt()`; the only overlay primitives.
- `skills/schmancy/directives.md` — Lit + schmancy directives.

## Source-author rules (not in the consumer docs)

### Host sizing — `inline-flex` + `flex-1` pattern

Every component whose `:host` carries visual affordances (box-shadow, transform) must follow the same pattern native `<button>` uses:

```css
/* ✓ correct */
:host { display: inline-flex; }          /* host is a flex container */
:host([width="full"]) { display: flex; width: 100%; }
```

```typescript
/* inner interactive element */
'flex-1 ...' : true,   /* ✓ resolves against the flex container's available space */
'w-full ...' : true,   /* ✗ resolves against the containing block content-box — wrong when host is blockified by a parent flex layout */
```

**Why `flex-1` not `w-full`:** when a flex/grid parent stretches the `<schmancy-button>` host, `width: 100%` on the inner `<button>` resolves against the host's *containing-block content-box*, which remains content-sized for `inline-flex` hosts. The outer (flex-stretched) size and the inner (content-sized) size split — the inner element is narrower than the host, so `:host(:hover)` box-shadow fires across the full stretched area while the visible button fill is narrower. `flex-1` uses `flex-basis: 0` + grow, which resolves against the flex container's *available space* — always the stretched width — with no circular-percentage issue. This matches native `<button>` behavior: content-sized inline, stretches in flex containers.

**Applies to:** `schmancy-button`, `schmancy-icon-button`, and any future component with host-level visual affordances.

### Component skeleton

Every concrete component:

```typescript
import { SchmancyElement } from '@mixins/index'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('schmancy-{name}')
export class Schmancy{Name} extends SchmancyElement {
  static styles = [css`:host { display: block }`]
  render() { return html`<slot></slot>` }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-{name}': Schmancy{Name}
  }
}
```

- Never extend raw `LitElement`.
- Never wrap with `SignalWatcher` — `SchmancyElement` already does. Double-wrapping panics with "Detected cycle in computations" at runtime; the `NO_SIGNAL_WATCHER_WRAP` pre-edit lint rule blocks it.
- The `$LitElement(style?)` factory in `mixins/litElement.mixin.ts` is a deprecated alias kept for the migration window. **Do not use it in new files.** The `PREFER_SCHMANCY_ELEMENT` pre-edit lint rule flags new uses; the migration section in `skills/schmancy/mixins.md` documents the rewrite.
- Register the tag in `HTMLElementTagNameMap` so consumers get TypeScript completion on `<schmancy-{name}>`.
- Export through `src/{name}/index.ts` and surface from `src/index.ts`.

### Styling

Two patterns, both end up in `static styles`:

```typescript
// Simple: inline css template literal
static styles = [css`:host { display: block }`]

// Complex: external SCSS via Vite ?inline import
import style from './component.scss?inline'
static styles = [unsafeCSS(style)]   // unsafeCSS converts the string → CSSResult
```

Tailwind utilities work in templates without import — `SchmancyElement`
injects the project Tailwind sheet into every shadow root. `static
styles` only carries component-local CSS.

### Slot content processing

Components that consume slotted children (select, autocomplete, chips,
menu) use `@queryAssignedElements` and wire handlers in `firstUpdated`:

```typescript
@queryAssignedElements({ flatten: true })
private _options!: SchmancyOption[]

firstUpdated() {
  this._options.forEach((option, index) => {
    option.tabIndex = -1
    if (!option.id) option.id = `${this.id}-option-${index}`
  })
}
```

### RxJS internals

Long-lived component state is a `BehaviorSubject` plus a derived stream:

```typescript
private _value$ = new BehaviorSubject<T>(initial)

connectedCallback() {
  super.connectedCallback()
  combineLatest([this._value$, this._open$])
    .pipe(takeUntil(this.disconnecting))
    .subscribe(([value, open]) => { /* … */ })
}
```

- Every subscription ends with `.pipe(takeUntil(this.disconnecting))`.
- Form components (`select`, `autocomplete`, `chips`) carry an explicit
  `multi: boolean` mode flag and route `value` through two
  BehaviorSubjects (`_value$`, `_values$`). They never infer mode from
  which setter was called. Before writing a new field, read
  `mixins/formField.mixin.ts` and mirror
  `src/form/fields/select/select.ts` (the canonical single/multi field).

### Custom events

Type the detail and dispatch with `bubbles: true, composed: true`:

```typescript
export type SchmancyChangeEvent = CustomEvent<{ value: string }>

this.dispatchEvent(
  new CustomEvent<SchmancyChangeEvent['detail']>('change', {
    detail: { value: this.value },
    bubbles: true,
    composed: true,
  }),
)
```

For a **form field** (a control `<schmancy-form>` collects), emit `change`
through the mixin's `emitChange({ value })` instead of hand-rolling
`dispatchEvent`. It guarantees `composed: true` so the event crosses the
shadow boundary the form listens across — the recurring field bug is a
hand-rolled dispatch that forgets that flag. See `emitChange` in
`mixins/formField.mixin.ts`.

### Accessibility

Form components carry the ARIA combobox pattern (`role="combobox"`,
`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`) and a
visually-hidden live region for status announcements:

```html
<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>
```

Use `delegatesFocus: true` in `shadowRootOptions` for components whose
internal first-focusable element should receive focus when the host
does:

```typescript
protected static shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  mode: 'open',
  delegatesFocus: true,
}
```

### State within a component

Module-scoped reactive state lives on `state(...)` from
`@mhmo91/schmancy/state` — see `skills/schmancy/state.md`. Inside a
component instance, use `@state` (Lit) for private template-driving
fields and `@property` for public attributes.

### Theme consumption

Components that need theme tokens consume the Lit context:

```typescript
@consume({ context: themeContext })
theme!: Partial<TSchmancyTheme>
```

Theme CSS variables are auto-generated as `--schmancy-{path}`. Prefer
the Tailwind shortcut utilities (`bg-surface-default`,
`text-error-default`, `border-outline-variant`) over raw
`var(--schmancy-sys-color-X)` references — the token map lives in
`skills/schmancy/theme.md § Tailwind utilities`.

## Validation patterns (form components)

`checkValidity()`, `reportValidity()`, `setCustomValidity()`, the
`validateOn` truth table, and `internals.setValidity` wiring all come from
`FormFieldMixin` (`mixins/formField.mixin.ts`). A new field adopts them by
extending `SchmancyFormField(styles)` — it does not hand-roll its own
validity. The two cases that *do* require an override are array-typed
values: empty-array `required` (the mixin's `value === ''` test passes for
`[]`) and `setFormValue` for arrays (the platform API rejects arrays).
`src/form/fields/select/select.ts` shows both — read it before authoring a
field's validity.

## Pointers

- **State module brief:** `src/state/CLAUDE.md` — invariants for code under `src/state/`.
- **Lab acceptance criterion:** `lab/README.md` — what does and doesn't belong in `@mhmo91/schmancy-lab`.
