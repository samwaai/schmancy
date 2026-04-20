import type { Constructor } from './constructor';
import { LitElement } from 'lit';
import { Subject, Observable } from 'rxjs';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
export declare class IBaseMixin {
    disconnecting: Subject<boolean>;
    classMap: typeof classMap;
    styleMap: typeof styleMap;
    discover<T extends HTMLElement>(tag: string): Observable<T | null>;
    readonly stableId: string;
    uid: string;
    /**
     * Current locale from theme context. Use with Intl.NumberFormat/DateTimeFormat.
     * Defaults to navigator.language if no theme provider is found.
     * @example new Intl.NumberFormat(this.locale).format(1234.56)
     */
    readonly locale: string;
    dispatchScopedEvent<T>(eventName: string, detail?: T, options?: {
        bubbles?: boolean;
        composed?: boolean;
    }): void;
}
export declare const BaseElement: <T extends Constructor<LitElement>>(superClass: T) => Constructor<IBaseMixin> & T;
