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
| validateOn | `'always'\|'touched'\|'dirty'\|'submitted'` | `'dirty'` | When to display validation errors. Default suppresses errors on pristine fields until submit. |
| touched | boolean (read-only) | `false` | True after first blur — set by `markTouched()`. |
| dirty | boolean (getter) | — | True when `value` differs from the captured default. |
| submitted | boolean (read-only) | `false` | Set by `<schmancy-form>` on submit; flips field to live-correction mode. |
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
| input | `{ value: string }` | Every keystroke (bubbles, composed) |
| change | `{ value: string }` | On blur/native change (bubbles, composed) |
| enter | `{ value: string }` | Enter key pressed |
| focus / blur | — | Standard focus events |

## Public API (from `SchmancyFormField`)
- `markTouched()` / `markSubmitted()` — flip the `_shouldShowError()` gate.
- `checkValidity()` / `reportValidity()` — return current validity (used by `<schmancy-form>` and native `<form>`).
- `setCustomValidity(message)` — server-side error path. `<schmancy-form>` calls this from `setFieldError(name, msg)`.
- `resetForm()` — restores the captured default; clears `error`, `touched`, `submitted`.
- `internals.ariaInvalid` / `ariaRequired` — set automatically; reaches AT through shadow DOM.

`<schmancy-form>` auto-discovers this field via `FIELD_CONNECT_EVENT` (composed event). No registration needed.

See `form.md` and `form-ux-rules.md` for the binding 4-phase validation contract.

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
