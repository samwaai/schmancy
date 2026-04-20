# `$LitElement`

Base class for Schmancy components. Extends `LitElement` with RxJS cleanup, Tailwind support, and cross-shadow discovery.

## Usage

```typescript
import { $LitElement } from '@mhmo91/schmancy/mixins'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('my-component')
class MyComponent extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`<slot></slot>`
  }
}
```

`$LitElement(style?)` accepts either a Lit `css` tagged literal or a string (e.g. SCSS imported with `?inline`).

## Provided members

### `disconnecting: Subject<void>`
Emits once when the element disconnects. Pair with `takeUntil` for cleanup:

```typescript
connectedCallback() {
  super.connectedCallback()
  someObservable$.pipe(
    takeUntil(this.disconnecting),
  ).subscribe()
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

```typescript
html`<div style=${this.styleMap({ width: `${w}px` })}></div>`
```

### `discover<T>(tag): Observable<T | null>`
Find another Schmancy component by tag via event-based handshake. Works across shadow DOM.

```typescript
this.discover<SchmancyDialog>('schmancy-dialog').pipe(
  takeUntil(this.disconnecting),
).subscribe(dialog => dialog?.setDefaultAction('confirm'))
```

### Auto-response to discovery
Every `$LitElement` responds to `{its-tag}-where-are-you` events with `{its-tag}-here-i-am` carrying `{ detail: { component: this } }`.

## Component skeleton

```typescript
@customElement('my-component')
export class MyComponent extends $LitElement(css`:host { display: block }`) {
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
- Register the tag in `HTMLElementTagNameMap` for TypeScript.
- Don't mix `classMap` with string interpolation in the same attribute.
