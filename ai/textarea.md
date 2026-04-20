# schmancy-textarea

> Multi-line text input with auto-resize and form integration.

## Usage
```html
<schmancy-textarea label="Description" placeholder="Enter details..."></schmancy-textarea>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Current text value |
| label | string | `''` | Label text above the textarea |
| placeholder | string | `''` | Placeholder text |
| name | string | auto | Form submission name |
| required | boolean | `false` | Whether the field is required |
| disabled | boolean | `false` | Whether the field is disabled |
| readonly | boolean | `false` | Whether the field is read-only |
| error | boolean | `false` | Whether the field shows an error state |
| hint | string | `undefined` | Hint text below the field |
| rows | number | `undefined` | Fixed visible rows (omit for auto-size) |
| cols | number | `20` | Column width |
| maxlength | number | `undefined` | Maximum character length |
| minlength | number | `undefined` | Minimum character length |
| autoHeight | boolean | `true` | Auto-grow height with content |
| fillHeight | boolean | `false` | Fill container height |
| resize | `'none'\|'vertical'\|'horizontal'\|'both'` | `'vertical'` | Resize handle |
| align | `'left'\|'center'\|'right'` | `'left'` | Text alignment |
| wrap | `'hard'\|'soft'` | `'soft'` | Text wrapping mode |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string }` | On input or native change |
| enter | `{ value: string }` | When Enter key is pressed |

## Examples
```html
<!-- Auto-sizing textarea -->
<schmancy-textarea label="Notes" autoHeight></schmancy-textarea>

<!-- Fixed height, no resize -->
<schmancy-textarea rows="5" resize="none" placeholder="Comments..."></schmancy-textarea>

<!-- Fill container -->
<schmancy-textarea fillHeight label="Content"></schmancy-textarea>
```
