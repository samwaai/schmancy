import SchmancyForm from './form';
export type { FormElement, CheckableFormElement, ValidatableFormElement, FormControlConfig, FormEventMap, } from './form';
/**
 * @deprecated Use `<schmancy-form>` (`SchmancyForm`) from `./form`. The
 * canonical form implementation now discovers fields via the `FormFieldMixin`
 * brand + a small compat registry, which makes the `sch-form` tag redundant.
 * This class remains as an alias so any existing `<sch-form>` markup or
 * `SchmancyFormV2` imports continue to work, and will be removed in a future
 * major.
 */
export default class SchmancyFormV2 extends SchmancyForm {
    static readonly tagName = "sch-form";
    /**
     * @deprecated Use `SchmancyForm.registerControl()` instead.
     */
    static registerFormControl: typeof SchmancyForm.registerControl;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-form': SchmancyFormV2;
    }
}
