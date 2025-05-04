# Schmancy Sheet - AI Reference

```js
// Sheet Service API
import { $sheet } from 'schmancy';

// Open a sheet
$sheet.open({
  title?: string,
  content: TemplateResult|HTMLElement|Function,
  width?: string|number, // default "600px"
  height?: string|number, // default "auto"
  position?: 'right'|'left'|'bottom'|'top', // default "right"
  closable?: boolean, // default true
  backdrop?: boolean, // default false
  onClose?: Function,
  hooks?: {
    beforeOpen?: Function,
    afterOpen?: Function,
    beforeClose?: Function,
    afterClose?: Function
  }
}) -> SheetRef

// SheetRef object
{
  close(): Promise<void>, // Programmatically close the sheet
  id: string,            // Unique ID of the sheet
  element: HTMLElement   // The sheet element
}

// Sheet Component
<schmancy-sheet
  title="Sheet Title"
  position="right|left|bottom|top"
  width="600px"
  height="auto"
  closable?
  backdrop?
  @close=${handleClose}>
  
  <div slot="header">
    <!-- Custom header content -->
  </div>
  
  <!-- Main content -->
  <div>Sheet content goes here</div>
  
  <div slot="footer">
    <!-- Footer content -->
    <schmancy-button @click=${closeSheet}>Close</schmancy-button>
  </div>
</schmancy-sheet>

// Sheet Header Component
<schmancy-sheet-header
  title="Sheet Title"
  closable?
  @close=${handleClose}>
  <!-- Optional additional header content -->
</schmancy-sheet-header>

// Sheet Hook (for programmatic usage)
const [openSheet, SheetComponent] = useSheet({
  title: "Sheet Title",
  content: () => html`<div>Sheet content</div>`,
  position: "right"
});

// Examples
// Basic usage
$sheet.open({
  title: "User Details",
  content: html`
    <div>
      <schmancy-form>
        <schmancy-input label="Name" value="John Doe"></schmancy-input>
        <schmancy-input label="Email" value="john@example.com"></schmancy-input>
      </schmancy-form>
    </div>
  `,
  onClose: () => console.log("Sheet closed")
});

// Using with form submission
const sheetRef = $sheet.open({
  title: "Add User",
  content: html`
    <schmancy-form @submit=${(e) => {
      const values = e.detail.values;
      saveUser(values);
      sheetRef.close();
    }}>
      <schmancy-input name="name" label="Name" required></schmancy-input>
      <schmancy-input name="email" label="Email" required></schmancy-input>
      
      <div slot="footer">
        <schmancy-button type="submit">Save</schmancy-button>
        <schmancy-button kind="secondary" @click=${() => sheetRef.close()}>Cancel</schmancy-button>
      </div>
    </schmancy-form>
  `
});

// Using the sheet component directly
<schmancy-sheet
  title="Settings"
  position="right"
  width="400px"
  @close=${() => this.sheetOpen = false}>
  
  <div>
    <h3>Preferences</h3>
    <schmancy-checkbox label="Enable notifications"></schmancy-checkbox>
    <schmancy-checkbox label="Dark mode"></schmancy-checkbox>
  </div>
  
  <div slot="footer">
    <schmancy-button @click=${saveSettings}>Save</schmancy-button>
  </div>
</schmancy-sheet>
```