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
    delay: number;
    /**
     * Automatically start typing on initialization.
     */
    autoStart: boolean;
    /**
     * The cursor character.
     */
    cursorChar: string;
    /**
     * Typing speed for deletions (ms per character).
     */
    deleteSpeed: number;
    once: boolean;
    /**
     * TypeIt instance.
     */
    private typeItInstance;
    /**
     * Reference to the typewriter container.
     */
    private typewriterContainer;
    private _getSlottedNodes;
    private _getSlottedElements;
    /**
     * Lifecycle method called when the component is disconnected from the DOM.
     * Ensures that TypeIt instances are properly cleaned up.
     */
    private sessionKey;
    disconnectedCallback(): void;
    /**
     * Initializes the TypeIt instance with the provided slotted content.
     */
    private _startTyping;
    private generateSessionKey;
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
