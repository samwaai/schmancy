# Schmancy Mailbox

> Full email composition + campaign management system. Orchestrates recipients, templates, editor, attachments, and preview.

## Components

| Tag | Purpose |
|-----|---------|
| `schmancy-mailbox` | Top-level orchestrator |
| `schmancy-email-editor` | Subject + body composition |
| `schmancy-email-viewer` | HTML/plaintext preview |
| `schmancy-email-recipients` | Recipient list with import/CSV |
| `schmancy-email-layout-selector` | Layout template picker |
| `schmancy-email-template-picker` | Email template browser |

## Usage
```html
<schmancy-mailbox
  .config=${{
    sendEndpoint: '/api/emails/send',
    uploadEndpoint: '/api/uploads',
    authenticateRequest: (req) => ({ ...req, headers: { Authorization: `Bearer ${token}` } })
  }}
  .templates=${myTemplates}
  .importSources=${[
    { id: 'ticketholders', label: 'Ticket holders', icon: 'confirmation_number', handler: loadTicketHolders },
    { id: 'waitlist', label: 'Waitlist', icon: 'hourglass_empty', handler: loadWaitlist },
  ]}
></schmancy-mailbox>
```

## schmancy-mailbox Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `config` | `EmailComposeConfig` | `{}` | Endpoints, auth, upload handlers |
| `templates` | `EmailTemplate[]` | `[]` | Available email templates |
| `importSources` | `ImportSource[]` | `[]` | Import buttons shown in recipients panel |
| `disabled` | boolean | `false` | Disable all interactions |
| `recipientsTitle` | string | `'Recipients'` | Recipients panel heading |
| `recipientsEmptyTitle` | string | `'No recipients yet'` | Empty state title |
| `recipientsEmptyMessage` | string | `'Import from sources or upload a CSV'` | Empty state body |
| `enableCsvImport` | boolean | `true` | Allow CSV file import |
| `enableDragDrop` | boolean | `true` | Accept dropped CSV files |

## Key Types
```typescript
interface EmailTemplate { id, name, subject, body, category?, thumbnail? }

interface EmailComposeConfig {
  sendEndpoint?: string
  templatesEndpoint?: string
  uploadEndpoint?: string
  authenticateRequest?: (req: RequestInit) => RequestInit
  uploadHandler?: (file: File) => Promise<string>
  imageUploadHandler?: (file: File) => Promise<string>
}

interface SendEmailRequest {
  recipients: string[]
  subject: string
  body: string
  attachments: EmailAttachment[]
  templateId?: string | null
}

interface ImportSource {
  id: string
  label: string
  icon: string       // Material icon name
  handler: () => void // Populates recipients via events
}
```

## Events
| Event | Detail | Where |
|-------|--------|-------|
| `emails-imported` | `{ emails, source }` | Recipients |
| `recipient-removed` | `{ email }` | Recipients |
| `recipients-cleared` | `{}` | Recipients |
| `selection-changed` | `{ selectedEmails }` | Recipients |
| `compose-changed` | `{ subject, body, templateId, attachments }` | Editor |
| `send-email` | `{ request: SendEmailRequest }` | Mailbox — consumer POSTs to backend |
| `send-error` | `{ error }` | Mailbox |

## Recipients Flow
1. User clicks an `ImportSource` button (or drops a CSV).
2. CSV is parsed → `validEmails`, `invalidEmails`, `duplicates` reported.
3. `emails-imported` event fires; mailbox merges into selected recipients.
4. User edits subject/body via email-editor; changes bubble as `compose-changed`.
5. On send, `send-email` fires with the full `SendEmailRequest` — parent handles network.

## Minimal Integration
```typescript
<schmancy-mailbox
  .config=${config}
  .templates=${templates}
  @send-email=${async (e: CustomEvent<{ request: SendEmailRequest }>) => {
    const result = await api.sendCampaign(e.detail.request)
    if (!result.success) this.dispatchError(result.message)
  }}
></schmancy-mailbox>
```
