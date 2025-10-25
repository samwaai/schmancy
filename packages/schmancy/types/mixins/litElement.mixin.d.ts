import { CSSResult, LitElement } from 'lit';
import { IBaseMixin } from './baseElement';
import { Constructor } from './constructor';
export declare const $LitElement: <T extends CSSResult>(componentStyle?: T) => CustomElementConstructor & Constructor<LitElement> & Constructor<IBaseMixin>;
