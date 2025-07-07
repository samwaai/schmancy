# Schmancy Components AI Documentation Alignment Report

## Executive Summary

This report identifies discrepancies between AI documentation (in `/ai` directory) and actual component implementations for major Schmancy components. Many components have significant misalignments that could lead to incorrect usage.

## Components Checked

### 1. ✅ Button (`schmancy-button`) - **UPDATED**
- Documentation has been updated to match implementation
- Correctly reflects Material Web dependency and actual API

### 2. ✅ Card (`schmancy-card`) - **UPDATED**
- Documentation has been updated to match implementation
- Now correctly shows CSS-based styling with :host selectors

### 3. ✅ Typography (`schmancy-typography`) - **UPDATED**
- Documentation has been updated to match implementation
- Correctly reflects the type/token system and Material Web integration

### 4. ✅ Input (`schmancy-input`) - **UPDATED**
- Documentation has been updated to match implementation
- Now shows accurate properties, events, and Material Web integration

### 5. ✅ Select (`schmancy-select`) - **UPDATED**
- Documentation has been updated to match implementation
- Correctly reflects Material Web md-select usage and actual API

### 6. ✅ Form (`schmancy-form`) - **UPDATED**
- Documentation has been updated to match implementation
- Now correctly shows form submission handling and validation

### 7. ✅ Notification (`schmancy-notification`) - **UPDATED**
- Documentation has been updated to match implementation
- Correctly reflects the toast notification API and usage patterns

### 8. ❌ Checkbox (`schmancy-checkbox`) - **NEEDS UPDATE**

#### Issues Found:
1. **Properties mismatch**:
   - Actual: `value` (boolean), `checked` (alias), `size` (sm/md/lg)
   - Docs show: many non-existent properties like `indeterminate`, `helper-text`, `error`
   
2. **Methods not implemented**:
   - Docs show: `check()`, `uncheck()`, `toggle()`, `validate()`
   - Actual: None of these methods exist

3. **Events mismatch**:
   - Actual: Only `change` event with `{ detail: { value: boolean } }`
   - Docs show: multiple events that don't exist

4. **Implementation details**:
   - Uses Material Web `md-checkbox` internally
   - Much simpler API than documented

### 9. ❌ Radio Group (`schmancy-radio-group`) - **NEEDS UPDATE**

#### Issues Found:
1. **Component structure mismatch**:
   - Actual: Uses `schmancy-radio-group` with `options` array OR slotted content
   - Docs show: `schmancy-radio-button` components that don't exist

2. **Properties mismatch**:
   - Actual: Inherits from `FormFieldMixin`, has `options` array property
   - Missing documented properties like `helper-text`, slots for descriptions

3. **Event handling**:
   - Uses internal `radio-button-click` events from children
   - Different from documented API

### 10. ❌ Textarea (`schmancy-textarea`) - **NEEDS UPDATE**

#### Issues Found:
1. **Properties mismatch**:
   - Actual has: `hint` instead of `helper-text`, no `show-counter`, `auto-grow`, etc.
   - Missing: Many documented properties like `resize`, `minRows`, `maxRows`

2. **Methods exist but different**:
   - Has validation methods but implementation differs
   - Additional methods like `adjustHeight()` not documented

3. **Events**:
   - Actual: Emits `enter` event on Enter key
   - Uses RxJS for event handling

### 11. ❌ Table (`schmancy-table`) - **NEEDS UPDATE**

#### Issues Found:
1. **Complete API mismatch**:
   - Actual: Data-driven with `columns` and `data` properties
   - Docs show: HTML table structure with slots

2. **Features mismatch**:
   - Actual: Built-in virtualization with `lit-virtualizer`
   - Actual: Programmatic sorting with custom value functions
   - Missing: Many documented properties like `striped`, `bordered`, `selectable`

3. **Component architecture**:
   - Uses `schmancy-table-row` internally
   - Very different from documented slot-based approach

### 12. ❌ Tabs (`schmancy-tab-group`) - **NEEDS UPDATE**

#### Issues Found:
1. **Component name mismatch**:
   - Actual: `schmancy-tab-group` (not `schmancy-tabs`)
   - Uses `schmancy-tab` child components

2. **Features not documented**:
   - Has `mode` property with 'tabs' and 'scroll' modes
   - Scroll mode creates sticky navigation

3. **API differences**:
   - Uses `activeTab` instead of `value`
   - Different event structure

## Recommendations

### Immediate Actions Needed:

1. **Update checkbox.md** - Complete rewrite needed
2. **Update radio-group.md** - Document actual implementation
3. **Update textarea.md** - Align with actual properties and methods
4. **Update table.md** - Complete rewrite for data-driven API
5. **Update tabs.md** - Rename and document actual components

### Pattern Observations:

1. Many components use Material Web internally (not documented)
2. Form components inherit from `FormFieldMixin` (not documented)
3. Components are generally simpler than documented
4. RxJS is used extensively for event handling (as per user preferences)

### Additional Components to Check:

Based on the `/ai` directory listing, these components should also be verified:
- `autocomplete`
- `dropdown` 
- `slider`
- `list`
- `menu`
- `nav-drawer`
- `sheet`
- `steps`
- `tree`
- `avatar`
- `badge`
- `chips`
- `divider`
- `progress`
- `tooltip`

## Conclusion

Approximately 40% of checked components have significant documentation misalignment. The AI documentation appears to be based on an idealized API rather than the actual implementation. This could lead to significant developer confusion and errors.

Priority should be given to updating the documentation for the most commonly used form components (checkbox, radio-group, textarea) and data display components (table, tabs).