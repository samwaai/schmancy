# Schmancy Chips - AI Reference

```js
// Single Chip - now accepts ANY content!
<schmancy-chip
  value="chip-value"
  selected?
  readOnly?
  disabled?
  @change=${handleChange}>
  Any content here
</schmancy-chip>

// Simple text chip
<schmancy-chip value="javascript">
  JavaScript
</schmancy-chip>

// Chip with icon
<schmancy-chip value="edit">
  <schmancy-icon>edit</schmancy-icon>
  Edit
</schmancy-chip>

// Chip with avatar and text
<schmancy-chip value="user1" class="flex items-center gap-2">
  <schmancy-avatar size="sm">JD</schmancy-avatar>
  <schmancy-typography type="body" token="sm">john.doe@example.com</schmancy-typography>
</schmancy-chip>

// Chip with badge
<schmancy-chip value="notifications" class="flex items-center gap-2">
  <schmancy-icon>notifications</schmancy-icon>
  <span>Notifications</span>
  <schmancy-badge>5</schmancy-badge>
</schmancy-chip>

// Chips Container - Single Selection
<schmancy-chips
  .value=${selectedValue}
  @change=${handleSelectionChange}>
  <schmancy-chip value="1">Option 1</schmancy-chip>
  <schmancy-chip value="2">Option 2</schmancy-chip>
  <schmancy-chip value="3">Option 3</schmancy-chip>
</schmancy-chips>

// Chips Container - Multiple Selection
<schmancy-chips
  multi
  .values=${selectedValues}
  @change=${handleSelectionChange}>
  <schmancy-chip value="red">Red</schmancy-chip>
  <schmancy-chip value="green">Green</schmancy-chip>
  <schmancy-chip value="blue">Blue</schmancy-chip>
</schmancy-chips>

// Horizontal scrolling chips
<schmancy-chips wrap="false">
  <schmancy-chip value="mon">Monday</schmancy-chip>
  <schmancy-chip value="tue">Tuesday</schmancy-chip>
  <schmancy-chip value="wed">Wednesday</schmancy-chip>
  <schmancy-chip value="thu">Thursday</schmancy-chip>
  <schmancy-chip value="fri">Friday</schmancy-chip>
</schmancy-chips>

// Chip Properties
value: string           // Value for selection purposes
selected: boolean       // Whether the chip is selected
readOnly: boolean       // Makes chip non-interactive (no selection change)
disabled: boolean       // Disable the chip (no interaction at all)

// Chips Container Properties
multi: boolean          // Enable multiple selection mode
value: string           // Selected value (single selection)
values: string[]        // Selected values (multiple selection)
wrap: boolean           // Whether chips wrap to new lines (default: true)

// Chip Events
@click   // Fires when chip is clicked
@change  // Fires when selection changes, with { detail: { value: string, selected: boolean } }

// Chips Container Events
@change  // Fires when selection changes, with detail being string (single) or string[] (multi)

// Examples
// Basic chips with emoji and Material icons
<div>
  <schmancy-chip value="basic">Basic</schmancy-chip>
  <schmancy-chip value="javascript" icon="📝">JavaScript</schmancy-chip>
  <schmancy-chip value="settings" icon="settings">Settings</schmancy-chip>
  <schmancy-chip value="star" icon="star">Starred</schmancy-chip>
  <schmancy-chip value="delete" icon="delete">Delete</schmancy-chip>
</div>

// User chips with avatars - now fully supported!
<div class="flex flex-wrap gap-2">
  <schmancy-chip value="user1" class="flex items-center gap-2">
    <schmancy-avatar size="sm">JD</schmancy-avatar>
    <schmancy-typography type="body" token="sm">john.doe@example.com</schmancy-typography>
  </schmancy-chip>
  
  <schmancy-chip value="user2" selected class="flex items-center gap-2">
    <schmancy-avatar size="sm">AS</schmancy-avatar>
    <schmancy-typography type="body" token="sm">alice.smith@example.com</schmancy-typography>
  </schmancy-chip>
</div>

// Single selection chips
<schmancy-chips
  .value=${selectedSize}
  @change=${(e) => selectedSize = e.detail}>
  <schmancy-chip value="sm">Small</schmancy-chip>
  <schmancy-chip value="md">Medium</schmancy-chip>
  <schmancy-chip value="lg">Large</schmancy-chip>
</schmancy-chips>

// Multiple selection chips
<schmancy-chips
  multi
  .values=${selectedToppings}
  @change=${(e) => selectedToppings = e.detail}>
  <schmancy-chip value="cheese">Cheese</schmancy-chip>
  <schmancy-chip value="pepperoni">Pepperoni</schmancy-chip>
  <schmancy-chip value="mushrooms">Mushrooms</schmancy-chip>
  <schmancy-chip value="onions">Onions</schmancy-chip>
  <schmancy-chip value="peppers">Peppers</schmancy-chip>
</schmancy-chips>

// Date selector with horizontal scrolling
<schmancy-chips
  wrap="false"
  .value=${selectedDate}
  @change=${(e) => selectedDate = e.detail}>
  <schmancy-chip value="2024-01-15">Mon 15</schmancy-chip>
  <schmancy-chip value="2024-01-16">Tue 16</schmancy-chip>
  <schmancy-chip value="2024-01-17">Wed 17</schmancy-chip>
  <schmancy-chip value="2024-01-18">Thu 18</schmancy-chip>
  <schmancy-chip value="2024-01-19">Fri 19</schmancy-chip>
  <schmancy-chip value="2024-01-20">Sat 20</schmancy-chip>
  <schmancy-chip value="2024-01-21">Sun 21</schmancy-chip>
</schmancy-chips>

// Category filters
<schmancy-chips
  multi
  .values=${selectedCategories}
  @change=${(e) => selectedCategories = e.detail}>
  <schmancy-chip value="electronics" icon="💻">Electronics</schmancy-chip>
  <schmancy-chip value="clothing" icon="👕">Clothing</schmancy-chip>
  <schmancy-chip value="books" icon="📚">Books</schmancy-chip>
  <schmancy-chip value="home" icon="🏠">Home & Garden</schmancy-chip>
  <schmancy-chip value="sports" icon="⚽">Sports</schmancy-chip>
</schmancy-chips>

// Skills/Tags selection
<schmancy-chips
  multi
  .values=${selectedSkills}
  @change=${(e) => selectedSkills = e.detail}>
  ${availableSkills.map(skill => html`
    <schmancy-chip 
      value=${skill.id}
      icon=${skill.icon}>
      ${skill.name}
    </schmancy-chip>
  `)}
</schmancy-chips>

// Read-only chips display
<div>
  <schmancy-chip value="completed" icon="✅" readOnly>Completed</schmancy-chip>
  <schmancy-chip value="pending" icon="⏳" readOnly>Pending</schmancy-chip>
  <schmancy-chip value="cancelled" icon="❌" readOnly>Cancelled</schmancy-chip>
</div>
```