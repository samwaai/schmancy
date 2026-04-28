import { TemplateResult } from 'lit';
declare const TypewriterElement_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Typewriter effect — animates text typing/deletion with a cursor. Wraps the TypeIt library, lazy-loaded on first render.
 *
 * @element schmancy-typewriter
 * @summary Drop string content as the default slot or use `<p>` / `<span>` with `cycle="A|B|C"` attribute children for cycling phrases. Set `loop` for infinite cycling, `once` to remember completion across sessions via sessionStorage.
 * @example
 * <schmancy-typewriter speed="35" cursor-char="|">
 *   Hello, world.
 * </schmancy-typewriter>
 * @platform span - Animated text container. Degrades to its raw text content if the tag never registers — animation is lost but content stays visible.
 * @fires typeit-complete - When the animation finishes typing all content. Fires after the final `afterComplete` callback in the underlying TypeIt instance.
 */
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
    /**
     * Only animate once per session.
     */
    once: boolean;
    /**
     * Loop the animation infinitely (overrides once).
     */
    loop: boolean;
    /**
     * Default pause duration for cycling (ms).
     */
    cyclePause: number;
    /**
     * TypeIt instance. Populated after `loadTypeIt()` resolves inside
     * `_startTyping()` — null until then, which is correct for a cold start
     * where the vendor chunk hasn't loaded yet.
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
     * Async because TypeIt itself is lazy-loaded on first render.
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
     * Processes cycling text with auto-calculated delete counts.
     */
    private _processCycle;
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
