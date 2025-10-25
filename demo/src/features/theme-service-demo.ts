import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { theme } from '@mhmo91/schmancy/theme'
import { takeUntil, tap } from 'rxjs'
import { $LitElement } from '@mhmo91/schmancy/mixins'
import { repeat } from 'lit/directives/repeat.js'

@customElement('theme-service-demo')
export class ThemeServiceDemo extends $LitElement() {
	@state() private currentScheme: 'dark' | 'light' | 'auto' = 'auto'
	@state() private currentColor: string = '#6200ee'
	@state() private resolvedScheme: 'dark' | 'light' = 'light'
	@state() private isDark: boolean = false
	@state() private isFullscreen: boolean = false
	@state() private activityLog: string[] = []
	@state() private watchedVariables: Map<string, string> = new Map()

	// Material Design 3 color presets grouped by category
	private presetColors = [
		// Primary colors
		{ name: 'Material Purple', value: '#6750A4', category: 'Primary' },
		{ name: 'Material Blue', value: '#0061A4', category: 'Primary' },
		{ name: 'Material Teal', value: '#006A6A', category: 'Primary' },
		{ name: 'Material Indigo', value: '#3F51B5', category: 'Primary' },

		// Accent colors
		{ name: 'Material Green', value: '#006E1C', category: 'Accent' },
		{ name: 'Material Orange', value: '#C4320A', category: 'Accent' },
		{ name: 'Material Pink', value: '#A8194D', category: 'Accent' },
		{ name: 'Material Amber', value: '#FFB300', category: 'Accent' },

		// Extended colors
		{ name: 'Deep Ocean', value: '#006874', category: 'Extended' },
		{ name: 'Forest', value: '#2E7D32', category: 'Extended' },
		{ name: 'Sunset', value: '#E65100', category: 'Extended' },
		{ name: 'Royal', value: '#4A148C', category: 'Extended' },
	]

	// CSS variables to watch for demonstration
	private variablesToWatch = [
		'sys-color-primary-default',
		'sys-color-surface-default',
		'sys-color-surface-container',
		'sys-color-outline'
	]

	connectedCallback() {
		super.connectedCallback()

		// Get initial state directly
		const comp = theme.themeComponent
		if (comp) {
			this.currentScheme = comp.scheme
			this.currentColor = comp.color
			this.addLog(`Found theme: ${comp.scheme}, ${comp.color}`)
		} else {
			this.addLog('No theme component, discovering...')
			// Try discovery
			theme.discoverTheme().pipe(
				tap(discovered => {
					if (discovered) {
						this.addLog(`Discovered: ${discovered.scheme}, ${discovered.color}`)
					}
				}),
				takeUntil(this.disconnecting)
			).subscribe()
		}

		// Subscribe to scheme changes
		theme.scheme$.pipe(
			tap(scheme => {
				this.currentScheme = scheme
				this.addLog(`Scheme changed: ${scheme}`)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to color changes
		theme.color$.pipe(
			tap(color => {
				this.currentColor = color
				this.addLog(`Color changed: ${color}`)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to resolved scheme (auto resolution)
		theme.resolvedScheme$.pipe(
			tap(scheme => {
				this.resolvedScheme = scheme
				if (this.currentScheme === 'auto') {
					this.addLog(`Auto resolved to: ${scheme}`)
				}
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to dark mode state
		theme.isDarkMode().pipe(
			tap(isDark => this.isDark = isDark),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to fullscreen state
		theme.fullscreen$.pipe(
			tap(fullscreen => {
				this.isFullscreen = fullscreen
				if (fullscreen) {
					this.addLog('Fullscreen mode enabled')
				} else {
					this.addLog('Fullscreen mode disabled')
				}
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Watch CSS variables for changes
		this.variablesToWatch.forEach(varName => {
			theme.watchCSSVariable(varName).pipe(
				tap(value => {
					if (value) {
						this.watchedVariables.set(varName, value)
						this.requestUpdate()
					}
				}),
				takeUntil(this.disconnecting)
			).subscribe()
		})

		// Initialize watched variables
		this.variablesToWatch.forEach(varName => {
			const value = theme.getCSSVariable(varName)
			if (value) {
				this.watchedVariables.set(varName, value)
			}
		})
	}

	private addLog(message: string) {
		this.activityLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...this.activityLog.slice(0, 14)]
	}

	private clearLog() {
		this.activityLog = []
		this.addLog('Activity log cleared')
	}

	private handleColorChange(e: Event) {
		const input = e.target as HTMLInputElement
		this.addLog(`Setting color: ${input.value}`)
		theme.setColor(input.value)
	}

	private handleSchemeChange(scheme: 'dark' | 'light' | 'auto') {
		this.addLog(`Setting scheme: ${scheme}`)
		theme.setScheme(scheme)
	}

	private toggleTheme() {
		this.addLog('Toggling scheme')
		theme.toggleScheme()
	}

	private setPresetColor(color: string, name: string) {
		this.addLog(`Setting preset: ${name} (${color})`)
		theme.setColor(color)
	}

	private toggleFullscreen() {
		this.addLog(`Toggling fullscreen`)
		theme.toggleFullscreen()
	}

	private rediscoverTheme() {
		this.addLog('Rediscovering theme...')
		theme.discoverTheme().pipe(
			tap(discovered => {
				if (discovered) {
					this.addLog(`Rediscovered: ${discovered.scheme}, ${discovered.color}`)
				} else {
					this.addLog('No theme component found')
				}
			}),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	private updateThemeMultiple() {
		const newScheme = this.currentScheme === 'dark' ? 'light' : 'dark'
		const newColor = '#FF5722'
		this.addLog(`Batch update: scheme=${newScheme}, color=${newColor}`)
		theme.next({
			scheme: newScheme,
			color: newColor
		})
	}

	render() {
		// Group colors by category
		const colorsByCategory = this.presetColors.reduce((acc, color) => {
			const cat = color.category || 'Other'
			if (!acc[cat]) acc[cat] = []
			acc[cat].push(color)
			return acc
		}, {} as Record<string, typeof this.presetColors>)

		return html`
			<div class="max-w-5xl space-y-6">
				<!-- Header -->
				<div>
					<schmancy-typography type="display" token="md" class="mb-2 block">
						Theme Service Demo
					</schmancy-typography>
					<schmancy-typography type="body" token="lg" class="text-surface-onVariant block">
						Comprehensive showcase of all theme service features and utilities
					</schmancy-typography>
				</div>

				<!-- Current Theme State -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<schmancy-surface elevation="1" rounded="all" class="p-6">
						<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
							<schmancy-icon size="sm" class="text-primary-default">palette</schmancy-icon>
							Current Theme State
						</schmancy-typography>
						<div class="space-y-3">
							<div class="flex justify-between items-center">
								<span class="text-sm text-surface-onVariant">Scheme:</span>
								<schmancy-chip type="${this.currentScheme === 'auto' ? 'assist' : 'suggestion'}">
									${this.currentScheme}
								</schmancy-chip>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-surface-onVariant">Resolved:</span>
								<schmancy-chip type="suggestion">${this.resolvedScheme}</schmancy-chip>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-surface-onVariant">Dark Mode:</span>
								<schmancy-chip type="${this.isDark ? 'input' : 'suggestion'}">
									${this.isDark ? 'Active' : 'Inactive'}
								</schmancy-chip>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-surface-onVariant">Fullscreen:</span>
								<schmancy-chip type="${this.isFullscreen ? 'input' : 'suggestion'}">
									${this.isFullscreen ? 'Enabled' : 'Disabled'}
								</schmancy-chip>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-surface-onVariant">Primary Color:</span>
								<div class="flex items-center gap-2">
									<code class="text-xs bg-surface-containerLow px-2 py-1 rounded">
										${this.currentColor}
									</code>
									<span
										class="inline-block w-8 h-8 rounded-full border-2 border-outline"
										style="background: ${this.currentColor}"
									></span>
								</div>
							</div>
						</div>
					</schmancy-surface>

					<!-- Theme Observables -->
					<schmancy-surface elevation="1" rounded="all" class="p-6">
						<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
							<schmancy-icon size="sm" class="text-primary-default">visibility</schmancy-icon>
							Observable Properties
						</schmancy-typography>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.scheme$</code>
							</div>
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.color$</code>
							</div>
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.resolvedScheme$</code>
							</div>
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.isDarkMode()</code>
							</div>
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.fullscreen$</code>
							</div>
							<div class="flex items-center gap-2">
								<schmancy-icon size="xs">check_circle</schmancy-icon>
								<code class="text-xs">theme.theme$</code>
							</div>
						</div>
					</schmancy-surface>
				</div>

				<!-- Scheme Controls -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">contrast</schmancy-icon>
						Color Scheme Controls
					</schmancy-typography>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
						<schmancy-button
							variant="${this.currentScheme === 'light' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('light')}"
						>
							<schmancy-icon slot="start">light_mode</schmancy-icon>
							Light
						</schmancy-button>
						<schmancy-button
							variant="${this.currentScheme === 'dark' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('dark')}"
						>
							<schmancy-icon slot="start">dark_mode</schmancy-icon>
							Dark
						</schmancy-button>
						<schmancy-button
							variant="${this.currentScheme === 'auto' ? 'filled' : 'outlined'}"
							@click="${() => this.handleSchemeChange('auto')}"
						>
							<schmancy-icon slot="start">brightness_auto</schmancy-icon>
							Auto
						</schmancy-button>
						<schmancy-button variant="tonal" @click="${this.toggleTheme}">
							<schmancy-icon slot="start">swap_horiz</schmancy-icon>
							Toggle
						</schmancy-button>
					</div>
				</schmancy-surface>

				<!-- Primary Color Selection -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">color_lens</schmancy-icon>
						Primary Color Selection
					</schmancy-typography>

					<!-- Custom color picker -->
					<div class="flex items-center gap-4 mb-6">
						<input
							type="color"
							.value="${this.currentColor}"
							@change="${this.handleColorChange}"
							class="w-20 h-20 rounded-lg cursor-pointer border-2 border-outline"
						/>
						<div class="flex-1">
							<schmancy-typography type="label" token="lg" class="block mb-1">
								Custom Color
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
								Click to choose any color
							</schmancy-typography>
						</div>
					</div>

					<!-- Preset colors by category -->
					${Object.entries(colorsByCategory).map(([category, colors]) => html`
						<div class="mb-4">
							<schmancy-typography type="label" token="md" class="block mb-2 text-surface-onVariant">
								${category} Colors
							</schmancy-typography>
							<div class="grid grid-cols-4 md:grid-cols-8 gap-2">
								${colors.map(color => html`
									<button
										class="group relative p-2 rounded-lg border border-outline hover:border-primary-default transition-all hover:scale-110"
										style="background: ${color.value}"
										@click="${() => this.setPresetColor(color.value, color.name)}"
										title="${color.name}"
									>
										<span class="sr-only">${color.name}</span>
										<div class="absolute inset-x-0 -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
											<span class="text-xs bg-surface-containerHighest px-1 py-0.5 rounded whitespace-nowrap">
												${color.name}
											</span>
										</div>
									</button>
								`)}
							</div>
						</div>
					`)}
				</schmancy-surface>

				<!-- Advanced Features -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">science</schmancy-icon>
						Advanced Features
					</schmancy-typography>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						<schmancy-button variant="outlined" @click="${this.toggleFullscreen}">
							<schmancy-icon slot="start">fullscreen</schmancy-icon>
							Toggle Fullscreen
						</schmancy-button>
						<schmancy-button variant="outlined" @click="${this.rediscoverTheme}">
							<schmancy-icon slot="start">search</schmancy-icon>
							Rediscover Theme
						</schmancy-button>
						<schmancy-button variant="outlined" @click="${this.updateThemeMultiple}">
							<schmancy-icon slot="start">sync</schmancy-icon>
							Batch Update
						</schmancy-button>
					</div>
				</schmancy-surface>

				<!-- CSS Variables Watcher -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">code</schmancy-icon>
						Live CSS Variables
					</schmancy-typography>
					<schmancy-surface type="containerLow" rounded="all" class="p-4">
						<div class="space-y-2 font-mono text-xs">
							${Array.from(this.watchedVariables.entries()).map(([name, value]) => html`
								<div class="flex items-center gap-2">
									<code class="flex-1">--schmancy-${name}:</code>
									<div class="flex items-center gap-2">
										<code>${value}</code>
										${value.startsWith('#') ? html`
											<span
												class="inline-block w-6 h-6 rounded border border-outline"
												style="background: ${value}"
											></span>
										` : ''}
									</div>
								</div>
							`)}
						</div>
					</schmancy-surface>
				</schmancy-surface>

				<!-- Activity Log -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<div class="flex justify-between items-center mb-4">
						<schmancy-typography type="headline" token="sm" class="flex items-center gap-2">
							<schmancy-icon size="sm" class="text-primary-default">history</schmancy-icon>
							Activity Log
						</schmancy-typography>
						<schmancy-button variant="text" size="sm" @click="${this.clearLog}">
							<schmancy-icon slot="start">clear</schmancy-icon>
							Clear
						</schmancy-button>
					</div>
					<schmancy-surface type="containerLow" rounded="all" class="p-4">
						${this.activityLog.length > 0
							? html`
									<div class="space-y-1 font-mono text-xs max-h-64 overflow-y-auto">
										${repeat(
											this.activityLog,
											(log, index) => `${log}-${index}`,
											log => html`
												<div class="py-1 px-2 hover:bg-surface-containerHigh rounded">
													${log}
												</div>
											`
										)}
									</div>
								`
							: html`
								<schmancy-typography type="body" token="sm" class="text-center text-surface-onVariant">
									No activity yet. Try changing theme settings above!
								</schmancy-typography>
							`}
					</schmancy-surface>
				</schmancy-surface>

				<!-- Nested Theme Isolation -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">layers</schmancy-icon>
						Nested Theme Isolation
					</schmancy-typography>
					<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant">
						Each nested theme maintains its own independent color and scheme, demonstrating proper isolation.
					</schmancy-typography>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<schmancy-theme color="#e91e63" scheme="light">
							<schmancy-surface class="p-6 text-center" type="container" rounded="all">
								<schmancy-icon class="text-6xl mb-2">palette</schmancy-icon>
								<schmancy-typography type="headline" token="sm" class="mb-1">Pink Light</schmancy-typography>
								<schmancy-typography type="body" token="xs" class="text-surface-onVariant">#e91e63</schmancy-typography>
							</schmancy-surface>
						</schmancy-theme>

						<schmancy-theme color="#2196f3" scheme="dark">
							<schmancy-surface class="p-6 text-center" type="container" rounded="all">
								<schmancy-icon class="text-6xl mb-2">palette</schmancy-icon>
								<schmancy-typography type="headline" token="sm" class="mb-1">Blue Dark</schmancy-typography>
								<schmancy-typography type="body" token="xs" class="text-surface-onVariant">#2196f3</schmancy-typography>
							</schmancy-surface>
						</schmancy-theme>

						<schmancy-theme color="#4caf50" scheme="light">
							<schmancy-surface class="p-6 text-center" type="container" rounded="all">
								<schmancy-icon class="text-6xl mb-2">palette</schmancy-icon>
								<schmancy-typography type="headline" token="sm" class="mb-1">Green Light</schmancy-typography>
								<schmancy-typography type="body" token="xs" class="text-surface-onVariant">#4caf50</schmancy-typography>
							</schmancy-surface>
						</schmancy-theme>
					</div>
				</schmancy-surface>

				<!-- API Reference -->
				<schmancy-surface elevation="1" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="sm" class="mb-4 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary-default">api</schmancy-icon>
						API Methods Reference
					</schmancy-typography>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<schmancy-typography type="label" token="md" class="block mb-2 text-primary-default">
								Setters
							</schmancy-typography>
							<div class="space-y-1 text-xs font-mono">
								<div>theme.setScheme(scheme)</div>
								<div>theme.setColor(color)</div>
								<div>theme.toggleScheme()</div>
								<div>theme.setFullscreen(value)</div>
								<div>theme.toggleFullscreen()</div>
								<div>theme.next({...})</div>
							</div>
						</div>
						<div>
							<schmancy-typography type="label" token="md" class="block mb-2 text-primary-default">
								Getters & Utilities
							</schmancy-typography>
							<div class="space-y-1 text-xs font-mono">
								<div>theme.getCSSVariable(name)</div>
								<div>theme.watchCSSVariable(name)</div>
								<div>theme.isDarkMode()</div>
								<div>theme.discoverTheme()</div>
								<div>theme.scheme / color / fullscreen</div>
							</div>
						</div>
					</div>
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
