# Schmancy Progress - AI Reference

Linear progress indicator showing task completion status.

```js
// Component Tag
<schmancy-progress
  value="number"
  max="number"
  size="sm|md|lg"
  color="primary|secondary|tertiary|error|success"
  indeterminate?>
</schmancy-progress>

// Examples
// 1. Basic progress
<schmancy-progress value="30" max="100"></schmancy-progress>

// 2. Different sizes
<schmancy-progress value="50" max="100" size="sm"></schmancy-progress>
<schmancy-progress value="50" max="100" size="md"></schmancy-progress>
<schmancy-progress value="50" max="100" size="lg"></schmancy-progress>

// 3. Color variants
<schmancy-progress value="60" max="100" color="primary"></schmancy-progress>
<schmancy-progress value="60" max="100" color="success"></schmancy-progress>
<schmancy-progress value="60" max="100" color="error"></schmancy-progress>

// 4. Indeterminate progress
<schmancy-progress indeterminate></schmancy-progress>

// 5. Custom max value
<schmancy-progress value="750" max="1000"></schmancy-progress>

// 6. With labels
<div class="space-y-2">
  <div class="flex justify-between mb-1">
    <schmancy-typography type="label" token="sm">Upload Progress</schmancy-typography>
    <schmancy-typography type="label" token="sm">75%</schmancy-typography>
  </div>
  <schmancy-progress value="75" max="100" color="success"></schmancy-progress>
</div>
```

## Related Components
- **[Circular Progress](./circular-progress.md)**: For circular progress indicators
- **[Typography](./typography.md)**: For progress labels

## Technical Details
### Properties
- `value`: Current progress value (0 to max)
- `max`: Maximum value (default: 100)
- `size`: Height variant - sm (2px), md (4px), lg (8px)
- `color`: Theme color variant
- `indeterminate`: Shows animated progress when value unknown

### CSS Implementation
Uses Tailwind classes:
- Container: `bg-surface-container rounded-full`
- Bar: `bg-[color] transition-all duration-300`
- Sizes: `h-0.5` (sm), `h-1` (md), `h-2` (lg)
- Indeterminate: Custom animation for continuous movement

## Common Use Cases
1. **File Upload**: Show upload progress with percentage
2. **Form Completion**: Display multi-step form progress
3. **Loading States**: Indeterminate mode for unknown duration
4. **Data Processing**: Track batch operation progress
5. **Download Progress**: Show download completion status