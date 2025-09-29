type BoatState = 'hidden' | 'minimized' | 'expanded';
declare const SchmancyBoat_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyBoat extends SchmancyBoat_base {
    state: BoatState;
    lowered: boolean;
    private contentVisible;
    previousState: BoatState;
    private containerElement?;
    private contentElement?;
    private headerElement?;
    private iconElement?;
    private activeAnimations;
    private readonly DURATIONS;
    private readonly EASINGS;
    private readonly SHADOWS;
    toggleState(): Promise<void>;
    private cancelActiveAnimations;
    private animateStateChange;
    private getTransformForState;
    private getStylesForState;
    firstUpdated(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat;
    }
}
export {};
