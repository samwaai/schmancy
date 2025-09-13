import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import '../../shared/installation-section'
import { area } from '@schmancy/area'

// ============================================================================
// Demo Components for Examples
// ============================================================================

// Simple page components
@customElement('demo-route-home')
class DemoRouteHome extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-8 text-center">
        <schmancy-icon size="72" class="text-primary mb-4">home</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">Home Page</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          Welcome to the home page. This component is rendered for the "/" route.
        </schmancy-typography>
      </div>
    `
  }
}

@customElement('demo-route-about')
class DemoRouteAbout extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-8 text-center">
        <schmancy-icon size="72" class="text-secondary mb-4">info</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">About Page</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          Learn more about us. This component is rendered for the "/about" route.
        </schmancy-typography>
      </div>
    `
  }
}

@customElement('demo-route-contact')
class DemoRouteContact extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-8 text-center">
        <schmancy-icon size="72" class="text-tertiary mb-4">mail</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">Contact Page</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          Get in touch with us. This component is rendered for the "/contact" route.
        </schmancy-typography>
      </div>
    `
  }
}

// Component with URL parameters
@customElement('demo-route-user')
class DemoRouteUser extends $LitElement(css`
  :host { display: block; }
`) {
  @property() userId?: string
  @property() tab?: string

  render() {
    return html`
      <div class="p-8">
        <schmancy-icon size="72" class="text-primary mb-4">person</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-4">User Profile</schmancy-typography>
        <schmancy-surface type="container" class="p-6 rounded-lg">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <schmancy-icon class="text-primary">badge</schmancy-icon>
              <strong>User ID:</strong> 
              <schmancy-badge>${this.userId || 'Not provided'}</schmancy-badge>
            </div>
            ${this.tab ? html`
              <div class="flex items-center gap-2">
                <schmancy-icon class="text-secondary">tab</schmancy-icon>
                <strong>Active Tab:</strong> 
                <schmancy-badge color="secondary">${this.tab}</schmancy-badge>
              </div>
            ` : ''}
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-4">
              URL parameters are automatically extracted and passed as properties to the component.
            </schmancy-typography>
          </div>
        </schmancy-surface>
      </div>
    `
  }
}

// Product component with multiple parameters
@customElement('demo-route-product')
class DemoRouteProduct extends $LitElement(css`
  :host { display: block; }
`) {
  @property() category?: string
  @property() productId?: string

  render() {
    return html`
      <div class="p-8">
        <schmancy-icon size="72" class="text-tertiary mb-4">shopping_cart</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-4">Product Details</schmancy-typography>
        <schmancy-surface type="container" class="p-6 rounded-lg">
          <div class="grid gap-4">
            <div>
              <strong>Category:</strong> 
              <schmancy-badge color="tertiary">${this.category || 'Unknown'}</schmancy-badge>
            </div>
            <div>
              <strong>Product ID:</strong> 
              <schmancy-badge color="secondary">${this.productId || 'Unknown'}</schmancy-badge>
            </div>
            <div>
              <strong>Full Path:</strong> 
              <code class="bg-surface-containerHigh px-2 py-1 rounded">
                /products/${this.category}/${this.productId}
              </code>
            </div>
          </div>
        </schmancy-surface>
      </div>
    `
  }
}

// Settings layout component for nested routing
@customElement('demo-route-settings-layout')
class DemoRouteSettingsLayout extends $LitElement(css`
  :host { display: block; }
`) {

  private navigateToTab(component: string) {
    area.push({ area: 'settings-nested', component });
  }

  render() {
    return html`
      <div class="p-8">
        <schmancy-typography type="headline" token="lg" class="mb-6">Settings</schmancy-typography>
        
        <!-- Settings navigation -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="md:col-span-1">
            <schmancy-surface type="container" class="p-4 rounded-lg">
              <nav class="space-y-2">
                <schmancy-button 
                  variant="text" 
                  class="w-full justify-start"
                  @click=${() => this.navigateToTab('demo-route-profile-settings')}
                >
                  <schmancy-icon>person</schmancy-icon>
                  Profile
                </schmancy-button>
                <schmancy-button 
                  variant="text" 
                  class="w-full justify-start"
                  @click=${() => this.navigateToTab('demo-route-security-settings')}
                >
                  <schmancy-icon>security</schmancy-icon>
                  Security
                </schmancy-button>
                <schmancy-button 
                  variant="text" 
                  class="w-full justify-start"
                  @click=${() => this.navigateToTab('demo-route-notification-settings')}
                >
                  <schmancy-icon>notifications</schmancy-icon>
                  Notifications
                </schmancy-button>
              </nav>
            </schmancy-surface>
          </div>
          
          <div class="md:col-span-3">
            <schmancy-surface type="surfaceDim" class="p-6 rounded-lg min-h-[300px]">
              <!-- Nested area with default to prevent re-initialization -->
              <schmancy-area name="settings-nested" default="demo-route-profile-settings"></schmancy-area>
            </schmancy-surface>
          </div>
        </div>
      </div>
    `
  }
}

// Settings sub-pages
@customElement('demo-route-profile-settings')
class DemoRouteProfileSettings extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div>
        <schmancy-typography type="title" token="md" class="mb-4">Profile Settings</schmancy-typography>
        <div class="space-y-4">
          <schmancy-input .label=${'Display Name'} value="John Doe"></schmancy-input>
          <schmancy-input .label=${'Email'} value="john@example.com"></schmancy-input>
          <schmancy-input .label=${'Bio'} type="textarea"></schmancy-input>
        </div>
      </div>
    `
  }
}

@customElement('demo-route-security-settings')
class DemoRouteSecuritySettings extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div>
        <schmancy-typography type="title" token="md" class="mb-4">Security Settings</schmancy-typography>
        <div class="space-y-4">
          <schmancy-input .label=${'Current Password'} type="password"></schmancy-input>
          <schmancy-input .label=${'New Password'} type="password"></schmancy-input>
          <schmancy-checkbox label="Enable two-factor authentication"></schmancy-checkbox>
        </div>
      </div>
    `
  }
}

@customElement('demo-route-notification-settings')
class DemoRouteNotificationSettings extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div>
        <schmancy-typography type="title" token="md" class="mb-4">Notification Settings</schmancy-typography>
        <div class="space-y-4">
          <schmancy-checkbox label="Email notifications" checked></schmancy-checkbox>
          <schmancy-checkbox label="Push notifications" checked></schmancy-checkbox>
          <schmancy-checkbox label="SMS notifications"></schmancy-checkbox>
          <schmancy-checkbox label="Marketing emails"></schmancy-checkbox>
        </div>
      </div>
    `
  }
}

// Components for guard demo
@customElement('demo-route-admin')
class DemoRouteAdmin extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-8 text-center">
        <schmancy-icon size="72" class="text-error mb-4">admin_panel_settings</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">Admin Dashboard</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          Protected route - only accessible when authenticated
        </schmancy-typography>
      </div>
    `
  }
}

@customElement('demo-route-login')
class DemoRouteLogin extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-8 text-center">
        <schmancy-icon size="72" class="text-primary mb-4">lock</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">Login Required</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-4">
          You were redirected here because authentication is required
        </schmancy-typography>
        <schmancy-button variant="filled" @click=${() => {
          // Simulate login
          (window as any).demoAuth = true
          area.push({ area: 'demo-guards', component: 'demo-route-admin' })
        }}>
          <schmancy-icon>login</schmancy-icon>
          Simulate Login
        </schmancy-button>
      </div>
    `
  }
}

// Mini app components
@customElement('demo-mini-app-layout')
class DemoMiniAppLayout extends $LitElement(css`
  :host { display: block; }
`) {
  @state() private currentPath = 'home'

  render() {
    return html`
      <div class="border border-outline rounded-lg overflow-hidden">
        <!-- App header -->
        <schmancy-surface type="container" class="p-4 border-b border-outline">
          <div class="flex items-center justify-between">
            <schmancy-typography type="title" token="md">Mini Blog App</schmancy-typography>
            <div class="flex gap-2">
              <schmancy-button
                variant=${this.currentPath === 'home' ? 'filled' : 'text'}
                @click=${() => this.navigate('home', 'demo-mini-app-posts')}
              >
                Posts
              </schmancy-button>
              <schmancy-button
                variant=${this.currentPath === 'authors' ? 'filled' : 'text'}
                @click=${() => this.navigate('authors', 'demo-mini-app-authors')}
              >
                Authors
              </schmancy-button>
              <schmancy-button
                variant=${this.currentPath === 'about' ? 'filled' : 'text'}
                @click=${() => this.navigate('about', 'demo-mini-app-about')}
              >
                About
              </schmancy-button>
            </div>
          </div>
        </schmancy-surface>
        
        <!-- App content -->
        <div class="min-h-[400px]">
          <schmancy-area name="mini-app-content" default="demo-mini-app-posts">
            <schmancy-route when="home" .component=${'demo-mini-app-posts'} exact></schmancy-route>
            <schmancy-route when="post" .component=${'demo-mini-app-post-detail'}></schmancy-route>
            <schmancy-route when="authors" .component=${'demo-mini-app-authors'}></schmancy-route>
            <schmancy-route when="author" .component=${'demo-mini-app-author-detail'}></schmancy-route>
            <schmancy-route when="about" .component=${'demo-mini-app-about'}></schmancy-route>
          </schmancy-area>
        </div>
      </div>
    `
  }

  private navigate(segment: string, component: string) {
    this.currentPath = segment
    area.push({ area: 'mini-app-content', component })
  }
}

@customElement('demo-mini-app-posts')
class DemoMiniAppPosts extends $LitElement(css`
  :host { display: block; }
`) {
  private posts = [
    { id: '1', title: 'Getting Started with Web Components', author: 'Jane Doe', date: '2024-01-15' },
    { id: '2', title: 'Advanced Routing Patterns', author: 'John Smith', date: '2024-01-14' },
    { id: '3', title: 'State Management Best Practices', author: 'Alice Johnson', date: '2024-01-13' }
  ]

  render() {
    return html`
      <div class="p-6">
        <schmancy-typography type="headline" token="md" class="mb-4">Recent Posts</schmancy-typography>
        <div class="space-y-3">
          ${this.posts.map(post => html`
            <schmancy-surface 
              type="container" 
              class="p-4 rounded-lg cursor-pointer hover:elevation-2 transition-all"
              @click=${() => area.push({ 
                area: 'mini-app-content', 
                component: 'demo-mini-app-post-detail',
                params: { postId: post.id, postTitle: post.title }
              })}
            >
              <schmancy-typography type="title" token="sm">${post.title}</schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                By ${post.author} • ${post.date}
              </schmancy-typography>
            </schmancy-surface>
          `)}
        </div>
      </div>
    `
  }
}

@customElement('demo-mini-app-post-detail')
class DemoMiniAppPostDetail extends $LitElement(css`
  :host { display: block; }
`) {
  @property() postId?: string
  @property() postTitle?: string

  render() {
    return html`
      <div class="p-6">
        <schmancy-button 
          variant="text" 
          @click=${() => area.push({ area: 'mini-app-content', component: 'demo-mini-app-posts' })}
          class="mb-4"
        >
          <schmancy-icon>arrow_back</schmancy-icon>
          Back to Posts
        </schmancy-button>
        
        <schmancy-typography type="headline" token="lg" class="mb-4">
          ${this.postTitle || `Post ${this.postId}`}
        </schmancy-typography>
        
        <schmancy-surface type="container" class="p-6 rounded-lg">
          <schmancy-typography type="body" token="md" class="text-surface-onVariant">
            This is the full content of post #${this.postId}. In a real application, this would load
            the complete article content, comments, and related posts.
          </schmancy-typography>
        </schmancy-surface>
      </div>
    `
  }
}

@customElement('demo-mini-app-authors')
class DemoMiniAppAuthors extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-6">
        <schmancy-typography type="headline" token="md" class="mb-4">Authors</schmancy-typography>
        <div class="grid gap-3">
          ${['Jane Doe', 'John Smith', 'Alice Johnson'].map((author, i) => html`
            <schmancy-surface type="container" class="p-4 rounded-lg">
              <schmancy-typography type="title" token="sm">${author}</schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                ${3 - i} posts published
              </schmancy-typography>
            </schmancy-surface>
          `)}
        </div>
      </div>
    `
  }
}

@customElement('demo-mini-app-author-detail')
class DemoMiniAppAuthorDetail extends $LitElement(css`
  :host { display: block; }
`) {
  @property() authorId?: string

  render() {
    return html`
      <div class="p-6">
        <schmancy-typography type="headline" token="lg">Author Profile</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          Author details for ID: ${this.authorId}
        </schmancy-typography>
      </div>
    `
  }
}

@customElement('demo-mini-app-about')
class DemoMiniAppAbout extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-6 text-center">
        <schmancy-icon size="72" class="text-primary mb-4">info</schmancy-icon>
        <schmancy-typography type="headline" token="lg" class="mb-2">About Mini Blog</schmancy-typography>
        <schmancy-typography type="body" token="md" class="text-surface-onVariant">
          A demonstration of nested routing with Schmancy Area components
        </schmancy-typography>
      </div>
    `
  }
}

// ============================================================================
// Main Demo Component
// ============================================================================

@customElement('demo-area-routing')
export class DemoAreaRouting extends $LitElement(css`
  :host {
    display: block;
  }
  
  .demo-container {
    min-height: 350px;
    background: var(--schmancy-sys-color-surface-container);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--schmancy-sys-color-outline-variant);
  }
  
`) {
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header Section -->
        <div class="mb-12">
          <schmancy-typography type="display" token="lg" class="mb-4 block">
            Nested Area Routing
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant block mb-6">
            Powerful declarative routing system with URL parameters, guards, and nested routes
          </schmancy-typography>
          
          <!-- Feature badges -->
          <div class="flex flex-wrap gap-2">
            <schmancy-badge color="primary">Declarative Routes</schmancy-badge>
            <schmancy-badge color="secondary">URL Parameters</schmancy-badge>
            <schmancy-badge color="tertiary">Nested Routing</schmancy-badge>
            <schmancy-badge color="success">Route Guards</schmancy-badge>
            <schmancy-badge color="warning">Redirects</schmancy-badge>
          </div>
        </div>

        <!-- Installation Section -->
        <installation-section></installation-section>

        <!-- Import Section -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
import '@mhmo91/schmancy/area'
import { area } from '@mhmo91/schmancy/area'
import { SchmancyRoute } from '@mhmo91/schmancy/area/route.component'
          </schmancy-code-preview>
        </div>

        <!-- Examples Section -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Interactive Examples</schmancy-typography>
        
        <!-- Example 1: Basic Declarative Routing -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              1. Basic Declarative Routing
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              Define routes declaratively using schmancy-route elements
            </schmancy-typography>
          </div>

          <!-- Demo -->
          <div class="demo-container mb-6">
            <schmancy-area name="demo-basic-routing">
              <schmancy-route when="home" .component=${'demo-route-home'} exact></schmancy-route>
              <schmancy-route when="about" .component=${'demo-route-about'}></schmancy-route>
              <schmancy-route when="contact" .component=${'demo-route-contact'}></schmancy-route>
            </schmancy-area>
          </div>

          <!-- Controls -->
          <div class="flex gap-2 mb-6">
            <schmancy-button variant="filled" @click=${() => this.navigateBasic('home')}>
              <schmancy-icon>home</schmancy-icon>
              Home
            </schmancy-button>
            <schmancy-button variant="filled tonal" @click=${() => this.navigateBasic('about')}>
              <schmancy-icon>info</schmancy-icon>
              About
            </schmancy-button>
            <schmancy-button variant="filled tonal" @click=${() => this.navigateBasic('contact')}>
              <schmancy-icon>mail</schmancy-icon>
              Contact
            </schmancy-button>
          </div>

          <!-- Code -->
          <schmancy-code-preview language="html">
&lt;schmancy-area name="main"&gt;
  &lt;schmancy-route
    when="home"
    .component=${'${HomeComponent}'}
    exact
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="about"
    .component=${'${AboutComponent}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="contact"
    .component=${'${ContactComponent}'}
  &gt;&lt;/schmancy-route&gt;
&lt;/schmancy-area&gt;
          </schmancy-code-preview>
        </schmancy-surface>

        <!-- Example 2: URL Parameters -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              2. URL Parameter Extraction
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              Extract parameters from URLs using :param syntax
            </schmancy-typography>
          </div>

          <!-- Demo -->
          <div class="demo-container mb-6">
            <schmancy-area name="demo-params">
              <schmancy-route
                when="users"
                .component=${'demo-route-user'}
              ></schmancy-route>
              <schmancy-route
                when="products"
                .component=${'demo-route-product'}
              ></schmancy-route>
            </schmancy-area>
          </div>

          <!-- Controls -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <schmancy-button variant="outlined" @click=${() => this.navigateParams('/users/123')}>
              Navigate to /users/123
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateParams('/users/456/settings')}>
              Navigate to /users/456/settings
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateParams('/products/electronics/laptop-001')}>
              Navigate to /products/electronics/laptop-001
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateParams('/products/books/isbn-123456')}>
              Navigate to /products/books/isbn-123456
            </schmancy-button>
          </div>

          <!-- Code -->
          <schmancy-code-preview language="html">
&lt;!-- Route definition --&gt;
&lt;schmancy-route
  when="users"
  .component=${'${UserComponent}'}
&gt;&lt;/schmancy-route&gt;

&lt;!-- Product route --&gt;
&lt;schmancy-route
  when="products"
  .component=${'${ProductComponent}'}
&gt;&lt;/schmancy-route&gt;

&lt;!-- Parameters passed programmatically --&gt;
area.push({
  area: 'main',
  component: UserComponent,
  params: { userId: '123' }
})
          </schmancy-code-preview>
        </schmancy-surface>

        <!-- Example 3: Nested Routing -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              3. Nested Routing
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              Create complex navigation hierarchies with nested areas
            </schmancy-typography>
          </div>

          <!-- Demo -->
          <div class="demo-container mb-6">
            <schmancy-area name="demo-nested" default="demo-route-settings-layout"></schmancy-area>
          </div>

          <!-- Code -->
          <schmancy-code-preview language="html">
&lt;!-- Parent area --&gt;
&lt;schmancy-area name="app"&gt;
  &lt;schmancy-route
    when="settings"
    .component=${'${SettingsLayout}'}
  &gt;&lt;/schmancy-route&gt;
&lt;/schmancy-area&gt;

&lt;!-- Inside SettingsLayout component --&gt;
&lt;schmancy-area name="settings-content"&gt;
  &lt;schmancy-route
    when="profile"
    .component=${'${ProfileSettings}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="security"
    .component=${'${SecuritySettings}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="notifications"
    .component=${'${NotificationSettings}'}
  &gt;&lt;/schmancy-route&gt;
&lt;/schmancy-area&gt;
          </schmancy-code-preview>
        </schmancy-surface>

        <!-- Example 4: Route Guards and Redirects -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              4. Route Guards & Redirects
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              Protect routes with guards and handle authentication redirects
            </schmancy-typography>
          </div>

          <!-- Demo -->
          <div class="demo-container mb-6">
            <schmancy-area name="demo-guards">
              <schmancy-route
                when="admin"
                .component=${'demo-route-admin'}
                .guard=${() => (window as any).demoAuth === true ? true : '/login'}
              ></schmancy-route>
              <schmancy-route
                when="login"
                .component=${'demo-route-login'}
              ></schmancy-route>
            </schmancy-area>
          </div>

          <!-- Controls -->
          <div class="flex gap-3 mb-6">
            <schmancy-button
              variant="filled"
              @click=${() => this.navigateGuarded('/admin')}
            >
              <schmancy-icon>admin_panel_settings</schmancy-icon>
              Try Admin (Protected)
            </schmancy-button>
            <schmancy-button 
              variant="outlined"
              @click=${() => {
                (window as any).demoAuth = false
                area.pop('demo-guards')
              }}
            >
              <schmancy-icon>logout</schmancy-icon>
              Reset Auth
            </schmancy-button>
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant self-center">
              Auth Status: ${(window as any).demoAuth ? 'Logged In ✓' : 'Logged Out ✗'}
            </schmancy-typography>
          </div>

          <!-- Code -->
          <schmancy-code-preview language="html">
&lt;schmancy-route
  when="admin"
  .component=${'${AdminComponent}'}
  .guard=${'${() => isAuthenticated() ? true : "/login"}'}
&gt;&lt;/schmancy-route&gt;

&lt;!-- Guards with redirect object --&gt;
&lt;schmancy-route
  when="premium"
  .component=${'${PremiumContent}'}
  .guard=${'${async () => {'}
    ${'const user = await fetchUser()'}
    ${'return user.isPremium ? true : { redirect: "/upgrade" }'}
  ${'}}'}
&gt;&lt;/schmancy-route&gt;
          </schmancy-code-preview>
        </schmancy-surface>

        <!-- Example 5: Integration with Imperative Navigation -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              5. Mixing Declarative & Imperative
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              Use area.push() alongside declarative routes for maximum flexibility
            </schmancy-typography>
          </div>

          <!-- Code Examples -->
          <div class="grid gap-4">
            <schmancy-code-preview language="javascript">
// Imperative navigation still works
area.push({
  area: 'main',
  component: 'user-profile',
  params: { id: '123' }
})

// Navigate with state
area.push({
  area: 'main',
  component: ProductDetails,
  state: {
    product: productData,
    returnUrl: '/products'
  }
})
            </schmancy-code-preview>

            <schmancy-code-preview language="javascript">
// Clear an area
area.pop('main')

// Subscribe to area changes
area.on('main').subscribe(({ component, params }) => {
})

// Get current state
const state = area.getState('main')
            </schmancy-code-preview>
          </div>
        </schmancy-surface>

        <!-- Example 6: Complete Mini App -->
        <schmancy-surface type="surfaceDim" rounded="all" class="p-6 mb-8">
          <div class="mb-6">
            <schmancy-typography type="headline" token="md" class="mb-2 block">
              6. Complete Mini App Example
            </schmancy-typography>
            <schmancy-typography type="body" token="md" class="text-surface-onVariant block">
              A fully functional blog app demonstrating all routing features
            </schmancy-typography>
          </div>

          <!-- Demo -->
          <demo-mini-app-layout></demo-mini-app-layout>

          <!-- Code -->
          <div class="mt-6">
            <schmancy-code-preview language="html">
&lt;!-- Main app layout --&gt;
&lt;schmancy-area name="app-content" default="posts-list"&gt;
  &lt;!-- Blog routes --&gt;
  &lt;schmancy-route
    when="posts"
    .component=${'${PostsList}'}
    exact
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="post"
    .component=${'${PostDetail}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="authors"
    .component=${'${AuthorsList}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;schmancy-route
    when="author"
    .component=${'${AuthorDetail}'}
  &gt;&lt;/schmancy-route&gt;

  &lt;!-- Protected admin routes --&gt;
  &lt;schmancy-route
    when="admin"
    .component=${'${AdminDashboard}'}
    .guard=${'${() => checkAdminAuth() ? true : "/login"}'}
  &gt;&lt;/schmancy-route&gt;
&lt;/schmancy-area&gt;
            </schmancy-code-preview>
          </div>
        </schmancy-surface>

        <!-- API Reference -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">API Reference</schmancy-typography>
          
          <!-- SchmancyRoute Properties -->
          <schmancy-surface type="container" rounded="all" class="overflow-hidden mb-6">
            <div class="p-4 bg-primary text-primary-on">
              <schmancy-typography type="title" token="md">SchmancyRoute Properties</schmancy-typography>
            </div>
            <table class="w-full">
              <thead>
                <tr class="border-b border-outline">
                  <th class="text-left p-4">Property</th>
                  <th class="text-left p-4">Type</th>
                  <th class="text-left p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-outline-variant">
                  <td class="p-4"><code>when</code></td>
                  <td class="p-4">string</td>
                  <td class="p-4">Route segment to match</td>
                </tr>
                <tr class="border-b border-outline-variant">
                  <td class="p-4"><code>component</code></td>
                  <td class="p-4">any</td>
                  <td class="p-4">Component to render (string name or constructor)</td>
                </tr>
                <tr class="border-b border-outline-variant">
                  <td class="p-4"><code>exact</code></td>
                  <td class="p-4">boolean</td>
                  <td class="p-4">Require exact path match (default: false)</td>
                </tr>
                <tr>
                  <td class="p-4"><code>guard</code></td>
                  <td class="p-4">() => boolean | string | {redirect}</td>
                  <td class="p-4">Route guard function that can return true (allow), false (block), string (redirect path), or redirect object</td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>

          <!-- Best Practices -->
          <schmancy-surface type="container" rounded="all" class="p-6">
            <schmancy-typography type="title" token="md" class="mb-4">Best Practices</schmancy-typography>
            <div class="space-y-3">
              <div class="flex gap-3">
                <schmancy-icon class="text-success">check_circle</schmancy-icon>
                <schmancy-typography type="body" token="md">
                  Use <code>exact</code> for root paths to prevent unwanted matches
                </schmancy-typography>
              </div>
              <div class="flex gap-3">
                <schmancy-icon class="text-success">check_circle</schmancy-icon>
                <schmancy-typography type="body" token="md">
                  Place more specific routes before generic ones
                </schmancy-typography>
              </div>
              <div class="flex gap-3">
                <schmancy-icon class="text-success">check_circle</schmancy-icon>
                <schmancy-typography type="body" token="md">
                  Use route guards for authentication and authorization
                </schmancy-typography>
              </div>
              <div class="flex gap-3">
                <schmancy-icon class="text-success">check_circle</schmancy-icon>
                <schmancy-typography type="body" token="md">
                  Combine declarative routes with imperative navigation for complex flows
                </schmancy-typography>
              </div>
              <div class="flex gap-3">
                <schmancy-icon class="text-success">check_circle</schmancy-icon>
                <schmancy-typography type="body" token="md">
                  Use nested areas for sub-navigation within components
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>
      </schmancy-surface>
    `
  }

  private navigateBasic(segment: string) {
    const componentMap: Record<string, string> = {
      'home': 'demo-route-home',
      'about': 'demo-route-about',
      'contact': 'demo-route-contact'
    }
    area.push({ area: 'demo-basic-routing', component: componentMap[segment] })
  }

  private navigateParams(path: string) {
    const match = path.match(/\/users\/(\d+)(?:\/(\w+))?/)
    const productMatch = path.match(/\/products\/(\w+)\/(.+)/)
    
    if (match) {
      area.push({ 
        area: 'demo-params', 
        component: 'demo-route-user',
        params: { userId: match[1], tab: match[2] }
      })
    } else if (productMatch) {
      area.push({ 
        area: 'demo-params', 
        component: 'demo-route-product',
        params: { category: productMatch[1], productId: productMatch[2] }
      })
    }
  }

  private navigateGuarded(path: string) {
    if (path === '/admin') {
      const isAuth = (window as any).demoAuth === true
      if (isAuth) {
        area.push({ area: 'demo-guards', component: 'demo-route-admin' })
      } else {
        area.push({ area: 'demo-guards', component: 'demo-route-login' })
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    // Clean up demo areas
    const areas = [
      'demo-basic-routing',
      'demo-params',
      'demo-nested',
      'demo-guards',
      'settings-nested',
      'mini-app-content'
    ]
    areas.forEach(name => {
      if (area.hasArea(name)) {
        area.pop(name)
      }
    })
    // Clean auth state
    delete (window as any).demoAuth
  }
}

// Register all components
declare global {
  interface HTMLElementTagNameMap {
    'demo-area-routing': DemoAreaRouting
    'demo-route-home': DemoRouteHome
    'demo-route-about': DemoRouteAbout
    'demo-route-contact': DemoRouteContact
    'demo-route-user': DemoRouteUser
    'demo-route-product': DemoRouteProduct
    'demo-route-settings-layout': DemoRouteSettingsLayout
    'demo-route-profile-settings': DemoRouteProfileSettings
    'demo-route-security-settings': DemoRouteSecuritySettings
    'demo-route-notification-settings': DemoRouteNotificationSettings
    'demo-route-admin': DemoRouteAdmin
    'demo-route-login': DemoRouteLogin
    'demo-mini-app-layout': DemoMiniAppLayout
    'demo-mini-app-posts': DemoMiniAppPosts
    'demo-mini-app-post-detail': DemoMiniAppPostDetail
    'demo-mini-app-authors': DemoMiniAppAuthors
    'demo-mini-app-author-detail': DemoMiniAppAuthorDetail
    'demo-mini-app-about': DemoMiniAppAbout
  }
}