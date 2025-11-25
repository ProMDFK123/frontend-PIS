export interface ValidationActionVariables {
    id: string;
    action: 'publish' | 'reject';
}

export interface ClosePublicationVariables {
    id: string;
    typePath: "buysells" | "offers";
}