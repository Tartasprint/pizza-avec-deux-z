import { Oso } from 'oso';
import { User } from '../models/user.js';
import { Document } from '../models/document';
export type OsoActions = "read" | "write"
export type TOso = Oso<User | null, OsoActions, Document | null>
export async function initOso(): Promise<TOso> {
    // Initialize the Oso object. This object is usually
    // used globally throughout an application.
    const oso = new Oso<User, OsoActions, Document>();

    // Tell Oso about the data that you will authorize.
    // These types can be referenced in the policy.
    oso.registerClass(User);
    oso.registerClass(Document);

    // Load your policy file.
    await oso.loadFiles(['../config/main.polar']);

    return oso;
}