# Schmancy Map Component

The `schmancy-map` component provides an easy-to-use Google Maps integration with an intuitive API designed for both technical and non-technical users.

## Installation

```bash
npm install @mhmo91/schmancy
# or
yarn add @mhmo91/schmancy
```

## Import

```javascript
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/map'
```

## API Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `address` | `string` | `''` | Simple address string that automatically geocodes to display the location. Takes precedence over latitude/longitude if both are provided. |
| `latitude` | `number` | `undefined` | Latitude coordinate for precise location. Used when address is not provided. |
| `longitude` | `number` | `undefined` | Longitude coordinate for precise location. Used when address is not provided. |
| `zoom` | `number` | `15` | Map zoom level. Higher numbers show more detail (1-20). |
| `height` | `string` | `"400px"` | Height of the map with CSS unit (e.g., "400px", "50vh"). |
| `marker` | `boolean` | `true` | Whether to show a marker at the location. |
| `markerTitle` | `string` | `''` | Tooltip text for the location marker. |
| `type` | `'roadmap' \| 'satellite' \| 'hybrid' \| 'terrain'` | `'roadmap'` | Map display type. |
| `interactive` | `boolean` | `true` | Whether users can interact with the map (pan, zoom, click). |
| `controls` | `boolean` | `true` | Whether to show map controls (zoom buttons, fullscreen, etc.). |
| `apiKey` | `string` | `''` | Google Maps API key. Falls back to GOOGLE_MAPS_API_KEY environment variable. |

## Basic Usage

### Simple Address
The easiest way to display a map - just provide an address:

```html
<schmancy-map address="Times Square, New York"></schmancy-map>
```

### Coordinates
For precise positioning, use latitude and longitude:

```html
<schmancy-map 
  latitude="40.758" 
  longitude="-73.985" 
  zoom="17">
</schmancy-map>
```

### Custom Height
Adjust the map size:

```html
<schmancy-map 
  address="Central Park, New York" 
  height="600px">
</schmancy-map>
```

## Map Types

### Satellite View
```html
<schmancy-map 
  address="Grand Canyon" 
  type="satellite" 
  height="500px">
</schmancy-map>
```

### Hybrid View
Combines satellite imagery with labels:

```html
<schmancy-map 
  address="Mount Everest" 
  type="hybrid">
</schmancy-map>
```

### Terrain View
Shows topographical features:

```html
<schmancy-map 
  address="Yellowstone National Park" 
  type="terrain">
</schmancy-map>
```

## Static Maps

For display-only maps without user interaction:

```html
<schmancy-map 
  address="Eiffel Tower, Paris" 
  interactive="false" 
  controls="false">
</schmancy-map>
```

## Customization

### Custom Marker
```html
<schmancy-map 
  address="Statue of Liberty" 
  markerTitle="Welcome to Liberty Island">
</schmancy-map>
```

### No Marker
```html
<schmancy-map 
  address="Pacific Ocean" 
  marker="false">
</schmancy-map>
```

### Different Zoom Levels
```html
<!-- City view -->
<schmancy-map address="Tokyo" zoom="10"></schmancy-map>

<!-- Street view -->
<schmancy-map address="Tokyo Tower" zoom="18"></schmancy-map>
```

## API Key Setup

### Environment Variable (Recommended)
Set `GOOGLE_MAPS_API_KEY` in your environment:

```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Direct Property
```html
<schmancy-map 
  address="Sydney Opera House" 
  api-key="your_api_key_here">
</schmancy-map>
```

## Features

### Automatic Geocoding
- Converts human-readable addresses to coordinates
- Handles various address formats
- Provides error feedback for invalid addresses

### Responsive Design
- Adapts to container width
- Configurable height with CSS units
- Maintains aspect ratio on mobile

### Loading States
- Shows spinner while loading
- Displays error messages for failed loads
- Graceful fallback when maps can't load

### Performance
- Lazy loads Google Maps API
- Caches script loading across components
- Minimal bundle size impact

## Error Handling

The component handles various error scenarios:

- **Invalid Address**: Shows error message with geocoding failure
- **Missing API Key**: Clear error message about required API key
- **Network Issues**: Graceful fallback with retry capability
- **Invalid Coordinates**: Validation of latitude/longitude ranges

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support (when interactive)
- High contrast error states
- Semantic HTML structure

## Browser Support

- Modern browsers with ES2015+ support
- Google Maps API compatibility
- Progressive enhancement for older browsers

## Examples in Real Applications

### Store Locator
```html
<schmancy-map 
  address="Apple Store, 5th Avenue, New York" 
  zoom="16" 
  marker-title="Apple Store - 5th Avenue">
</schmancy-map>
```

### Event Location
```html
<schmancy-map 
  address="Madison Square Garden, New York" 
  height="300px" 
  interactive="false">
</schmancy-map>
```

### Property Listing
```html
<schmancy-map 
  latitude="40.7831" 
  longitude="-73.9712" 
  zoom="15" 
  marker-title="Beautiful Apartment">
</schmancy-map>
```

## Best Practices

1. **Use addresses for user-friendly input**: Most users understand addresses better than coordinates
2. **Set appropriate zoom levels**: 10-12 for cities, 15-17 for neighborhoods, 18+ for buildings
3. **Consider mobile users**: Use responsive heights like "50vh" for mobile-friendly maps
4. **Provide meaningful marker titles**: Help users understand what the marker represents
5. **Use static maps for display-only**: Disable interaction when the map is purely informational