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
  spellcheck?
  align="left|center|right"
  hint="Helper text"
  error?
  fillHeight?
  autoHeight?
  resize="none|vertical|horizontal|both"
  @change=${handleChange}
  @enter=${handleEnter}>
</schmancy-textarea>

// Textarea with fill height (fills container)
<schmancy-textarea
  label="Description"
  fillHeight
  placeholder="This fills the container height...">
</schmancy-textarea>

// Auto-growing textarea
<schmancy-textarea
  autoHeight
  label="Comments"
  placeholder="This grows with content...">
</schmancy-textarea>

// User-resizable textarea
<schmancy-textarea
  resize="vertical"
  rows="6"
  label="Notes"
  placeholder="Drag the corner to resize...">
</schmancy-textarea>

// Combined features
<schmancy-textarea
  fillHeight
  autoHeight
  resize="both"
  label="Full Featured"
  placeholder="Fills container, auto-grows, and user resizable...">
</schmancy-textarea>

// Textarea Methods
textarea.focus(options?) -> void           // Focus the textarea
textarea.blur() -> void                    // Remove focus
textarea.select() -> void                  // Select all text
textarea.checkValidity() -> boolean        // Check validity
textarea.reportValidity() -> boolean       // Validate and show browser message if invalid
textarea.setCustomValidity(message) -> void // Set custom validation message
textarea.adjustHeight() -> void            // Manually adjust height (for autoHeight)
textarea.setSelectionRange(start, end, direction?) -> void // Set text selection
textarea.setRangeText(replacement) -> void // Replace selected text

// Textarea Properties
value: string         // The content of the textarea
name: string          // The name attribute
label: string         // Label text
placeholder: string   // Placeholder text
rows: number = 2      // Number of rows to display
cols: number = 20     // Number of columns to display
minlength: number     // Minimum number of characters required
maxlength: number     // Maximum number of characters allowed
disabled: boolean     // Whether the textarea is disabled
readonly: boolean     // Whether the textarea is read-only
required: boolean     // Whether the textarea is required
spellcheck: boolean   // Whether spellcheck is enabled
align: 'left'|'center'|'right' = 'left' // Text alignment
hint: string          // Helper text below the textarea
error: boolean        // Error state
fillHeight: boolean = false  // Fill container height
autoHeight: boolean = false  // Auto-adjust height based on content
resize: 'none'|'vertical'|'horizontal'|'both' = 'none' // Resize behavior
wrap: 'hard'|'soft' = 'soft' // Text wrapping behavior
dirname: string       // Direction attribute name
autofocus: boolean    // Auto focus on page load

// Textarea Events
@change  // Fires when value changes with { detail: { value } }
@enter   // Fires when enter key is pressed with { detail: { value } }
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

// Textarea with hint and error state
<schmancy-textarea
  name="bio"
  label="Biography"
  maxlength="500"
  hint="Tell us about yourself (max 500 chars)"
  error=${bio.length > 500}
  @change=${(e) => bio = e.detail.value}>
</schmancy-textarea>

// Fill container height
<div style="height: 300px; display: flex; flex-direction: column;">
  <schmancy-textarea
    fillHeight
    label="Full Height Textarea"
    placeholder="This fills the container...">
  </schmancy-textarea>
</div>

// Auto-growing textarea
<schmancy-textarea
  name="notes"
  label="Meeting Notes"
  autoHeight
  placeholder="Type your notes here, field grows automatically...">
</schmancy-textarea>

// User resizable textarea
<schmancy-textarea
  name="description"
  label="Description"
  resize="vertical"
  rows="5"
  placeholder="You can drag the corner to resize this...">
</schmancy-textarea>

// Combined features
<div style="height: 400px; display: flex; flex-direction: column;">
  <schmancy-textarea
    fillHeight
    autoHeight
    resize="both"
    label="Advanced Textarea"
    placeholder="Fills height, auto-grows, and is resizable...">
  </schmancy-textarea>
</div>

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
    required
    hint="Provide a detailed description">
  </schmancy-textarea>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>

// Textarea with enter key handling
<schmancy-textarea
  name="message"
  label="Chat Message"
  placeholder="Type message and press Enter to send..."
  @enter=${(e) => {
    sendMessage(e.detail.value);
    e.target.value = '';
  }}>
</schmancy-textarea>

// Centered text alignment
<schmancy-textarea
  name="poem"
  label="Poetry"
  align="center"
  rows="8"
  placeholder="Write your poem here...">
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
  rows="12"
  autoHeight>
</schmancy-textarea>

// Readonly textarea for displaying content
<schmancy-textarea
  label="Terms and Conditions"
  value="Lorem ipsum dolor sit amet..."
  readonly
  rows="10">
</schmancy-textarea>

// Textarea with spellcheck disabled
<schmancy-textarea
  name="code"
  label="Code Snippet"
  placeholder="Paste your code here..."
  spellcheck=${false}
  rows="8">
</schmancy-textarea>
```