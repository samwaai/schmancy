# schmancy-qr-scanner

> Camera-based QR code scanner using `jsQR`. Requests rear-camera access, decodes frames in real time, deduplicates reads.

## Usage
```html
<schmancy-qr-scanner
  continuous
  @scan-result=${e => this.handleScan(e.detail.data)}
></schmancy-qr-scanner>
```

```typescript
handleScan(data: string) {
  console.log('QR decoded:', data)
}
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `continuous` | boolean | `true` | Keep scanning after a successful read (dedupe repeated reads) |

## Events
| Event | Detail | When |
|-------|--------|------|
| `scan-result` | `{ data: string, timestamp: number }` | QR code successfully decoded |

## Behavior
- Requests `getUserMedia` with `facingMode: 'environment'` (rear camera) at 1280×720.
- Decodes via `jsQR` on `animationFrames` stream with `throttleTime` to avoid CPU thrashing.
- `distinctUntilChanged` prevents duplicate emissions for the same code.
- Brief success flash on each valid read.
- Stops camera + tears down subscriptions on disconnect.
- Displays an error state if camera permission is denied.

## Requires
- HTTPS (or `localhost`) for camera access.
- User permission to the camera.

## Example
```html
<schmancy-surface type="glass" rounded="all">
  <schmancy-qr-scanner
    @scan-result=${(e: CustomEvent<{ data: string }>) => {
      $notify.success(`Scanned: ${e.detail.data}`)
      this.scannedCode = e.detail.data
    }}
  ></schmancy-qr-scanner>
</schmancy-surface>
```
