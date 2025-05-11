# Schmancy Area - AI Reference

```js
// Area Router Component
<schmancy-area
  name="root"
  default="home-component">
</schmancy-area>

// Area Service
import { area } from '@schmancy/area';

// Navigation methods
area.push({
  component: UserProfileComponent,  // Component constructor, string tag name, or element instance
  area: 'root',                     // Target area name
  state?: { view: 'profile' },      // Optional state object
  params?: { id: '123' },           // Optional parameters
  historyStrategy: 'push'           // 'push', 'replace', 'pop', 'silent'
});

area.pop('sidebar');                // Remove an area

// Subscription methods
area.on(areaName, skipCurrent?) -> Observable<ActiveRoute>
area.all(skipCurrent?) -> Observable<Map<string, ActiveRoute>>
area.getState<T>(areaName) -> Observable<T>
area.params<T>(areaName) -> Observable<T>
area.param<T>(areaName, key) -> Observable<T>

// Event name format for DOM event listeners
schmancy-area-${areaName}-changed

// Examples
// 1. Basic navigation
area.push({
  component: 'home-page',
  area: 'main',
  historyStrategy: 'push'
});

// 2. Navigation with params
area.push({
  component: ProductDetailComponent,
  area: 'main',
  params: { productId: '12345' },
  historyStrategy: 'push'
});

// 3. Subscribe to an area
area.on('main').subscribe(route => {
  console.log(`Component: ${route.component}, Params: ${route.params}`);
});

// 4. Get and react to a specific param
area.param<string>('product', 'productId').subscribe(id => {
  fetchProductDetails(id);
});

// 5. DOM event listening (non-RxJS approach)
window.addEventListener('schmancy-area-main-changed', event => {
  const { component, params } = event.detail;
  updateUI(component, params);
});
```

## Related Components
- **[Teleport](./teleport.md)**: Can be used with Area for advanced component transportation
- **[Store](./store.md)**: Complements Area for more complex state management
- **[Layout](./layout.md)**: Often used as a container for areas

## Technical Details

### ActiveRoute Interface
```typescript
interface ActiveRoute {
  component: string;        // Component tag name
  area: string;             // Area name
  state?: Record<string, unknown>;  // Optional state
  params?: Record<string, unknown>; // Optional parameters
}
```

### RouteAction Interface
```typescript
interface RouteAction {
  component: CustomElementConstructor | string | HTMLElement;
  area: string;
  state?: Record<string, unknown>;
  params?: Record<string, unknown>;
  historyStrategy?: 'push' | 'replace' | 'pop' | 'silent';
  clearQueryParams?: string[] | null;
}
```

### Common Use Cases

1. **Single Page Applications**: Define multiple areas for different sections of your app
   ```html
   <schmancy-area name="main"></schmancy-area>
   <schmancy-area name="sidebar"></schmancy-area>
   <schmancy-area name="modal"></schmancy-area>
   ```

2. **Typed Params and State**: Use TypeScript generics for type safety
   ```typescript
   interface UserParams { id: string; tab?: string; }
   area.params<UserParams>('user').subscribe(params => {
     fetchUser(params.id);
     setActiveTab(params.tab || 'profile');
   });
   ```

3. **Navigation Guards**: Implement navigation guards with RxJS operators
   ```typescript
   area.on('protected').pipe(
     switchMap(route => {
       if (!isAuthenticated()) {
         area.push({ component: 'login-page', area: 'main' });
         return EMPTY;
       }
       return of(route);
     })
   ).subscribe(handleProtectedRoute);
   ```