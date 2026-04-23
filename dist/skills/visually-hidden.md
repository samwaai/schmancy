# schmancy-visually-hidden

> Hide content visually while keeping it in the accessibility tree. For screen-reader-only labels, supplemental descriptions, and live-region text.

## Usage
```html
<button>
  <schmancy-icon>close</schmancy-icon>
  <schmancy-visually-hidden>Close dialog</schmancy-visually-hidden>
</button>
```

## Why not `display: none` / `visibility: hidden` / `aria-hidden`?
Those remove content from assistive tech too. `<schmancy-visually-hidden>` uses the WCAG-recommended clip pattern, so screen readers still read the content while sighted users don't see it.

## Properties
None. Pure wrapper.

## Examples
```html
<!-- Icon-only button label -->
<schmancy-icon-button>
  <schmancy-icon>delete</schmancy-icon>
  <schmancy-visually-hidden>Delete item</schmancy-visually-hidden>
</schmancy-icon-button>
```

```html
<!-- Additional context for links -->
<a href="/article/42">
  Read more
  <schmancy-visually-hidden>about quarterly earnings</schmancy-visually-hidden>
</a>
```

```html
<!-- Live region announcements -->
<schmancy-visually-hidden role="status" aria-live="polite">
  ${this.status}
</schmancy-visually-hidden>
```
