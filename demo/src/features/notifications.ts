import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { $notify } from '@schmancy/notification'

@customElement('notification-demo')
export default class NotificationDemo extends $LitElement() {
	static styles = css`
		/* You can add your Tailwind setup or additional custom styles here */
		.bg-background {
			background-color: #f5f5f5;
		}
		.text-onBackground {
			color: #333;
		}
		.btn {
			/* Default button styling (Tailwind-inspired) */
			padding: 0.5rem 1rem;
			border-radius: 0.5rem;
			font-weight: 500;
			transition: background-color 0.3s;
			background-color: #3b82f6;
			color: #fff;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			border: none;
			cursor: pointer;
		}
		.btn:hover {
			background-color: rgba(59, 130, 246, 0.9);
		}
		.btn.success {
			background-color: #4caf50;
		}
		.btn.error {
			background-color: #f44336;
		}
		.btn.warning {
			background-color: #ff9800;
			color: #000;
		}
		.btn.info {
			background-color: #2196f3;
		}
	`

	// Test 1: Screen corner notifications (no reference element used)
	triggerCornerNotification(position) {
		$notify.success('Centered anchor notification')
	}

	// Test 2: Element anchoring examples (no references)
	onMidScreenClick() {
		$notify.success('Centered anchor notification')
	}

	onEdgeElementClick() {
		$notify.warning('Edge element notification')
	}

	onNestedElementClick() {
		$notify.error('Nested element notification')
	}

	// Test 3: Notification type tests
	showTypeTest(type) {
		$notify[type](`${type.toUpperCase()}: This is a ${type} notification`, {
			duration: 2000,
		})
	}

	// Test 4: Stress tests
	triggerLongContent() {
		$notify.info(
			`This is a long content notification. It should wrap around and show the full content. This is a long content notification. It should wrap around and show the full content. This is a long content notification. It should wrap around and show the full content.`,
			{ duration: 4000 },
		)
	}

	triggerMultipleNotifications() {
		for (let i = 1; i <= 5; i++) {
			$notify.success(`Notification #${i}`, {
				duration: 3000,
			})
		}
	}

	render() {
		return html`
			<div class="p-4 min-h-screen bg-background">
				<h1 class="text-3xl font-bold mb-8 text-onBackground">Notification Positioning Tests</h1>

				<!-- Test Section: Screen Corners -->
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-4 text-onBackground">1. Screen Edge Cases</h2>
					<div class="grid grid-cols-2 gap-4">
						<button class="btn" @click=${() => this.triggerCornerNotification('top-left')}>Top-Left Corner</button>
						<button class="btn" @click=${() => this.triggerCornerNotification('top-right')}>Top-Right Corner</button>
						<button class="btn" @click=${() => this.triggerCornerNotification('bottom-left')}>
							Bottom-Left Corner
						</button>
						<button class="btn" @click=${() => this.triggerCornerNotification('bottom-right')}>
							Bottom-Right Corner
						</button>
					</div>
				</section>

				<!-- Test Section: Element Anchors -->
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-4 text-onBackground">2. Element Anchoring</h2>
					<div class="flex gap-4 flex-wrap">
						<button class="btn" @click=${this.onMidScreenClick.bind(this)}>Center Screen Anchor</button>
						<button
							class="btn"
							style="position: fixed; right: 10px; top: 50%;"
							@click=${this.onEdgeElementClick.bind(this)}
						>
							Edge Element Anchor
						</button>
						<div class="relative h-32 w-48 border-2 p-4">
							<button class="btn absolute bottom-2 right-2" @click=${this.onNestedElementClick.bind(this)}>
								Nested Element
							</button>
						</div>
					</div>
				</section>

				<!-- Test Section: Notification Types -->
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-4 text-onBackground">3. Notification Types</h2>
					<div class="flex gap-4">
						<button class="btn success" @click=${() => this.showTypeTest('success')}>Success Type</button>
						<button class="btn error" @click=${() => this.showTypeTest('error')}>Error Type</button>
						<button class="btn warning" @click=${() => this.showTypeTest('warning')}>Warning Type</button>
						<button class="btn info" @click=${() => this.showTypeTest('info')}>Info Type</button>
					</div>
				</section>

				<!-- Test Section: Stress Tests -->
				<section>
					<h2 class="text-xl font-semibold mb-4 text-onBackground">4. Stress Tests</h2>
					<div class="flex gap-4">
						<button class="btn" @click=${this.triggerLongContent.bind(this)}>Long Content Notification</button>
						<button class="btn" @click=${this.triggerMultipleNotifications.bind(this)}>
							Multiple Notifications (5x)
						</button>
					</div>
				</section>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'notification-demo': NotificationDemo
	}
}
