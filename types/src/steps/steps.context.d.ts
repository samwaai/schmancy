export declare class StepsController {
    private _currentStep;
    get currentStep$(): any;
    get currentStep(): any;
    setStep(step: number): void;
}
/**
 * The actual context object. We provide/consume this in the container and steps.
 */
export declare const stepsContext: any;
