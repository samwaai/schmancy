# Form UX rules — Revolute pattern → schmancy mixin API

This is the mapping between the Revolute interview-bar form UX (the source-of-truth checklist for state-of-the-art form behaviour) and the `SchmancyFormField()` API that implements each rule. When you hit a UX question, find the rule here and use the named API — don't re-derive from scratch.

## The four-phase validation contract

| Phase | UX rule | Implementation |
|---|---|---|
| 1 — Pristine | A field the user hasn't typed in shows no error, even if focused-then-blurred. The autofocus+cancel anti-pattern (focus a required field, click cancel, see "required") is forbidden. | `validateOn: 'dirty'` (default). `_shouldShowError()` returns `false` while `dirty === false`. |
| 2 — Dirty | User types and blurs → validate the field. Show error only if invalid. Empty required fields blurred-without-typing remain pristine. | `markTouched()` called on blur. Mixin's `willUpdate` sees `touched` change, sees `dirty` is true, calls `checkValidity()` which sets `this.error` because the gate is open. |
| 3 — Live correction | User returns to a field with an error → re-validate on every keystroke. Error clears immediately when valid. | Mixin's `willUpdate` re-runs `checkValidity()` on every value change while `_shouldShowError()` is true. |
| 4 — Submit | Submit click → validate **all** fields regardless of dirty. Focus the first invalid field. | `<schmancy-form>` calls `markSubmitted()` on every registered field. `submitted = true` overrides every `validateOn` mode and forces error display. The form then focuses the first field with `error === true`. |

After Phase 4, the field stays in Phase 3 (live re-validation) for the rest of the session because `submitted` persists until `resetForm()`.

## Per-rule cross-reference

| UX rule | API | Notes |
|---|---|---|
| Default mode is "errors after the user has interacted" | `validateOn: 'dirty'` | Pristine fields stay clean; submit forces all errors. |
| Live search shows errors immediately | `validateOn="always"` | Bypass the dirty/touched gate entirely. |
| Wizard step holds errors until Next | `validateOn="submitted"` | Only `markSubmitted()` opens the gate. |
| Server-side error → specific field | `form.setFieldError(name, msg)` | RHF `setError` parity. Sets custom validity + marks submitted so the error shows. |
| Server-side error → form banner | `form.setFormError(msg, code?)` | Flips `formSubmitState` to `{ status: 'error', error: { message, code } }`. Top-of-form banners read this. |
| Async server-side check gating submit | `e.detail.until(promise)` | Form's `submit` event detail. Submit status reflects the promise outcome (`success` on resolve, `error` on reject). |
| Submit button must stay focusable while busy | `aria-busy="true"` on the host (auto) + `:state(submitting)` on `<schmancy-button[type=submit]>` (auto) | WCAG 2.2 AA. Disabled buttons drop from the tab order; we never disable. |
| Screen reader announces invalid fields | `internals.ariaInvalid` (auto) + `internals.ariaRequired` (auto) | Reflected through `ElementInternals` so AT reaches into shadow DOM. Not on the host as `aria-*` attributes. |
| Reset returns the form to pristine | `<schmancy-button type="reset">` or `form.reset()` | Mixin's `formResetCallback` → `resetForm()` clears `value`, `error`, `validationMessage`, `touched`, `submitted`. |
| Cross-field rules (password confirm) | `schema` prop with zod `.refine` | Validation seam is the schema, not the mixin. Cross-field violations surface on submit; map to a specific field via `form.setFieldError`. |
| Server-shape transforms (IBAN uppercase, trim) | `schema` prop with zod `.transform` | Runs during `schema.parse(rawFormData)` in `_onSubmit`. The `data` in the submit event is post-transform. |
| Multi-entry FormData (date range, tag input) | Override `toFormEntries()` + `internals.setFormValue(formData)` | Flat suffix keys (`${name}From`, `${name}To`) — no bracket-key encoding. Native `new FormData(form)` sees both keys. |
| Boolean state semantics (checkbox, switch) | Override `checkValidity()` | Required validity is `checked === true`, not the mixin's "non-empty value." |
| Numeric value (range) | `override value: number` | Narrows the mixin's wide union. Mixin's `dirty` getter uses `value !== _defaultValue` which works for primitives. |
| Two independent forms on one page | Each `<schmancy-form>` is its own context provider | `<schmancy-context .provides=${[formSubmitState]}>` is rendered inside each form. Submit state is isolated per instance — no cross-contamination. |
| Nested forms forbidden | `<schmancy-form>` `connectedCallback` checks for an ancestor `schmancy-form` and `console.error`s if found | Nested forms are platform-undefined; we surface the error early. |

## What's NOT in scope

These are deferred to v2 and **not** in the current contract:

- `<schmancy-form-summary>` (top-of-form error banner with anchor links to invalid fields).
- `validateOn: 'length'` (validate once `value.length === maxlength` — Stripe card-number pattern).
- Per-field `errorMessages` i18n hook (the default `'This field is required'` is hardcoded English).
- First-class `useFieldArray` API for dynamic fields.
- Async-validation helpers (`isValidating`, `runAsyncValidator`, `:state(validating)`).
- Wizard `clearSubmitted()` (post-submit state currently persists until `resetForm`).
- Structured `ValidityStateFlags` exposure beyond `valueMissing` + `customError`.

If a consumer needs one of these, file an issue with the use case before adding it — every addition to the binding contract has a propagation cost across all 9 form components.

## See also

- `form.md` — the `<schmancy-form>` API reference.
- `mixins.md` — `SchmancyFormField()` factory composition.
- `state.md` — `formSubmitState` singleton + per-form isolation.
