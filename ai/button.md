# Schmancy Button - AI Reference

```js
// Basic Button
<schmancy-button
  variant="elevated|filled|filled tonal|outlined|text"
  width="full|auto"
  type="button|submit|reset"
  disabled?
  href?
  @click>
  Button Text
</schmancy-button>

// Icon Button
<schmancy-icon-button
  variant="elevated|filled|filled tonal|outlined|text"
  size="sm|md|lg"
  width="full|auto"
  type="button|submit|reset"
  disabled?
  href?
  @click>
  <!-- Icon content goes directly in the slot -->
  <svg>...</svg> 
</schmancy-icon-button>

// Button with Icon
<schmancy-button>
  <schmancy-icon slot="prefix" icon="check"></schmancy-icon>
  With Prefix Icon
</schmancy-button>

<schmancy-button>
  With Suffix Icon
  <schmancy-icon slot="suffix" icon="arrow-right"></schmancy-icon>
</schmancy-button>

// Button Properties
variant: string       // "elevated", "filled", "filled tonal", "outlined", "text" (default: "text")
width: string         // "full", "auto" (default: "auto")
type: string          // "button", "submit", "reset" (default: "button")
disabled: boolean     // Whether the button is disabled
href: string          // If provided, renders as an anchor (<a>) element
ariaLabel: string     // Accessible label for the button

// Icon Button Properties
variant: string       // "elevated", "filled", "filled tonal", "outlined", "text" (default: "text")
size: string          // "sm", "md", "lg" (default: "md")
width: string         // "full", "auto" (default: "auto")
type: string          // "button", "submit", "reset" (default: "button")
disabled: boolean     // Whether the button is disabled
href: string          // If provided, renders as an anchor (<a>) element
ariaLabel: string     // Accessible label for the button

// Button Methods
focus(options?) -> void  // Sets focus on the button
blur() -> void           // Removes focus from the button
click() -> void          // Programmatically clicks the button

// Examples
<schmancy-button variant="filled" @click=${() => console.log('clicked')}>
  Filled Button
</schmancy-button>

<schmancy-button variant="outlined" disabled>
  Disabled Button
</schmancy-button>

<schmancy-button variant="elevated">
  Elevated Button
</schmancy-button>

<schmancy-button variant="text">
  Text Button
</schmancy-button>

<schmancy-button variant="filled tonal">
  Tonal Button
</schmancy-button>

<schmancy-button href="https://example.com" variant="outlined">
  Link Button
</schmancy-button>

<schmancy-button width="full" variant="filled">
  Full Width Button
</schmancy-button>

<schmancy-icon-button variant="filled" size="md">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
</schmancy-icon-button>

<schmancy-icon-button variant="text" size="sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <line x1="13" y1="6" x2="6" y2="14"></line>
  </svg>
</schmancy-icon-button>

// Form submission button
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input name="email" type="email" required></schmancy-input>
  <schmancy-button type="submit" variant="filled">
    Submit Form
  </schmancy-button>
</schmancy-form>
```