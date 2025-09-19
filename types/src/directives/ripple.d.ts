import { AsyncDirective } from 'lit/async-directive.js';
declare class RippleDirective extends AsyncDirective {
    element: HTMLElement;
    private subscription?;
    render(): void;
    addRippleEffect: (event: MouseEvent) => void;
    update(part: any): void;
    disconnected(): void;
}
export declare const ripple: () => import("lit-html/directive").DirectiveResult<typeof RippleDirective>;
export {};
