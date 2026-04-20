# schmancy-input

> Text input with form association, validation strategies, and size variants.

## Usage
```html
<schmancy-input label="Email" type="email" required></schmancy-input>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Current input value |
| type | string | `'text'` | HTML input type (text, password, email, number, date, etc.) |
| label | string | `''` | Label text above the input |
| placeholder | string | `''` | Placeholder text |
| name | string | auto | Form submission name |
| required | boolean | `false` | Whether the field is required |
| disabled | boolean | `false` | Whether the field is disabled |
| readonly | boolean | `false` | Whether the field is read-only |
| error | boolean | `false` | Whether the field shows an error state |
| validationMessage | string | `''` | Custom validation message |
| hint | string | `undefined` | Hint text below the field |
| size | `'xxs'\|'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Input height (24-56px) |
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'touched'` | When to show validation |
| align | `'left'\|'center'\|'right'` | `'left'` | Text alignment |
| pattern | string | `undefined` | Regex validation pattern |
| inputmode | string | `undefined` | Virtual keyboard hint |
| min/max | string | `undefined` | Range constraints |
| minlength/maxlength | number | `undefined` | Length constraints |
| clickable | boolean | `false` | Show pointer cursor when readonly |
| autofocus | boolean | `false` | Auto-focus on mount |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| input | `{ value: string }` | Every keystroke |
| change | `{ value: string }` | On blur/native change |
| enter | `{ value: string }` | When Enter key is pressed |

## Examples
```html
<!-- Password with validation -->
<schmancy-input label="Password" type="password" required minlength="8"
  hint="At least 8 characters"></schmancy-input>

<!-- Compact number input -->
<schmancy-input type="number" size="xs" min="0" max="100"
  placeholder="Qty"></schmancy-input>

<!-- With enter handler -->
<schmancy-input label="Search" placeholder="Type and press Enter"
  @enter=${(e) => search(e.detail.value)}></schmancy-input>
```

**Tag aliases:** `<sch-input>` (backward compatible)
