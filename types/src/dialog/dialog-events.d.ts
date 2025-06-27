export declare const DialogWhereAreYouRicky = "are-you-there-dialog";
export declare const DialogHereMorty = "yes-dialog-here";
export interface DialogWhereAreYouRickyEvent extends CustomEvent {
    detail: {
        uid: string;
    };
}
export interface DialogHereMortyEvent extends CustomEvent {
    detail: {
        dialog: any;
        theme?: any;
    };
}
