export declare class StepsController {
    private _currentStep;
    get currentStep$(): import("rxjs").Observable<number>;
    get currentStep(): number;
    setStep(step: number): void;
}
/**
 * The actual context object. We provide/consume this in the container and steps.
 */
export declare const stepsContext: {
    __context__: StepsController;
};
