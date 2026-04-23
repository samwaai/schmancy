# lightbox (directive)

> Lit directive that opens a fullscreen image viewer on click with gallery support and FLIP animation.

## Usage
```typescript
import { lightbox } from '@mhmo91/schmancy'

html`<img src="photo.jpg" ${lightbox()} />`
```

## Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| options.images | string[] | `undefined` | Array of image URLs for gallery mode |
| options.index | number | `0` | Starting image index in gallery |
| options.overlay | TemplateResult | `undefined` | Custom overlay template on image |

## Examples
```html
<!-- Single image -->
<img src="photo.jpg" ${lightbox()} />

<!-- Gallery with multiple images -->
<img src="thumb1.jpg" ${lightbox({
  images: ['full1.jpg', 'full2.jpg', 'full3.jpg'],
  index: 0
})} />

<!-- With overlay content -->
<img src="photo.jpg" ${lightbox({
  overlay: html`<div class="absolute bottom-4 left-4 text-white">Caption</div>`
})} />
```

Features: FLIP animation from click position, keyboard navigation (Escape, Arrow keys), gallery counter, backdrop blur. Click image or press Escape to close.
