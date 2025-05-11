# Schmancy Component Relationships

This document maps the relationships between Schmancy components to provide a holistic understanding of the library.

## Component Categories

### Core Infrastructure
- **Area**: Routing and application area management
- **Store**: State management system
- **Teleport**: Component transportation across DOM
- **RxJS Utils**: Reactive programming utilities

### Layout Components
- **Layout**: Container layout (flex, grid)
- **Surface**: Style-able container with consistent theming
- **Card**: Content containers with various layouts
- **Divider**: Visual separation element

### Navigation & Structure
- **Tabs**: Tabbed interface components
- **Menu**: Dropdown/contextual menus
- **Nav-Drawer**: Navigation drawer with app bar
- **Content-Drawer**: Side panel content drawers
- **Sheet**: Modal slide-up panels
- **Dialog**: Modal dialog boxes

### Form Controls
- **Form**: Form container with validation
- **Input**: Text input fields
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Autocomplete**: Text input with suggestions
- **Checkbox**: Boolean selection control
- **Radio-Group**: Exclusive option selection
- **Option**: Selection option item

### Interactive Elements
- **Button**: Action triggers (primary, secondary, tertiary)
- **Dropdown**: Togglable content containers
- **Chips**: Compact interactive elements
- **List**: Interactive list items
- **Tree**: Hierarchical data display
- **Table**: Tabular data display

### Feedback & Status
- **Notification**: Toast messages and alerts
- **Tooltip**: Contextual information on hover
- **Badge**: Numeric/status indicators
- **Busy**: Loading indicators
- **Avatar**: User/entity visual representation

### Typography & Visual
- **Typography**: Text styling system
- **Icons**: Iconography system
- **Animated-Text**: Text animation utilities
- **Typewriter**: Typing animation effect

### Utilities
- **Directives**: DOM behavior extensions
- **Theme**: Theming system
- **Theme-Button**: Theme toggle control
- **Utils**: General utility functions
- **Types**: TypeScript type definitions
- **Delay**: Timing utilities
- **Date-Range**: Date selection utilities
- **Steps**: Multi-step process visualization

## Key Component Interactions

### Form System Interactions
- **Form** → Contains and validates: Input, Textarea, Select, Checkbox, Radio-Group
- **Input/Select/Autocomplete** → Can contain: Icons
- **Option** → Used by: Select, Autocomplete

### Layout System Interactions
- **Surface** → Used by: Card, Dialog, Sheet, Table
- **Layout** → Container for: most visible components
- **Card** → Contains: Card-Media, Card-Content, Card-Actions

### Navigation System Interactions
- **Area** → Controls routing for: any component
- **Tabs** → Contains: Tab components
- **Nav-Drawer** → Contains: AppBar, Drawer, Content
- **Content-Drawer** → Specialized Sheet with context

### State Management
- **Store** → Can be used with: any component
- **Area** → Manages routing state via reactive observables

### Notification System
- **Notification** → Uses: Surface
- **Dialog** → Uses: Surface
- **Tooltip** → Can attach to: any component