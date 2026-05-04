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
- Form components (`select`, `autocomplete`, `chips`) track explicit
  property assignment with flags (`_valueSet`, `_valuesSet`) and
  resync the visible label via `_updateInputDisplay()` in
  `firstUpdated()` and on every programmatic value change.

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
fields and `@property` for public attributes. There is no
`createContext` / `@select` / `createCompoundSelector`; those v1 APIs
were removed and replaced wholesale by `state()` / `@observe` /
`computed`. The migration cheatsheet is `src/state/MIGRATION.md`.

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

```typescript
public checkValidity(): boolean {
  if (!this.required) return true
  return this.multi
    ? this._selectedValues$.value.length > 0
    : Boolean(this._selectedValue$.value)
}

public reportValidity(): boolean {
  return this._inputElementRef.value?.reportValidity() ?? this.checkValidity()
}
```

## Pointers

- **State module brief:** `src/state/CLAUDE.md` — invariants for code under `src/state/`.
- **Migration off v1 contexts:** `src/state/MIGRATION.md`.
- **Lab acceptance criterion:** `lab/README.md` — what does and doesn't belong in `@mhmo91/schmancy-lab`.
