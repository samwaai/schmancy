import { $LitElement } from '@mixins/index'
import { $dialog } from '@schmancy/dialog'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-dialog-test')
export class DemoDialogTest extends $LitElement() {
  private openComponentDialog() {
    $dialog.component(
      html`
        <div class="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
          <div class="bg-indigo-600 text-white p-4">
            <h2 class="text-xl font-bold">Component Dialog</h2>
            <p>Using $dialog.component</p>
          </div>
          
          <div class="p-4">
            <p class="mb-4">This is using $dialog.component directly.</p>
            <p class="mb-4">There should be NO standard dialog buttons or headers.</p>
            <p class="mb-4">Testing dismiss functionality...</p>
          </div>
          
          <div class="p-4 border-t border-gray-200 flex justify-end gap-2">
            <schmancy-button 
              variant="outlined" 
              @click=${() => $dialog.dismiss()}
            >
              Test Close Button
            </schmancy-button>
          </div>
        </div>
      `,
      { width: '400px' }
    )
  }

  private openSimpleDialog() {
    $dialog.simple(
      html`
        <div class="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
          <div class="bg-indigo-600 text-white p-4">
            <h2 class="text-xl font-bold">Simple Dialog</h2>
            <p>Using $dialog.simple</p>
          </div>
          
          <div class="p-4">
            <p class="mb-4">This is using $dialog.simple which is just an alias for component.</p>
            <p class="mb-4">There should be NO standard dialog buttons or headers.</p>
          </div>
          
          <div class="p-4 border-t border-gray-200 flex justify-end gap-2">
            <schmancy-button 
              variant="outlined" 
              @click=${() => $dialog.dismiss()}
            >
              Custom Close
            </schmancy-button>
          </div>
        </div>
      `,
      { width: '400px' }
    )
  }

  private openConfirmDialog() {
    $dialog.confirm({
      title: "Standard Confirm Dialog",
      message: "This is a standard confirm dialog with buttons",
      confirmText: "OK",
      cancelText: "Cancel"
    })
  }

  render() {
    return html`
      <schmancy-surface type="container" fill="all" rounded="left" class="p-4">
        <schmancy-typography type="headline">Dialog Component Test</schmancy-typography>
        
        <div class="grid gap-6 mt-4">
          <div>
            <schmancy-typography type="title" class="mb-2">Component Dialog</schmancy-typography>
            <p class="mb-4">Test the direct component rendering with no buttons</p>
            <schmancy-button @click=${this.openComponentDialog}>Open Component Dialog</schmancy-button>
          </div>
          
          <div>
            <schmancy-typography type="title" class="mb-2">Simple Dialog</schmancy-typography>
            <p class="mb-4">Test the simple dialog function (should be identical to component)</p>
            <schmancy-button @click=${this.openSimpleDialog}>Open Simple Dialog</schmancy-button>
          </div>
          
          <div>
            <schmancy-typography type="title" class="mb-2">Standard Confirm</schmancy-typography>
            <p class="mb-4">For comparison, a standard confirm dialog WITH buttons</p>
            <schmancy-button @click=${this.openConfirmDialog}>Open Confirm Dialog</schmancy-button>
          </div>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-dialog-test': DemoDialogTest
  }
}