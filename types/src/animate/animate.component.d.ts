declare const SchmancyAnimate_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyAnimate extends SchmancyAnimate_base {
    layout: boolean;
    opacity: Array<number>;
    /**
     * @description delay in ms
     * @type {number}
     * @default 0
     */
    delay: number;
    duration: number;
    /**
     * @description translateX in px
     * @type {Array<number>}
     * @default [0, 0]
     */
    translateX: Array<number | string>;
    translateY: Array<number | string>;
    easing?: string;
    stagger?: boolean;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-animate': SchmancyAnimate;
    }
}
export {};
