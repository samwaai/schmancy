# Schmancy Card - AI Reference

```js
// Basic Card
<schmancy-card>
  <div>Card content goes here</div>
</schmancy-card>

// Card with title and content
<schmancy-card>
  <schmancy-card-content>
    <h2>Card Title</h2>
    <p>Card description text goes here.</p>
  </schmancy-card-content>
</schmancy-card>

// Card with media
<schmancy-card>
  <schmancy-card-media
    image="path/to/image.jpg"
    alt="Image description"
    height="200px">
  </schmancy-card-media>
  
  <schmancy-card-content>
    <h2>Card with Media</h2>
    <p>Card content below the image.</p>
  </schmancy-card-content>
</schmancy-card>

// Card with actions
<schmancy-card>
  <schmancy-card-content>
    <h2>Card Title</h2>
    <p>Card content with action buttons.</p>
  </schmancy-card-content>
  
  <schmancy-card-actions>
    <schmancy-button>Action 1</schmancy-button>
    <schmancy-button>Action 2</schmancy-button>
  </schmancy-card-actions>
</schmancy-card>

// Complete card with all components
<schmancy-card>
  <schmancy-card-media
    image="path/to/image.jpg"
    alt="Image description">
  </schmancy-card-media>
  
  <schmancy-card-content>
    <h2>Card Title</h2>
    <p>Card description text goes here. This can contain any content.</p>
  </schmancy-card-content>
  
  <schmancy-card-actions>
    <schmancy-button kind="tertiary">Cancel</schmancy-button>
    <schmancy-button kind="primary">Submit</schmancy-button>
  </schmancy-card-actions>
</schmancy-card>

// Card Properties
outlined: boolean        // Shows an outline instead of elevation
elevation: number        // Shadow elevation level (1-5)
interactive: boolean     // Enables hover and click effects

// Card Media Properties
image: string           // URL of the image
alt: string             // Alt text for the image
height: string          // Height of the media area
title: string           // Title to display over the media

// Card Actions Properties
align: string           // Alignment of actions: "start", "end", "space-between", "center"
direction: string       // Direction of actions: "row", "column"

// Examples
// Basic card with content
<schmancy-card>
  <schmancy-card-content>
    <h2>Welcome to Schmancy</h2>
    <p>A modern component library for web applications.</p>
  </schmancy-card-content>
</schmancy-card>

// Interactive card
<schmancy-card 
  interactive
  @click=${handleCardClick}>
  <schmancy-card-content>
    <h3>Click Me</h3>
    <p>This entire card is clickable.</p>
  </schmancy-card-content>
</schmancy-card>

// Outlined card
<schmancy-card outlined>
  <schmancy-card-content>
    <h3>Outlined Card</h3>
    <p>This card has an outline instead of elevation.</p>
  </schmancy-card-content>
</schmancy-card>

// Product card
<schmancy-card>
  <schmancy-card-media
    image="/products/headphones.jpg"
    alt="Wireless Headphones"
    height="180px">
  </schmancy-card-media>
  
  <schmancy-card-content>
    <h3>Wireless Headphones</h3>
    <p>Premium sound quality with noise cancellation.</p>
    <p><strong>$149.99</strong></p>
  </schmancy-card-content>
  
  <schmancy-card-actions>
    <schmancy-button kind="tertiary">Details</schmancy-button>
    <schmancy-button kind="primary">Add to Cart</schmancy-button>
  </schmancy-card-actions>
</schmancy-card>

// Card grid layout
<schmancy-grid
  columns="1"
  columns-md="2"
  columns-lg="3"
  gap="16px">
  
  ${products.map(product => html`
    <schmancy-card>
      <schmancy-card-media
        image=${product.image}
        alt=${product.name}>
      </schmancy-card-media>
      
      <schmancy-card-content>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${product.price}</strong></p>
      </schmancy-card-content>
      
      <schmancy-card-actions>
        <schmancy-button @click=${() => viewProduct(product)}>
          View
        </schmancy-button>
        <schmancy-button kind="primary" @click=${() => addToCart(product)}>
          Add to Cart
        </schmancy-button>
      </schmancy-card-actions>
    </schmancy-card>
  `)}
</schmancy-grid>
```