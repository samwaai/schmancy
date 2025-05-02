import { $LitElement } from '@mixins/index'
import { $dialog } from '@schmancy/dialog'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-dialog')
export class DemoDialog extends $LitElement(css`
  :host {
    display: block;
  }
  
  .custom-component {
    padding: 20px;
  }
`) {
  private openBasicDialog() {
    $dialog.confirm({
      title: 'Basic Dialog',
      message: 'This is a basic confirmation dialog with title and buttons.',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    })
  }
  
  private openCustomDialog() {
    $dialog.component(
      html`
        <div class="custom-component">
          <h2 class="text-xl font-bold mb-4">Custom Dialog Component</h2>
          <p class="mb-4">This dialog uses a custom component with standard dialog header and actions.</p>
          <schmancy-button 
            variant="outlined" 
            @click=${() => $dialog.dismiss()}
          >
            Close Dialog
          </schmancy-button>
        </div>
      `,
      {
        hideActions: false,
        title: 'Custom Component Dialog',
        confirmText: 'Save',
        cancelText: 'Cancel'
      }
    )
  }
  
  private openRawComponentDialog() {
    $dialog.component(
      html`
        <schmancy-dialog-content>
          <div style="padding: 0; margin: 0; height: 100%;">
            <div style="background-color: #4f46e5; color: white; padding: 16px;">
              <h2 class="text-xl font-bold">Raw Component Dialog</h2>
              <p>This dialog has no standard wrapper elements</p>
            </div>
            
            <div style="padding: 16px;">
              <p class="mb-4">This example shows a dialog without any standard dialog chrome.</p>
              <p class="mb-4">It renders the component directly without any padding, header, or action buttons.</p>
              
              <div class="flex justify-end mt-4">
                <schmancy-button 
                  variant="outlined" 
                  @click=${() => $dialog.dismiss()}
                >
                  Close
                </schmancy-button>
              </div>
            </div>
          </div>
        </schmancy-dialog-content>
      `,
      {
        hideActions: true, // This is key to completely hide the buttons
        width: '400px'
      }
    )
  }

  render() {
    return html`
      <schmancy-surface type="container" fill="all" rounded="left" class="p-4">
        <schmancy-typography type="headline">Dialog Components</schmancy-typography>
        
        <div class="grid gap-6 mt-4">
          <div>
            <schmancy-typography type="title" class="mb-2">Standard Dialog</schmancy-typography>
            <p class="mb-4">A standard dialog with title, message, and action buttons.</p>
            <schmancy-button @click=${this.openBasicDialog}>Open Standard Dialog</schmancy-button>
          </div>

          <div>
            <schmancy-typography type="title" class="mb-2">Custom Component Dialog</schmancy-typography>
            <p class="mb-4">A dialog with custom component content but standard dialog header and actions.</p>
            <schmancy-button @click=${this.openCustomDialog}>Open Custom Component Dialog</schmancy-button>
          </div>

          <div>
            <schmancy-typography type="title" class="mb-2">Raw Component Dialog</schmancy-typography>
            <p class="mb-4">A dialog that renders a component directly without any wrapper elements.</p>
            <schmancy-button @click=${this.openRawComponentDialog}>Open Raw Component Dialog</schmancy-button>
          </div>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-dialog': DemoDialog
  }
}