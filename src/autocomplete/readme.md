```js
<schmancy-autocomplete
  label="Status"
  .value="${this.filter.status}"
  @change="${(e:"
  SchmancyAutocompleteChangeEvent)=""
>
  { this.filter.status = e.detail.value this.emitChanges('status') }} > ${[ 'All', 'New', 'Paid CC',
  'Approved', 'Modified', 'Checked-In', 'Checked-Out', 'No show', 'Cancelled', 'Invalid CC',
  'Debtor', 'Problematic', 'Prepaid', 'Paid', 'Paid bank', 'Completed' ].map((o) => html`
  <schmancy-option .value="${o}"> ${o}</schmancy-option>`)} </schmancy-autocomplete
>
```
