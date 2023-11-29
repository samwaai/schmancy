import { CSSResult, LitElement } from 'lit';
import { Constructor, IBaseMixin } from '../';
export declare class ITailwindElementMixin {
    styles: (typeof CSSResult)[];
}
export declare const tailwindStyles: CSSResult;
declare const TailwindElement: <T extends CSSResult>(componentStyle?: T | undefined) => Constructor<CustomElementConstructor> & Constructor<ITailwindElementMixin> & Constructor<LitElement> & Constructor<IBaseMixin>;
export default TailwindElement;
