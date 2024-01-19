declare const SchmancyAnimatedText_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-animated-text
 * Inspired by https://tobiasahlin.com/moving-letters/#1
 */
export default class SchmancyAnimatedText extends SchmancyAnimatedText_base {
    ease: string;
    stagger: number;
    duration: number;
    scale: number[];
    opacity: number[];
    translateX: (string | number)[];
    translateY: (string | number)[];
    translateZ: number[];
    rotateZ: number[];
    resetOnScroll: boolean;
    defaultSlot: HTMLElement[];
    letters: HTMLElement;
    ml7: HTMLElement;
    isInViewport(element: any): boolean;
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-animated-text': SchmancyAnimatedText;
    }
}
export {};
