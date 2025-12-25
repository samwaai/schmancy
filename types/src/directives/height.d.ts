import { PartInfo } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
/**
 * Directive that sets element height to fill remaining viewport space.
 * Uses visualViewport for accurate mobile height (handles keyboard).
 *
 * @example
 * html`<div ${fullHeight()}>Content</div>`
 */
declare class FullHeight extends AsyncDirective {
    private element;
    private disconnecting$;
    private updateHeight;
    render(): void;
    update(part: PartInfo): void;
    disconnected(): void;
    reconnected(): void;
}
export declare const fullHeight: () => import("lit-html/directive").DirectiveResult<typeof FullHeight>;
export {};
