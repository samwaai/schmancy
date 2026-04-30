import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { merge, fromEvent, timer } from 'rxjs'
import { map, distinctUntilChanged, tap, takeUntil, skip } from 'rxjs/operators'
import { $sounds } from '../audio'

/**
 * @element schmancy-connectivity-status
 * A beautiful connectivity status component that monitors online/offline state
 * and shows subtle animated banners when connectivity changes.
 *
 * @example
 * <!-- Add once to your app root -->
 * <schmancy-connectivity-status></schmancy-connectivity-status>
 */
@customElement('schmancy-connectivity-status')
export class SchmancyConnectivityStatus extends SchmancyElement {
	static styles = [css`
	:host {
		display: block;
	}

	.banner {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out;
	}

	.banner.visible {
		transform: translateY(0);
		opacity: 1;
	}

	.banner.exiting {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 300ms ease-out, opacity 300ms ease-out;
	}

	@keyframes icon-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	@keyframes icon-bounce {
		0%, 100% { transform: translateY(0); }
		25% { transform: translateY(-6px); }
		50% { transform: translateY(0); }
		75% { transform: translateY(-3px); }
	}

	.icon-pulse {
		animation: icon-pulse 1s ease-in-out infinite;
	}

	.icon-bounce {
		animation: icon-bounce 600ms ease-out;
	}
`];
	private bannerRef = createRef<HTMLDivElement>()
	private surfaceRef = createRef<HTMLElement>()
	private iconRef = createRef<HTMLSpanElement>()
	private messageRef = createRef<HTMLSpanElement>()

	connectedCallback(): void {
		super.connectedCallback()

		const connectivity$ = merge(
			fromEvent(window, 'online').pipe(map(() => true)),
			fromEvent(window, 'offline').pipe(map(() => false))
		).pipe(distinctUntilChanged())

		// UI updates via refs
		connectivity$.pipe(
			tap(online => this.updateBanner(online)),
			takeUntil(this.disconnecting)
		).subscribe()

		// Sounds (skip initial)
		connectivity$.pipe(
			skip(1),
			tap(online => $sounds.play(online ? 'celebrated' : 'disappointed')),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	private updateBanner(online: boolean): void {
		const banner = this.bannerRef.value
		const surface = this.surfaceRef.value
		const icon = this.iconRef.value
		const message = this.messageRef.value

		if (!banner || !surface || !icon || !message) return

		if (!online) {
			// Going offline
			surface.setAttribute('type', 'error')
			icon.textContent = '🙀'
			icon.className = 'text-2xl icon-pulse'
			message.textContent = "You're offline"
			banner.classList.remove('exiting')
			banner.classList.add('visible')
		} else {
			// Back online
			surface.setAttribute('type', 'primary')
			icon.textContent = '🎉'
			icon.className = 'text-2xl icon-bounce'
			message.textContent = 'Back online'
			banner.classList.remove('exiting')
			banner.classList.add('visible')

			// Auto-dismiss after 1.5 seconds
			timer(1500).pipe(
				tap(() => {
					banner.classList.add('exiting')
					timer(300).pipe(
						tap(() => banner.classList.remove('visible', 'exiting')),
						takeUntil(this.disconnecting)
					).subscribe()
				}),
				takeUntil(this.disconnecting)
			).subscribe()
		}
	}

	protected render(): unknown {
		return html`
			<div ${ref(this.bannerRef)} class="banner fixed top-0 inset-x-0 z-50 p-2 pointer-events-none">
				<schmancy-surface
					${ref(this.surfaceRef)}
					type="error"
					rounded="all"
					elevation="3"
					class="mx-auto max-w-sm shadow-lg pointer-events-auto"
				>
					<div class="flex items-center gap-3 px-4 py-3">
						<span ${ref(this.iconRef)} class="text-2xl">🙀</span>
						<schmancy-typography type="body" token="md">
							<span ${ref(this.messageRef)}>You're offline</span>
						</schmancy-typography>
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-connectivity-status': SchmancyConnectivityStatus
	}
}
