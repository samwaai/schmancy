import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { theme } from '../../../src/theme'
import { takeUntil, tap } from 'rxjs'
import { $LitElement } from '@mixins/litElement.mixin'

@customElement('theme-service-demo')
export class ThemeServiceDemo extends $LitElement() {
	@state() private currentScheme: 'dark' | 'light' | 'auto' = 'auto'
	@state() private currentColor: string = '#6200ee'
	@state() private resolvedScheme: 'dark' | 'light' = 'light'
	@state() private isDark: boolean = false
	@state() private activityLog: string[] = []

	private presetColors = [
		{ name: 'Purple', value: '#6750A4' },
		{ name: 'Blue', value: '#0061A4' },
		{ name: 'Green', value: '#006E1C' },
		{ name: 'Orange', value: '#C4320A' },
		{ name: 'Pink', value: '#A8194D' },
	]

	connectedCallback() {
		super.connectedCallback()

		console.log('ThemeServiceDemo connected')
		console.log('theme.themeComponent:', theme.themeComponent)

		// Get initial state directly
		const comp = theme.themeComponent
		if (comp) {
			this.currentScheme = comp.scheme
			this.currentColor = comp.color
			this.addLog(`Found theme: ${comp.scheme}, ${comp.color}`)
		} else {
			this.addLog('No theme component!')
			// Try discovery
			theme.discoverTheme().subscribe(discovered => {
				console.log('Discovered:', discovered)
				if (discovered) {
					this.addLog(`Discovered: ${discovered.scheme}, ${discovered.color}`)
				}
			})
		}

		// Subscribe to changes
		theme.scheme$.pipe(
			tap(scheme => {
				this.currentScheme = scheme
				this.addLog(`Scheme: ${scheme}`)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		theme.color$.pipe(
			tap(color => {
				this.currentColor = color
				this.addLog(`Color: ${color}`)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		theme.resolvedScheme$.pipe(
			tap(scheme => this.resolvedScheme = scheme),
			takeUntil(this.disconnecting)
		).subscribe()

		theme.isDarkMode().pipe(
			tap(isDark => this.isDark = isDark),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	private addLog(message: string) {
		this.activityLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...this.activityLog.slice(0, 9)]
	}

	private clearLog() {
		this.activityLog = []
	}

	private handleColorChange(e: Event) {
		const input = e.target as HTMLInputElement
		theme.setColor(input.value)
	}

	private handleSchemeChange(scheme: 'dark' | 'light' | 'auto') {
		console.log('handleSchemeChange:', scheme)
		console.log('Before - themeComponent:', theme.themeComponent)
		this.addLog(`Calling setScheme(${scheme})`)
		theme.setScheme(scheme)
		console.log('After - themeComponent.scheme:', theme.themeComponent?.scheme)
	}

	private toggleTheme() {
		console.log('toggleTheme called')
		this.addLog('Calling toggleScheme()')
		theme.toggleScheme()
	}

	private setPresetColor(color: string) {
		console.log('setPresetColor:', color)
		this.addLog(`Calling setColor(${color})`)
		theme.setColor(color)
	}

	render() {
		return html`
			<div class="max-w-3xl space-y-6">
				<h1 class="text-3xl font-bold">Theme Service</h1>

				<!-- Current State -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<h2 class="text-xl font-semibold mb-4">Current State</h2>
					<div class="space-y-2 text-sm">
						<p>Scheme: <strong>${this.currentScheme}</strong></p>
						<p>Resolved: <strong>${this.resolvedScheme}</strong></p>
						<p>Dark Mode: <strong>${this.isDark ? 'Yes' : 'No'}</strong></p>
						<p class="flex items-center gap-2">
							Color: <strong>${this.currentColor}</strong>
							<span
								class="inline-block w-6 h-6 rounded border border-outline"
								style="background: ${this.currentColor}"
							></span>
						</p>
					</div>
				</schmancy-surface>

				<!-- Scheme -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<h2 class="text-xl font-semibold mb-4">Color Scheme</h2>
					<div class="flex gap-2 flex-wrap">
						<schmancy-button
							variant="${this.currentScheme === 'light' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('light')}"
						>
							Light
						</schmancy-button>
						<schmancy-button
							variant="${this.currentScheme === 'dark' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('dark')}"
						>
							Dark
						</schmancy-button>
						<schmancy-button
							variant="${this.currentScheme === 'auto' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('auto')}"
						>
							Auto
						</schmancy-button>
						<schmancy-button variant="tonal" @click="${this.toggleTheme}"> Toggle </schmancy-button>
					</div>
				</schmancy-surface>

				<!-- Color -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<h2 class="text-xl font-semibold mb-4">Primary Color</h2>
					<div class="flex gap-2 items-center mb-4">
						<input
							type="color"
							.value="${this.currentColor}"
							@change="${this.handleColorChange}"
							class="w-16 h-16 rounded cursor-pointer"
						/>
						<span class="text-sm">${this.currentColor}</span>
					</div>
					<div class="flex gap-2 flex-wrap">
						${this.presetColors.map(
							color => html`
								<button
									class="w-12 h-12 rounded border border-outline hover:scale-110 transition-transform"
									style="background: ${color.value}"
									@click="${() => this.setPresetColor(color.value)}"
									title="${color.name}"
								></button>
							`,
						)}
					</div>
				</schmancy-surface>

				<!-- Activity Log -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">Activity Log</h2>
						<schmancy-button variant="text" size="sm" @click="${this.clearLog}"> Clear </schmancy-button>
					</div>
					<schmancy-surface type="containerLow" rounded="all" class="p-4">
						${this.activityLog.length > 0
							? html`
									<div class="space-y-1 font-mono text-xs max-h-64 overflow-y-auto">
										${this.activityLog.map(log => html`<div class="py-1">${log}</div>`)}
									</div>
								`
							: html`<p class="text-sm opacity-50 text-center">No activity yet. Try changing settings!</p>`}
					</schmancy-surface>
				</schmancy-surface>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'theme-service-demo': ThemeServiceDemo
	}
}
