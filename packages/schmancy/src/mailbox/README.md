# Schmancy Mailbox Components

A comprehensive email composition and management system extracted from funkhaus-events and generalized for reusability.

## Components

### SchmancyEmailCompose

Main orchestration component that combines composer, preview, and recipients management.

```html
<schmancy-email-compose
  .config=${{ sendEndpoint: '/api/send-email' }}
  .templates=${emailTemplates}
  .importSources=${recipientSources}
  @send-email=${handleSendEmail}
></schmancy-email-compose>
```

### SchmancyEmailComposer

Rich text email editor with markdown formatting, templates, and file attachments.

```html
<schmancy-email-composer
  .subject="Welcome to our service"
  .body="**Hello** and welcome!"
  .templates=${templates}
  @composer-change=${handleChange}
></schmancy-email-composer>
```

### SchmancyEmailPreview

Email preview component showing HTML and plain text versions.

```html
<schmancy-email-preview
  subject="Welcome!"
  body="**Hello** world"
  .attachments=${attachments}
  .recipients=${['user@example.com']}
></schmancy-email-preview>
```

### SchmancyRecipientsPanel

Floating boat interface for managing email recipients with CSV import.

```html
<schmancy-recipients-panel
  .recipients=${recipientList}
  .importSources=${importOptions}
  @emails-imported=${handleImport}
></schmancy-recipients-panel>
```

## Features

- **Framework Agnostic**: No Firebase or external dependencies built-in
- **Configurable Upload Handlers**: Support for custom file and image upload logic
- **CSV Import**: Drag & drop CSV files with email validation
- **Rich Text Editing**: Markdown-based editor with formatting toolbar
- **Layout Templates**: Pre-built email layouts (columns, sidebars, image rows)
- **Responsive Design**: Mobile-first with desktop optimization
- **Theme Integration**: Full Schmancy theme system support
- **TypeScript**: Complete type safety with comprehensive interfaces

## Configuration

### EmailComposeConfig

```typescript
interface EmailComposeConfig {
  sendEndpoint?: string
  templatesEndpoint?: string  
  uploadEndpoint?: string
  authenticateRequest?: (request: RequestInit) => RequestInit
  uploadHandler?: (file: File) => Promise<string>
  imageUploadHandler?: (file: File) => Promise<string>
}
```

### Import Sources

```typescript
interface ImportSource {
  id: string
  label: string
  icon: string
  handler: () => void
}

const importSources: ImportSource[] = [
  {
    id: 'contacts',
    label: 'Import from Contacts',
    icon: 'contacts',
    handler: () => importFromContacts()
  }
]
```

## Events

All components dispatch standard CustomEvents:

- `emails-imported`: When recipients are imported
- `recipient-removed`: When individual recipient is removed  
- `recipients-cleared`: When all recipients are cleared
- `selection-changed`: When recipient selection changes
- `compose-changed`: When email content changes
- `send-email`: When send button is clicked
- `send-error`: When validation or sending fails

## Migration from funkhaus-events

Key changes made for generalization:

1. **Removed Firebase Dependencies**: No direct Firebase imports
2. **Configurable Upload Handlers**: Custom upload logic via props
3. **Optional CSV Parser**: Can use Papa Parse or custom parser
4. **Theme Integration**: Uses Schmancy design system
5. **Host Styling**: Follows Schmancy component patterns
6. **Type Safety**: Comprehensive TypeScript interfaces

## Dependencies

- **Required**: Schmancy core components (button, surface, typography, etc.)
- **Optional**: CSV parser library (Papa Parse recommended)
- **Optional**: Custom upload handlers for file management