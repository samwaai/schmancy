# schmancy-map

> Google Maps component. Accepts address string (auto-geocoded) or exact lat/lng. Singleton-loaded Maps SDK.

## Usage
```html
<!-- By address -->
<schmancy-map
  address="Times Square, New York"
  api-key="YOUR_GOOGLE_MAPS_KEY"
></schmancy-map>

<!-- By coordinates -->
<schmancy-map
  .latitude=${40.758}
  .longitude=${-73.985}
  .zoom=${15}
  type="satellite"
  api-key="YOUR_GOOGLE_MAPS_KEY"
></schmancy-map>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `address` | string | — | Location for geocoding (e.g. `"Eiffel Tower, Paris"`) |
| `latitude` | number | — | Precise latitude (takes precedence over address) |
| `longitude` | number | — | Precise longitude |
| `zoom` | number | default Maps default | Map zoom level |
| `type` | `'roadmap' \| 'satellite' \| 'hybrid' \| 'terrain'` | `'roadmap'` | Map style |
| `height` | string | — | Custom height (e.g. `'400px'`, `'60vh'`) |
| `apiKey` | string | **required** | Google Maps API key |

## Behavior
- The first `schmancy-map` instance triggers a singleton script load of `maps.googleapis.com/maps/api/js` with the `places` library.
- Subsequent instances reuse the same loader — no duplicate network requests.
- If `address` is provided without coordinates, the built-in `Geocoder` resolves it before rendering.
- Errors (invalid key, unauthorized domain, geocode failure) render a fallback message inside the host.

## Setup
1. Acquire a Google Maps JavaScript API key from Google Cloud Console.
2. Enable the **Maps JavaScript API** and **Geocoding API**.
3. Add your domain to the authorized list.

## Example
```html
<schmancy-surface type="subtle" rounded="all">
  <schmancy-map
    address="1600 Amphitheatre Parkway, Mountain View, CA"
    height="320px"
    type="hybrid"
    .apiKey=${import.meta.env.VITE_GOOGLE_MAPS_KEY}
  ></schmancy-map>
</schmancy-surface>
```
