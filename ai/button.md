# Schmancy Button - AI Reference

```js
// Basic Button
<schmancy-button
  variant="primary|secondary|tertiary|danger"
  size="small|medium|large"
  disabled?
  loading?
  @click>
  Button Text
</schmancy-button>

// Icon Button
<schmancy-icon-button
  variant="primary|secondary|tertiary|danger"
  size="small|medium|large"
  icon="icon-name"
  disabled?
  @click>
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

// Examples
<schmancy-button variant="primary" @click=${() => console.log('clicked')}>
  Primary Button
</schmancy-button>

<schmancy-button variant="secondary" size="small" disabled>
  Disabled Button
</schmancy-button>

<schmancy-button loading>
  Loading Button
</schmancy-button>

<schmancy-icon-button icon="edit" variant="tertiary"></schmancy-icon-button>
```
