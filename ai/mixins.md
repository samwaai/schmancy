# $LitElement — Base Class Foundation

> **Every Schmancy component extends `$LitElement`. No exceptions.**
> It wires RxJS cleanup, Tailwind, cross-shadow discovery, and a few quality-of-life helpers into every element — so you never write that plumbing yourself.

## The minimal component

```typescript
import { $LitElement } from '@mhmo91/schmancy/mixins'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('my-card')
class MyCard extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`<slot></slot>`
  }
}
```

That's it. You now get the five things below for free.

## What `$LitElement` gives you

### 1. `disconnecting` — automatic RxJS cleanup
```typescript
connectedCallback() {
  super.connectedCallback()

  userContext.$.pipe(
    takeUntil(this.disconnecting),
  ).subscribe(user => this.user = user)
}
```

`disconnecting` is a `Subject<void>` that emits once when the element is detached from the DOM. Paired with `takeUntil`, it makes the entire Schmancy codebase manual-unsubscribe-free.

**This is the single most-used line in a Schmancy app.** If you see an RxJS pipe without `takeUntil(this.disconnecting)` — it's a leak.

### 2. `classMap(obj)` — space-splitting enhanced
```typescript
render() {
  return html`
    <div class=${this.classMap({
      'flex items-center gap-2': true,
      'bg-primary-default': this.active,
      'opacity-50 pointer-events-none': this.disabled,
    })}>
      …
    </div>
  `
}
```

Unlike standard Lit `classMap`, keys can be **space-separated** ("flex items-center gap-2"). Combined with Tailwind, you write natural class strings instead of one-class-per-key.

**Hard rule:** `class=${this.classMap(...)}` must be the *sole* expression in `class=`. You cannot mix it with string interpolation (` class="foo ${this.classMap(...)}"`) — Lit will fail silently.

### 3. `styleMap(obj)` — inline styles (passthrough)
```typescript
render() {
  return html`
    <div style=${this.styleMap({
      width: `${this.size}px`,
      opacity: this.visible ? 1 : 0,
    })}></div>
  `
}
```

Direct passthrough to Lit's `styleMap` directive, exposed as a method so you don't have to import it in every component.

### 4. `discover<T>(tag)` — cross-shadow component lookup
```typescript
connectedCallback() {
  super.connectedCallback()

  this.discover<SchmancyDialog>('schmancy-dialog').pipe(
    takeUntil(this.disconnecting),
  ).subscribe(dialog => dialog?.setDefaultAction('confirm'))
}
```

Broadcasts a `{tag}-where-are-you` event. Any mounted `$LitElement` with that tag responds with itself. Works **across shadow DOM boundaries** — zero traversal.

### 5. Auto-response to discovery events
Every `$LitElement` automatically answers `{its-tag}-where-are-you` by dispatching `{its-tag}-here-i-am` with `{ detail: { component: this } }`. You opt in by extending — opt out by not.

## Tailwind support

Styles you import are pre-processed through the Schmancy Tailwind pipeline. Tailwind utility classes work in both the host and slotted content. All theme CSS variables (`--schmancy-sys-color-primary-default`, etc.) resolve inside the component's shadow root.

```typescript
// Works out of the box
render() {
  return html`<div class="flex items-center gap-2 text-primary-default">…</div>`
}
```

## Extending with SCSS

For complex styling, import a `.scss?inline` file and pass it to `$LitElement`:

```typescript
import style from './my-card.scss?inline'

@customElement('my-card')
class MyCard extends $LitElement(style) {
  // SCSS features: nesting, mixins, @layer
}
```

Simple components use template-literal CSS; complex ones use SCSS.

## Standard component shape

This is the skeleton 90% of Schmancy components follow:

```typescript
import { $LitElement } from '@mhmo91/schmancy/mixins'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Subject, takeUntil } from 'rxjs'

@customElement('my-component')
export class MyComponent extends $LitElement(css`
  :host { display: block; }
`) {
  // 1. Public API — reflected / typed
  @property({ type: String, reflect: true }) variant: 'a' | 'b' = 'a'
  @property({ type: Boolean, reflect: true }) disabled = false

  // 2. Internal state
  @state() private _open = false

  // 3. Private RxJS subjects (if needed)
  private _value$ = new Subject<string>()

  // 4. Lifecycle
  connectedCallback() {
    super.connectedCallback()
    this._value$.pipe(
      debounceTime(150),
      takeUntil(this.disconnecting),
    ).subscribe(v => this.handleValue(v))
  }

  // 5. Rendering
  render() {
    return html`
      <div class=${this.classMap({
        'flex items-center': true,
        'opacity-50': this.disabled,
      })}>
        <slot></slot>
      </div>
    `
  }

  // 6. Public imperative API (if any)
  public open() { this._open = true }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent
  }
}
```

Guarantees from this shape:
- Every subscription dies with the element.
- Tailwind + theme tokens work.
- Component is discoverable from anywhere via `discover('my-component')`.
- Declared in the global tag map for TypeScript.

## Why not `LitElement` directly?

You can, but you'll re-implement:
- Manual unsubscribe handling in `disconnectedCallback` for every `Observable`.
- `classMap` space-splitting.
- Tailwind variable wiring.
- Cross-shadow discovery.

`$LitElement` is 200 lines of common-denominator plumbing that keeps apps consistent. Using it is the convention; not using it is the outlier.

## Rules

1. **Every custom element extends `$LitElement(style?)`.**
2. **Every RxJS subscription ends with `.pipe(takeUntil(this.disconnecting))`** — or you have a leak.
3. **Call `super.connectedCallback()` and `super.disconnectedCallback()`** when you override them.
4. **Don't mix `classMap` with string interpolation** in the same attribute.
5. **Prefer `ref(createRef())` over `querySelector`** for your own shadow tree.
6. **Register in `HTMLElementTagNameMap`** for TypeScript autocompletion.

## See also
- [store](./store.md) — contexts pair with `takeUntil(this.disconnecting)` for auto-cleaning subscriptions.
- [area](./area.md) — route components all extend `$LitElement`.
- [discovery](./discovery.md) — the discovery events `$LitElement` handles automatically.
