/**
 * cycleText directive - Cycles through child elements with transitions.
 *
 * Composition-first: works as an inline span inside animateText or standalone.
 * Items are defined as HTML children, not JS arrays — content stays in templates.
 *
 * @example
 * ```ts
 * // Basic: cycles through child spans with fade transition
 * html`<span ${cycleText()}>
 *   <span>Guests</span>
 *   <span>Kitchen</span>
 *   <span>Floor</span>
 * </span>`
 *
 * // With options
 * html`<span ${cycleText({ transition: 'slide', hold: 1500 })}>
 *   <span>Fast</span>
 *   <span>Snappy</span>
 * </span>`
 *
 * // Per-item timing via data attributes
 * html`<span ${cycleText()}>
 *   <span data-hold="3000">Lingers longer</span>
 *   <span>Normal timing</span>
 * </span>`
 *
 * // Add mode: accumulates items, then clears and restarts
 * html`<span ${cycleText({ mode: 'add', transition: 'typewriter' })}>
 *   <span>guests</span>
 *   <span>kitchen</span>
 *   <span>team</span>
 * </span>`
 * // Shows: "guests" → "guests, kitchen" → "guests, kitchen, team" → clears → repeat
 *
 * // Custom separator
 * html`<span ${cycleText({ mode: 'add', separator: ' · ' })}>
 *   <span>A</span>
 *   <span>B</span>
 * </span>`
 * ```
 */
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit/directive.js'
import { EMPTY, Observable, Subject, Subscription, concat, defer, from, interval, of, timer } from 'rxjs'
import { catchError, map, repeat, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators'

export type CycleTransition = 'fade' | 'slide' | 'typewriter'

export interface CycleTextOptions {
	/** Transition between items (default: 'fade') */
	transition?: CycleTransition
	/** Default hold duration per item in ms (default: 2000). Overridden by child data-hold. */
	hold?: number
	/** Transition duration in ms (default: 300) */
	duration?: number
	/** Initial delay before first cycle in ms (default: 0) */
	delay?: number
	/** 'replace' cycles one at a time; 'add' accumulates items then resets (default: 'replace') */
	mode?: 'replace' | 'add'
	/** Separator between accumulated items in add mode (default: ', ') */
	separator?: string
}

class CycleTextDirective extends AsyncDirective {
	private element: HTMLElement | null = null
	private items: HTMLElement[] = []
	private subscription: Subscription | null = null
	private typewriterSub: Subscription | null = null
	private currentAnimation: Animation | null = null
	private addDisplayEl: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()
	private initialized = false

	render(_options?: CycleTextOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = {}]: [CycleTextOptions?]) {
		this.element = part.element as HTMLElement

		if (!this.initialized && this.isConnected) {
			this.initialized = true

			if (this.disconnecting$.closed) {
				this.disconnecting$ = new Subject<void>()
			}

			// Collect child elements as cycle items
			this.items = Array.from(this.element.children).filter(
				(el): el is HTMLElement => el instanceof HTMLElement,
			)

			if (this.items.length === 0) return noChange

			// Grid stacking: all items in same cell, grid sizes to widest — zero layout shift
			this.element.style.display = 'inline-grid'
			this.element.style.verticalAlign = 'bottom'

			this.items.forEach((item, i) => {
				item.style.gridColumn = '1'
				item.style.gridRow = '1'
				item.style.visibility = i === 0 ? '' : 'hidden'
			})

			this.startCycling(options)
		}

		return noChange
	}

	override disconnected(): void {
		this.cleanup()
	}

	override reconnected(): void {
		// nothing needed
	}

	private startCycling(options: CycleTextOptions): void {
		const { mode = 'replace' } = options

		if (this.items.length < 2) return

		if (mode === 'add') {
			this.startAddCycling(options)
		} else {
			this.startReplaceCycling(options)
		}
	}

	private startReplaceCycling(options: CycleTextOptions): void {
		const {
			transition = 'fade',
			hold: defaultHold = 2000,
			duration = 300,
			delay: initialDelay = 0,
		} = options

		// Build one observable per item: show → hold → hide
		const cycleItem = (index: number) =>
			defer(() => {
				return new Observable<void>(subscriber => {
					const item = this.items[index]
					const prevIndex = (index - 1 + this.items.length) % this.items.length
					const prevItem = this.items[prevIndex]
					const itemHold = parseInt(item.dataset.hold || '', 10) || defaultHold

					// Transition out previous, transition in current
					const transitionDone$ = this.transitionItems(prevItem, item, transition, duration)

					// After transition + hold, signal complete
					const holdSub = transitionDone$
						.pipe(
							switchMap(() => timer(itemHold)),
							take(1),
							takeUntil(this.disconnecting$),
						)
						.subscribe({
							next: () => {
								subscriber.next()
								subscriber.complete()
							},
							error: err => subscriber.error(err),
						})

					return () => holdSub.unsubscribe()
				})
			})

		// First item is already visible — just hold it, then cycle from index 1
		const firstHold = parseInt(this.items[0].dataset.hold || '', 10) || defaultHold
		const firstItem = defer(() => {
			return new Observable<void>(subscriber => {
				const holdSub = timer(firstHold)
					.pipe(takeUntil(this.disconnecting$))
					.subscribe({
						next: () => {
							subscriber.next()
							subscriber.complete()
						},
					})
				return () => holdSub.unsubscribe()
			})
		})

		// Build sequence: hold first → cycle 1,2,...,0,1,2,...
		const indices = Array.from({ length: this.items.length }, (_, i) => i)
		// After first hold, cycle starting from item 1 through all items
		const restIndices = [...indices.slice(1), 0]
		const restSequence = concat(...restIndices.map(i => cycleItem(i)))

		// First hold + rest sequence, then repeat rest sequence forever
		const fullSequence = concat(firstItem, restSequence.pipe(repeat()))

		this.subscription = timer(initialDelay)
			.pipe(
				switchMap(() => fullSequence),
				takeUntil(this.disconnecting$),
			)
			.subscribe()
	}

	private startAddCycling(options: CycleTextOptions): void {
		const {
			transition = 'fade',
			hold: defaultHold = 2000,
			duration = 300,
			delay: initialDelay = 0,
			separator = ', ',
		} = options

		const texts = this.items.map(item => item.textContent || '')

		// Hide all children — we manage display via a single display span
		this.items.forEach(item => {
			item.style.display = 'none'
		})

		const displayEl = document.createElement('span')
		this.element!.appendChild(displayEl)
		this.addDisplayEl = displayEl

		// One cycle: type each item progressively, then clear and restart
		const oneCycle = defer(() => {
			displayEl.textContent = ''
			let accumulated = ''

			// Build sequence: type item 0 → hold → type sep+item 1 → hold → ... → hold longer → clear
			const itemSteps = texts.map((text, i) => {
				const itemHold = parseInt(this.items[i].dataset.hold || '', 10) || defaultHold
				const prefix = i > 0 ? separator : ''
				const textToType = prefix + text

				return defer(() => {
					if (transition === 'typewriter') {
						return this.typewriterAdd(displayEl, accumulated, textToType, duration).pipe(
							tap(() => {
								accumulated += textToType
							}),
							switchMap(() => timer(itemHold)),
						)
					}
					// fade/slide: instant append with fade-in on new text
					return defer(() => {
						accumulated += textToType
						displayEl.textContent = accumulated
						return timer(itemHold)
					})
				})
			})

			// After all items shown, hold a bit longer then clear with fade-out
			const clearPhase = defer(() => {
				const fadeOut = displayEl.animate([{ opacity: 1 }, { opacity: 0 }], {
					duration: duration,
					fill: 'forwards',
				})
				this.currentAnimation = fadeOut
				return from(fadeOut.finished).pipe(
					tap(() => {
						fadeOut.cancel()
						displayEl.textContent = ''
						displayEl.style.opacity = ''
						accumulated = ''
					}),
					switchMap(() => timer(300)),
				)
			})

			return concat(...itemSteps, clearPhase)
		})

		this.subscription = timer(initialDelay)
			.pipe(
				switchMap(() => oneCycle.pipe(repeat())),
				takeUntil(this.disconnecting$),
			)
			.subscribe()
	}

	/** Types text character by character, appending to existing content. Completes after all chars typed. */
	private typewriterAdd(
		displayEl: HTMLElement,
		existing: string,
		newText: string,
		duration: number,
	): Observable<void> {
		if (newText.length === 0) return of(undefined as void)
		const charDelay = duration / newText.length

		return new Observable<void>(subscriber => {
			let typed = 0
			const sub = interval(charDelay)
				.pipe(
					tap(() => {
						typed++
						displayEl.textContent = existing + newText.slice(0, typed)
					}),
					takeWhile(() => typed < newText.length),
					takeUntil(this.disconnecting$),
				)
				.subscribe({
					complete: () => {
						displayEl.textContent = existing + newText
						subscriber.next()
						subscriber.complete()
					},
				})
			return () => sub.unsubscribe()
		})
	}

	private transitionItems(
		outItem: HTMLElement,
		inItem: HTMLElement,
		transition: CycleTransition,
		duration: number,
	): Observable<void> {
		// Cancel any running transition
		this.currentAnimation?.cancel()
		this.currentAnimation = null
		this.typewriterSub?.unsubscribe()
		this.typewriterSub = null

		switch (transition) {
			case 'slide':
				return this.slideTransition(outItem, inItem, duration)
			case 'typewriter':
				return this.typewriterTransition(outItem, inItem, duration)
			case 'fade':
			default:
				return this.fadeTransition(outItem, inItem, duration)
		}
	}

	private fadeTransition(outItem: HTMLElement, inItem: HTMLElement, duration: number): Observable<void> {
		const fadeOut = outItem.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: duration / 2,
			fill: 'forwards',
		})
		this.currentAnimation = fadeOut

		return from(fadeOut.finished).pipe(
			switchMap(() => {
				fadeOut.cancel()
				outItem.style.visibility = 'hidden'

				inItem.style.visibility = ''
				const fadeIn = inItem.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration: duration / 2,
					fill: 'forwards',
				})
				this.currentAnimation = fadeIn

				return from(fadeIn.finished).pipe(
					tap(() => { fadeIn.cancel() }),
					map(() => {}),
					catchError(() => EMPTY),
				)
			}),
			catchError(() => EMPTY),
		)
	}

	/** Counter-style slide: both animate simultaneously in same grid cell */
	private slideTransition(outItem: HTMLElement, inItem: HTMLElement, duration: number): Observable<void> {
		const soft = 'cubic-bezier(0.4, 0, 0.2, 1)'

		inItem.style.visibility = ''

		const slideOut = outItem.animate(
			[
				{ transform: 'translateY(0)', opacity: 1 },
				{ transform: 'translateY(-100%)', opacity: 0 },
			],
			{ duration, fill: 'forwards', easing: soft },
		)
		const slideIn = inItem.animate(
			[
				{ transform: 'translateY(100%)', opacity: 0 },
				{ transform: 'translateY(0)', opacity: 1 },
			],
			{ duration, fill: 'forwards', easing: soft },
		)
		this.currentAnimation = slideIn

		return from(slideIn.finished).pipe(
			tap(() => {
				slideOut.cancel()
				slideIn.cancel()
				outItem.style.visibility = 'hidden'
			}),
			map(() => {}),
			catchError(() => EMPTY),
		)
	}

	private typewriterTransition(
		outItem: HTMLElement,
		inItem: HTMLElement,
		duration: number,
	): Observable<void> {
		const outText = outItem.textContent || ''
		const inText = inItem.textContent || ''
		const totalChars = outText.length + inText.length
		if (totalChars === 0) {
			outItem.style.visibility = 'hidden'
			inItem.style.visibility = ''
			return of(undefined as void)
		}

		const charDelay = duration / totalChars

		return new Observable<void>(subscriber => {
			// Phase 1: delete outgoing text
			let remaining = outText.length

			this.typewriterSub = concat(
				// Delete phase
				interval(charDelay).pipe(
					tap(() => {
						remaining--
						outItem.textContent = outText.slice(0, remaining)
					}),
					takeWhile(() => remaining > 0),
				),
				// Switch items
				defer(() => {
					outItem.style.visibility = 'hidden'
					outItem.textContent = outText // restore original
					inItem.style.visibility = ''
					inItem.textContent = ''
					return of(null)
				}),
				// Type phase
				defer(() => {
					let typed = 0
					return interval(charDelay).pipe(
						tap(() => {
							typed++
							inItem.textContent = inText.slice(0, typed)
						}),
						takeWhile(() => typed < inText.length),
					)
				}),
			)
				.pipe(takeUntil(this.disconnecting$))
				.subscribe({
					complete: () => {
						inItem.textContent = inText // ensure full text
						subscriber.next()
						subscriber.complete()
					},
				})

			return () => {
				this.typewriterSub?.unsubscribe()
				this.typewriterSub = null
			}
		})
	}

	private cleanup(): void {
		this.disconnecting$.next()
		this.disconnecting$.complete()

		this.currentAnimation?.cancel()
		this.currentAnimation = null
		this.typewriterSub?.unsubscribe()
		this.typewriterSub = null
		this.subscription?.unsubscribe()
		this.subscription = null

		// Remove add-mode display element
		if (this.addDisplayEl) {
			this.addDisplayEl.remove()
			this.addDisplayEl = null
		}

		this.items.forEach((item, i) => {
			item.style.gridColumn = ''
			item.style.gridRow = ''
			item.style.visibility = i === 0 ? '' : 'hidden'
			item.style.opacity = ''
			item.style.transform = ''
		})

		this.element = null
		this.items = []
		this.initialized = false
	}
}

export const cycleText = directive(CycleTextDirective)
