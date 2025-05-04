# Schmancy Layout - AI Reference

```js
// Grid Layout
<schmancy-grid
  columns="3"                    // Number of columns or template
  rows="auto"                    // Number of rows or template
  gap="16px"                     // Gap between items
  column-gap="16px"              // Column-specific gap
  row-gap="16px"                 // Row-specific gap
  justify-items="start|center|end|stretch"
  align-items="start|center|end|stretch"
  justify-content="start|center|end|space-between|space-around|space-evenly"
  align-content="start|center|end|space-between|space-around|space-evenly">
  
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</schmancy-grid>

// Advanced grid with template
<schmancy-grid
  columns="repeat(12, 1fr)"
  rows="auto auto 1fr"
  template-areas="
    'header header header header'
    'sidebar content content content'
    'footer footer footer footer'
  ">
  <div style="grid-area: header">Header</div>
  <div style="grid-area: sidebar">Sidebar</div>
  <div style="grid-area: content">Content</div>
  <div style="grid-area: footer">Footer</div>
</schmancy-grid>

// Flex Layout
<schmancy-flex
  direction="row|column|row-reverse|column-reverse"
  wrap="nowrap|wrap|wrap-reverse"
  justify-content="start|center|end|space-between|space-around|space-evenly"
  align-items="start|center|end|stretch|baseline"
  align-content="start|center|end|space-between|space-around|space-evenly"
  gap="16px"                     // Gap between items
  column-gap="16px"              // Column-specific gap
  row-gap="16px">                // Row-specific gap
  
  <div>Item 1</div>
  <div>Item 2</div>
  <div style="flex: 1">Flexible Item</div>
</schmancy-flex>

// Responsive layouts (using attributes)
<schmancy-grid
  columns="1"
  columns-md="2"
  columns-lg="3"
  columns-xl="4"
  gap="8px"
  gap-md="16px"
  gap-lg="24px">
  
  <!-- Content -->
</schmancy-grid>

<schmancy-flex
  direction="column"
  direction-md="row"
  align-items="center"
  justify-content-md="space-between">
  
  <!-- Content -->
</schmancy-flex>

// Scroll Container
<schmancy-scroll
  direction="vertical|horizontal|both"
  scrollbar="auto|always|hover|none">
  
  <!-- Scrollable content -->
</schmancy-scroll>

// Layout v2 Components (enhanced versions)
<schmancy-flex-v2
  display="flex|inline-flex"
  direction="row|column"
  wrap="nowrap|wrap|wrap-reverse"
  justify="flex-start|flex-end|center|space-between|space-around|space-evenly"
  items="flex-start|flex-end|center|stretch|baseline"
  content="flex-start|flex-end|center|space-between|space-around|space-evenly"
  gap="none|xs|sm|md|lg|xl">
  
  <!-- Content -->
</schmancy-flex-v2>

<schmancy-grid-v2
  display="grid|inline-grid"
  template-columns="1fr 1fr|repeat(3, 1fr)"
  template-rows="auto|1fr auto"
  template-areas="'header header' 'sidebar content' 'footer footer'"
  gap="none|xs|sm|md|lg|xl"
  justify-content="start|end|center|stretch|space-around|space-between|space-evenly"
  align-content="start|end|center|stretch|space-around|space-between|space-evenly"
  justify-items="start|end|center|stretch"
  align-items="start|end|center|stretch">
  
  <!-- Content -->
</schmancy-grid-v2>

// Examples
// Responsive grid layout
<schmancy-grid 
  columns="1" 
  columns-md="2" 
  columns-lg="4" 
  gap="16px">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</schmancy-grid>

// Flex layout for a form
<schmancy-flex
  direction="column"
  gap="16px">
  <h2>Contact Form</h2>
  <schmancy-input label="Name"></schmancy-input>
  <schmancy-input label="Email"></schmancy-input>
  <schmancy-textarea label="Message"></schmancy-textarea>
  
  <schmancy-flex
    direction="row"
    justify-content="end"
    gap="8px">
    <schmancy-button kind="secondary">Cancel</schmancy-button>
    <schmancy-button kind="primary">Submit</schmancy-button>
  </schmancy-flex>
</schmancy-flex>

// App layout with header, sidebar and content
<schmancy-grid
  style="height: 100vh"
  template-areas="
    'header header'
    'sidebar content'
  "
  template-rows="64px 1fr"
  template-columns="250px 1fr">
  
  <div style="grid-area: header">
    <schmancy-appbar>App Title</schmancy-appbar>
  </div>
  
  <div style="grid-area: sidebar">
    <schmancy-list>
      <schmancy-list-item>Dashboard</schmancy-list-item>
      <schmancy-list-item>Settings</schmancy-list-item>
      <schmancy-list-item>Profile</schmancy-list-item>
    </schmancy-list>
  </div>
  
  <schmancy-scroll style="grid-area: content">
    <!-- Main content -->
  </schmancy-scroll>
</schmancy-grid>
```