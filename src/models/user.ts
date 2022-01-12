import { default as mongoose } from 'mongoose';
const { Schema, model } = mongoose;
// @ts-ignore
import uniqueValidator from 'mongoose-unique-validator';

import { ObjectId } from 'mongodb'
import { ClientHashedPassword, ServerHashedPassword } from './password.js';
import { Model, SaveResult } from '../lib/model.js'
interface UserInteface {
    email: string,
    password: string,
}

const userSchema = new Schema<UserInteface>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

type MongooseUsr = mongoose.HydratedDocument<UserInteface>
const UserModel = model('User', userSchema);
export class User implements Model {
    #model: MongooseUsr
    constructor(model: MongooseUsr) {
        this.#model = model;
    }

    static create(email: string, password: ServerHashedPassword) {
        return new User(new UserModel({
            email: email,
            password: password.password
        }))
    }

    async save(): Promise<SaveResult> {
        try {
            this.#model = await this.#model.save();
            return SaveResult.Created;
        } catch (_) {
            return SaveResult.Failed;
        }
    }

    private get password(): ServerHashedPassword {
        return new ServerHashedPassword(this.#model.password)
    }

    static async auth_user(email: string, password: ClientHashedPassword): Promise<{ user: User, valid: boolean } | null> {
        const result = await UserModel.findOne({ email: email })
        if (result === null) {
            return null
        } else {
            const user = new User(result)
            const valid = await password.compareWithServer(user.password);
            return { user, valid }
        }
    }

    static async findById(id: ObjectId): Promise<User | null> {
        let d = await UserModel.findById(id)
        if (d !== null) return new User(d)
        else return null
    }

    public get email(): string {
        return this.#model.email
    }

    public get id(): ObjectId {
        return new ObjectId(this.#model._id)
    }

}