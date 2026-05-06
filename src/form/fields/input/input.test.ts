import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './input'
import { expectNoA11yViolations } from '../../../test-utils/a11y'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-input', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('contributes value to FormData under its name', async () => {
		host.innerHTML = `
			<form>
				<schmancy-input name="email" value="me@example.com"></schmancy-input>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		await nextUpdate()
		expect(new FormData(form).get('email')).toBe('me@example.com')
	})

	it('reports invalid when required and empty', async () => {
		host.innerHTML = `<form><schmancy-input name="x" required></schmancy-input></form>`
		const form = host.querySelector('form') as HTMLFormElement
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			internals?: ElementInternals
			required: boolean
			value: string
			updateComplete: Promise<boolean>
			checkValidity(): boolean
		}
		await inp.updateComplete
		await nextUpdate()
		// Sanity probe — internal state and validity flags.
		expect(inp.required).toBe(true)
		expect(inp.value).toBe('')
		expect(inp.checkValidity()).toBe(false) // direct call, baseline
		expect(inp.internals?.validity?.valueMissing).toBe(true)
		expect(form.checkValidity()).toBe(false)
	})

	it('default validateOn is "dirty"', async () => {
		host.innerHTML = `<schmancy-input label="Email" required></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & { validateOn: string; error: boolean }
		await nextUpdate()
		await nextUpdate()
		expect(inp.validateOn).toBe('dirty')
		expect(inp.error).toBe(false) // pristine → no error
	})

	it('surfaces typeMismatch via internals.validity for type=email', async () => {
		host.innerHTML = `<schmancy-input label="Email" type="email" value="not-an-email"></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			internals?: ElementInternals
			markSubmitted(): void
			checkValidity(): boolean
			updateComplete: Promise<boolean>
		}
		await inp.updateComplete
		await nextUpdate()
		// Ensure the inner native input has rendered with the value before we
		// inspect validity (Lit binds .value via property at render time).
		const innerInput = inp.shadowRoot?.querySelector('input') as HTMLInputElement
		expect(innerInput.value).toBe('not-an-email')
		expect(innerInput.validity.typeMismatch).toBe(true)
		inp.markSubmitted()
		// Direct call to ensure platform validity is synced.
		inp.checkValidity()
		await nextUpdate()
		await nextUpdate()
		expect(inp.internals?.validity?.typeMismatch).toBe(true)
		expect(inp.matches(':state(type-mismatch)')).toBe(true)
		expect(inp.matches(':state(value-missing)')).toBe(false)
	})

	it('surfaces patternMismatch via internals.validity', async () => {
		host.innerHTML = `<schmancy-input label="Code" pattern="[A-Z]{3}" value="abc"></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			internals?: ElementInternals
			markSubmitted(): void
			updateComplete: Promise<boolean>
		}
		await inp.updateComplete
		await nextUpdate()
		inp.markSubmitted()
		await nextUpdate()
		await nextUpdate()
		expect(inp.internals?.validity?.patternMismatch).toBe(true)
		expect(inp.matches(':state(pattern-mismatch)')).toBe(true)
	})

	it('validateOn=length shows errors only when value reaches maxlength', async () => {
		host.innerHTML = `<schmancy-input label="ZIP" maxlength="5" pattern="[0-9]{5}" validateOn="length" value="12"></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			value: string
			error: boolean
			validateOn: string
			updateComplete: Promise<boolean>
		}
		await inp.updateComplete
		await nextUpdate()
		// Below maxlength: gate closed.
		expect(inp.error).toBe(false)

		// Reach maxlength with non-matching pattern: gate opens, error shows.
		inp.value = 'abcde'
		await inp.updateComplete
		await nextUpdate()
		await nextUpdate()
		expect(inp.error).toBe(true)
	})

	it('errorMessages overrides the default validity message (i18n)', async () => {
		host.innerHTML = `<schmancy-input label="Email" type="email" required></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			errorMessages: { valueMissing?: string; typeMismatch?: string }
			value: string
			markSubmitted(): void
			validationMessage: string
			updateComplete: Promise<boolean>
		}
		inp.errorMessages = {
			valueMissing: 'Adresse e-mail requise',
			typeMismatch: 'Format e-mail invalide',
		}
		await inp.updateComplete
		await nextUpdate()
		// Required + empty.
		inp.markSubmitted()
		await nextUpdate()
		await nextUpdate()
		expect(inp.validationMessage).toBe('Adresse e-mail requise')

		// Now invalid format.
		inp.value = 'not-an-email'
		// Reset internal state so we re-evaluate cleanly (clear the previous
		// validationMessage so the new check assigns the typeMismatch override).
		inp.validationMessage = ''
		await nextUpdate()
		await nextUpdate()
		expect(inp.validationMessage).toBe('Format e-mail invalide')
	})

	it('runAsyncValidator sets isValidating + :state(validating) and applies the result', async () => {
		host.innerHTML = `<schmancy-input label="Username" value="taken"></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			isValidating: boolean
			runAsyncValidator(fn: () => Promise<string>): Promise<void>
			validationMessage: string
			updateComplete: Promise<boolean>
		}
		await inp.updateComplete

		let resolveValidator: (msg: string) => void
		const promise = inp.runAsyncValidator(
			() => new Promise<string>(r => { resolveValidator = r }),
		)
		// Yield once for the @state to update.
		await new Promise(r => requestAnimationFrame(() => r(null)))
		expect(inp.isValidating).toBe(true)
		expect(inp.matches(':state(validating)')).toBe(true)

		// Server says: name taken.
		resolveValidator!('Username is taken')
		await promise
		await new Promise(r => requestAnimationFrame(() => r(null)))
		expect(inp.isValidating).toBe(false)
		expect(inp.matches(':state(validating)')).toBe(false)
		expect(inp.validationMessage).toBe('Username is taken')
	})

	it('has no axe-core a11y violations (idle, with label)', async () => {
		host.innerHTML = `<schmancy-input label="Email address" type="email"></schmancy-input>`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('has no axe-core a11y violations in error state', async () => {
		host.innerHTML = `<schmancy-input label="Email" required></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			markSubmitted(): void
			checkValidity(): boolean
		}
		await nextUpdate()
		await nextUpdate()
		inp.markSubmitted()
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})
})
