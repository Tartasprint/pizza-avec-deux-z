import { default as mongoose, Document, Model, Mongoose } from 'mongoose';
const { Schema, model } = mongoose;
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from "bcrypt"
import { ClientHashedPassword, ServerHashedPassword } from './password.js';

type ObjectId = mongoose.Types.ObjectId

interface UserInteface {
    email: string,
    password: string,
}

const userSchema = new Schema<UserInteface>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);



const UserModel = model('User', userSchema);
export class User {
    #email: string
    #password: ServerHashedPassword
    #id: ObjectId
    constructor(email: string, password: ServerHashedPassword) {
        this.#email = email
        this.#password = password
    }

    async save(): Promise<boolean> {
        const user = new UserModel({
            email: this.email,
            password: this.#password.password,
        });
        try {
            const doc = await user.save();
            this.#id = doc._id
            return true;
        } catch (_) {
            return false;
        }
    }

    update(): Promise<boolean> {
        return UserModel.findById(this.#id).then((doc) => {
            if (doc === null) return false
            this.#email = doc.email
            this.#password = new ServerHashedPassword(doc.password)
            return true;
        }).catch((_) => false);
    }

    private static from_document(query: Document & UserInteface | null): User | null {
        if (query === null) return null
        else {
            const user = new User(query.email, new ServerHashedPassword(query.password))
            user.#id = query._id;
            return user
        }
    }

    static async auth_user(email: string, password: ClientHashedPassword): Promise<{ user: User, valid: boolean } | null> {
        const user = await UserModel.findOne({ email: email }).then(User.from_document)
        if (user === null) {
            return null
        } else {
            const valid = await password.compareWithServer(user.#password);
            return { user, valid }
        }
    }

    static async from_id(id: ObjectId | string): Promise<User | null> {
        return await UserModel.findById(id).then(User.from_document);
    }

    public get email(): string {
        return this.#email
    }

    public get id(): ObjectId {
        return new mongoose.Types.ObjectId(this.#id)
    }

}