import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TailwindElement } from '@mixins/tailwind.mixin'

@customElement('demo-feedback-progress')
export class DemoFeedbackProgress extends TailwindElement() {
  @state() private dynamicProgress = 0
  @state() private isRunning = false

  private startProgress() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.dynamicProgress = 0
    
    const interval = setInterval(() => {
      this.dynamicProgress += 10
      
      if (this.dynamicProgress >= 100) {
        this.dynamicProgress = 100
        this.isRunning = false
        clearInterval(interval)
      }
    }, 500)
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Progress
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          A horizontal progress indicator that shows the completion status of a task or process.
        </schmancy-typography>

        <installation-section
          package="@schmancy/progress"
          imports="import '@schmancy/progress'"
        ></installation-section>

        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            import '@schmancy/progress'
          </schmancy-code-preview>
        </div>

        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-md overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-outlineVariant">
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="lg">Property</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="lg">Type</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="lg">Default</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="lg">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-outlineVariant">
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">value</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <code class="text-primary bg-surface-containerHighest px-1 rounded">number</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">0</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Current progress value</schmancy-typography>
                  </td>
                </tr>
                <tr class="border-b border-outlineVariant">
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">max</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <code class="text-primary bg-surface-containerHighest px-1 rounded">number</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">100</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Maximum progress value</schmancy-typography>
                  </td>
                </tr>
                <tr class="border-b border-outlineVariant">
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">size</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <code class="text-primary bg-surface-containerHighest px-1 rounded">'sm' | 'md' | 'lg'</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">'md'</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Height of the progress bar</schmancy-typography>
                  </td>
                </tr>
                <tr class="border-b border-outlineVariant">
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">color</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <code class="text-primary bg-surface-containerHighest px-1 rounded">'primary' | 'secondary' | 'tertiary' | 'error' | 'success'</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">'primary'</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Color scheme of the progress bar</schmancy-typography>
                  </td>
                </tr>
                <tr>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">indeterminate</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <code class="text-primary bg-surface-containerHighest px-1 rounded">boolean</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="md">false</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Shows animated progress when value is unknown</schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>
        </div>

        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
          <schmancy-grid gap="lg" class="w-full">
            <schmancy-code-preview title="Basic Progress">
              <schmancy-progress value="30" max="100"></schmancy-progress>
            </schmancy-code-preview>

            <schmancy-code-preview title="Different Sizes">
              <div class="space-y-4">
                <schmancy-progress value="50" max="100" size="sm"></schmancy-progress>
                <schmancy-progress value="50" max="100" size="md"></schmancy-progress>
                <schmancy-progress value="50" max="100" size="lg"></schmancy-progress>
              </div>
            </schmancy-code-preview>

            <schmancy-code-preview title="Color Variants">
              <div class="space-y-4">
                <schmancy-progress value="60" max="100" color="primary"></schmancy-progress>
                <schmancy-progress value="60" max="100" color="secondary"></schmancy-progress>
                <schmancy-progress value="60" max="100" color="tertiary"></schmancy-progress>
                <schmancy-progress value="60" max="100" color="success"></schmancy-progress>
                <schmancy-progress value="60" max="100" color="error"></schmancy-progress>
              </div>
            </schmancy-code-preview>

            <schmancy-code-preview title="Indeterminate Progress">
              <schmancy-progress indeterminate></schmancy-progress>
            </schmancy-code-preview>

            <schmancy-code-preview title="Custom Values">
              <div class="space-y-4">
                <schmancy-progress value="25" max="50"></schmancy-progress>
                <schmancy-progress value="750" max="1000"></schmancy-progress>
              </div>
            </schmancy-code-preview>

            <schmancy-code-preview title="Progress with Labels">
              <div class="space-y-2">
                <div class="flex justify-between mb-1">
                  <schmancy-typography type="label" token="sm">Upload Progress</schmancy-typography>
                  <schmancy-typography type="label" token="sm">75%</schmancy-typography>
                </div>
                <schmancy-progress value="75" max="100" color="success"></schmancy-progress>
              </div>
            </schmancy-code-preview>

            <schmancy-code-preview title="Dynamic Progress">
              <div class="space-y-4">
                <div class="flex justify-between mb-2">
                  <schmancy-typography type="label" token="sm">Processing Files</schmancy-typography>
                  <schmancy-typography type="label" token="sm">${this.dynamicProgress}%</schmancy-typography>
                </div>
                <schmancy-progress 
                  value="${this.dynamicProgress}" 
                  max="100" 
                  color="${this.dynamicProgress === 100 ? 'success' : 'primary'}"
                ></schmancy-progress>
                <schmancy-button 
                  @click="${() => this.startProgress()}"
                  ?disabled="${this.isRunning}"
                  variant="filled"
                >
                  ${this.isRunning ? 'Processing...' : 'Start Progress'}
                </schmancy-button>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-feedback-progress': DemoFeedbackProgress
  }
}