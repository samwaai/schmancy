import { PropertyValues } from 'lit';
declare const SchmancyLightbox_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Image lightbox — thumbnail grid that opens to a full-screen viewer on click, with keyboard navigation between images.
 *
 * @element schmancy-lightbox
 * @summary Drop-in for galleries / image lists where each thumbnail should expand to fill the viewport. Pass an `images` array of `{ src, alt, caption? }`.
 * @example
 * <schmancy-lightbox .images=${[{ src: '/a.jpg', alt: 'A' }, { src: '/b.jpg', alt: 'B' }]}></schmancy-lightbox>
 * @platform dialog close - Modal full-screen viewer with keyboard navigation. Degrades to a plain image grid if the tag never registers.
 * @fires change - When the active image index changes (next/prev). `detail.index` is the new active image's position in the array.
 * @fires close - When the viewer is dismissed (ESC, backdrop click, close button).
 */
export declare class SchmancyLightbox extends SchmancyLightbox_base {
    src: string;
    images: string[];
    initialIndex: number;
    open: boolean;
    private currentIndex;
    private isLoading;
    private zIndex;
    private readonly swipeThreshold;
    private overlayRef;
    private contentRef;
    private imageRef;
    private get isGalleryMode();
    private get currentImageSrc();
    connectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    private animateIn;
    private animateOut;
    private animateImageChange;
    private setupEventListeners;
    private handleClose;
    private handlePrevious;
    private handleNext;
    private handleImageLoad;
    private handleOverlayClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-lightbox': SchmancyLightbox;
    }
}
export {};
