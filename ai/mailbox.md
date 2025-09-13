# Schmancy Mailbox - AI Reference

```js
// Import
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/mailbox'

// Main Mailbox Component
<schmancy-mailbox
  .config="${emailConfig}"                          // Email configuration
  .templates="${emailTemplates}"                    // Available email templates
  .importSources="${recipientSources}"              // Recipient import sources
  disabled?                                         // Disable all interactions
  recipientsTitle="Recipients"                      // Recipients panel title
  recipientsEmptyTitle="No recipients yet"          // Empty state title
  recipientsEmptyMessage="Import or upload CSV"     // Empty state message
  enableCsvImport?                                  // Enable CSV import (default: true)
  enableDragDrop?                                   // Enable drag and drop (default: true)
  @email-sent=${handleEmailSent}                    // Email sent successfully
  @email-error=${handleEmailError}>                 // Email send error
</schmancy-mailbox>

// Supporting Components
<schmancy-email-editor                              // Rich text email editor
  content="${emailBody}"
  @content-change=${handleContentChange}>
</schmancy-email-editor>

<schmancy-email-viewer                              // Email preview
  .emailData="${emailData}">
</schmancy-email-viewer>

<schmancy-email-recipients                          // Recipients management
  .recipients="${recipients}"
  .importSources="${sources}"
  @recipients-change=${handleRecipientsChange}>
</schmancy-email-recipients>

<schmancy-email-layout-selector                     // Template selection
  .templates="${templates}"
  @template-select=${handleTemplateSelect}>
</schmancy-email-layout-selector>
```

## Configuration

### Email Configuration Object
```typescript
const emailConfig: EmailComposeConfig = {
  sendEndpoint: '/api/send-email',
  templatesEndpoint: '/api/templates',
  uploadEndpoint: '/api/upload',
  authenticateRequest: (request) => ({
    ...request,
    headers: {
      ...request.headers,
      'Authorization': `Bearer ${getAuthToken()}`
    }
  }),
  uploadHandler: async (file) => {
    // Custom file upload logic
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    return result.url
  },
  imageUploadHandler: async (file) => {
    // Custom image upload for email content
    return await uploadToImageService(file)
  }
}
```

## Data Types

### Email Template
```typescript
interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  isDefault?: boolean
  createdAt?: Date | string
  category?: string
  description?: string
  thumbnail?: string
}
```

### Email Attachment
```typescript
interface EmailAttachment {
  id: string
  file: File
  name: string
  size: number
  type: string
  url?: string  // For uploaded attachments
}
```

### Import Source
```typescript
interface ImportSource {
  id: string
  label: string
  icon: string
  handler: () => void
}
```

## Usage Examples

### Basic Email Composer
```html
<schmancy-mailbox
  .config="${{
    sendEndpoint: '/api/emails/send'
  }}"
  .templates="${emailTemplates}"
  @email-sent=${this.handleEmailSent}
  @email-error=${this.handleEmailError}>
</schmancy-mailbox>

<script>
const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Our Platform!',
    body: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
    isDefault: true
  },
  {
    id: 'newsletter',
    name: 'Newsletter Template',
    subject: 'Monthly Newsletter',
    body: '<h2>This Month\'s Updates</h2><p>Here\'s what\'s new...</p>'
  }
]

function handleEmailSent(e) {
  const { campaignId, recipients } = e.detail
  console.log(`Email sent to ${recipients.length} recipients`)
}

function handleEmailError(e) {
  const { error, recipients } = e.detail
  console.error('Email send failed:', error)
}
</script>
```

### Newsletter System
```html
<schmancy-mailbox
  .config="${{
    sendEndpoint: '/api/newsletter/send',
    templatesEndpoint: '/api/newsletter/templates',
    uploadEndpoint: '/api/media/upload'
  }}"
  .templates="${newsletterTemplates}"
  .importSources="${subscriberSources}"
  recipientsTitle="Subscribers"
  recipientsEmptyTitle="No subscribers loaded"
  recipientsEmptyMessage="Import from your subscriber lists">
</schmancy-mailbox>

<script>
const subscriberSources = [
  {
    id: 'mailchimp',
    label: 'Import from Mailchimp',
    icon: 'mail',
    handler: () => importFromMailchimp()
  },
  {
    id: 'database',
    label: 'Load from Database',
    icon: 'database',
    handler: () => loadSubscribersFromDB()
  }
]

async function importFromMailchimp() {
  const subscribers = await fetch('/api/mailchimp/subscribers').then(r => r.json())
  // Handle import logic
}
</script>
```

### Event Announcements
```html
<div class="mailbox-container">
  <h2>Send Event Announcement</h2>

  <schmancy-mailbox
    .config="${eventEmailConfig}"
    .templates="${eventTemplates}"
    .importSources="${attendeeSources}"
    recipientsTitle="Event Attendees"
    enableCsvImport
    enableDragDrop
    @email-sent=${handleAnnouncementSent}>
  </schmancy-mailbox>
</div>

<script>
const eventEmailConfig = {
  sendEndpoint: '/api/events/send-announcement',
  uploadHandler: async (file) => {
    // Upload to event media storage
    return await uploadEventMedia(file)
  }
}

const eventTemplates = [
  {
    id: 'reminder',
    name: 'Event Reminder',
    subject: 'Reminder: {{eventName}} is tomorrow!',
    body: eventReminderTemplate
  },
  {
    id: 'update',
    name: 'Event Update',
    subject: 'Important Update: {{eventName}}',
    body: eventUpdateTemplate
  }
]

const attendeeSources = [
  {
    id: 'registered',
    label: 'All Registered Attendees',
    icon: 'people',
    handler: () => loadRegisteredAttendees()
  },
  {
    id: 'vip',
    label: 'VIP Attendees Only',
    icon: 'star',
    handler: () => loadVipAttendees()
  }
]
</script>
```

### Marketing Campaign
```html
<schmancy-card>
  <div slot="header">
    <h3>New Marketing Campaign</h3>
  </div>

  <div slot="content">
    <schmancy-mailbox
      .config="${marketingConfig}"
      .templates="${campaignTemplates}"
      .importSources="${customerSources}"
      recipientsTitle="Target Customers"
      recipientsEmptyTitle="No customers selected"
      recipientsEmptyMessage="Import customer segments or upload lists"
      @email-sent=${trackCampaignSuccess}
      @email-error=${handleCampaignError}>
    </schmancy-mailbox>
  </div>
</schmancy-card>

<script>
const marketingConfig = {
  sendEndpoint: '/api/marketing/send-campaign',
  templatesEndpoint: '/api/marketing/templates',
  uploadEndpoint: '/api/marketing/upload',
  authenticateRequest: (request) => ({
    ...request,
    headers: {
      ...request.headers,
      'Authorization': `Bearer ${getMarketingToken()}`,
      'X-Campaign-Source': 'web-dashboard'
    }
  })
}

function trackCampaignSuccess(e) {
  const { campaignId, recipients } = e.detail
  analytics.track('Campaign Sent', {
    campaignId,
    recipientCount: recipients.length,
    source: 'mailbox-component'
  })
}
</script>
```

## Individual Components

### Email Editor
```html
<schmancy-email-editor
  content="${emailContent}"
  placeholder="Write your email content..."
  @content-change=${(e) => this.emailContent = e.detail.content}
  @image-upload=${handleImageUpload}>
</schmancy-email-editor>
```

### Email Viewer (Preview)
```html
<schmancy-email-viewer
  .emailData="${{
    subject: 'Test Email',
    body: '<p>Email content here</p>',
    recipients: ['user@example.com'],
    attachments: []
  }}">
</schmancy-email-viewer>
```

### Recipients Management
```html
<schmancy-email-recipients
  .recipients="${recipientList}"
  .importSources="${importSources}"
  enableCsvImport
  enableDragDrop
  @recipients-change=${handleRecipientsUpdate}
  @csv-import=${handleCsvImport}>
</schmancy-email-recipients>
```

### Template Selector
```html
<schmancy-email-layout-selector
  .templates="${availableTemplates}"
  selectedId="${currentTemplateId}"
  @template-select=${(e) => this.currentTemplateId = e.detail.templateId}>
</schmancy-email-layout-selector>
```

## Events

### Main Mailbox Events
```typescript
// Email sent successfully
@email-sent: CustomEvent<{
  campaignId: string
  recipients: string[]
  templateId?: string
}>

// Email send error
@email-error: CustomEvent<{
  error: string
  recipients: string[]
  details?: any
}>

// Template selected
@template-change: CustomEvent<{
  templateId: string
  template: EmailTemplate
}>

// Recipients updated
@recipients-change: CustomEvent<{
  recipients: string[]
  added: string[]
  removed: string[]
}>
```

## Advanced Configuration

### Custom Upload Handlers
```typescript
const advancedConfig: EmailComposeConfig = {
  sendEndpoint: '/api/emails/send',

  // Custom file upload with progress
  uploadHandler: async (file: File) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        const progress = (e.loaded / e.total) * 100
        // Update progress indicator
        updateUploadProgress(progress)
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.url)
        } else {
          reject(new Error('Upload failed'))
        }
      }

      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  },

  // Custom image handler for rich text editor
  imageUploadHandler: async (file: File) => {
    const imageUrl = await uploadToImageCDN(file)
    return imageUrl
  },

  // Add authentication headers
  authenticateRequest: (request: RequestInit) => ({
    ...request,
    headers: {
      ...request.headers,
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-API-Key': getApiKey(),
      'Content-Type': 'application/json'
    }
  })
}
```

### Template Variables
```html
<!-- Templates support variable substitution -->
<script>
const templateWithVariables = {
  id: 'personalized',
  name: 'Personalized Email',
  subject: 'Hello {{firstName}}, welcome to {{companyName}}!',
  body: `
    <h1>Welcome {{firstName}}!</h1>
    <p>Thank you for joining {{companyName}}.</p>
    <p>Your account: {{email}}</p>
    <p>Next event: {{nextEventDate}}</p>
  `
}

// Variables are automatically replaced when sending
const emailData = {
  firstName: 'John',
  companyName: 'Acme Corp',
  email: 'john@example.com',
  nextEventDate: '2024-06-15'
}
</script>
```

## Integration Examples

### With Form Validation
```html
<schmancy-form @submit=${handleSendEmail}>
  <schmancy-input
    label="Campaign Name"
    name="campaignName"
    required>
  </schmancy-input>

  <schmancy-mailbox
    .config="${emailConfig}"
    .templates="${templates}"
    @email-sent=${handleSuccess}
    @email-error=${handleError}>
  </schmancy-mailbox>

  <div slot="actions">
    <schmancy-button type="submit" variant="filled">
      Send Campaign
    </schmancy-button>
  </div>
</schmancy-form>
```

### With Analytics
```html
<schmancy-mailbox
  .config="${emailConfig}"
  @email-sent=${(e) => {
    // Track successful sends
    analytics.track('Email Campaign Sent', {
      recipients: e.detail.recipients.length,
      templateId: e.detail.templateId
    })
  }}
  @template-change=${(e) => {
    // Track template usage
    analytics.track('Email Template Selected', {
      templateId: e.detail.templateId
    })
  }}>
</schmancy-mailbox>
```

## Related Components

- **[Button](./button.md)** - Send and action buttons
- **[Card](./card.md)** - Container for mailbox interface
- **[Form](./form.md)** - Form integration
- **[Input](./input.md)** - Subject and recipient inputs
- **[Dialog](./dialog.md)** - Confirmation dialogs
- **[Progress](./progress.md)** - Upload and send progress
- **[Notification](./notification.md)** - Success/error messages

## Use Cases

1. **Newsletter Systems** - Send newsletters to subscribers
2. **Event Management** - Send announcements and reminders
3. **Marketing Campaigns** - Customer email campaigns
4. **Transactional Emails** - Order confirmations, receipts
5. **Internal Communications** - Company announcements
6. **Customer Support** - Bulk support notifications
7. **Educational Platforms** - Course updates and announcements

## Performance Considerations

- **Large Recipient Lists**: Component handles large lists with virtual scrolling
- **File Uploads**: Supports chunked uploads for large attachments
- **Template Caching**: Templates are cached for better performance
- **Batch Sending**: Automatically batches large email sends
- **Progressive Enhancement**: Works without JavaScript for basic functionality