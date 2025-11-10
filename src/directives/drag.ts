import { nothing } from 'lit'
import { Directive, directive, Part, PartInfo } from 'lit/directive.js'
import { fromEvent, merge, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'

export type SchmancyDropEvent = CustomEvent<{ source: string; destination: string }>

// A module-level variable to hold the current drag source id.
let currentDragSourceId: string | null = null

// DRAG DIRECTIVE
export class DragDirective extends Directive {
	private element?: HTMLElement
	private id!: string
	private destroy$ = new Subject<void>()

	constructor(partInfo: PartInfo) {
		super(partInfo)
	}

	private handleDragStart = (e: DragEvent) => {
		e.stopPropagation()
		const data = { id: this.id }
		e.dataTransfer?.setData('application/json', JSON.stringify(data))
		e.dataTransfer!.effectAllowed = 'move'
		this.element?.style.setProperty('cursor', 'grabbing')
		// Store the source id globally so the drop directive can use it.
		currentDragSourceId = this.id
	}

	private handleDragEnd = () => {
		this.element?.style.setProperty('cursor', 'grab')
		// Clear the global id once dragging ends.
		currentDragSourceId = null
	}

	update(part: Part, [id]: [string]) {
		this.id = id

		if (!this.element) {
			// @ts-ignore
			this.element = part.element as HTMLElement
			this.element.draggable = true
			this.element.style.cursor = 'grab'

			merge(fromEvent<DragEvent>(this.element, 'dragstart'), fromEvent<DragEvent>(this.element, 'dragend'))
				.pipe(takeUntil(this.destroy$))
				.subscribe(event => {
					if (event.type === 'dragstart') {
						this.handleDragStart(event)
					} else if (event.type === 'dragend') {
						this.handleDragEnd()
					}
				})
		}

		return nothing
	}

	disconnected() {
		this.destroy$.next()
		this.destroy$.complete()
	}

	render(_id: string) {
		return nothing
	}
}

export const drag = directive(DragDirective)

// DROP DIRECTIVE
export class DropDirective extends Directive {
	private element?: HTMLElement
	private destinationId!: string
	private destroy$ = new Subject<void>()

	constructor(partInfo: PartInfo) {
		super(partInfo)
	}

	private handleDragOver = (e: DragEvent) => {
		e.preventDefault()
		// If the current drag source id matches the drop target's id,
		// do not highlight the drop area.
		if (currentDragSourceId === this.destinationId) {
			return
		}
		if (this.element) {
			this.element.style.outline = '1px dashed var(--schmancy-sys-color-tertiary-default)'
			this.element.style.outlineOffset = '1px'
			// apply shadow to the drop target when the draggable element is over it
			this.element.style.filter = 'drop-shadow(0 0 0.5rem var(--schmancy-sys-color-tertiary-default))'
		}
	}

	private handleDragLeave = () => {
		if (this.element) {
			this.element.style.removeProperty('outline')
			this.element.style.removeProperty('outline-offset')
			// remove filter from the drop target
			this.element.style.filter = 'none'
		}
	}

	private handleDrop = (e: DragEvent) => {
		e.preventDefault()
		this.handleDragLeave()

		const data = e.dataTransfer?.getData('application/json')
		if (!data) return

		try {
			const { id: sourceId } = JSON.parse(data)
			// If the source and destination are the same, do nothing.
			if (sourceId === this.destinationId) {
				return
			}
			this.element?.dispatchEvent(
				new CustomEvent('drop', {
					detail: {
						source: sourceId,
						destination: this.destinationId,
					},
					bubbles: true,
					composed: true,
				}),
			)
		} catch (error) {
			console.error('Error parsing drop data:', error)
		}
	}

	update(part: Part, [destinationId]: [string]) {
		this.destinationId = destinationId

		if (!this.element) {
			// @ts-ignore
			this.element = part.element as HTMLElement

			merge(
				fromEvent<DragEvent>(this.element, 'dragover'),
				fromEvent<DragEvent>(this.element, 'dragleave'),
				fromEvent<DragEvent>(this.element, 'drop').pipe(
					map(e => {
						e.stopPropagation()
						e.preventDefault()
						return e
					}),
				),
			)
				.pipe(takeUntil(this.destroy$))
				.subscribe(event => {
					switch (event.type) {
						case 'dragover':
							this.handleDragOver(event)
							break
						case 'dragleave':
							this.handleDragLeave()
							break
						case 'drop':
							this.handleDrop(event)
							break
					}
				})
		}

		return nothing
	}

	disconnected() {
		this.destroy$.next()
		this.destroy$.complete()
	}

	render(_destinationId: string) {
		return nothing
	}
}

export const drop = directive(DropDirective)
