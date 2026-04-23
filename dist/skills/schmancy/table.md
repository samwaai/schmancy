# schmancy-table

> Virtualized data table with sorting, custom column rendering, and sticky headers.

## Usage
```typescript
html`
<schmancy-table
  .columns=${columns}
  .data=${items}
  keyField="id"
  cols="1fr 2fr 1fr"
  sortable
  @click=${(e) => selectRow(e.detail)}>
</schmancy-table>
`
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| columns | `TableColumn[]` | `[]` | Column definitions |
| data | `T[]` | `[]` | Data array |
| keyField | string | `'id'` | Unique key property on each item |
| cols | string | `'1fr'` | CSS grid-template-columns |
| sortable | boolean | `false` | Enable column sorting |

## TableColumn Interface
```typescript
interface TableColumn<T> {
  name: string             // Column header text
  key?: keyof T            // Data property key
  align?: 'left' | 'right' | 'center'
  weight?: 'normal' | 'bold'
  render?: (item: T) => TemplateResult | string | number
  sortable?: boolean       // Per-column sort toggle
  value?: (item: T) => any // Custom sort value function
}
```

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| click | `{ item: T, index: number }` | Row clicked |
| sort-change | `{ column, direction }` | Sort state changed |

## Examples
```typescript
const columns = [
  { name: 'Name', key: 'name', sortable: true },
  { name: 'Status', key: 'status', render: (item) =>
    html`<schmancy-badge color=${item.active ? 'success' : 'neutral'}>
      ${item.active ? 'Active' : 'Inactive'}
    </schmancy-badge>` },
  { name: 'Created', key: 'createdAt', sortable: true,
    value: (item) => new Date(item.createdAt).getTime() },
]
```

Uses `lit-virtualizer` for efficient rendering of large datasets. Header is sticky with glass surface.
