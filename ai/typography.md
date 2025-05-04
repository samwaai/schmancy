# Schmancy Typography - AI Reference

```js
// Basic Typography
<schmancy-typography
  variant="h1|h2|h3|h4|h5|h6|subtitle1|subtitle2|body1|body2|button|caption|overline"
  color="primary|secondary|tertiary|error|text-primary|text-secondary|text-disabled"
  align="left|center|right|justify"
  weight="thin|light|regular|medium|bold"
  transform="none|uppercase|lowercase|capitalize"
  truncate?
  no-wrap?
  gutter-bottom?>
  Text content goes here
</schmancy-typography>

// Typography heading variants
<schmancy-typography variant="h1">Heading 1</schmancy-typography>
<schmancy-typography variant="h2">Heading 2</schmancy-typography>
<schmancy-typography variant="h3">Heading 3</schmancy-typography>
<schmancy-typography variant="h4">Heading 4</schmancy-typography>
<schmancy-typography variant="h5">Heading 5</schmancy-typography>
<schmancy-typography variant="h6">Heading 6</schmancy-typography>

// Typography body variants
<schmancy-typography variant="subtitle1">Subtitle 1</schmancy-typography>
<schmancy-typography variant="subtitle2">Subtitle 2</schmancy-typography>
<schmancy-typography variant="body1">Body 1 text</schmancy-typography>
<schmancy-typography variant="body2">Body 2 text</schmancy-typography>
<schmancy-typography variant="button">Button text</schmancy-typography>
<schmancy-typography variant="caption">Caption text</schmancy-typography>
<schmancy-typography variant="overline">Overline text</schmancy-typography>

// Typography Properties
variant: string        // Text style variant
color: string          // Text color
align: string          // Text alignment
weight: string         // Font weight
transform: string      // Text transformation
truncate: boolean      // Truncate overflow with ellipsis
noWrap: boolean        // Prevent text wrapping
gutterBottom: boolean  // Add margin at the bottom
italic: boolean        // Italic style
underline: boolean     // Underline text
lineHeight: string     // Line height
letterSpacing: string  // Letter spacing
fontFamily: string     // Font family
size: string           // Custom font size (overrides variant)
responsive: boolean    // Apply responsive sizing

// Examples
// Basic usage
<schmancy-typography variant="h2" color="primary">
  Welcome to Our Application
</schmancy-typography>

<schmancy-typography variant="body1">
  This is a paragraph of text that demonstrates the body1 typography variant.
  It's commonly used for the main content text on a page.
</schmancy-typography>

// Styled text
<schmancy-typography
  variant="subtitle1"
  weight="bold"
  color="secondary"
  transform="uppercase">
  Important Notice
</schmancy-typography>

// Truncated text
<schmancy-typography
  variant="body2"
  truncate
  style="max-width: 200px;">
  This is a very long text that will be truncated with an ellipsis when it exceeds the container width.
</schmancy-typography>

// Responsive headings
<schmancy-typography
  variant="h1"
  responsive
  align="center"
  gutter-bottom>
  Responsive Heading
</schmancy-typography>

// Text with custom styling
<schmancy-typography
  variant="body1"
  italic
  letter-spacing="0.5px"
  line-height="1.8">
  This text has custom letter spacing and line height, with italic styling.
</schmancy-typography>

// Text with different weights
<div>
  <schmancy-typography variant="body1" weight="thin">
    This text has thin weight.
  </schmancy-typography>
  
  <schmancy-typography variant="body1" weight="light">
    This text has light weight.
  </schmancy-typography>
  
  <schmancy-typography variant="body1" weight="regular">
    This text has regular weight.
  </schmancy-typography>
  
  <schmancy-typography variant="body1" weight="medium">
    This text has medium weight.
  </schmancy-typography>
  
  <schmancy-typography variant="body1" weight="bold">
    This text has bold weight.
  </schmancy-typography>
</div>

// Typography in a card
<schmancy-card>
  <schmancy-card-content>
    <schmancy-typography variant="h4" gutter-bottom>
      Card Title
    </schmancy-typography>
    
    <schmancy-typography variant="body2" color="text-secondary" gutter-bottom>
      Posted on January 1, 2023
    </schmancy-typography>
    
    <schmancy-typography variant="body1">
      This is the main content of the card. It uses the body1 typography variant
      which is suitable for longer text content.
    </schmancy-typography>
  </schmancy-card-content>
  
  <schmancy-card-actions>
    <schmancy-button>
      <schmancy-typography variant="button">
        Read More
      </schmancy-typography>
    </schmancy-button>
  </schmancy-card-actions>
</schmancy-card>

// Error message
<schmancy-typography
  variant="body2"
  color="error"
  gutter-bottom>
  The username or password you entered is incorrect.
</schmancy-typography>

// Caption with custom size
<schmancy-typography
  variant="caption"
  color="text-secondary"
  size="10px">
  * Terms and conditions apply
</schmancy-typography>

// Paragraph with custom font family
<schmancy-typography
  variant="body1"
  font-family="'Georgia', serif"
  line-height="1.7">
  This paragraph uses a serif font for a more traditional typographic style.
  Custom font families can be specified when needed for special sections.
</schmancy-typography>
```