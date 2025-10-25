import { Part } from 'lit';
import { Directive, PartInfo } from 'lit/directive.js';
export type ColorConfig = {
    bgColor?: string;
    color?: string;
};
declare class ColorDirective extends Directive {
    private config;
    constructor(partInfo: PartInfo);
    update(part: Part, [config]: [ColorConfig]): void;
    render(config: ColorConfig): unknown;
}
declare const color: (config: ColorConfig) => import("lit-html/directive").DirectiveResult<typeof ColorDirective>;
export { color };
