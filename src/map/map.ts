import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { of, EMPTY, Observable } from 'rxjs'
import { switchMap, tap, catchError, takeUntil, finalize, shareReplay } from 'rxjs/operators'

/** Google Maps coordinate type */
interface LatLng {
  lat(): number
  lng(): number
}

/** Google Maps options */
interface GoogleMapOptions {
  center: { lat: number; lng: number }
  zoom: number
  mapTypeId?: string
  disableDefaultUI?: boolean
  gestureHandling?: string
  zoomControl?: boolean
  mapTypeControl?: boolean
  scaleControl?: boolean
  streetViewControl?: boolean
  rotateControl?: boolean
  fullscreenControl?: boolean
  styles?: Array<{ featureType?: string; stylers: Array<Record<string, unknown>> }>
}

/** Google Maps Map instance */
interface GoogleMap {
  setCenter(latLng: { lat: number; lng: number }): void
  setZoom(zoom: number): void
}

/** Google Maps Marker instance */
interface GoogleMarker {
  setPosition(latLng: { lat: number; lng: number }): void
  setTitle(title: string): void
  setMap(map: GoogleMap | null): void
}

/** Google Maps Geocoder result */
interface GeocoderResult {
  geometry: {
    location: LatLng
  }
}

/** Google Maps Geocoder instance */
interface GoogleGeocoder {
  geocode(
    request: { address: string },
    callback: (results: GeocoderResult[] | null, status: string) => void
  ): void
}

interface GoogleMapsAPI {
  maps: {
    Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMap
    Marker: new (options: { position: { lat: number; lng: number }; map: GoogleMap; title?: string }) => GoogleMarker
    Geocoder: new () => GoogleGeocoder
    LatLng: new (lat: number, lng: number) => LatLng
    MapTypeId: {
      ROADMAP: string
      SATELLITE: string
      HYBRID: string
      TERRAIN: string
    }
  }
}

declare global {
  interface Window {
    google?: GoogleMapsAPI
    initGoogleMaps?: () => void
    __schmancyGoogleMapsLoading?: Observable<boolean>
  }
}

// Singleton for managing Google Maps script loading
class GoogleMapsLoader {
  private static loading$?: Observable<boolean>

  static load(apiKey: string): Observable<boolean> {
    // If already loaded, return success
    if (window.google?.maps) {
      return of(true)
    }

    // If already loading, return the existing observable
    if (this.loading$) {
      return this.loading$
    }

    // Create a new loading observable
    this.loading$ = new Observable<boolean>(observer => {
      // Check again if loaded while waiting
      if (window.google?.maps) {
        observer.next(true)
        observer.complete()
        return
      }

      const script = document.createElement('script')
      // Using places library instead of geometry for geocoding
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&v=weekly`
      script.async = true
      script.defer = true

      window.initGoogleMaps = () => {
        observer.next(true)
        observer.complete()
      }

      script.onerror = (error) => {
        console.error('Google Maps script loading error:', error)
        observer.error(new Error('Failed to load Google Maps. Please check API key configuration and ensure the domain is authorized.'))
      }

      document.head.appendChild(script)
    }).pipe(
      shareReplay(1) // Share the result among all subscribers
    )

    return this.loading$
  }
}

/**
 * `<schmancy-map>` component
 *
 * A Google Maps component with an intuitive API for displaying interactive or static maps.
 * Supports both address strings (with automatic geocoding) and precise coordinates.
 *
 * @element schmancy-map
 *
 * @example
 * <!-- Simple address -->
 * <schmancy-map address="Times Square, New York"></schmancy-map>
 *
 * @example
 * <!-- With coordinates -->
 * <schmancy-map latitude="40.758" longitude="-73.985" zoom="17"></schmancy-map>
 *
 * @example
 * <!-- Satellite view -->
 * <schmancy-map address="Grand Canyon" type="satellite" height="500px"></schmancy-map>
 *
 * @example
 * <!-- Static map -->
 * <schmancy-map address="Eiffel Tower, Paris" interactive="false" controls="false"></schmancy-map>
 */
@customElement('schmancy-map')
export default class SchmancyMap extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--schmancy-sys-color-surface-container);
    color: var(--schmancy-sys-color-surface-on);
  }
  
  :host([height]) {
    height: var(--map-height);
  }
  
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
  
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 400px;
    background-color: var(--schmancy-sys-color-surface-containerLow);
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 400px;
    padding: 24px;
    text-align: center;
    background-color: var(--schmancy-sys-color-surface-containerLow);
  }
  
  .error-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    color: var(--schmancy-sys-color-error-default);
  }
  
  .error-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--schmancy-sys-color-surface-on);
  }
  
  .error-message {
    font-size: 14px;
    color: var(--schmancy-sys-color-surface-onVariant);
    line-height: 1.5;
  }
`) {
  /**
   * Simple address string that automatically geocodes to display the location.
   * Takes precedence over latitude/longitude if both are provided.
   */
  @property({ type: String })
  address: string = ''

  /**
   * Latitude coordinate for precise location.
   * Used when address is not provided.
   */
  @property({ type: Number })
  latitude?: number

  /**
   * Longitude coordinate for precise location.
   * Used when address is not provided.
   */
  @property({ type: Number })
  longitude?: number

  /**
   * Map zoom level. Higher numbers show more detail.
   * @default 15
   */
  @property({ type: Number })
  zoom: number = 15

  /**
   * Height of the map with CSS unit (e.g., "400px", "50vh").
   * @default "400px"
   */
  @property({ type: String, reflect: true })
  height: string = '400px'

  /**
   * Whether to show a marker at the location.
   * @default true
   */
  @property({ type: Boolean })
  marker: boolean = true

  /**
   * Tooltip text for the location marker.
   */
  @property({ type: String })
  markerTitle: string = ''

  /**
   * Map display type.
   * Options: "roadmap", "satellite", "hybrid", "terrain"
   * @default "roadmap"
   */
  @property({ type: String })
  type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain' = 'roadmap'

  /**
   * Whether users can interact with the map (pan, zoom, click).
   * @default true
   */
  @property({ type: Boolean })
  interactive: boolean = true

  /**
   * Whether to show map controls (zoom buttons, fullscreen, etc.).
   * @default true
   */
  @property({ type: Boolean })
  controls: boolean = true

  /**
   * Google Maps API key. Required for the map to load.
   */
  @property({ type: String })
  apiKey: string = ''

  @state() private loading: boolean = false
  @state() private error: string = ''

  private mapRef = createRef<HTMLDivElement>()
  private map?: GoogleMap
  private mapMarker?: GoogleMarker
  private geocoder?: GoogleGeocoder
  private intersectionObserver?: IntersectionObserver
  private hasLoadedMap = false

  connectedCallback() {
    super.connectedCallback()
    
    // Set CSS custom property for height
    this.style.setProperty('--map-height', this.height)
    
    // Only load map when component becomes visible
    this.setupIntersectionObserver()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }

  private setupIntersectionObserver() {
    // Load map only when it's visible in the viewport
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasLoadedMap) {
            this.hasLoadedMap = true
            this.loadMap()
            // Stop observing after loading
            this.intersectionObserver?.disconnect()
          }
        })
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
      }
    )
    
    this.intersectionObserver.observe(this)
  }

  private loadMap() {
    of(null).pipe(
      tap(() => {
        this.loading = true
        this.error = ''
      }),
      switchMap(() => {
        if (!this.apiKey) {
          throw new Error('Google Maps API key is required. Please provide it via the apiKey property.')
        }
        return GoogleMapsLoader.load(this.apiKey)
      }),
      switchMap(() => this.getCoordinates()),
      tap((coordinates) => {
        // Store coordinates for later use
        this.pendingCoordinates = coordinates
      }),
      catchError((error) => {
        console.error('Map loading error:', error)
        this.error = error.message || 'Failed to load map'
        return EMPTY
      }),
      finalize(() => {
        this.loading = false
      }),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  private pendingCoordinates?: { lat: number; lng: number }

  private getCoordinates() {
    if (this.address) {
      return this.geocodeAddress(this.address)
    }

    if (this.latitude !== undefined && this.longitude !== undefined) {
      return of({ lat: this.latitude, lng: this.longitude })
    }

    throw new Error('Either address or latitude/longitude coordinates are required')
  }

  private geocodeAddress(address: string) {
    if (!this.geocoder) {
      this.geocoder = new window.google!.maps.Geocoder()
    }

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results: GeocoderResult[] | null, status: string) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng()
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }

  private initializeMap(coordinates: { lat: number; lng: number }) {
    if (!this.mapRef.value || !window.google?.maps) {
      return
    }

    const mapOptions = {
      center: coordinates,
      zoom: this.zoom,
      mapTypeId: this.getMapTypeId(),
      disableDefaultUI: !this.controls,
      gestureHandling: this.interactive ? 'cooperative' : 'none',
      zoomControl: this.controls,
      mapTypeControl: this.controls,
      scaleControl: this.controls,
      streetViewControl: this.controls,
      rotateControl: this.controls,
      fullscreenControl: this.controls,
      styles: this.interactive ? undefined : [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        }
      ]
    }

    this.map = new window.google.maps.Map(this.mapRef.value, mapOptions)

    if (this.marker) {
      this.addMarker(coordinates)
    }
  }

  private getMapTypeId(): string {
    const typeMap = {
      roadmap: window.google!.maps.MapTypeId.ROADMAP,
      satellite: window.google!.maps.MapTypeId.SATELLITE,
      hybrid: window.google!.maps.MapTypeId.HYBRID,
      terrain: window.google!.maps.MapTypeId.TERRAIN
    }
    return typeMap[this.type] || typeMap.roadmap
  }

  private addMarker(coordinates: { lat: number; lng: number }) {
    if (!window.google?.maps || !this.map) {
      return
    }

    this.mapMarker = new window.google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: this.markerTitle || this.address || 'Location'
    })
  }

  protected updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties)

    if (changedProperties.has('height')) {
      this.style.setProperty('--map-height', this.height)
    }

    // Initialize map when loading completes and container is ready
    if (changedProperties.has('loading') && !this.loading && this.pendingCoordinates && !this.map) {
      // Wait for next frame to ensure map container is rendered
      requestAnimationFrame(() => {
        if (this.mapRef.value && this.pendingCoordinates) {
          this.initializeMap(this.pendingCoordinates)
          this.pendingCoordinates = undefined
        }
      })
    }

    // Reload map if critical properties change (only if map was already loaded)
    if (
      changedProperties.has('address') ||
      changedProperties.has('latitude') ||
      changedProperties.has('longitude') ||
      changedProperties.has('type') ||
      changedProperties.has('zoom')
    ) {
      if (this.map && this.hasLoadedMap) {
        this.loadMap()
      }
    }

    // Update marker title if it changes
    if (changedProperties.has('markerTitle') && this.mapMarker) {
      this.mapMarker.setTitle(this.markerTitle || this.address || 'Location')
    }
  }

  protected render() {
    return html`
      ${when(
        this.loading,
        () => html`
          <div class="loading-container">
            <schmancy-spinner></schmancy-spinner>
          </div>
        `,
        () => when(
          this.error,
          () => html`
            <div class="error-container">
              <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="error-title">Map could not be loaded</div>
              <div class="error-message">${this.error}</div>
            </div>
          `,
          () => html`
            <div class="map-container" ${ref(this.mapRef)}></div>
          `
        )
      )}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-map': SchmancyMap
  }
}
