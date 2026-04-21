export type SchmancySplashScreenDoneEvent = CustomEvent<void>;
declare const SchmancySplashScreen_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Full-viewport splash overlay that dismisses once a minimum duration has
 * elapsed and (optionally) an external `ready` signal has fired. The splash
 * fades out while the underlying app content fades in.
 *
 * Bring-your-own visuals: the `splash` slot is empty by default so the
 * component pulls in no dependencies. Provide a logo, spinner, or
 * animation from the consumer side.
 *
 * @element schmancy-splash-screen
 * @slot splash - Content rendered on the splash layer (logo, spinner, etc.).
 * @slot - Default slot for the actual app content, revealed once dismissed.
 * @fires schmancy-splash-done - `CustomEvent<void>` when the splash dismisses.
 *
 * @example
 * ```html
 * <schmancy-splash-screen min-duration="1200">
 *   <my-logo slot="splash"></my-logo>
 *   <my-app></my-app>
 * </schmancy-splash-screen>
 * ```
 */
export default class SchmancySplashScreen extends SchmancySplashScreen_base {
    /**
     * Minimum duration (ms) the splash layer stays visible. Prevents a flash
     * when the app loads faster than expected.
     */
    minDuration: number;
    /**
     * When true, the splash dismisses on the `minDuration` timer alone.
     * When false (default), it additionally waits for an external ready signal
     * (a `ready` event on this element, or a call to `this.ready()`).
     */
    auto: boolean;
    /**
     * When true, the splash starts hidden. Use this for imperative control.
     */
    initiallyHidden: boolean;
    private _visible;
    connectedCallback(): void;
    /**
     * Imperative API: signal that the app is ready and dismiss the splash
     * after the minimum duration has elapsed.
     */
    ready(): void;
    /**
     * Force the splash to show again (e.g. between route transitions).
     */
    show(): void;
    private _dismiss;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-splash-screen': SchmancySplashScreen;
    }
}
export {};
