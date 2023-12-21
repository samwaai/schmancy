import { EasingOptions } from 'animejs';
declare const SchmancyAnimate_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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
    easing?: EasingOptions | string;
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
