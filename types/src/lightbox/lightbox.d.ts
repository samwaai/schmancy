import { PropertyValues } from 'lit';
declare const SchmancyLightbox_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyLightbox extends SchmancyLightbox_base {
    src: string;
    images: string[];
    initialIndex: number;
    open: boolean;
    private currentIndex;
    private isLoading;
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
