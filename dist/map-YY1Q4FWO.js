import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { EMPTY as n, Observable as r, of as i } from "rxjs";
import { catchError as a, finalize as o, shareReplay as s, switchMap as c, takeUntil as l, tap as u } from "rxjs/operators";
import { customElement as d, property as f, state as p } from "lit/decorators.js";
import { css as m, html as h } from "lit";
import { createRef as g, ref as _ } from "lit/directives/ref.js";
import { when as v } from "lit/directives/when.js";
var y = class {
	static load(e) {
		return window.google?.maps ? i(!0) : (this.loading$ ||= new r((t) => {
			if (window.google?.maps) return t.next(!0), void t.complete();
			let n = document.createElement("script");
			n.src = `https://maps.googleapis.com/maps/api/js?key=${e}&libraries=places&callback=initGoogleMaps&v=weekly`, n.async = !0, n.defer = !0, window.initGoogleMaps = () => {
				t.next(!0), t.complete();
			}, n.onerror = (e) => {
				t.error(/* @__PURE__ */ Error("Failed to load Google Maps. Please check API key configuration and ensure the domain is authorized."));
			}, document.head.appendChild(n);
		}).pipe(s(1)), this.loading$);
	}
}, b = class extends e(m`
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
	constructor(...e) {
		super(...e), this.address = "", this.zoom = 15, this.height = "400px", this.marker = !0, this.markerTitle = "", this.type = "roadmap", this.interactive = !0, this.controls = !0, this.apiKey = "", this.loading = !1, this.error = "", this.mapRef = g(), this.hasLoadedMap = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this.style.setProperty("--map-height", this.height), this.setupIntersectionObserver();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.intersectionObserver && this.intersectionObserver.disconnect();
	}
	setupIntersectionObserver() {
		this.intersectionObserver = new IntersectionObserver((e) => {
			e.forEach((e) => {
				e.isIntersecting && !this.hasLoadedMap && (this.hasLoadedMap = !0, this.loadMap(), this.intersectionObserver?.disconnect());
			});
		}, {
			root: null,
			rootMargin: "50px",
			threshold: .01
		}), this.intersectionObserver.observe(this);
	}
	loadMap() {
		i(null).pipe(u(() => {
			this.loading = !0, this.error = "";
		}), c(() => {
			if (!this.apiKey) throw Error("Google Maps API key is required. Please provide it via the apiKey property.");
			return y.load(this.apiKey);
		}), c(() => this.getCoordinates()), u((e) => {
			this.pendingCoordinates = e;
		}), a((e) => (this.error = e.message || "Failed to load map", n)), o(() => {
			this.loading = !1;
		}), l(this.disconnecting)).subscribe();
	}
	getCoordinates() {
		if (this.address) return this.geocodeAddress(this.address);
		if (this.latitude !== void 0 && this.longitude !== void 0) return i({
			lat: this.latitude,
			lng: this.longitude
		});
		throw Error("Either address or latitude/longitude coordinates are required");
	}
	geocodeAddress(e) {
		return this.geocoder ||= new window.google.maps.Geocoder(), new Promise((t, n) => {
			this.geocoder.geocode({ address: e }, (e, r) => {
				if (r === "OK" && e[0]) {
					let n = e[0].geometry.location;
					t({
						lat: n.lat(),
						lng: n.lng()
					});
				} else n(/* @__PURE__ */ Error(`Geocoding failed: ${r}`));
			});
		});
	}
	initializeMap(e) {
		if (!this.mapRef.value || !window.google?.maps) return;
		let t = {
			center: e,
			zoom: this.zoom,
			mapTypeId: this.getMapTypeId(),
			disableDefaultUI: !this.controls,
			gestureHandling: this.interactive ? "cooperative" : "none",
			zoomControl: this.controls,
			mapTypeControl: this.controls,
			scaleControl: this.controls,
			streetViewControl: this.controls,
			rotateControl: this.controls,
			fullscreenControl: this.controls,
			styles: this.interactive ? void 0 : [{
				featureType: "poi",
				stylers: [{ visibility: "off" }]
			}]
		};
		this.map = new window.google.maps.Map(this.mapRef.value, t), this.marker && this.addMarker(e);
	}
	getMapTypeId() {
		let e = {
			roadmap: window.google.maps.MapTypeId.ROADMAP,
			satellite: window.google.maps.MapTypeId.SATELLITE,
			hybrid: window.google.maps.MapTypeId.HYBRID,
			terrain: window.google.maps.MapTypeId.TERRAIN
		};
		return e[this.type] || e.roadmap;
	}
	addMarker(e) {
		window.google?.maps && this.map && (this.mapMarker = new window.google.maps.Marker({
			position: e,
			map: this.map,
			title: this.markerTitle || this.address || "Location"
		}));
	}
	updated(e) {
		super.updated(e), e.has("height") && this.style.setProperty("--map-height", this.height), e.has("loading") && !this.loading && this.pendingCoordinates && !this.map && requestAnimationFrame(() => {
			this.mapRef.value && this.pendingCoordinates && (this.initializeMap(this.pendingCoordinates), this.pendingCoordinates = void 0);
		}), (e.has("address") || e.has("latitude") || e.has("longitude") || e.has("type") || e.has("zoom")) && this.map && this.hasLoadedMap && this.loadMap(), e.has("markerTitle") && this.mapMarker && this.mapMarker.setTitle(this.markerTitle || this.address || "Location");
	}
	render() {
		return h`
      ${v(this.loading, () => h`
          <div class="loading-container">
            <schmancy-spinner></schmancy-spinner>
          </div>
        `, () => v(this.error, () => h`
            <div class="error-container">
              <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="error-title">Map could not be loaded</div>
              <div class="error-message">${this.error}</div>
            </div>
          `, () => h`
            <div class="map-container" ${_(this.mapRef)}></div>
          `))}
    `;
	}
};
t([f({ type: String })], b.prototype, "address", void 0), t([f({ type: Number })], b.prototype, "latitude", void 0), t([f({ type: Number })], b.prototype, "longitude", void 0), t([f({ type: Number })], b.prototype, "zoom", void 0), t([f({
	type: String,
	reflect: !0
})], b.prototype, "height", void 0), t([f({ type: Boolean })], b.prototype, "marker", void 0), t([f({ type: String })], b.prototype, "markerTitle", void 0), t([f({ type: String })], b.prototype, "type", void 0), t([f({ type: Boolean })], b.prototype, "interactive", void 0), t([f({ type: Boolean })], b.prototype, "controls", void 0), t([f({ type: String })], b.prototype, "apiKey", void 0), t([p()], b.prototype, "loading", void 0), t([p()], b.prototype, "error", void 0);
var x = b = t([d("schmancy-map")], b);
export { x as t };
