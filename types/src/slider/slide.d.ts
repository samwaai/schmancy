/**
 * Supported slide "types."
 * - 'image': Renders an <img>
 * - 'video': Renders a <video>
 * - 'content': Renders a <slot> (the default)
 */
type SlideType = 'image' | 'video' | 'content';
/**
 * Allowed values for the 'fit' property,
 * which maps to CSS object-fit.
 */
type ObjectFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
declare const SchmancySlide_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySlide extends SchmancySlide_base {
    /**
     * Determines how this slide should be rendered.
     * Defaults to 'content' if not provided.
     */
    type: SlideType;
    /**
     * Source for images or videos (if `type` is 'image' or 'video').
     */
    src: string;
    /**
     * Alternate text for images.
     */
    alt: string;
    /**
     * Whether to show default video controls (if `type` is 'video').
     */
    controls: boolean;
    /**
     * Whether the video should autoplay (if `type` is 'video').
     */
    autoplay: boolean;
    /**
     * Whether the video should loop (if `type` is 'video').
     */
    loop: boolean;
    /**
     * Whether the video is muted (if `type` is 'video').
     */
    muted: boolean;
    /**
     * CSS `object-fit` property, applied to images/videos.
     */
    fit: ObjectFit;
    render(): any;
    private renderSlide;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-slide': SchmancySlide;
    }
}
export {};
