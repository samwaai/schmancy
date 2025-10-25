# Slider Component

A smooth, touch-friendly carousel component for displaying content in slides with navigation controls and indicators.

## Quick Start

```html
<!-- Basic image slider -->
<schmancy-slider>
  <schmancy-slide type="image" src="/image1.jpg" alt="Slide 1"></schmancy-slide>
  <schmancy-slide type="image" src="/image2.jpg" alt="Slide 2"></schmancy-slide>
  <schmancy-slide type="image" src="/image3.jpg" alt="Slide 3"></schmancy-slide>
</schmancy-slider>

<!-- Content slider -->
<schmancy-slider showArrows>
  <schmancy-slide>
    <schmancy-card>
      <h3>Feature One</h3>
      <p>Description of the first feature...</p>
    </schmancy-card>
  </schmancy-slide>
  <schmancy-slide>
    <schmancy-card>
      <h3>Feature Two</h3>
      <p>Description of the second feature...</p>
    </schmancy-card>
  </schmancy-slide>
</schmancy-slider>
```

## Components

### schmancy-slider
The main container that handles slide navigation and controls.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showArrows` | `boolean` | `true` | Show navigation arrows |

**Events:**
- `slide-changed`: Fired when active slide changes with `{ detail: { index: number } }`

### schmancy-slide
Individual slide component supporting various content types.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'image' \| 'video' \| 'content'` | `'content'` | Slide content type |
| `src` | `string` | `''` | Source for image/video |
| `alt` | `string` | `''` | Alt text for images |
| `controls` | `boolean` | `true` | Show video controls |
| `autoplay` | `boolean` | `false` | Autoplay video |
| `loop` | `boolean` | `false` | Loop video |
| `muted` | `boolean` | `false` | Mute video |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'scale-down' \| 'none'` | `'cover'` | Object fit style |

## Examples

### Product Gallery
```html
<schmancy-slider class="h-96">
  ${products.map(product => html`
    <schmancy-slide type="image" 
      src="${product.image}" 
      alt="${product.name}"
      fit="contain"
    ></schmancy-slide>
  `)}
</schmancy-slider>
```

### Testimonials Carousel
```html
<schmancy-slider showArrows>
  ${testimonials.map(testimonial => html`
    <schmancy-slide>
      <div class="p-8 text-center">
        <schmancy-avatar 
          src="${testimonial.avatar}" 
          name="${testimonial.name}"
          size="lg"
          class="mx-auto mb-4"
        ></schmancy-avatar>
        <blockquote class="text-lg italic mb-4">
          "${testimonial.quote}"
        </blockquote>
        <cite class="text-sm">
          - ${testimonial.name}, ${testimonial.role}
        </cite>
      </div>
    </schmancy-slide>
  `)}
</schmancy-slider>
```

### Video Showcase
```html
<schmancy-slider>
  <schmancy-slide 
    type="video" 
    src="/demo-video-1.mp4"
    controls
    muted
    autoplay
  ></schmancy-slide>
  <schmancy-slide 
    type="video" 
    src="/demo-video-2.mp4"
    controls
  ></schmancy-slide>
</schmancy-slider>
```

### Mixed Content Slider
```html
<schmancy-slider>
  <!-- Welcome slide -->
  <schmancy-slide>
    <div class="flex items-center justify-center h-full p-8">
      <div class="text-center">
        <h1 class="text-4xl mb-4">Welcome</h1>
        <p>Swipe to explore our features</p>
      </div>
    </div>
  </schmancy-slide>
  
  <!-- Feature image -->
  <schmancy-slide type="image" src="/feature.jpg" alt="Main Feature"></schmancy-slide>
  
  <!-- Video demo -->
  <schmancy-slide type="video" src="/demo.mp4" controls></schmancy-slide>
  
  <!-- Call to action -->
  <schmancy-slide>
    <div class="flex items-center justify-center h-full">
      <schmancy-button variant="filled" size="lg">
        Get Started
      </schmancy-button>
    </div>
  </schmancy-slide>
</schmancy-slider>
```

## Features

### Smooth Scrolling
- Native scroll behavior with CSS scroll-snap
- Touch and mouse support
- Keyboard navigation ready

### Navigation Controls
- Previous/Next arrow buttons
- Automatic disable at bounds
- Dot indicators showing current position

### Responsive Design
- Slides automatically fill container width
- Hidden scrollbars for clean appearance
- Works on all device sizes

### Performance
- Lazy loading for images
- Throttled scroll events
- Efficient slide position detection

## Styling

```css
/* Container styling */
schmancy-slider {
  height: 400px; /* Set explicit height */
}

/* Custom arrow positioning */
schmancy-slider::part(prev-button) {
  left: 1rem;
}

schmancy-slider::part(next-button) {
  right: 1rem;
}

/* Indicator customization */
schmancy-slider::part(indicators) {
  bottom: 2rem;
}
```

## Navigation Methods

```javascript
// Get slider element
const slider = document.querySelector('schmancy-slider');

// Listen for slide changes
slider.addEventListener('slide-changed', (e) => {
  console.log('Current slide:', e.detail.index);
});

// Programmatically navigate (if exposed)
// slider.goToSlide(2);
```

## Best Practices

1. **Height**: Always set explicit height on slider container
2. **Images**: Optimize images for web delivery
3. **Accessibility**: Provide meaningful alt text
4. **Performance**: Limit number of slides for better performance
5. **Touch**: Ensure adequate touch targets on mobile

## Related Components

- [Card](./card.md) - Content containers for slides
- [Button](./button.md) - Navigation controls
- [Surface](./surface.md) - Slide backgrounds

## Use Cases

1. **Product Galleries**: E-commerce product images
2. **Hero Sections**: Landing page carousels
3. **Testimonials**: Customer feedback showcase
4. **Tutorials**: Step-by-step guides
5. **Media Galleries**: Photo and video collections