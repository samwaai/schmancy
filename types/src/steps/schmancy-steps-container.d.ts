import { StepsController } from './steps.context';
/**
 * Custom event emitted when the current step changes
 */
export type SchmancyStepsChangeEvent = CustomEvent<{
    value: number;
}>;
declare const SchmancyStepsContainer_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyStepsContainer extends SchmancyStepsContainer_base {
    private controller;
    stepsController: StepsController;
    set currentStep(value: number);
    get currentStep(): number;
    private _currentStep;
    /**
     * Gap between steps. Maps to Tailwind gap classes.
     * Options: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
     * @default 4
     */
    gap: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-steps-container': SchmancyStepsContainer;
    }
    interface HTMLElementEventMap {
        'schmancy-steps:change': SchmancyStepsChangeEvent;
    }
}
export {};
