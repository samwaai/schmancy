import { AsyncDirective } from 'lit/async-directive.js';
declare class RippleDirective extends AsyncDirective {
    element: HTMLElement;
    render(): void;
    addRippleEffect(event: any): void;
    update(part: any): void;
    disconnected(): void;
}
export declare const ripple: () => import("lit-html/directive").DirectiveResult<typeof RippleDirective>;
export {};
