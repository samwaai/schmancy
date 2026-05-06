# schmancy-form

> Form container with isolated submit state, typed schema seam, and a unified validation UX contract every field implements.

## Usage

```html
<schmancy-form @submit=${(e) => handleSubmit(e.detail.data)}>
  <schmancy-input name="email" label="Email" required></schmancy-input>
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```

The submit detail is `{ data, formData, until }`:

```ts
type SchmancyFormSubmitDetail<T = Record<string, FormDataEntryValue>> = {
  data: T                                  // typed when `schema` is set
  formData: FormData                       // raw payload
  until(p: Promise<unknown>): void         // gate success/error on async outcome
}
```

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `schema` | `ParseSchema` (zod / valibot / ArkType compatible) | — | When set, parses raw FormData on submit; `e.detail.data` is typed `z.infer<TSchema>`. |
| `novalidate` | `boolean` | `true` | Skip native browser validation popups (we control display). |

## Events

| Event | Detail | Description |
|---|---|---|
| `submit` | `SchmancyFormSubmitDetail` | Fired after all registered fields pass validation. |
| `reset` | `CustomEvent` | Fired after the form resets. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `submit()` | `boolean` | Programmatic submission via the inner form's `requestSubmit()`. |
| `reset()` | `void` | Resets every registered field. |
| `setFieldError(name, message)` | `boolean` | RHF `setError(name, ...)`-equivalent: maps a server-side error to a specific field. |
| `setFormError(message, code?)` | `void` | RHF `setError('root.serverError', ...)`-equivalent: structured form-level error. |
| `getFormData()` | `FormData` | Snapshot of the registered fields' contributed entries. |
| `reportValidity()` | `boolean` | Checks every registered field. |
| `checkValidity()` | `boolean` | Same as `reportValidity` without the side effect. |

## Validation UX (binding contract)

Every field that extends `SchmancyFormField()` implements four phases:

| Phase | Trigger | Behaviour |
|---|---|---|
| 1 — Pristine | User hasn't changed the field | **No error shown**, ever. `dirty = false` is the gate. |
| 2 — Dirty | User typed something then blurred | Validate. **Show error only if invalid.** |
| 3 — Live correction | User returns to a field with an error | Re-validate on every keystroke. Error clears immediately when valid. |
| 4 — Submit | User clicks submit | Force-validate **all** fields regardless of `dirty`. Focus the first invalid field. |

The default mode is `validateOn="dirty"`. Override per-field for special cases:

```html
<schmancy-input validateOn="always" ...></schmancy-input>      <!-- live search -->
<schmancy-input validateOn="submitted" ...></schmancy-input>   <!-- wizard step -->
```

After a submit attempt, the field stays in live-correction mode (Phase 3) for the rest of the session — `resetForm()` is the only way back.

## Server-side errors

```ts
async _onSubmit(e: CustomEvent<SchmancyFormSubmitDetail>) {
  const form = e.target as SchmancyForm
  e.detail.until(
    chargeCard(e.detail.data).catch(err => {
      if (err.code === 'CARD_DECLINED') {
        form.setFieldError('card', 'Card declined — check the number')
      } else {
        form.setFormError(err.message)
      }
      throw err   // re-throw so submit-state flips to 'error'
    }),
  )
}
```

## CSS state hooks (free)

Every field broadcasts these via `:state(...)`:

```css
schmancy-input:state(invalid)   { --border-color: var(--color-error); }
schmancy-input:state(dirty)     { --border-color: var(--color-primary); }
schmancy-input:state(touched)   { /* user blurred at least once */ }
schmancy-input:state(submitted) { /* post-submit state */ }
schmancy-input:state(required)  { /* required visual */ }

schmancy-button[type=submit]:state(submitting) { opacity: 0.6; }   /* form busy */
```

The `<schmancy-form>` host gets `aria-busy="true"` while submitting (WCAG 2.2 AA — disabled submit buttons drop from tab order; we keep them focusable and signal busy via aria).

## Field-author contract

Components that extend `SchmancyFormField()` get FACE wiring, ARIA reflection (`internals.ariaInvalid` / `ariaRequired`), the validation UX state (`touched/dirty/submitted/validateOn`), the `_shouldShowError()` gate, the form-registry composed event (`FIELD_CONNECT_EVENT`), and reset/disabled propagation — all for free.

The component author must wire only two things:

```ts
// 1. Call markTouched() on blur — tells the mixin the user has left the field
this.input.addEventListener('blur', () => this.markTouched())

// 2. Call emitChange() when value changes
this.value = newValue
this.emitChange({ value: newValue })
```

Override only when validity semantics differ (checkbox uses `checked`, switch uses `checked`, date-range uses `dateFrom`/`dateTo`) or when FormData contribution is multi-entry (date-range emits `${name}From` and `${name}To`).

## Submit triggers

`<schmancy-form>` listens on its host for `click` on `<button type=submit>` / `<schmancy-button type=submit>` and `keydown.Enter` on registered fields, then calls the inner shadow-DOM form's `requestSubmit()`. This bridges the gap that native form-association cannot cross from light-DOM slotted children to a shadow-DOM `<form>`.

## Examples

```html
<!-- Two independent checkout forms — each <schmancy-form> instance has its own
     isolated submit state via <schmancy-context>; no cross-contamination. -->
<schmancy-form @submit=${(e) => pay('primary', e)}>
  <schmancy-input name="card" required></schmancy-input>
  <schmancy-button type="submit">Pay £50</schmancy-button>
</schmancy-form>

<schmancy-form @submit=${(e) => pay('backup', e)}>
  <schmancy-input name="card" required></schmancy-input>
  <schmancy-button type="submit">Pay £50</schmancy-button>
</schmancy-form>
```

## See also

- `form-ux-rules.md` — the Revolute UX contract → mixin API mapping.
- `mixins.md` — `SchmancyFormField()` factory composition.
- `state.md` — `formSubmitState` + `<schmancy-context>` isolation pattern.
