import type { Constructor } from './constructor';
import { LitElement } from 'lit';
import { Subject } from 'rxjs';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
export declare class IBaseMixin {
    disconnecting: Subject<boolean>;
    classMap: typeof classMap;
    styleMap: typeof styleMap;
}
export declare const BaseElement: <T extends Constructor<LitElement>>(superClass: T) => Constructor<IBaseMixin> & T;
