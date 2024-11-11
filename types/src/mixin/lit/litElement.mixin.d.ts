import { CSSResult, LitElement } from 'lit';
import { Constructor, IBaseMixin } from '..';
export declare const $LitElement: <T extends CSSResult>(componentStyle?: T) => CustomElementConstructor & Constructor<LitElement> & Constructor<IBaseMixin>;
