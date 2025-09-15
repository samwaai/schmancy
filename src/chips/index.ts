// Export SchmancyFilterChip as SchmancyChip for backward compatibility
export { SchmancyChip } from './filter-chip'
export type { SchmancyChipChangeEvent } from './filter-chip'

// Export all new chip variants
export { SchmancyAssistChip } from './assist-chip'
export type { AssistChipActionEvent } from './assist-chip'

export { SchmancyFilterChip } from './filter-chip'
export type { FilterChipChangeEvent, FilterChipRemoveEvent } from './filter-chip'

export { SchmancyInputChip } from './input-chip'
export type { InputChipClickEvent, InputChipRemoveEvent } from './input-chip'

export { SchmancySuggestionChip } from './suggestion-chip'
export type { SuggestionChipActionEvent } from './suggestion-chip'

// Export the chips container
export { default as SchmancyChips } from './chips'