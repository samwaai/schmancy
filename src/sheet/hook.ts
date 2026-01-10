// @watch decorator
//
// Runs when an observed property changes, e.g. @property or @state, but before the component updates.
//
// To wait for an update to complete after a change occurs, use `await this.updateComplete` in the handler. To start
// watching after the initial update/render, use `{ waitUntilFirstUpdate: true }` or `this.hasUpdated` in the handler.
//
// Usage:
//
//  @watch('propName')
//  handlePropChange(oldValue, newValue) {
//    ...
//  }
//
interface WatchOptions {
	waitUntilFirstUpdate?: boolean
}

export function on(propName: string, options?: WatchOptions) {
	return (protoOrDescriptor: Record<string, unknown>, name: string): void => {
		const { willUpdate } = protoOrDescriptor as { willUpdate: (changedProps: Map<string, unknown>) => void }

		const mergedOptions = Object.assign({ waitUntilFirstUpdate: false }, options) as WatchOptions

		protoOrDescriptor.willUpdate = function (this: Record<string, unknown> & { hasUpdated?: boolean }, changedProps: Map<string, unknown>) {
			willUpdate.call(this, changedProps)

			if (changedProps.has(propName)) {
				const oldValue = changedProps.get(propName)
				const newValue = this[propName]

				if (oldValue !== newValue) {
					if (!mergedOptions.waitUntilFirstUpdate || this.hasUpdated) {
						(this[name] as (oldValue: unknown, newValue: unknown) => void).call(this, oldValue, newValue)
					}
				}
			}
		}
	}
}
