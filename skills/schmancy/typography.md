# schmancy-typography

> Typography component with type scale tokens, editable mode, and line clamping.

## Usage
```html
<schmancy-typography type="headline" token="lg">Page Title</schmancy-typography>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `'display'\|'headline'\|'title'\|'subtitle'\|'body'\|'label'` | `'body'` | Typography category |
| token | `'xs'\|'sm'\|'md'\|'lg'\|'xl'\|''` | `'md'` | Size token (set `''` to use Tailwind classes) |
| align | `'left'\|'center'\|'right'\|'justify'` | `undefined` | Text alignment |
| weight | `'normal'\|'medium'\|'bold'` | `undefined` | Font weight |
| transform | `'uppercase'\|'lowercase'\|'capitalize'\|'normal'` | `undefined` | Text transform |
| maxLines | 1-6 | `undefined` | Line clamp (truncate with ellipsis) |
| editable | boolean | `false` | Enable inline editing |
| value | string | `''` | Text value (editable mode) |
| placeholder | string | `''` | Placeholder (editable mode) |

## Events (editable mode only)
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string }` | When edited text is committed (blur/Enter) |

## Type Scale Reference
| Type | Token | Size |
|------|-------|------|
| display | xl/lg/md/sm/xs | 72/57/45/36/28px |
| headline | xl/lg/md/sm/xs | 36/32/28/24/20px |
| title | xl/lg/md/sm/xs | 24/22/16/14/12px |
| body | xl/lg/md/sm/xs | 18/16/14/12/10px |
| label | xl/lg/md/sm/xs | 16/14/12/11/10px |

## Examples
```html
<!-- Responsive sizing with Tailwind (set token="") -->
<schmancy-typography type="display" token="" class="text-2xl md:text-4xl">
  Responsive Title
</schmancy-typography>

<!-- Editable text -->
<schmancy-typography type="title" token="lg" editable .value=${'Click to edit'}
  @change=${(e) => save(e.detail.value)}>
</schmancy-typography>

<!-- Clamped to 2 lines -->
<schmancy-typography type="body" token="md" maxLines="2">
  Long text that will be truncated after two lines...
</schmancy-typography>
```
