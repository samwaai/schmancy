# Schmancy Extra

> Data-driven dropdowns for common localization fields. Country and timezone pickers, form-associated and autocomplete-backed.

## schmancy-select-countries
Fully autocomplete-searchable country dropdown. Form-associated (participates in `<form>` submission and validation via `ElementInternals`).

```html
<schmancy-select-countries
  name="country"
  label="Country"
  placeholder="Select a country"
  required
  value="DE"
  @change=${e => this.country = e.target.value}
></schmancy-select-countries>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | string | — | ISO country code (reflected) |
| `name` | string | `''` | Form field name |
| `label` | string | `'Country'` | Visible label |
| `hint` | string | `'Please select a country'` | Helper text |
| `placeholder` | string | `'Select a country'` | Placeholder in the input |
| `required` | boolean | `false` | Validation constraint |

## schmancy-select-timezones
Same pattern as countries, backed by timezone data.

```html
<schmancy-select-timezones
  name="timezone"
  label="Timezone"
  value="Europe/Berlin"
></schmancy-select-timezones>
```

Accepts the same set of properties (`value`, `name`, `label`, `hint`, `placeholder`, `required`).

## Raw Data Exports
If you want the underlying data without the component:
```typescript
import countries from '@mhmo91/schmancy'   // default export from countries.data
import timezones from '@mhmo91/schmancy'   // default export from timezones.data
```

Each countries row: `{ code, name, dialCode?, flag?, ... }`. Timezones: `{ name, offset, label, ... }`.

## Form Integration
Both use `formAssociated = true` and register with the parent `<form>`. Works with native `form.checkValidity()` and with [`schmancy-form`](./form.md).

```html
<schmancy-form @submit=${this.onSubmit}>
  <schmancy-select-countries name="country" required></schmancy-select-countries>
  <schmancy-select-timezones name="timezone" required></schmancy-select-timezones>
  <schmancy-button type="submit" variant="filled">Save</schmancy-button>
</schmancy-form>
```
