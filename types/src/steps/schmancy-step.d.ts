declare const SchmancyStep_base: CustomElementConstructor & import("@mhmo91/schmancy/dist/mixins").Constructor<import("lit").LitElement> & import("@mhmo91/schmancy/dist/mixins").Constructor<import("@mhmo91/schmancy/dist/mixins").IBaseMixin>;
export declare class SchmancyStep extends SchmancyStep_base {
    /**
     * The step's position (1-based). This is used to compare against
     * the container's current step to decide if it's "complete",
     * "current", or "upcoming".
     */
    position: number;
    title: string;
    description: string;
    completed: boolean;
    /**
     * NEW: Lock API to disable users from going back.
     * When set to true, clicking on a previous (completed) step is ignored.
     */
    lockBack: boolean;
    /**
     * Consume the shared StepsController from context.
     */
    private steps;
    /**
     * Local reactive copy of the container's current step number.
     */
    private currentStep;
    /**
     * Keep a reference to our subscription so we can unsubscribe cleanly.
     */
    private subscription?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Update the host element's flex properties based on active state
     */
    private updateFlexProperties;
    /**
     * Compute visual status for styling purposes. Note that if a step is explicitly
     * marked as completed, it always appears as complete even if it's active.
     */
    get status(): 'complete' | 'current' | 'upcoming';
    /**
     * Click handler to allow navigation between completed (or active) steps.
     * With lockBack enabled, clicking on a previous step is ignored.
     */
    private _onStepClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-step': SchmancyStep;
    }
}
export {};
