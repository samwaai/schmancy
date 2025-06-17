import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-context')
export class DemoContext extends TailwindElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Context
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A powerful state management system for sharing data across components. Provides reactive context values that automatically update all consumers when changed.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import { SchmancyContext } from '@mhmo91/schmancy/context'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Method</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Parameters</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Returns</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">new SchmancyContext()</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">defaultValue: T</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">Context&lt;T&gt;</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Create a new context with default value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">context.Provider</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">value: T</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">ContextProvider</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Provider component to supply context value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">context.Consumer</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">render: (value: T) => TemplateResult</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">ContextConsumer</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Consumer component to access context value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">consume()</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">context: Context&lt;T&gt;</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">PropertyDecorator</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Decorator to consume context in a property</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					<schmancy-grid gap="lg" class="w-full">
						
						<!-- Basic Context Setup -->
						<schmancy-code-preview language="javascript">
// Create a context
import { SchmancyContext } from '@mhmo91/schmancy/context'

// Define your context type
interface UserContext {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

// Create context with default value
export const userContext = new SchmancyContext<UserContext>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
})
						</schmancy-code-preview>

						<!-- Provider Pattern -->
						<schmancy-code-preview language="javascript">
// Create a provider component
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { userContext } from './user-context'

@customElement('app-root')
class AppRoot extends LitElement {
  @state() private user: User | null = null

  login = (user: User) => {
    this.user = user
    // Update context will trigger re-renders
  }

  logout = () => {
    this.user = null
  }

  render() {
    const contextValue = {
      user: this.user,
      isAuthenticated: !!this.user,
      login: this.login,
      logout: this.logout
    }

    return html\`
      <\${userContext.Provider} .value=\${contextValue}>
        <app-header></app-header>
        <app-main></app-main>
        <app-footer></app-footer>
      </\${userContext.Provider}>
    \`
  }
}
						</schmancy-code-preview>

						<!-- Consumer Component -->
						<schmancy-code-preview language="javascript">
// Consume context using decorator
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@mhmo91/schmancy/context'
import { userContext } from './user-context'

@customElement('user-profile')
class UserProfile extends LitElement {
  @consume({ context: userContext })
  userCtx!: UserContext

  render() {
    if (!this.userCtx.isAuthenticated) {
      return html\`<p>Please log in to view profile</p>\`
    }

    return html\`
      <div class="profile">
        <h2>Welcome, \${this.userCtx.user.name}!</h2>
        <p>Email: \${this.userCtx.user.email}</p>
        <schmancy-button @click=\${this.userCtx.logout}>
          Logout
        </schmancy-button>
      </div>
    \`
  }
}
						</schmancy-code-preview>

						<!-- Theme Context Example -->
						<schmancy-code-preview language="javascript">
// Theme context for dark/light mode
interface ThemeContext {
  mode: 'light' | 'dark'
  primary: string
  toggleTheme: () => void
}

const themeContext = new SchmancyContext<ThemeContext>({
  mode: 'light',
  primary: '#1976d2',
  toggleTheme: () => {}
})

// Theme provider
@customElement('theme-provider')
class ThemeProvider extends LitElement {
  @state() mode: 'light' | 'dark' = 'light'
  @state() primary = '#1976d2'

  toggleTheme = () => {
    this.mode = this.mode === 'light' ? 'dark' : 'light'
    document.body.classList.toggle('dark', this.mode === 'dark')
  }

  render() {
    return html\`
      <\${themeContext.Provider} .value=\${{
        mode: this.mode,
        primary: this.primary,
        toggleTheme: this.toggleTheme
      }}>
        <slot></slot>
      </\${themeContext.Provider}>
    \`
  }
}

// Theme consumer
@customElement('theme-toggle')
class ThemeToggle extends LitElement {
  @consume({ context: themeContext })
  theme!: ThemeContext

  render() {
    return html\`
      <schmancy-button @click=\${this.theme.toggleTheme}>
        <schmancy-icon>
          \${this.theme.mode === 'light' ? 'dark_mode' : 'light_mode'}
        </schmancy-icon>
      </schmancy-button>
    \`
  }
}
						</schmancy-code-preview>

						<!-- Shopping Cart Context -->
						<schmancy-code-preview language="javascript">
// E-commerce cart context
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContext {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const cartContext = new SchmancyContext<CartContext>({
  items: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
})

// Cart provider with persistence
@customElement('cart-provider')
class CartProvider extends LitElement {
  @state() items: CartItem[] = []

  connectedCallback() {
    super.connectedCallback()
    // Load cart from localStorage
    const saved = localStorage.getItem('cart')
    if (saved) {
      this.items = JSON.parse(saved)
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  }

  private get total() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    )
  }

  addItem = (newItem: CartItem) => {
    const existing = this.items.find(item => item.id === newItem.id)
    if (existing) {
      existing.quantity += newItem.quantity
      this.items = [...this.items]
    } else {
      this.items = [...this.items, newItem]
    }
    this.saveCart()
  }

  removeItem = (id: string) => {
    this.items = this.items.filter(item => item.id !== id)
    this.saveCart()
  }

  updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      this.removeItem(id)
      return
    }
    const item = this.items.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
      this.items = [...this.items]
      this.saveCart()
    }
  }

  clearCart = () => {
    this.items = []
    this.saveCart()
  }

  render() {
    return html\`
      <\${cartContext.Provider} .value=\${{
        items: this.items,
        total: this.total,
        addItem: this.addItem,
        removeItem: this.removeItem,
        updateQuantity: this.updateQuantity,
        clearCart: this.clearCart
      }}>
        <slot></slot>
      </\${cartContext.Provider}>
    \`
  }
}
						</schmancy-code-preview>

						<!-- Notification Context -->
						<schmancy-code-preview language="javascript">
// Global notification system
interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
}

interface NotificationContext {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
}

const notificationContext = new SchmancyContext<NotificationContext>({
  notifications: [],
  showNotification: () => {},
  dismissNotification: () => {}
})

// Notification provider
@customElement('notification-provider')
class NotificationProvider extends LitElement {
  @state() notifications: Notification[] = []

  showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID()
    const newNotification = { ...notification, id }
    
    this.notifications = [...this.notifications, newNotification]
    
    // Auto dismiss after duration
    if (notification.duration) {
      setTimeout(() => {
        this.dismissNotification(id)
      }, notification.duration)
    }
  }

  dismissNotification = (id: string) => {
    this.notifications = this.notifications.filter(n => n.id !== id)
  }

  render() {
    return html\`
      <\${notificationContext.Provider} .value=\${{
        notifications: this.notifications,
        showNotification: this.showNotification,
        dismissNotification: this.dismissNotification
      }}>
        <slot></slot>
        <notification-container></notification-container>
      </\${notificationContext.Provider}>
    \`
  }
}

// Use in any component
@customElement('submit-form')
class SubmitForm extends LitElement {
  @consume({ context: notificationContext })
  notifications!: NotificationContext

  async handleSubmit() {
    try {
      await api.submitForm(this.formData)
      this.notifications.showNotification({
        type: 'success',
        message: 'Form submitted successfully!',
        duration: 3000
      })
    } catch (error) {
      this.notifications.showNotification({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      })
    }
  }
}
						</schmancy-code-preview>

						<!-- Multi-Context Pattern -->
						<schmancy-code-preview language="javascript">
// Combining multiple contexts
@customElement('app-providers')
class AppProviders extends LitElement {
  render() {
    return html\`
      <theme-provider>
        <auth-provider>
          <cart-provider>
            <notification-provider>
              <slot></slot>
            </notification-provider>
          </cart-provider>
        </auth-provider>
      </theme-provider>
    \`
  }
}

// Component using multiple contexts
@customElement('header-cart-button')
class HeaderCartButton extends LitElement {
  @consume({ context: cartContext })
  cart!: CartContext

  @consume({ context: userContext })
  user!: UserContext

  @consume({ context: themeContext })
  theme!: ThemeContext

  render() {
    if (!this.user.isAuthenticated) {
      return html\`\`
    }

    return html\`
      <schmancy-button 
        variant="text"
        @click=\${this.openCart}
      >
        <schmancy-icon>shopping_cart</schmancy-icon>
        <schmancy-badge 
          .value=\${this.cart.items.length}
          .show=\${this.cart.items.length > 0}
        ></schmancy-badge>
      </schmancy-button>
    \`
  }
}
						</schmancy-code-preview>

						<!-- Context with RxJS -->
						<schmancy-code-preview language="javascript">
// Advanced context with RxJS observables
import { BehaviorSubject } from 'rxjs'

interface AppState {
  user: User | null
  preferences: UserPreferences
  notifications: Notification[]
}

class StateContext {
  private state$ = new BehaviorSubject<AppState>({
    user: null,
    preferences: defaultPreferences,
    notifications: []
  })

  // Selectors
  user$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  )

  preferences$ = this.state$.pipe(
    map(state => state.preferences),
    distinctUntilChanged()
  )

  // Actions
  updateUser(user: User | null) {
    this.state$.next({
      ...this.state$.value,
      user
    })
  }

  updatePreferences(preferences: Partial<UserPreferences>) {
    this.state$.next({
      ...this.state$.value,
      preferences: {
        ...this.state$.value.preferences,
        ...preferences
      }
    })
  }
}

// Create context
const stateContext = new SchmancyContext(new StateContext())

// Use in component
@customElement('user-preferences')
class UserPreferences extends LitElement {
  @consume({ context: stateContext })
  state!: StateContext

  @state() preferences?: UserPreferences
  private subscription?: Subscription

  connectedCallback() {
    super.connectedCallback()
    this.subscription = this.state.preferences$.subscribe(
      prefs => this.preferences = prefs
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.subscription?.unsubscribe()
  }

  updateTheme(theme: string) {
    this.state.updatePreferences({ theme })
  }
}
						</schmancy-code-preview>

					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-context': DemoContext
	}
}