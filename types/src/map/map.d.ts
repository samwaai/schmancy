import { Observable } from 'rxjs';
interface GoogleMapsAPI {
    maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Geocoder: new () => any;
        LatLng: new (lat: number, lng: number) => any;
        MapTypeId: {
            ROADMAP: string;
            SATELLITE: string;
            HYBRID: string;
            TERRAIN: string;
        };
    };
}
declare global {
    interface Window {
        google?: GoogleMapsAPI;
        initGoogleMaps?: () => void;
        __schmancyGoogleMapsLoading?: Observable<boolean>;
    }
}
declare const SchmancyMap_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
export default class SchmancyMap extends SchmancyMap_base {
    /**
     * Simple address string that automatically geocodes to display the location.
     * Takes precedence over latitude/longitude if both are provided.
     */
    address: string;
    /**
     * Latitude coordinate for precise location.
     * Used when address is not provided.
     */
    latitude?: number;
    /**
     * Longitude coordinate for precise location.
     * Used when address is not provided.
     */
    longitude?: number;
    /**
     * Map zoom level. Higher numbers show more detail.
     * @default 15
     */
    zoom: number;
    /**
     * Height of the map with CSS unit (e.g., "400px", "50vh").
     * @default "400px"
     */
    height: string;
    /**
     * Whether to show a marker at the location.
     * @default true
     */
    marker: boolean;
    /**
     * Tooltip text for the location marker.
     */
    markerTitle: string;
    /**
     * Map display type.
     * Options: "roadmap", "satellite", "hybrid", "terrain"
     * @default "roadmap"
     */
    type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
    /**
     * Whether users can interact with the map (pan, zoom, click).
     * @default true
     */
    interactive: boolean;
    /**
     * Whether to show map controls (zoom buttons, fullscreen, etc.).
     * @default true
     */
    controls: boolean;
    /**
     * Google Maps API key. Required for the map to load.
     */
    apiKey: string;
    private loading;
    private error;
    private mapRef;
    private map?;
    private mapMarker?;
    private geocoder?;
    private intersectionObserver?;
    private hasLoadedMap;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupIntersectionObserver;
    private loadMap;
    private pendingCoordinates?;
    private getCoordinates;
    private geocodeAddress;
    private initializeMap;
    private getMapTypeId;
    private addMarker;
    protected updated(changedProperties: Map<string, any>): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-map': SchmancyMap;
    }
}
export {};
