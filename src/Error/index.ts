export * from './errors';
export * from './handler';
export enum CustomErrors {
    DataBaseError = "DataBaseError",
    PermissionError = "PermissionError",
    CommandError = "CommadError",
    PageLimitError = "PageLimitError",
    ConditionError = "ConditionError"
}