// Dialog discovery event constants
export const DialogWhereAreYouRicky = 'are-you-there-dialog'
export const DialogHereMorty = 'yes-dialog-here'

// Event interfaces
export interface DialogWhereAreYouRickyEvent extends CustomEvent {
  detail: {
    uid: string
  }
}

export interface DialogHereMortyEvent extends CustomEvent {
  detail: {
    dialog: any // Will be schmancy-dialog instance
    theme?: any // Will be schmancy-theme instance
  }
}