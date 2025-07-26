import { StepsController } from './steps.context';
declare const SchmancyStepsContainer_base: CustomElementConstructor & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyStepsContainer extends SchmancyStepsContainer_base {
    private controller;
    stepsController: StepsController;
    set currentStep(value: number);
    get currentStep(): number;
    private _currentStep;
    connectedCallback(): void;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-steps-container': SchmancyStepsContainer;
    }
}
export {};
