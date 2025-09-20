# AI Component Patterns for Schmancy Library

## 🚨 CRITICAL: Self-Closing Component Patterns

This documentation is specifically designed for AI agents (particularly the ui-developer agent) to understand the correct usage patterns for Schmancy components. **VIOLATION OF THESE PATTERNS WILL BREAK FUNCTIONALITY.**

---

## 🔥 SCHMANCY-CHECKBOX: ALWAYS SELF-CLOSING

### ⛔ CRITICAL RULE: schmancy-checkbox MUST NEVER contain children

**schmancy-checkbox is ALWAYS self-closing and NEVER contains children elements.**

### ✅ CORRECT PATTERNS

#### Pattern 1: Using `label` attribute (Preferred)
```html
<!-- ✅ CORRECT: Self-closing with label attribute -->
<schmancy-checkbox
  label="Accept terms and conditions"
  ?checked=${this.termsAccepted}
  @change=${this.handleTermsChange}
></schmancy-checkbox>

<!-- ✅ CORRECT: With reactive properties -->
<schmancy-checkbox
  label="Enable notifications"
  ?checked=${this.notificationsEnabled}
  ?disabled=${this.isLoading}
  @change=${(e) => this.notificationsEnabled = e.target.checked}
></schmancy-checkbox>
```

#### Pattern 2: External typography (When you need more control)
```html
<!-- ✅ CORRECT: Self-closing checkbox with external label -->
<div class="flex items-center gap-2">
  <schmancy-checkbox
    ?checked=${this.isChecked}
    @change=${this.handleChange}
  ></schmancy-checkbox>
  <schmancy-typography type="body" token="md">
    Accept terms and conditions
  </schmancy-typography>
</div>

<!-- ✅ CORRECT: Complex label with multiple elements -->
<div class="flex items-start gap-3">
  <schmancy-checkbox
    ?checked=${this.marketingConsent}
    @change=${this.handleMarketingChange}
  ></schmancy-checkbox>
  <div class="flex flex-col">
    <schmancy-typography type="body" token="md" class="font-medium">
      Marketing Communications
    </schmancy-typography>
    <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
      Receive updates about new features and promotions
    </schmancy-typography>
  </div>
</div>
```

#### Pattern 3: Checkbox groups
```html
<!-- ✅ CORRECT: Multiple checkboxes in a group -->
<div class="space-y-4">
  <schmancy-checkbox
    label="Email notifications"
    ?checked=${this.settings.email}
    @change=${(e) => this.updateSetting('email', e.target.checked)}
  ></schmancy-checkbox>

  <schmancy-checkbox
    label="Push notifications"
    ?checked=${this.settings.push}
    @change=${(e) => this.updateSetting('push', e.target.checked)}
  ></schmancy-checkbox>

  <schmancy-checkbox
    label="SMS notifications"
    ?checked=${this.settings.sms}
    @change=${(e) => this.updateSetting('sms', e.target.checked)}
  ></schmancy-checkbox>
</div>
```

### ❌ WRONG PATTERNS - NEVER DO THIS

```html
<!-- ❌ WRONG: Never nest children inside schmancy-checkbox -->
<schmancy-checkbox
  ?checked=${this.isAuthenticated}
  @change=${this.toggleAuth}
>
  <schmancy-typography type="body" token="sm" class="mt-2">
    User is authenticated
  </schmancy-typography>
</schmancy-checkbox>

<!-- ❌ WRONG: Never put any content inside -->
<schmancy-checkbox ?checked=${this.value}>
  Accept terms
</schmancy-checkbox>

<!-- ❌ WRONG: Never use it as a container -->
<schmancy-checkbox>
  <div>Some content</div>
</schmancy-checkbox>
```

### 🔧 Form Integration

```html
<!-- ✅ CORRECT: Form usage -->
<schmancy-form>
  <div class="space-y-4">
    <schmancy-checkbox
      name="terms"
      label="I agree to the terms and conditions"
      required
      ?checked=${this.formData.terms}
      @change=${(e) => this.updateFormData('terms', e.target.checked)}
    ></schmancy-checkbox>

    <schmancy-checkbox
      name="newsletter"
      label="Subscribe to newsletter"
      ?checked=${this.formData.newsletter}
      @change=${(e) => this.updateFormData('newsletter', e.target.checked)}
    ></schmancy-checkbox>
  </div>
</schmancy-form>
```

### 🎯 Event Handling

```typescript
// ✅ CORRECT: Event handling
private handleCheckboxChange = (e: Event) => {
  const checkbox = e.target as SchmancyCheckboxElement;
  this.value = checkbox.checked;

  // Dispatch custom event if needed
  this.dispatchEvent(new CustomEvent('value-change', {
    detail: { checked: checkbox.checked }
  }));
}

// Usage in template
html`
  <schmancy-checkbox
    label="Enable feature"
    ?checked=${this.featureEnabled}
    @change=${this.handleCheckboxChange}
  ></schmancy-checkbox>
`;
```

---

## 🔧 OTHER SELF-CLOSING SCHMANCY COMPONENTS

The following Schmancy components are also **ALWAYS self-closing** and follow similar patterns:

### schmancy-divider
```html
<!-- ✅ CORRECT: Always self-closing -->
<schmancy-divider orientation="horizontal"></schmancy-divider>
<schmancy-divider orientation="vertical" grow="both"></schmancy-divider>

<!-- ❌ WRONG: Never contains children -->
<schmancy-divider>content</schmancy-divider>
```

### schmancy-progress
```html
<!-- ✅ CORRECT: Always self-closing -->
<schmancy-progress value="75" max="100" color="primary"></schmancy-progress>
<schmancy-progress indeterminate size="lg"></schmancy-progress>

<!-- ❌ WRONG: Never contains children -->
<schmancy-progress>Loading...</schmancy-progress>
```

### schmancy-spinner
```html
<!-- ✅ CORRECT: Always self-closing -->
<schmancy-spinner size="6" color="primary"></schmancy-spinner>
<schmancy-spinner glass></schmancy-spinner>

<!-- ❌ WRONG: Never contains children -->
<schmancy-spinner>Loading...</schmancy-spinner>
```

---

## 🎯 COMPONENTS THAT ACCEPT CHILDREN

These components **DO accept children** and should NOT be self-closing:

### schmancy-icon
```html
<!-- ✅ CORRECT: Contains icon name -->
<schmancy-icon fill="1" weight="500">favorite</schmancy-icon>
<schmancy-icon variant="rounded">home</schmancy-icon>

<!-- ❌ WRONG: Don't self-close -->
<schmancy-icon name="favorite"></schmancy-icon>
```

### schmancy-badge
```html
<!-- ✅ CORRECT: Contains content -->
<schmancy-badge color="primary" size="sm">New</schmancy-badge>
<schmancy-badge color="error" shape="pill">
  <schmancy-icon slot="icon">warning</schmancy-icon>
  Alert
</schmancy-badge>

<!-- ❌ WRONG: Don't self-close unless using only icon property -->
<schmancy-badge icon="star" color="success"></schmancy-badge> <!-- This is OK -->
```

---

## 🚨 MEMORY CHECKLIST FOR AI AGENTS

Before writing ANY schmancy component code, check this list:

### Self-Closing Components (NEVER have children):
- ✅ `schmancy-checkbox` - Use `label` attribute or external typography
- ✅ `schmancy-divider` - Pure visual separator
- ✅ `schmancy-progress` - Shows progress value
- ✅ `schmancy-spinner` - Loading indicator

### Components That Accept Children:
- ✅ `schmancy-icon` - Contains icon name as text content
- ✅ `schmancy-badge` - Contains badge text/content
- ✅ `schmancy-button` - Contains button text/content
- ✅ `schmancy-typography` - Contains text content
- ✅ `schmancy-surface` - Container component
- ✅ Most other components - Check documentation

---

## 🔥 ENFORCEMENT

**ANY CODE THAT VIOLATES THESE PATTERNS WILL BE REJECTED.**

These patterns are not suggestions - they are **REQUIREMENTS** based on how the components are implemented. Violating them will result in:

1. **Broken functionality**
2. **Rendering issues**
3. **Event handling problems**
4. **Accessibility violations**

---

## 📚 QUICK REFERENCE

| Component | Pattern | Children Allowed |
|-----------|---------|------------------|
| `schmancy-checkbox` | Self-closing + `label` attribute | ❌ Never |
| `schmancy-divider` | Self-closing | ❌ Never |
| `schmancy-progress` | Self-closing | ❌ Never |
| `schmancy-spinner` | Self-closing | ❌ Never |
| `schmancy-icon` | Contains icon name | ✅ Required |
| `schmancy-badge` | Contains content | ✅ Usually |
| `schmancy-button` | Contains content | ✅ Yes |
| `schmancy-typography` | Contains text | ✅ Yes |

**When in doubt: Check if the component has a `label` attribute. If it does, it's likely self-closing.**