import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'
import style from './radio-group.scss?inline'
import { SchmancyElement } from '@mixins/index'
import { when } from 'lit/directives/when.js'
import { FormFieldMixin } from '@mixins/formField.mixin'
import type { RadioButton } from './radio-button.ts'

export type SchmancyRadioGroupChangeEvent = CustomEvent<{ value: string }>

@customElement('schmancy-radio-group')
export class RadioGroup extends FormFieldMixin(SchmancyElement) {
	static styles = [unsafeCSS(style)]
	@property({ type: String }) override label = ''
	@property({ type: String }) override name = ''
	@property({ type: String }) override value = ''
	@property({ type: Boolean }) override required = false

	connectedCallback() {
		super.connectedCallback()
		fromEvent<CustomEvent>(this, 'radio-button-click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe((e: CustomEvent<{ value: string }>) => {
				this.value = e.detail.value
				this.emitChange({ value: e.detail.value })
				this._syncChildren()
			})
	}

	updated(changed: Map<string, unknown>) {
		super.updated(changed)
		if (changed.has('value')) this._syncChildren()
	}

	private _syncChildren() {
		this.querySelectorAll<RadioButton>('schmancy-radio-button').forEach(btn => {
			btn.checked = btn.value === this.value
		})
	}

	render() {
		return html`
			<div role="radiogroup" aria-label=${this.label} aria-required=${this.required} class="grid gap-2">
				${when(this.label, () => html`<schmancy-typography type="label" token="lg">${this.label}</schmancy-typography>`)}
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-radio-group': RadioGroup
	}
}
