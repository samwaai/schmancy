declare const SchmancyAnimatedText_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-animated-text
 * Inspired by https://tobiasahlin.com/moving-letters/#1
 */
export default class SchmancyAnimatedText extends SchmancyAnimatedText_base {
    ease: string;
    delay: number;
    stagger: number;
    duration: number;
    scale: number[];
    opacity: number[];
    translateX: string[];
    translateY: string[];
    translateZ: number[];
    rotateZ: number[];
    resetOnScroll: boolean;
    defaultSlot: HTMLElement[];
    letters: HTMLElement;
    ml7: HTMLElement;
    isInViewport(element: HTMLElement): boolean;
    firstUpdated(): Promise<void>;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-animated-text': SchmancyAnimatedText;
    }
}
export {};
