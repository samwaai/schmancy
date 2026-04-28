import { nothing } from 'lit'
import { Directive, directive, type ElementPart } from 'lit/directive.js'
import { animationFrameScheduler, BehaviorSubject, EMPTY, fromEvent, Subject, timer } from 'rxjs'
import { distinctUntilChanged, observeOn, skip, switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { SPRING_SNAPPY } from '../utils/animation'
import { reducedMotion$ } from './reduced-motion'

// =============================================================================
// TYPES
// =============================================================================

export type SchmancyDropEvent = CustomEvent<{
	source: string
	destination: string
	/** Where the item was dropped relative to the destination: above or below its midpoint */
	position?: 'before' | 'after'
}>

// =============================================================================
// REACTIVE STATE
// =============================================================================

/** Current drag source ID — single source of truth for all drag/drop directives */
const dragSource$ = new BehaviorSubject<string | null>(null)

/** Insertion line position — drives the singleton line element reactively */
const linePosition$ = new BehaviorSubject<{
	target: HTMLElement
	destinationId: string
	position: 'before' | 'after'
} | null>(null)

/** Registry of all drag-enabled elements by ID (for direction detection + FLIP) */
const dragRegistry = new Map<string, HTMLElement>()

/** Pre-drop rect snapshots for FLIP animation (captured at dragstart) */
const preDropRects = new Map<string, DOMRect>()

/** Debug log — accumulates drag/drop events, auto-copies to clipboard on dragend */
const debugLog: string[] = []
function dlog(msg: string) {
	debugLog.push(`[${new Date().toISOString().slice(11, 23)}] ${msg}`)
}
function flushDebugLog() {
	if (debugLog.length === 0) return
	debugLog.length = 0
}

// =============================================================================
// INSERTION LINE (lazy singleton)
// =============================================================================

let insertionLine: HTMLElement | null = null

function ensureInsertionLine(): HTMLElement {
	if (insertionLine) return insertionLine

	const line = document.createElement('div')
	line.setAttribute('data-schmancy-drop-line', '')
	Object.assign(line.style, {
		position: 'fixed',
		height: '2px',
		backgroundColor: 'var(--schmancy-sys-color-tertiary-default, #6750A4)',
		borderRadius: '1px',
		pointerEvents: 'none',
		zIndex: '10000',
		transition: 'top 100ms ease, left 100ms ease, width 100ms ease',
		boxShadow: '0 0 4px var(--schmancy-sys-color-tertiary-default, #6750A4)',
		display: 'none',
	})

	for (const side of ['left', 'right'] as const) {
		const dot = document.createElement('div')
		Object.assign(dot.style, {
			position: 'absolute',
			width: '6px',
			height: '6px',
			borderRadius: '50%',
			backgroundColor: 'var(--schmancy-sys-color-tertiary-default, #6750A4)',
			top: '-2px',
			[side]: '-3px',
		})
		line.appendChild(dot)
	}

	document.body.appendChild(line)
	insertionLine = line
	return line
}

// Single global subscription — drives insertion line DOM from linePosition$
linePosition$
	.pipe(
		distinctUntilChanged(
			(a, b) => a?.target === b?.target && a?.position === b?.position,
		),
	)
	.subscribe(state => {
		if (!state) {
			if (insertionLine) insertionLine.style.display = 'none'
			return
		}

		if (reducedMotion$.value) return

		const line = ensureInsertionLine()
		const rect = state.target.getBoundingClientRect()
		const y = state.position === 'before' ? rect.top - 1 : rect.bottom + 1

		Object.assign(line.style, {
			top: `${y}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			display: 'block',
		})
	})

// =============================================================================
// DIRECTION-AWARE DROP POSITION
// =============================================================================

function getDropPosition(e: DragEvent, targetEl: HTMLElement, sourceId: string | null): 'before' | 'after' | null {
	const tr = targetEl.getBoundingClientRect()
	const sourceEl = sourceId ? dragRegistry.get(sourceId) : null
	if (!sourceEl) return e.clientY < tr.top + tr.height / 2 ? 'before' : 'after'

	const sr = sourceEl.getBoundingClientRect()
	const horizontal = Math.abs(sr.top - tr.top) < tr.height / 2

	if (horizontal) {
		const midX = tr.left + tr.width / 2
		return sr.left > tr.left ? (e.clientX < midX ? 'before' : null) : e.clientX >= midX ? 'after' : null
	}

	const midY = tr.top + tr.height / 2
	return sr.top > tr.top ? (e.clientY < midY ? 'before' : null) : e.clientY >= midY ? 'after' : null
}

// =============================================================================
// DRAG DIRECTIVE
// =============================================================================

export class DragDirective extends Directive {
	private element?: HTMLElement
	private id!: string
	private registeredId?: string
	private destroy$ = new Subject<void>()

	update(part: ElementPart, [id]: [string]) {
		this.id = id

		if (!this.element) {
			const el = part.element as HTMLElement
			this.element = el
			el.draggable = true
			el.style.cursor = 'grab'

			fromEvent<DragEvent>(el, 'dragstart')
				.pipe(
					tap(e => {
						e.stopPropagation()
						e.dataTransfer?.setData('application/json', JSON.stringify({ id: this.id }))
						if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
						el.style.cursor = 'grabbing'
						debugLog.length = 0
						dlog(`DRAGSTART id=${this.id} tag=${el.tagName}`)
						dragSource$.next(this.id)
						// Inline FLIP capture
						preDropRects.clear()
						const parent = el.parentElement
						if (parent) {
							for (const [regId, reg] of dragRegistry) {
								if (reg.parentElement === parent) preDropRects.set(regId, reg.getBoundingClientRect())
							}
						}
					}),
					// Defer lift to next frame so browser captures ghost at normal state
					observeOn(animationFrameScheduler),
					tap(() => {
						if (!reducedMotion$.value) {
							el.style.transition = 'transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease'
							el.style.transform = 'scale(1.03)'
							el.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
							el.style.opacity = '0.6'
							el.style.zIndex = '1000'
							el.style.pointerEvents = 'none'
						}
					}),
					// dragend is a natural side effect of dragstart — one per session
					switchMap(() =>
						fromEvent<DragEvent>(el, 'dragend').pipe(
							take(1),
							tap(() => {
								const pendingDrop = linePosition$.value

								el.style.removeProperty('transition')
								el.style.removeProperty('transform')
								el.style.removeProperty('box-shadow')
								el.style.removeProperty('opacity')
								el.style.removeProperty('z-index')
								el.style.removeProperty('pointer-events')
								el.style.cursor = 'grab'

								if (pendingDrop) {
									const { target, destinationId, position } = pendingDrop
									dlog(`DROP source=${this.id} dest=${destinationId} pos=${position}`)
									target.dispatchEvent(
										new CustomEvent('drop', {
											detail: { source: this.id, destination: destinationId, position },
											bubbles: true,
											composed: true,
										}),
									)
									// FLIP: double rAF waits for Lit render + browser layout
									timer(0, animationFrameScheduler).pipe(skip(1), take(1)).subscribe(() => {
										if (reducedMotion$.value || preDropRects.size === 0) return
										for (const [flipId, oldRect] of preDropRects) {
											const reg = dragRegistry.get(flipId)
											if (!reg) continue
											const newRect = reg.getBoundingClientRect()
											const dx = oldRect.left - newRect.left
											const dy = oldRect.top - newRect.top
											if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue
											reg.animate(
												[{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }],
												{ duration: SPRING_SNAPPY.duration, easing: SPRING_SNAPPY.easingFallback, fill: 'none' },
											)
										}
										preDropRects.clear()
									})
								}

								dragSource$.next(null)
								linePosition$.next(null)
								dlog(`DRAGEND id=${this.id}`)
								flushDebugLog()
							}),
						),
					),
					takeUntil(this.destroy$),
				)
				.subscribe()
		}

		// Keep registry in sync (element may be reused with different id)
		if (this.registeredId && this.registeredId !== id) {
			dragRegistry.delete(this.registeredId)
		}
		dragRegistry.set(id, this.element)
		this.registeredId = id

		return nothing
	}

	disconnected() {
		this.destroy$.next()
		this.destroy$.complete()
		if (this.registeredId) dragRegistry.delete(this.registeredId)
		this.element = undefined
	}

	reconnected() {
		this.destroy$ = new Subject<void>()
		// Clear element so that the next update() call re-attaches event listeners
		this.element = undefined
	}

	render(_id: string) {
		return nothing
	}
}

export const drag = directive(DragDirective)

// =============================================================================
// DROP DIRECTIVE — dragover/drop are side effects of dragSource$
// =============================================================================

export class DropDirective extends Directive {
	private element?: HTMLElement
	private destinationId!: string
	private destroy$ = new Subject<void>()

	update(part: ElementPart, [destinationId]: [string]) {
		this.destinationId = destinationId

		if (!this.element) {
			const el = part.element as HTMLElement
			this.element = el

			// Native drag event logging via RxJS
			fromEvent<DragEvent>(el, 'dragenter').pipe(
				tap(e => {
					dlog(`NATIVE-DRAGENTER dest=${this.destinationId}`)
					e.preventDefault()
				}),
				takeUntil(this.destroy$),
			).subscribe()

			fromEvent<DragEvent>(el, 'dragover').pipe(
				tap(e => {
					dlog(`NATIVE-DRAGOVER dest=${this.destinationId}`)
					e.preventDefault()
					if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
				}),
				takeUntil(this.destroy$),
			).subscribe()

			fromEvent<DragEvent>(el, 'drop').pipe(
				tap(e => {
					e.preventDefault()
					dlog(`NATIVE-DROP dest=${this.destinationId}`)
				}),
				takeUntil(this.destroy$),
			).subscribe()

			// dragSource$ is the entry — dragover/drop only exist while a drag is active
			dragSource$
				.pipe(
					switchMap(sourceId => {
						if (!sourceId || sourceId === this.destinationId) {
							linePosition$.next(null)
							return EMPTY
						}
						dlog(`DROP-ACTIVE dest=${this.destinationId} src=${sourceId}`)
						return fromEvent<DragEvent>(el, 'dragover').pipe(
							tap(e => {
								e.preventDefault()
								if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
							}),
							tap(e => {
								const position = getDropPosition(e, el, sourceId)
								linePosition$.next(position ? { target: el, destinationId: this.destinationId, position } : null)
							}),
						)
					}),
					takeUntil(this.destroy$),
				)
				.subscribe()
		}

		return nothing
	}

	disconnected() {
		this.destroy$.next()
		this.destroy$.complete()
		this.element = undefined
	}

	reconnected() {
		this.destroy$ = new Subject<void>()
		// Clear element so that the next update() call re-attaches event listeners
		this.element = undefined
	}

	render(_destinationId: string) {
		return nothing
	}
}

export const drop = directive(DropDirective)
