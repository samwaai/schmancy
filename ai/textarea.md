# Schmancy Textarea - AI Reference

```js
// Basic Textarea
<schmancy-textarea
  name="textarea-name"
  label="Textarea Label"
  value="Initial text"
  placeholder="Enter text here..."
  rows="4"
  cols="50"
  maxlength="500"
  minlength="10"
  required?
  disabled?
  readonly?
  error="Error message"
  resize="both|horizontal|vertical|none"
  @input=${handleInput}
  @change=${handleChange}>
</schmancy-textarea>

// Textarea with counter and helper text
<schmancy-textarea
  label="Description"
  maxlength="200"
  show-counter?
  helper-text="Briefly describe your issue">
</schmancy-textarea>

// Auto-growing textarea
<schmancy-textarea
  auto-grow?
  min-rows="2"
  max-rows="10"
  label="Comments">
</schmancy-textarea>

// Textarea Methods
textarea.focus() -> void           // Focus the textarea
textarea.blur() -> void            // Remove focus
textarea.select() -> void          // Select all text
textarea.validate() -> boolean     // Validate and show error if invalid
textarea.reset() -> void           // Reset to initial value
textarea.setCustomValidity(message) -> void  // Set custom validation message

// Textarea Properties
value: string         // The content of the textarea
name: string          // The name attribute
label: string         // Label text
placeholder: string   // Placeholder text
rows: number          // Number of rows to display
cols: number          // Number of columns to display
minlength: number     // Minimum number of characters required
maxlength: number     // Maximum number of characters allowed
disabled: boolean     // Whether the textarea is disabled
readonly: boolean     // Whether the textarea is read-only
required: boolean     // Whether the textarea is required
error: string         // Error message to display
resize: string        // Resize behavior: "both", "horizontal", "vertical", "none"
autoGrow: boolean     // Whether the textarea should automatically grow with content
minRows: number       // Minimum number of rows when auto-growing
maxRows: number       // Maximum number of rows when auto-growing
showCounter: boolean  // Whether to show the character counter

// Textarea Events
@input   // Fires on input with { detail: { value } }
@change  // Fires when value changes and focus is lost with { detail: { value } }
@focus   // Fires when textarea gains focus
@blur    // Fires when textarea loses focus

// Examples
// Basic usage
<schmancy-textarea
  name="comments"
  label="Comments"
  placeholder="Enter your comments here"
  rows="4"
  required
  @change=${(e) => console.log('Comments:', e.detail.value)}>
</schmancy-textarea>

// Textarea with character counter
<schmancy-textarea
  name="bio"
  label="Biography"
  maxlength="500"
  show-counter
  helper-text="Tell us about yourself">
</schmancy-textarea>

// Auto-growing textarea
<schmancy-textarea
  name="notes"
  label="Meeting Notes"
  auto-grow
  min-rows="3"
  max-rows="15"
  placeholder="Type your notes here...">
</schmancy-textarea>

// Usage in a form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input 
    name="title" 
    label="Title" 
    required>
  </schmancy-input>
  
  <schmancy-textarea
    name="description"
    label="Description"
    rows="5"
    required>
  </schmancy-textarea>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>

// Textarea with error state
<schmancy-textarea
  name="feedback"
  label="Feedback"
  value=${feedback}
  error=${feedback.length < 10 ? 'Feedback must be at least 10 characters' : ''}
  @input=${(e) => feedback = e.detail.value}>
</schmancy-textarea>

// Textarea with prefilled markdown template
<schmancy-textarea
  name="issue"
  label="Issue Description"
  value="## Issue Description
- 
- 

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior

"
  rows="12">
</schmancy-textarea>
```