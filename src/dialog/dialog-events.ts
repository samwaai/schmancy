import type { LitElement } from 'lit'

// Dialog discovery event constants
export const DialogWhereAreYouRicky = 'are-you-there-dialog'
export const DialogHereMorty = 'yes-dialog-here'

/**
 * Base interface for dialog components
 */
export interface DialogInstance extends LitElement {
  uid?: string
  open: () => void
  close: (returnValue?: string) => void
  active?: boolean
}

/**
 * Base interface for theme components
 */
export interface ThemeInstance extends LitElement {
  theme?: Record<string, unknown>
}

// Event interfaces
export interface DialogWhereAreYouRickyEvent extends CustomEvent {
  detail: {
    uid: string
  }
}

export interface DialogHereMortyEvent extends CustomEvent {
  detail: {
    dialog: DialogInstance
    theme?: ThemeInstance
  }
}