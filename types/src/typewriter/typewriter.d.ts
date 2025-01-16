import { TemplateResult } from 'lit';
declare const TypewriterElement_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class TypewriterElement extends TypewriterElement_base {
    /**
     * Typing speed in milliseconds per character.
     */
    speed: number;
    /**
     * Delay before typing starts (ms).
     */
    startDelay: number;
    /**
     * Automatically start typing on initialization.
     */
    autoStart: boolean;
    /**
     * Whether to show the cursor.
     */
    cursor: boolean;
    /**
     * The cursor character.
     */
    cursorChar: string;
    /**
     * Typing speed for deletions (ms per character).
     */
    deleteSpeed: number;
    /**
     * TypeIt instance.
     */
    private typeItInstance;
    /**
     * Reference to the typewriter container.
     */
    private typewriterContainer;
    private _getSlottedNodes;
    /**
     * Lifecycle method called when the component is disconnected from the DOM.
     * Ensures that TypeIt instances are properly cleaned up.
     */
    disconnectedCallback(): void;
    /**
     * Initializes the TypeIt instance with the provided slotted content.
     */
    private _startTyping;
    /**
     * Destroys the current TypeIt instance if it exists.
     */
    private _destroyTypeIt;
    /**
     * Processes a custom element for its typing behavior.
     */
    private _processCustomElement;
    /**
     * Renders the component's HTML.
     */
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typewriter': TypewriterElement;
    }
}
export {};
