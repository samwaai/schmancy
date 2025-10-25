import { Subject } from 'rxjs';
import { PartInfo } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { LitElement } from 'lit';
declare class FullHeight extends AsyncDirective {
    element: HTMLElement & LitElement;
    disconnecting: Subject<boolean>;
    render(): void;
    constructor(_partInfo: PartInfo);
    update(part: any): void;
    disconnected(): void;
    reconnected(): void;
}
export declare const fullHeight: () => import("lit-html/directive").DirectiveResult<typeof FullHeight>;
export {};
