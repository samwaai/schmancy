import { CSSResult, LitElement } from 'lit';
import { IBaseMixin } from './baseElement';
import { Constructor } from './constructor';
export declare class ITailwindElementMixin {
    styles: (typeof CSSResult)[];
}
export declare const tailwindStyles: CSSResult;
/**
 * Register one or more stylesheets whose rules will be adopted by every
 * `$LitElement` (TailwindElement) instance created afterwards. Pass the
 * consumer app's compiled Tailwind stylesheet here, typically at app init:
 *
 * ```ts
 * import tw from './styles.css?inline'
 * import { registerTailwind } from '@mhmo91/schmancy/mixins'
 * registerTailwind(tw)
 * ```
 *
 * Accepts raw CSS strings, `CSSResult` values, or pre-built `CSSStyleSheet`
 * instances. Safe to call multiple times — sheets accumulate.
 */
export declare function registerTailwind(...sheets: Array<CSSStyleSheet | CSSResult | string>): void;
export declare const TailwindElement: <T extends CSSResult>(componentStyle?: T) => Constructor<CustomElementConstructor> & Constructor<ITailwindElementMixin> & Constructor<LitElement> & Constructor<IBaseMixin>;
