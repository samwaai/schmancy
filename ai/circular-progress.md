# Schmancy Circular Progress - AI Reference

```js
// Circular Progress Component
<schmancy-circular-progress
  size="xs|sm|md|lg|xl|{custom}"
  indeterminate?>
</schmancy-circular-progress>

// Properties
size: string          // "xs", "sm", "md", "lg", "xl", or custom size (default: "md")
indeterminate: boolean // Whether the progress is indeterminate (default: false)

// Size values
"xs" = 16px
"sm" = 24px
"md" = 32px
"lg" = 48px
"xl" = 64px

// Examples
// 1. Basic medium progress
<schmancy-circular-progress></schmancy-circular-progress>

// 2. Large indeterminate progress
<schmancy-circular-progress 
  size="lg"
  indeterminate>
</schmancy-circular-progress>

// 3. Custom size
<schmancy-circular-progress size="100">
</schmancy-circular-progress>

// 4. Small progress indicator
<schmancy-circular-progress size="xs">
</schmancy-circular-progress>
```

## Related Components
- **[Busy](./busy.md)**: Parent component providing spinner functionality
- **[Button](./button.md)**: Often used with buttons to show loading state

## Technical Details

### Implementation
- Internally uses `<schmancy-spinner>` component
- Size can be predefined string or custom CSS value
- Numeric values are converted to pixels
- Reflects indeterminate attribute to host element

### CSS Custom Properties
The component inherits spinner styling from the busy component.

## Common Use Cases

1. **Loading Buttons**: Show progress inside buttons
   ```html
   <schmancy-button disabled>
     <schmancy-circular-progress size="sm"></schmancy-circular-progress>
     Processing...
   </schmancy-button>
   ```

2. **Page Loading**: Full-page loading indicator
   ```html
   <div class="loading-overlay">
     <schmancy-circular-progress 
       size="xl" 
       indeterminate>
     </schmancy-circular-progress>
   </div>
   ```

3. **Inline Loading**: Small indicators in lists or tables
   ```html
   <td>
     <schmancy-circular-progress size="xs"></schmancy-circular-progress>
     Loading data...
   </td>
   ```

4. **Card Loading State**: Centered in content areas
   ```html
   <schmancy-card>
     <div class="centered">
       <schmancy-circular-progress size="lg"></schmancy-circular-progress>
       <p>Fetching results...</p>
     </div>
   </schmancy-card>
   ```