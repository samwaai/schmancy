# Mailbox Component Documentation

## Overview
The Schmancy Mailbox is a comprehensive email management component that provides a full-featured email interface with composition, viewing, and recipient management capabilities.

## Basic Usage

### Simple Email Viewer
```html
<schmancy-mailbox>
</schmancy-mailbox>
```

### With Pre-loaded Emails
```javascript
const mailbox = document.querySelector('schmancy-mailbox');
mailbox.emails = [
  {
    id: '1',
    subject: 'Welcome to Schmancy',
    body: 'Thanks for using our email component!',
    from: { name: 'John Doe', email: 'john@example.com' },
    to: [{ name: 'Jane Smith', email: 'jane@example.com' }],
    date: new Date(),
    read: false,
    starred: false
  }
];
```

## Components

### 1. Email Editor (`schmancy-email-editor`)
The email composition interface with rich text editing capabilities.

#### Features
- **Markdown Support**: Write emails using markdown syntax
- **Auto-growing Textarea**: Starts small and expands as you type
- **Drag & Drop**: Drop images directly into the editor
- **Image Paste**: Paste images from clipboard (Ctrl+V)
- **Layout Templates**: Pre-built layouts for columns, sidebars, and image galleries
- **File Attachments**: Attach multiple files up to 10MB each
- **Templates**: Use pre-defined email templates
- **Resizable**: Manually resize the editor vertically

#### Usage
```javascript
// Standalone editor
<schmancy-email-editor
  .subject="Meeting Tomorrow"
  .body="Let's discuss the project timeline..."
  .templates=${emailTemplates}
  @editor-change=${(e) => console.log(e.detail)}
></schmancy-email-editor>
```

#### Email Templates
```javascript
const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{company}}!',
    body: `# Welcome!
    
We're excited to have you on board.

Best regards,
The Team`
  },
  {
    id: 'followup',
    name: 'Follow Up',
    subject: 'Following up on our conversation',
    body: 'Hi {{name}},\n\nI wanted to follow up on...'
  }
];
```

#### Formatting Toolbar
- **Bold**: `**text**` or toolbar button
- **Italic**: `*text*` or toolbar button  
- **Link**: `[text](url)` or toolbar button
- **Heading**: `# Heading` or toolbar button
- **List**: `* item` or toolbar button
- **Image**: Drag & drop, paste, or toolbar button
- **Layout**: Insert pre-built layouts via toolbar

#### Layout Options
The editor includes several pre-built layouts:
- **2 Columns**: Side-by-side content
- **3 Columns**: Three equal columns
- **Left Sidebar**: Main content with left navigation
- **Right Sidebar**: Main content with right sidebar
- **Image Row**: Horizontal image gallery

### 2. Email Recipients (`schmancy-email-recipients`)
Manages email recipients with validation and auto-complete.

#### Features
- **Multiple Recipients**: Add unlimited recipients
- **Email Validation**: Validates email format
- **Auto-complete**: Suggests contacts as you type
- **Keyboard Navigation**: Tab/Enter to add, Backspace to remove
- **Visual Chips**: Recipients displayed as removable chips

#### Usage
```javascript
<schmancy-email-recipients
  .recipients=${['john@example.com', 'jane@example.com']}
  .suggestions=${contactList}
  .placeholder="Add recipients..."
  @recipients-change=${(e) => console.log(e.detail.recipients)}
></schmancy-email-recipients>
```

### 3. Email Viewer (`schmancy-email-viewer`)
Displays email content with markdown rendering.

#### Features
- **Markdown Rendering**: Full markdown support
- **Syntax Highlighting**: Code blocks with language highlighting
- **Image Support**: Inline images with size attributes
- **Layout Rendering**: Custom layout blocks
- **Responsive**: Adapts to container width

#### Usage
```javascript
<schmancy-email-viewer
  .email=${emailData}
  .showActions=${true}
  @email-reply=${handleReply}
  @email-forward=${handleForward}
  @email-delete=${handleDelete}
></schmancy-email-viewer>
```

### 4. Main Mailbox (`schmancy-mailbox`)
Complete email interface combining all components.

#### Features
- **Email List**: Sortable, filterable email list
- **Search**: Search emails by subject, sender, or content
- **Folders**: Inbox, Sent, Drafts, Trash organization
- **Starring**: Mark important emails
- **Read/Unread**: Track email status
- **Compose**: Full email composition
- **Reply/Forward**: Quick actions on emails

#### Complete Example
```javascript
import { SchmancyMailbox } from '@schmancy/mailbox';

// Configure the mailbox
const mailbox = document.createElement('schmancy-mailbox');

// Set configuration
mailbox.config = {
  uploadHandler: async (file) => {
    // Handle file upload
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url;
  },
  imageUploadHandler: async (file) => {
    // Special handling for images
    // Could resize, optimize, etc.
    return await uploadToImageService(file);
  }
};

// Load initial emails
mailbox.emails = await fetchEmails();

// Set contact suggestions
mailbox.contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
];

// Listen for events
mailbox.addEventListener('email-send', async (e) => {
  const { subject, body, to, attachments } = e.detail;
  await sendEmail(e.detail);
});

mailbox.addEventListener('email-delete', async (e) => {
  await deleteEmail(e.detail.id);
});

mailbox.addEventListener('email-star', async (e) => {
  await toggleStar(e.detail.id);
});

document.body.appendChild(mailbox);
```

## Advanced Features

### Custom Upload Handlers
```javascript
mailbox.config = {
  // General file upload
  uploadHandler: async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large');
    }
    return await uploadToS3(file);
  },
  
  // Image-specific upload with processing
  imageUploadHandler: async (file) => {
    const compressed = await compressImage(file);
    const url = await uploadToImageCDN(compressed);
    return url;
  }
};
```

### Email Templates with Variables
```javascript
const templates = [
  {
    id: 'invoice',
    name: 'Invoice Template',
    subject: 'Invoice #{{invoice_number}}',
    body: `# Invoice
    
**Date**: {{date}}
**Amount**: ${{amount}}

| Item | Quantity | Price |
|------|----------|-------|
| {{item1}} | {{qty1}} | {{price1}} |

Thank you for your business!`
  }
];

mailbox.templates = templates;
```

### Markdown Extensions
The email editor supports extended markdown:

```markdown
# Headers
## Subheaders

**Bold** and *italic* text

[Links](https://example.com)

![Images](image.jpg){width=600px height=auto}

:::layout columns-2
<div class="column">
Left content
</div>
<div class="column">
Right content
</div>
:::

\`\`\`javascript
// Code blocks with syntax highlighting
const greeting = "Hello, World!";
\`\`\`

| Tables | Are | Supported |
|--------|-----|-----------|
| Cell 1 | Cell 2 | Cell 3 |
```

### Keyboard Shortcuts
- **Tab**: Insert 2 spaces (in editor)
- **Ctrl/Cmd + V**: Paste image from clipboard
- **Ctrl/Cmd + B**: Bold selected text
- **Ctrl/Cmd + I**: Italic selected text
- **Ctrl/Cmd + K**: Insert link
- **Ctrl/Cmd + Enter**: Send email (when in compose mode)

### Drag & Drop
The editor supports multiple drag & drop scenarios:
- **Images**: Automatically uploaded and inserted as markdown
- **Text Files**: Added as attachments
- **Multiple Files**: Batch processing with progress indicators

### Email Search
```javascript
// Search configuration
mailbox.searchOptions = {
  fields: ['subject', 'body', 'from.name', 'from.email'],
  caseSensitive: false,
  fuzzyMatch: true
};

// Programmatic search
mailbox.search('project update');
```

## Styling

### CSS Custom Properties
```css
schmancy-mailbox {
  --mailbox-header-height: 64px;
  --mailbox-sidebar-width: 280px;
  --mailbox-list-item-height: 72px;
  --mailbox-composer-min-height: 400px;
}
```

### Theme Integration
The mailbox automatically integrates with Schmancy theme system:
```javascript
import { SchmancyTheme } from '@schmancy/theme';

// Components will automatically use theme colors
SchmancyTheme.sys.color.primary.default
SchmancyTheme.sys.color.surface.highest
```

## Error Handling
```javascript
mailbox.addEventListener('email-error', (e) => {
  const { type, message, details } = e.detail;
  
  switch(type) {
    case 'upload-failed':
      console.error('Upload failed:', message);
      break;
    case 'send-failed':
      console.error('Send failed:', message);
      // Retry logic
      break;
    case 'validation-error':
      console.error('Validation error:', details);
      break;
  }
});
```

## Best Practices

1. **Always provide upload handlers** for production use
2. **Set reasonable file size limits** (10MB recommended)
3. **Validate email addresses** on the server side as well
4. **Sanitize markdown content** before storing/sending
5. **Implement rate limiting** for email sending
6. **Cache templates** for better performance
7. **Use debouncing** for search functionality
8. **Provide loading states** during async operations

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies
- Lit 3.0+
- RxJS (for reactive patterns)
- Tailwind CSS (for styling)
- Material Icons (for UI icons)

## License
See LICENSE file in the repository.