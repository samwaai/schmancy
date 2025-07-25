# Schmancy Sheet - AI Reference

The sheet component provides a sliding panel overlay that can be used for forms, details views, or any content that needs to be displayed in a drawer-style interface.

```js
// Import Options
import { sheet } from '@mhmo91/schmancy';  // Legacy import
import { $sheet } from '@mhmo91/schmancy'; // New recommended import

// Sheet Service API
$sheet.open({
  component: HTMLElement | TemplateResult,  // Content to display
  uid?: string,                            // Unique identifier for the sheet
  position?: 'side' | 'bottom',           // Position (default: responsive based on screen size)
  persist?: boolean,                       // Keep sheet in DOM after closing (default: false)
  close?: () => void,                      // Callback when sheet closes
  lock?: boolean,                          // Prevent dismissal via ESC/overlay click (default: false)
  handleHistory?: boolean,                 // Integrate with browser back button (default: true)
  title?: string,                          // Sheet title
  header?: 'hidden' | 'visible'           // Header visibility (default: 'visible')
}) -> void

// Service Methods
$sheet.dismiss(uid?: string)    // Close specific sheet or most recent if no uid
$sheet.isOpen(uid: string)      // Check if a sheet is open
$sheet.closeAll()              // Close all open sheets

// Position Enum
SchmancySheetPosition.Side     // Side panel (desktop)
SchmancySheetPosition.Bottom   // Bottom sheet (mobile)

// Sheet Component (Direct Usage)
<schmancy-sheet
  uid="unique-id"
  position="side|bottom"
  open?
  persist?
  lock?
  handleHistory?
  title="Sheet Title"
  header="visible|hidden"
  @close=${handleClose}>
  
  <!-- Main content goes in default slot -->
  <div>Sheet content goes here</div>
</schmancy-sheet>

// Sheet Header Component
<schmancy-sheet-header
  title="Sheet Title"
  @close=${handleClose}>
  <schmancy-icon-button slot="trailing">more_vert</schmancy-icon-button>
</schmancy-sheet-header>

// Examples

// 1. Basic Sheet with Form
$sheet.open({
  component: html`
    <div class="p-6">
      <schmancy-typography type="headline" token="md" class="mb-4">
        User Details
      </schmancy-typography>
      <schmancy-form>
        <schmancy-input label="Name" value="John Doe"></schmancy-input>
        <schmancy-input label="Email" value="john@example.com"></schmancy-input>
        <schmancy-button type="submit">Save</schmancy-button>
      </schmancy-form>
    </div>
  `,
  title: "Edit User"
});

// 2. Using HTMLElement Component
const myComponent = document.createElement('my-custom-element');
$sheet.open({
  component: myComponent,
  uid: 'my-custom-element', // Will reuse existing sheet if already open
  persist: true,            // Keep in DOM after closing
  title: "Custom Component"
});

// 3. Sheet with Lock (cannot be dismissed by ESC or clicking outside)
$sheet.open({
  component: html`
    <div class="p-6">
      <schmancy-typography type="body" token="lg">
        This action requires confirmation. Please complete the form.
      </schmancy-typography>
      <schmancy-button @click=${() => $sheet.dismiss()}>
        Complete Action
      </schmancy-button>
    </div>
  `,
  lock: true,
  title: "Required Action"
});

// 4. Bottom Sheet (Mobile Pattern)
$sheet.open({
  component: html`
    <schmancy-list>
      <schmancy-list-item @click=${() => handleShare('email')}>
        <schmancy-icon slot="start">email</schmancy-icon>
        Share via Email
      </schmancy-list-item>
      <schmancy-list-item @click=${() => handleShare('link')}>
        <schmancy-icon slot="start">link</schmancy-icon>
        Copy Link
      </schmancy-list-item>
    </schmancy-list>
  `,
  position: 'bottom',
  title: "Share"
});

// 5. Programmatic Control
// Open a sheet and store reference
const uid = 'settings-sheet';
$sheet.open({
  component: html`<settings-panel></settings-panel>`,
  uid: uid,
  title: "Settings"
});

// Check if open
if ($sheet.isOpen(uid)) {
  console.log('Settings sheet is open');
}

// Close specific sheet
$sheet.dismiss(uid);

// Close all sheets
$sheet.closeAll();

// 6. Sheet with Custom Close Handler
$sheet.open({
  component: html`
    <div class="p-6">
      <schmancy-form @submit=${async (e) => {
        const values = e.detail.values;
        await saveData(values);
        $sheet.dismiss(); // Close after save
      }}>
        <schmancy-input name="title" label="Title" required></schmancy-input>
        <schmancy-textarea name="description" label="Description"></schmancy-textarea>
        <div class="flex gap-2 mt-4">
          <schmancy-button type="submit">Save</schmancy-button>
          <schmancy-button type="button" variant="text" @click=${() => $sheet.dismiss()}>
            Cancel
          </schmancy-button>
        </div>
      </schmancy-form>
    </div>
  `,
  title: "New Item",
  close: () => {
    // Optional cleanup when sheet closes
    console.log('Sheet closed');
  }
});

// 7. Responsive Sheet (auto-adjusts position)
$sheet.open({
  component: html`<product-details .product=${product}></product-details>`,
  // Position will be 'side' on desktop, 'bottom' on mobile
  title: "Product Details"
});

// 8. No Browser History Integration
$sheet.open({
  component: html`<quick-actions></quick-actions>`,
  handleHistory: false, // Won't add to browser history
  title: "Quick Actions"
});

// 9. Hidden Header
$sheet.open({
  component: html`
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <schmancy-typography type="headline" token="sm">Custom Header</schmancy-typography>
        <schmancy-icon-button @click=${() => $sheet.dismiss()}>close</schmancy-icon-button>
      </div>
      <div>Content with custom header layout</div>
    </div>
  `,
  header: 'hidden' // Hide default header
});

// 10. Sheet with Loading State
class ProductEditor extends LitElement {
  @state() loading = false;
  
  async saveProduct(values) {
    this.loading = true;
    try {
      await api.saveProduct(values);
      $sheet.dismiss();
    } finally {
      this.loading = false;
    }
  }
  
  render() {
    return html`
      <schmancy-form @submit=${(e) => this.saveProduct(e.detail.values)}>
        <schmancy-input name="name" label="Product Name" required></schmancy-input>
        <schmancy-input name="price" label="Price" type="number" required></schmancy-input>
        <schmancy-button type="submit" .loading=${this.loading}>
          Save Product
        </schmancy-button>
      </schmancy-form>
    `;
  }
}

$sheet.open({
  component: new ProductEditor(),
  uid: 'product-editor',
  title: "Edit Product"
});

// 11. Nested Sheets
$sheet.open({
  component: html`
    <div class="p-6">
      <schmancy-button @click=${() => {
        // Open another sheet on top
        $sheet.open({
          component: html`<color-picker @select=${(e) => {
            selectedColor = e.detail.color;
            $sheet.dismiss('color-picker');
          }}></color-picker>`,
          uid: 'color-picker',
          title: "Choose Color"
        });
      }}>
        Select Color
      </schmancy-button>
    </div>
  `,
  uid: 'main-settings',
  title: "Settings"
});

// Advanced Patterns

// Pattern: Confirmation Sheet
function confirmAction(message, onConfirm) {
  $sheet.open({
    component: html`
      <div class="p-6">
        <schmancy-typography type="body" token="lg" class="mb-4">
          ${message}
        </schmancy-typography>
        <div class="flex gap-2 justify-end">
          <schmancy-button variant="text" @click=${() => $sheet.dismiss()}>
            Cancel
          </schmancy-button>
          <schmancy-button variant="filled" @click=${() => {
            onConfirm();
            $sheet.dismiss();
          }}>
            Confirm
          </schmancy-button>
        </div>
      </div>
    `,
    lock: true,
    position: 'bottom',
    title: "Confirm Action"
  });
}

// Pattern: Form Sheet with Validation
class FormSheet extends LitElement {
  @state() errors = {};
  
  async handleSubmit(e) {
    const values = e.detail.values;
    
    // Validate
    this.errors = this.validate(values);
    if (Object.keys(this.errors).length > 0) {
      e.preventDefault();
      return;
    }
    
    // Save and close
    await this.save(values);
    $sheet.dismiss();
  }
  
  render() {
    return html`
      <schmancy-form @submit=${this.handleSubmit}>
        <schmancy-input 
          name="email" 
          label="Email" 
          type="email"
          .error=${this.errors.email}
          required>
        </schmancy-input>
        <!-- More fields -->
      </schmancy-form>
    `;
  }
}

// Pattern: Wizard/Multi-step Sheet
class WizardSheet extends LitElement {
  @state() currentStep = 0;
  steps = ['Basic Info', 'Details', 'Review'];
  
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }
  
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  render() {
    return html`
      <div class="p-6">
        <schmancy-steps .items=${this.steps} .current=${this.currentStep}></schmancy-steps>
        
        <div class="mt-6">
          ${this.renderStep()}
        </div>
        
        <div class="flex justify-between mt-6">
          <schmancy-button 
            variant="text" 
            @click=${this.prevStep}
            ?disabled=${this.currentStep === 0}>
            Previous
          </schmancy-button>
          <schmancy-button 
            @click=${this.currentStep === this.steps.length - 1 ? this.submit : this.nextStep}>
            ${this.currentStep === this.steps.length - 1 ? 'Submit' : 'Next'}
          </schmancy-button>
        </div>
      </div>
    `;
  }
}

// Best Practices

// 1. Always provide a title for accessibility
$sheet.open({
  component: content,
  title: "Descriptive Title" // Required for screen readers
});

// 2. Use uid for singleton sheets
// Bad: Opens multiple sheets
button.addEventListener('click', () => {
  $sheet.open({ component: html`<settings-panel></settings-panel>` });
});

// Good: Reuses existing sheet
button.addEventListener('click', () => {
  $sheet.open({ 
    component: html`<settings-panel></settings-panel>`,
    uid: 'settings' // Only one settings sheet will be open
  });
});

// 3. Clean up resources on close
$sheet.open({
  component: html`<video-player></video-player>`,
  close: () => {
    // Stop video playback, clear timers, etc.
    videoPlayer.cleanup();
  }
});

// 4. Use appropriate positions
// Desktop: side sheets for forms and details
// Mobile: bottom sheets for actions and options
const position = window.innerWidth < 768 ? 'bottom' : 'side';
$sheet.open({ component, position });

// 5. Handle errors gracefully
try {
  await saveData();
  $sheet.dismiss();
} catch (error) {
  showNotification({ message: 'Save failed', type: 'error' });
  // Don't close sheet on error
}

// Common Issues & Solutions

// Issue: Sheet content is cut off
// Solution: Ensure content has proper padding and scrolling
html`
  <div class="p-6 overflow-y-auto max-h-[80vh]">
    <!-- Long content -->
  </div>
`

// Issue: Form submission closes sheet prematurely  
// Solution: Prevent default and handle async
html`
  <schmancy-form @submit=${async (e) => {
    e.preventDefault(); // Important!
    await handleSubmit(e.detail.values);
    $sheet.dismiss();
  }}>
`

// Issue: Multiple sheets open at once
// Solution: Use closeAll() before opening new sheet
$sheet.closeAll();
$sheet.open({ component: newContent });

// Integration with Other Components

// With Dialog Service
import { dialog } from '@mhmo91/schmancy';

async function deleteItem(id) {
  const confirmed = await dialog.confirm({
    title: 'Delete Item?',
    message: 'This action cannot be undone.'
  });
  
  if (confirmed) {
    await api.delete(id);
    $sheet.dismiss(); // Close the sheet after deletion
  }
}

// With Notification Service  
import { notification } from '@mhmo91/schmancy';

$sheet.open({
  component: html`
    <schmancy-form @submit=${async (e) => {
      try {
        await api.save(e.detail.values);
        notification.success('Saved successfully');
        $sheet.dismiss();
      } catch (error) {
        notification.error('Failed to save');
      }
    }}>
  `
});
```