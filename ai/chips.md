# Schmancy Chips - AI Reference

```js
// Single Chip
<schmancy-chip
  text="Chip Text"
  variant="default|primary|secondary|success|warning|danger|info"
  size="small|medium|large"
  closable?
  disabled?
  @close=${handleClose}
  @click=${handleClick}>
</schmancy-chip>

// Chip with icon
<schmancy-chip text="JavaScript">
  <schmancy-icon slot="prefix" icon="code"></schmancy-icon>
</schmancy-chip>

// Chip with avatar
<schmancy-chip text="John Doe">
  <schmancy-avatar slot="prefix" src="path/to/avatar.jpg" size="small"></schmancy-avatar>
</schmancy-chip>

// Chips Container
<schmancy-chips
  @change=${handleSelectionChange}>
  <schmancy-chip text="Option 1" value="1"></schmancy-chip>
  <schmancy-chip text="Option 2" value="2"></schmancy-chip>
  <schmancy-chip text="Option 3" value="3"></schmancy-chip>
</schmancy-chips>

// Chips Container with selection mode
<schmancy-chips
  selection="single|multiple|none"
  .value=${selectedValues}
  @change=${handleSelectionChange}>
  <schmancy-chip text="Red" value="red"></schmancy-chip>
  <schmancy-chip text="Green" value="green"></schmancy-chip>
  <schmancy-chip text="Blue" value="blue"></schmancy-chip>
</schmancy-chips>

// Input with chip creation
<schmancy-chips
  input?
  placeholder="Add tag..."
  @add=${handleAddChip}
  @remove=${handleRemoveChip}>
  <schmancy-chip text="React" closable></schmancy-chip>
  <schmancy-chip text="Vue" closable></schmancy-chip>
  <schmancy-chip text="Angular" closable></schmancy-chip>
</schmancy-chips>

// Chip Properties
text: string            // Text content of the chip
value: string           // Value for selection purposes
variant: string         // Visual style: "default", "primary", "secondary", etc.
size: string            // Size: "small", "medium", "large"
closable: boolean       // Show close button
disabled: boolean       // Disable the chip
selected: boolean       // Whether the chip is selected

// Chips Container Properties
selection: string       // Selection mode: "none", "single", "multiple"
value: string[]         // Selected values
input: boolean          // Show input for adding new chips
placeholder: string     // Placeholder for the input
max: number             // Maximum number of chips allowed
disabled: boolean       // Disable the entire container

// Chip Events
@click   // Fires when chip is clicked
@close   // Fires when close button is clicked
@keydown // Fires on keydown events

// Chips Container Events
@change  // Fires when selection changes, with { detail: { value } }
@add     // Fires when a chip is added, with { detail: { text, value } }
@remove  // Fires when a chip is removed, with { detail: { text, value } }

// Examples
// Basic chips
<div>
  <schmancy-chip text="Basic"></schmancy-chip>
  <schmancy-chip text="Primary" variant="primary"></schmancy-chip>
  <schmancy-chip text="Success" variant="success"></schmancy-chip>
  <schmancy-chip text="Warning" variant="warning"></schmancy-chip>
  <schmancy-chip text="Danger" variant="danger"></schmancy-chip>
</div>

// Closable chips
<div>
  <schmancy-chip 
    text="JavaScript" 
    closable
    @close=${() => removeTag('javascript')}>
    <schmancy-icon slot="prefix" icon="code"></schmancy-icon>
  </schmancy-chip>
  
  <schmancy-chip 
    text="TypeScript" 
    closable
    @close=${() => removeTag('typescript')}>
    <schmancy-icon slot="prefix" icon="code"></schmancy-icon>
  </schmancy-chip>
</div>

// Single selection chips
<schmancy-chips
  selection="single"
  .value=${[selectedSize]}
  @change=${(e) => selectedSize = e.detail.value[0]}>
  <schmancy-chip text="Small" value="sm"></schmancy-chip>
  <schmancy-chip text="Medium" value="md"></schmancy-chip>
  <schmancy-chip text="Large" value="lg"></schmancy-chip>
</schmancy-chips>

// Multiple selection chips
<schmancy-chips
  selection="multiple"
  .value=${selectedToppings}
  @change=${(e) => selectedToppings = e.detail.value}>
  <schmancy-chip text="Cheese" value="cheese"></schmancy-chip>
  <schmancy-chip text="Pepperoni" value="pepperoni"></schmancy-chip>
  <schmancy-chip text="Mushrooms" value="mushrooms"></schmancy-chip>
  <schmancy-chip text="Onions" value="onions"></schmancy-chip>
  <schmancy-chip text="Peppers" value="peppers"></schmancy-chip>
</schmancy-chips>

// Input chips for tags
<schmancy-chips
  input
  placeholder="Add tag..."
  @add=${(e) => addTag(e.detail.text)}
  @remove=${(e) => removeTag(e.detail.text)}>
  ${tags.map(tag => html`
    <schmancy-chip 
      text=${tag} 
      closable>
    </schmancy-chip>
  `)}
</schmancy-chips>

// Email recipient chips
<schmancy-chips
  input
  placeholder="Add recipient..."
  @add=${addRecipient}
  @remove=${removeRecipient}>
  ${recipients.map(recipient => html`
    <schmancy-chip text=${recipient.name} closable>
      <schmancy-avatar
        slot="prefix"
        src=${recipient.avatar}
        size="small">
      </schmancy-avatar>
    </schmancy-chip>
  `)}
</schmancy-chips>

// Filter chips
<div>
  <div>Filters:</div>
  <schmancy-chips>
    ${filters.map(filter => html`
      <schmancy-chip
        text=${filter.label}
        closable
        @close=${() => removeFilter(filter.id)}>
      </schmancy-chip>
    `)}
    
    <schmancy-chip
      text="Add Filter"
      @click=${openFilterDialog}>
      <schmancy-icon slot="prefix" icon="add"></schmancy-icon>
    </schmancy-chip>
  </schmancy-chips>
</div>
```