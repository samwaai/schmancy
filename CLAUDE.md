# Schmancy Project Guidelines

## Important Component Locations

### Demo Components
The demo components are located in `/demo/src/features/` directory:
- Forms demos: `/demo/src/features/forms-demos/`
  - Autocomplete demo: `/demo/src/features/forms-demos/autocomplete.ts` (class: `DemoFormsAutocomplete`)
  - Select demo: `/demo/src/features/forms-demos/select.ts`
- Feedback demos: `/demo/src/features/feedback-demos/`
- Navigation demos: `/demo/src/features/navigation-demos/`

**NEVER create test HTML files in the project root. Use the existing demo structure.**

## Component Architecture

### Value Binding Pattern
When implementing value binding for form components (select, autocomplete, chips, etc.):
1. Components should display the label of the selected option when value is set programmatically
2. Use `_updateInputDisplay()` method to sync display with value
3. Call `_updateInputDisplay()` in `firstUpdated()` for initial value sync
4. Tracking flags like `_valueSet` and `_valuesSet` can be used to track explicit property setting

## Testing Changes
To test component changes:
1. Run `yarn dev` to start the development server
2. Navigate to the appropriate demo page in the browser
3. The demo components already have comprehensive examples
4. DO NOT create standalone HTML test files

## File Structure
- Source components: `/src/`
- Demo components: `/demo/src/features/`
- Types: `/types/src/`
- Build output: `/dist/`