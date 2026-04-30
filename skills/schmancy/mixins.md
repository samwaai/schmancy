# `SchmancyElement`

Base class for Schmancy components. A concrete named class — not a mixin
factory — composing `LitElement` + Tailwind injection + `BaseElement`
(the `disconnecting` Subject, `classMap`, `styleMap`, discovery, `stableId`,
`uid`, `locale`) + `SignalWatcher` (auto-tracks every signal read in `render()`).

## Usage

```typescript
import { SchmancyElement } from '@mhmo91/schmancy/mixins'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('my-component')
class MyComponent extends SchmancyElement {
  static styles = [css`
    :host { display: block }
  `]

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent
  }
}
```

No styles? Just drop `static styles`:

```typescript
@customElement('my-component')
class MyComponent extends SchmancyElement {
  render() { return html`<slot></slot>` }
}
```

Tailwind is injected automatically — your `static styles` only declares
component-local CSS.

## Provided members

### `disconnecting: Subject<void>` (RxJS)
Emits once when the element disconnects. Pair with `takeUntil` for cleanup:

```typescript
connectedCallback() {
  super.connectedCallback()
  someObservable$
    .pipe(takeUntil(this.disconnecting))
    .subscribe()
}
```

### `disconnectedSignal: AbortSignal` (native)
Aborts when the element disconnects. Use with any AbortSignal-aware API —
no RxJS conversion needed:

```typescript
connectedCallback() {
  super.connectedCallback()
  fetch('/api/stream', { signal: this.disconnectedSignal })
  someElement.addEventListener('click', handler, { signal: this.disconnectedSignal })
}
```

### `classMap(obj)`
Wraps Lit's `classMap` so keys can be space-separated:

```typescript
html`<div class=${this.classMap({
  'flex items-center gap-2': true,
  'opacity-50': this.disabled,
})}></div>`
```

Must be the only expression in `class=` — don't mix with string interpolation.

### `styleMap(obj)`
Passthrough to Lit's `styleMap`.

### `discover<T>(tag): Observable<T | null>`
Find another Schmancy component by tag via event-based handshake. Works across shadow DOM.

```typescript
this.discover<SchmancyDialog>('schmancy-dialog')
  .pipe(takeUntil(this.disconnecting))
  .subscribe(dialog => dialog?.setDefaultAction('confirm'))
```

### Auto-response to discovery
Every SchmancyElement responds to `{its-tag}-where-are-you` events with
`{its-tag}-here-i-am` carrying `{ detail: { component: this } }`.

## Component skeleton

```typescript
@customElement('my-component')
export class MyComponent extends SchmancyElement {
  static styles = [css`:host { display: block }`]

  @property({ type: String, reflect: true }) variant: 'a' | 'b' = 'a'
  @state() private _open = false

  connectedCallback() {
    super.connectedCallback()
    // subscriptions here, with takeUntil(this.disconnecting)
  }

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent
  }
}
```

## Rules

- Call `super.connectedCallback()` / `super.disconnectedCallback()` when overriding.
- All RxJS subscriptions end with `.pipe(takeUntil(this.disconnecting))`.
- All AbortSignal-aware API calls pass `{ signal: this.disconnectedSignal }`.
- Register the tag in `HTMLElementTagNameMap` for TypeScript.
- Don't mix `classMap` with string interpolation in the same attribute.
- **Never wrap with `SignalWatcher`** — it is already part of SchmancyElement.
  `SignalWatcher(SchmancyElement)` creates two nested Computeds and panics
  with "Detected cycle in computations" at runtime. The pre-edit lint rule
  (`NO_SIGNAL_WATCHER_WRAP`) blocks it.

## Migration: `$LitElement` (deprecated)

`$LitElement(style?)` is a thin alias kept for the migration window. It
returns a class that extends SchmancyElement with the passed style as
`static styles`. Existing code keeps compiling and running unchanged. New
code uses SchmancyElement directly:

```typescript
// Before
class MyView extends $LitElement(css`:host { display: block }`) { … }

// After
class MyView extends SchmancyElement {
  static styles = [css`:host { display: block }`]
  …
}
```

The `$LitElement` factory will be removed in the next major Schmancy
release. The pre-edit lint rule (`PREFER_SCHMANCY_ELEMENT`) flags new uses.
