export enum SaveResult {
    Created,
    Updated,
    Failed,
}


export interface Model {
    save(): Promise<SaveResult>
}