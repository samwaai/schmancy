# Schmancy Area

A lightweight routing and state management system for web components.

## Installation

```bash
npm install @schmancy/area
```

## Basic Usage

```typescript
import { area } from '@schmancy/area';

// Navigate to a new area
area.push({
  component: UserProfileComponent,
  area: 'main',
  historyStrategy: 'push',
  params: { userId: '123' }
});

// Subscribe to area changes
area.on('main').subscribe(route => {
  console.log('Main area component changed:', route.component);
});
```

## Area Subscriptions

The area system provides a reactive API for subscribing to navigation changes.

### Subscribe to a Specific Area

```typescript
// Get notified when the 'main' area changes
area.on('main').subscribe(route => {
  console.log('Main area route:', route);
});
```

### Access State and Params

```typescript
// Get typed state data
interface UserState {
  name: string;
  permissions: string[];
}

area.getState<UserState>('user').subscribe(state => {
  console.log(`User: ${state.name}`);
  console.log(`Permissions: ${state.permissions.join(', ')}`);
});

// Get typed params
area.params<{ id: string }>('user').subscribe(params => {
  console.log(`User ID: ${params.id}`);
});

// Get a specific param value
area.param<string>('user', 'id').subscribe(id => {
  console.log(`User ID: ${id}`);
});
```

### Subscribe to All Areas

```typescript
// Monitor all active routes
area.all().subscribe(routes => {
  console.log('Active routes:', routes);
});
```

## Custom Components

Create components that respond to area changes:

```typescript
class UserProfileComponent extends HTMLElement {
  connectedCallback() {
    // Subscribe to the userId param
    this.subscription = area.param<string>('user', 'id')
      .subscribe(id => {
        this.loadUserData(id);
      });
  }
  
  disconnectedCallback() {
    // Clean up subscription
    this.subscription.unsubscribe();
  }
  
  loadUserData(id) {
    // Fetch and display user data
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(data => {
        this.renderUser(data);
      });
  }
}

customElements.define('user-profile', UserProfileComponent);
```

## API Reference

### area.push(routeAction)

Push a new route to an area.

```typescript
area.push({
  component: DashboardComponent, // Component constructor, tag name, or instance
  area: 'main',                  // Area name
  historyStrategy: 'push',       // 'push', 'replace', 'pop', or 'silent'
  state: { view: 'summary' },    // Optional state object
  params: { period: 'monthly' }  // Optional parameters
});
```

### area.on(areaName, skipCurrent?)

Subscribe to changes for a specific area.

```typescript
area.on('main').subscribe(route => {
  console.log('Area changed:', route);
});
```

### area.getState<T>(areaName)

Get state from an area with type safety.

```typescript
area.getState<{ view: string }>('main').subscribe(state => {
  console.log('View:', state.view);
});
```

### area.params<T>(areaName)

Get params from an area with type safety.

```typescript
area.params<{ id: string }>('user').subscribe(params => {
  console.log('User ID:', params.id);
});
```

### area.param<T>(areaName, key)

Get a specific param value.

```typescript
area.param<string>('user', 'id').subscribe(id => {
  console.log('User ID:', id);
});
```

### area.all(skipCurrent?)

Subscribe to all active routes.

```typescript
area.all().subscribe(routes => {
  console.log('All routes:', routes);
});
```

### area.pop(areaName)

Remove an area from the current state.

```typescript
area.pop('sidebar');
```