# schmancy-form

> Form container that collects data from child controls, validates, and emits submit/reset events.

## Usage
```html
<schmancy-form @submit=${(e) => handleSubmit(e.detail)}>
  <schmancy-input name="email" label="Email" required></schmancy-input>
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| novalidate | boolean | `false` | Skip validation on submit |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| submit | FormData | Form data from all child controls |
| reset | - | When the form is reset |

## Methods
| Method | Returns | Description |
|--------|---------|-------------|
| submit() | boolean | Validates and dispatches submit event. Returns false if invalid. |
| reset() | void | Resets all child controls to default values |
| getFormData() | FormData | Collects current form data without submitting |
| reportValidity() | boolean | Checks and shows validation on all controls |

## Examples
```html
<!-- Form with validation -->
<schmancy-form @submit=${(e) => save(e.detail)} @reset=${() => clearForm()}>
  <schmancy-input name="name" label="Name" required></schmancy-input>
  <schmancy-select name="role" label="Role" required>
    <schmancy-option value="admin" label="Admin"></schmancy-option>
    <schmancy-option value="user" label="User"></schmancy-option>
  </schmancy-select>
  <schmancy-checkbox name="active" label="Active"></schmancy-checkbox>
  <div class="flex gap-2">
    <schmancy-button type="submit">Save</schmancy-button>
    <schmancy-button type="reset">Reset</schmancy-button>
  </div>
</schmancy-form>
```

Submit triggers on Enter key in inputs or clicking a submit-type button.
