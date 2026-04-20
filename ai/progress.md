# schmancy-progress

> Linear progress bar with determinate and indeterminate modes, color variants, and glass effect.

## Usage
```html
<schmancy-progress value="60" max="100"></schmancy-progress>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | number | `0` | Current progress value |
| max | number | `100` | Maximum value |
| indeterminate | boolean | `false` | Show indeterminate animation |
| size | `'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Track height (1px, 2px, 4px, 8px) |
| color | `'primary'\|'secondary'\|'tertiary'\|'error'\|'success'` | `'primary'` | Bar color |
| glass | boolean | `false` | Glass/frosted effect |

## Examples
```html
<!-- Indeterminate loading -->
<schmancy-progress indeterminate color="secondary"></schmancy-progress>

<!-- Glass effect progress -->
<schmancy-progress value="75" glass size="lg" color="success"></schmancy-progress>

<!-- Thin track -->
<schmancy-progress value="30" size="xs"></schmancy-progress>
```
