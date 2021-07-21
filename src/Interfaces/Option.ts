interface Choice {
    name: string;
    value: string;
}

export interface Option {
    name: string;
    description?: string;
    required: boolean;
}
export interface Option {
    name: string;
    description?: string;
    required: boolean;
    choices?: Choice[];
}