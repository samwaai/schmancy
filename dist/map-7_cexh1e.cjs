require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`rxjs/operators`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/ref.js`),s=require(`lit/directives/when.js`);var c=class{static load(e){return window.google?.maps?(0,n.of)(!0):(this.loading$||=new n.Observable(t=>{if(window.google?.maps)return t.next(!0),void t.complete();let n=document.createElement(`script`);n.src=`https://maps.googleapis.com/maps/api/js?key=${e}&libraries=places&callback=initGoogleMaps&v=weekly`,n.async=!0,n.defer=!0,window.initGoogleMaps=()=>{t.next(!0),t.complete()},n.onerror=e=>{t.error(Error(`Failed to load Google Maps. Please check API key configuration and ensure the domain is authorized.`))},document.head.appendChild(n)}).pipe((0,r.shareReplay)(1)),this.loading$)}},l=class extends e.t(a.css`
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
`){constructor(...e){super(...e),this.address=``,this.zoom=15,this.height=`400px`,this.marker=!0,this.markerTitle=``,this.type=`roadmap`,this.interactive=!0,this.controls=!0,this.apiKey=``,this.loading=!1,this.error=``,this.mapRef=(0,o.createRef)(),this.hasLoadedMap=!1}connectedCallback(){super.connectedCallback(),this.style.setProperty(`--map-height`,this.height),this.setupIntersectionObserver()}disconnectedCallback(){super.disconnectedCallback(),this.intersectionObserver&&this.intersectionObserver.disconnect()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&!this.hasLoadedMap&&(this.hasLoadedMap=!0,this.loadMap(),this.intersectionObserver?.disconnect())})},{root:null,rootMargin:`50px`,threshold:.01}),this.intersectionObserver.observe(this)}loadMap(){(0,n.of)(null).pipe((0,r.tap)(()=>{this.loading=!0,this.error=``}),(0,r.switchMap)(()=>{if(!this.apiKey)throw Error(`Google Maps API key is required. Please provide it via the apiKey property.`);return c.load(this.apiKey)}),(0,r.switchMap)(()=>this.getCoordinates()),(0,r.tap)(e=>{this.pendingCoordinates=e}),(0,r.catchError)(e=>(this.error=e.message||`Failed to load map`,n.EMPTY)),(0,r.finalize)(()=>{this.loading=!1}),(0,r.takeUntil)(this.disconnecting)).subscribe()}getCoordinates(){if(this.address)return this.geocodeAddress(this.address);if(this.latitude!==void 0&&this.longitude!==void 0)return(0,n.of)({lat:this.latitude,lng:this.longitude});throw Error(`Either address or latitude/longitude coordinates are required`)}geocodeAddress(e){return this.geocoder||=new window.google.maps.Geocoder,new Promise((t,n)=>{this.geocoder.geocode({address:e},(e,r)=>{if(r===`OK`&&e[0]){let n=e[0].geometry.location;t({lat:n.lat(),lng:n.lng()})}else n(Error(`Geocoding failed: ${r}`))})})}initializeMap(e){if(!this.mapRef.value||!window.google?.maps)return;let t={center:e,zoom:this.zoom,mapTypeId:this.getMapTypeId(),disableDefaultUI:!this.controls,gestureHandling:this.interactive?`cooperative`:`none`,zoomControl:this.controls,mapTypeControl:this.controls,scaleControl:this.controls,streetViewControl:this.controls,rotateControl:this.controls,fullscreenControl:this.controls,styles:this.interactive?void 0:[{featureType:`poi`,stylers:[{visibility:`off`}]}]};this.map=new window.google.maps.Map(this.mapRef.value,t),this.marker&&this.addMarker(e)}getMapTypeId(){let e={roadmap:window.google.maps.MapTypeId.ROADMAP,satellite:window.google.maps.MapTypeId.SATELLITE,hybrid:window.google.maps.MapTypeId.HYBRID,terrain:window.google.maps.MapTypeId.TERRAIN};return e[this.type]||e.roadmap}addMarker(e){window.google?.maps&&this.map&&(this.mapMarker=new window.google.maps.Marker({position:e,map:this.map,title:this.markerTitle||this.address||`Location`}))}updated(e){super.updated(e),e.has(`height`)&&this.style.setProperty(`--map-height`,this.height),e.has(`loading`)&&!this.loading&&this.pendingCoordinates&&!this.map&&requestAnimationFrame(()=>{this.mapRef.value&&this.pendingCoordinates&&(this.initializeMap(this.pendingCoordinates),this.pendingCoordinates=void 0)}),(e.has(`address`)||e.has(`latitude`)||e.has(`longitude`)||e.has(`type`)||e.has(`zoom`))&&this.map&&this.hasLoadedMap&&this.loadMap(),e.has(`markerTitle`)&&this.mapMarker&&this.mapMarker.setTitle(this.markerTitle||this.address||`Location`)}render(){return a.html`
      ${(0,s.when)(this.loading,()=>a.html`
          <div class="loading-container">
            <schmancy-spinner></schmancy-spinner>
          </div>
        `,()=>(0,s.when)(this.error,()=>a.html`
            <div class="error-container">
              <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="error-title">Map could not be loaded</div>
              <div class="error-message">${this.error}</div>
            </div>
          `,()=>a.html`
            <div class="map-container" ${(0,o.ref)(this.mapRef)}></div>
          `))}
    `}};t.t([(0,i.property)({type:String})],l.prototype,`address`,void 0),t.t([(0,i.property)({type:Number})],l.prototype,`latitude`,void 0),t.t([(0,i.property)({type:Number})],l.prototype,`longitude`,void 0),t.t([(0,i.property)({type:Number})],l.prototype,`zoom`,void 0),t.t([(0,i.property)({type:String,reflect:!0})],l.prototype,`height`,void 0),t.t([(0,i.property)({type:Boolean})],l.prototype,`marker`,void 0),t.t([(0,i.property)({type:String})],l.prototype,`markerTitle`,void 0),t.t([(0,i.property)({type:String})],l.prototype,`type`,void 0),t.t([(0,i.property)({type:Boolean})],l.prototype,`interactive`,void 0),t.t([(0,i.property)({type:Boolean})],l.prototype,`controls`,void 0),t.t([(0,i.property)({type:String})],l.prototype,`apiKey`,void 0),t.t([(0,i.state)()],l.prototype,`loading`,void 0),t.t([(0,i.state)()],l.prototype,`error`,void 0);var u=l=t.t([(0,i.customElement)(`schmancy-map`)],l);Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return u}});