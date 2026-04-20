# schmancy-delay

> Defers rendering of children by a duration, with an entrance motion. Siblings auto-stagger without manual delay math.

## Usage
```html
<schmancy-delay delay="200">
  <h1>Appears after 200ms</h1>
</schmancy-delay>

<!-- Auto-staggered list: each child inherits + stacks its own delay -->
<schmancy-delay delay="100">
  <schmancy-delay delay="100"><div>Step 1</div></schmancy-delay>
  <schmancy-delay delay="100"><div>Step 2</div></schmancy-delay>
  <schmancy-delay delay="100"><div>Step 3</div></schmancy-delay>
</schmancy-delay>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `delay` | number | `0` | Ms to wait before rendering this node |
| `motion` | `'flyBelow' \| 'flyAbove' \| 'fadeIn'` | `'flyBelow'` | `@lit-labs/motion` entrance animation |
| `once` | boolean | `true` | Skip delay on subsequent renders within the same session (keyed on content hash) |

## Context
- Consumes parent `delayContext` and adds its own delay.
- Walks previous siblings that are also `schmancy-delay` and accumulates their delays.
- Provides the resulting `effectiveDelay` down to descendants via context.

Result: nested `schmancy-delay` nodes produce natural staggered entrances without manual math.

## Session Caching
- When `once=true`, the content is hashed on first render and cached in `sessionStorage`.
- On subsequent component mounts (route revisits), the delay is skipped — content appears instantly.
- Set `once=false` to always replay the delay.

## Example — hero reveal
```html
<schmancy-delay delay="0" motion="fadeIn">
  <schmancy-delay delay="300"><h1>Welcome</h1></schmancy-delay>
  <schmancy-delay delay="200"><p>Subtitle…</p></schmancy-delay>
  <schmancy-delay delay="200">
    <schmancy-button variant="filled">Get started</schmancy-button>
  </schmancy-delay>
</schmancy-delay>
```

## See Also
- Use [`gravity`](./directives.md#gravity--elements-fall-into-place-with-mass-based-bounce) directive for mass-based staggered reveal on lists — often simpler than nested `schmancy-delay`.
