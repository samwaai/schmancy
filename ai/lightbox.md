# Lightbox Directive

A Lit directive that adds lightbox functionality to images, allowing them to be viewed in a full-screen overlay with optional gallery navigation.

## Import

```typescript
import { lightbox } from '@mhmo91/schmancy/directives'
```

## Basic Usage

### Single Image Lightbox

The simplest use case - click an image to view it full-screen:

```typescript
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { lightbox } from '@mhmo91/schmancy/directives'

@customElement('my-component')
export class MyComponent extends LitElement {
  render() {
    return html`
      <img
        src="https://example.com/image.jpg"
        alt="Product photo"
        ${lightbox()}
      />
    `
  }
}
```

### Image Gallery

Show multiple images with navigation controls:

```typescript
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { lightbox } from '@mhmo91/schmancy/directives'

@customElement('gallery-component')
export class GalleryComponent extends LitElement {
  @property({ type: Array })
  images = [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg',
    'https://example.com/photo3.jpg',
    'https://example.com/photo4.jpg'
  ]

  render() {
    return html`
      <div class="gallery">
        ${this.images.map((image, index) => html`
          <img
            src=${image}
            alt="Gallery image ${index + 1}"
            ${lightbox({ images: this.images, index })}
            class="thumbnail"
          />
        `)}
      </div>
    `
  }
}
```

## Options

The directive accepts an optional `LightboxOptions` object:

```typescript
interface LightboxOptions {
  images?: string[]       // Array of image URLs for gallery mode
  index?: number          // Starting index when opening the gallery
  overlay?: TemplateResult // Optional Lit template to render over the image
}
```

### Options Examples

**Single image (no options needed):**
```typescript
${lightbox()}
```

**Gallery with specific starting image:**
```typescript
${lightbox({
  images: this.allImages,
  index: 2  // Opens at the 3rd image
})}
```

**Image with overlay (name/price):**
```typescript
${lightbox({
  overlay: html`
    <div class="absolute inset-x-0 bottom-0 pt-10 pb-3 px-4 bg-linear-to-t from-black/80 via-black/40 to-transparent rounded-b-lg">
      <div class="flex items-end justify-between gap-2">
        <schmancy-typography type="title" token="lg" class="text-white">
          ${this.item.name}
        </schmancy-typography>
        <schmancy-typography type="title" token="lg" class="text-white font-semibold">
          ${formatCurrency(this.item.price, this.cart.currency)}
        </schmancy-typography>
      </div>
    </div>
  `,
})}
```

## Features

### Keyboard Navigation

When the lightbox is open:
- **Escape** - Close the lightbox
- **Arrow Left** - Previous image (gallery mode only)
- **Arrow Right** - Next image (gallery mode only)

### Click Behavior

- **Overlay background** - Click to close
- **Single image** - Click the image itself to close
- **Gallery** - Click navigation buttons to move between images
- **Close button** - Always available in top-right corner

### Automatic Enhancements

The directive automatically:
- Adds `cursor: pointer` style to images
- Adds hover effects (`hover:opacity-80` and `transition-opacity` classes)
- Creates full-screen overlay with backdrop blur
- Handles focus management and cleanup
- Supports smooth animations

## Real-World Examples

### Product Images

```typescript
@customElement('product-card')
export class ProductCard extends LitElement {
  @property({ type: Object })
  product!: {
    thumbnail: string
    images: string[]
  }

  render() {
    return html`
      <div class="product-card">
        <img
          src=${this.product.thumbnail}
          alt=${this.product.name}
          ${lightbox({
            images: this.product.images,
            index: 0
          })}
          class="product-thumbnail"
        />
      </div>
    `
  }
}
```

### Document Viewer

```typescript
@customElement('invoice-viewer')
export class InvoiceViewer extends LitElement {
  @property({ type: Array })
  pageImages: string[] = []

  render() {
    return html`
      <div class="invoice-pages">
        ${this.pageImages.map((page, i) => html`
          <div class="page-preview">
            <img
              src=${page}
              alt="Invoice page ${i + 1}"
              ${lightbox({ images: this.pageImages, index: i })}
            />
            <p>Page ${i + 1}</p>
          </div>
        `)}
      </div>
    `
  }
}
```

### Avatar with Enlargement

```typescript
@customElement('user-profile')
export class UserProfile extends LitElement {
  @property({ type: String })
  avatarUrl!: string

  render() {
    return html`
      <div class="profile-header">
        <img
          src=${this.avatarUrl}
          alt="User avatar"
          ${lightbox()}
          class="avatar"
        />
        <div class="user-info">
          <h2>John Doe</h2>
          <p>Click avatar to enlarge</p>
        </div>
      </div>
    `
  }
}
```

## Styling Tips

The directive works with any image styling. Common patterns:

```css
/* Thumbnail grid */
.thumbnail {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* Product image */
.product-thumbnail {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
}

/* Avatar */
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
```

## Blackbird Animation

The lightbox uses a **Blackbird two-stage arc animation** inspired by bird flight patterns. When opening, the image follows a curved trajectory like a bird taking flight.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    (2) Takeoff Arc Peak                                     │
│         ↗     ↘                                             │
│       ↗         ↘                                           │
│  (1) Source      (3) Click Position                         │
│  [Thumbnail]          ↘                                     │
│                         ↘  (4) Landing Arc                  │
│                           ↘                                 │
│                             ↘                               │
│                          (5) Final [Large Image]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5 Keyframes (like bird flight)

| Offset | Stage | Movement |
|--------|-------|----------|
| 0% | Start | At thumbnail (source element) |
| 25% | Takeoff Arc | Arcs **UP** (bird lifts off) |
| 50% | Waypoint | At click position (transition) |
| 75% | Landing Arc | Arcs **DOWN** (bird descends) |
| 100% | Final | At destination position |

### Key Features

- **Arc UP** during takeoff (like a bird gaining altitude)
- **Arc DOWN** during landing (like a bird descending)
- **Scale progression**: small → medium → large
- **Organic easing**: `cubic-bezier(0.34, 1.2, 0.64, 1)` with slight overshoot
- **Duration**: 600ms total for the full flight path
- **Respects `prefers-reduced-motion`** for accessibility

### Animation Sources

The animation is based on research from:
- [Animator Notebook - Bird Flight](https://www.animatornotebook.com/learn/bird-flight) - Three stages of flight (lift-off, flying, landing)
- [Moving along curved paths in CSS](https://tobiasahlin.com/blog/curved-path-animations-in-css/) - Layered animation technique
- [Spring Physics Animation](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/) - Organic easing functions

---

## Flip Directive

The lightbox includes a reusable `flip` directive for FLIP (First, Last, Invert, Play) animations.

### Import

```typescript
import { flip } from '@mhmo91/schmancy/lightbox'
```

### Options

```typescript
interface FlipOptions {
  sourceElement?: HTMLElement  // Source element to animate from
  position?: { x: number; y: number } | MouseEvent | TouchEvent  // Click position
  duration?: number            // Animation duration in ms (default: 600)
  easing?: string              // CSS easing function
  scale?: boolean              // Whether to animate scale (default: true)
  blackbird?: boolean          // Enable two-stage arc animation (default: true)
}
```

### Usage

```typescript
// Basic usage - animate from source element
<div ${flip({ sourceElement: thumbnailElement })}>
  Expanding content
</div>

// With click position for blackbird animation
<img
  src=${imageSrc}
  ${flip({
    sourceElement: this.thumbnailElement,
    position: this.clickPosition,
    duration: 600,
    scale: true,
    blackbird: true,
  })}
/>

// Simple animation without blackbird arcs
<div ${flip({ position: { x: 100, y: 200 }, blackbird: false })}>
  Content
</div>
```

---

## Positioning

The lightbox uses [Floating UI](https://floating-ui.com/) for smart positioning:

### Desktop Behavior
- Positions near the click point (quadrant-based)
- Expands away from the click to maximize visibility
- Automatically flips/shifts to stay in viewport

### Mobile Behavior (< 768px)
- **Centered horizontally** for better mobile UX
- Vertical placement based on click position (top/bottom half)
- Full-width image display

---

## Notes

- The lightbox automatically handles cleanup when the component disconnects
- Images are displayed at their natural resolution in the lightbox
- The overlay uses Tailwind classes for styling (dark background, backdrop blur)
- Gallery counter shows current position (e.g., "2 / 5")
- Works seamlessly with lazy-loaded images
- Mobile-friendly with touch-friendly controls
