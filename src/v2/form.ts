import { TailwindElement } from '@mixins/tailwind.mixin'
import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

/**
 * A form component that enforces native browser validation
 * for all contained form elements.
 *
 * @example
 * ```html
 * <sch-form @submit=${handleSubmit}>
 *   <sch-input label="Name" required></sch-input>
 *   <schmancy-button type="submit">Submit</schmancy-button>
 * </sch-form>
 * ```
 */
@customElement('sch-form')
export class SchForm extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	/**
	 * If true, form validation will be skipped
	 */
	@property({ type: Boolean })
	novalidate = false

	/**
	 * The form's submission method (get or post)
	 */
	@property({ type: String })
	method: 'get' | 'post' = 'post'

	/**
	 * The URL to submit the form to
	 */
	@property({ type: String })
	action = ''

	/**
	 * The form's encoding type
	 */
	@property({ type: String })
	enctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' =
		'application/x-www-form-urlencoded'

	/**
	 * Reference to the internal form element
	 */
	@query('form')
	formElement!: HTMLFormElement

	/**
	 * Handle form submission
	 * This is the key method that ensures browser validation works
	 */
	private handleSubmit(e: Event) {
		// Always prevent the default submission
		e.preventDefault()

		// Use the browser's built-in validation
		if (!this.novalidate && !this.formElement.checkValidity()) {
			// This will trigger the browser's default validation UI on all fields
			this.formElement.reportValidity()
			return
		}

		// If validation passes or is disabled, collect the form data
		const formData = new FormData(this.formElement)

		// Convert FormData to a plain object for easier consumption
		const formDataObj = Array.from(formData.entries()).reduce(
			(obj, [key, value]) => {
				if (obj[key] !== undefined) {
					if (!Array.isArray(obj[key])) {
						obj[key] = [obj[key]]
					}
					obj[key].push(value)
				} else {
					obj[key] = value
				}
				return obj
			},
			{} as Record<string, any>,
		)

		// Dispatch a submit event with the form data
		this.dispatchEvent(
			new CustomEvent('submit', {
				detail: { formData, data: formDataObj },
				bubbles: true,
			}),
		)

		// If there's an action URL, submit the form to it
		if (this.action && !this.novalidate) {
			this.formElement.submit()
		}
	}

	/**
	 * Reset the form
	 */
	public reset() {
		this.formElement?.reset()
	}

	render() {
		return html`
			<form
				method=${this.method}
				action=${this.action}
				enctype=${this.enctype}
				?novalidate=${this.novalidate}
				@submit=${this.handleSubmit}
			>
				<slot></slot>
			</form>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-form': SchForm
	}
}
