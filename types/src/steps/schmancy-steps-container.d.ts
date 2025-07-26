import { StepsController } from './steps.context';
declare const SchmancyStepsContainer_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyStepsContainer extends SchmancyStepsContainer_base {
    private controller;
    stepsController: StepsController;
    set currentStep(value: number);
    get currentStep(): number;
    private _currentStep;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-steps-container': SchmancyStepsContainer;
    }
}
export {};
