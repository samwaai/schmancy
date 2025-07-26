import { CSSResult, LitElement } from 'lit';
import { IBaseMixin } from './baseElement';
import { Constructor } from './constructor';
export declare class ITailwindElementMixin {
    styles: (typeof CSSResult)[];
}
export declare const tailwindStyles: any;
export declare const TailwindElement: <T extends CSSResult>(componentStyle?: T) => Constructor<CustomElementConstructor> & Constructor<ITailwindElementMixin> & Constructor<LitElement> & Constructor<IBaseMixin>;
