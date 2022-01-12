import { default as mongoose } from 'mongoose';
const { Schema, model } = mongoose
import { Model, SaveResult } from '../lib/model.js'
import { User } from './user.js';
import { ObjectId } from 'mongodb'
interface DocumentInterface {
  title: string,
  content: string,
  owner: mongoose.Types.ObjectId,
}

const DocumentSchema = new Schema<DocumentInterface>({
  title: String,
  content: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const DocumentModel: mongoose.Model<DocumentInterface, {}, {}, {}> = model('Document', DocumentSchema);

type MongooseDoc = mongoose.HydratedDocument<DocumentInterface>;
export class Document implements Model {
  #model: MongooseDoc
  private constructor(model: MongooseDoc) {
    this.#model = model
  }
  static create(title: string, content: string, owner: ObjectId) {
    return new Document(new DocumentModel({
      title: title,
      owner: owner,
      content: content,
    }));
  }


  async save(): Promise<SaveResult> {
    try {
      this.#model = await this.#model.save();
      return SaveResult.Created
    } catch (err) {
      return SaveResult.Failed
    }
  }

  get content(): string {
    return this.#model.content
  }

  set content(c: string) {
    this.#model.content = c;
  }

  get title(): string {
    return this.#model.title
  }

  set title(t: string) {
    this.#model.title = t
  }

  async get_owner(): Promise<User | null> {
    return User.findById(this.#model.owner)
  }

  set owner(u: User) {
    this.#model.owner = new mongoose.Types.ObjectId(u.id)
  }

  private get id(): ObjectId {
    return new ObjectId(this.#model._id)
  }

  static async findbyTitle(title: string, owner: User): Promise<Document | null> {
    let d = await DocumentModel.findOne({ title: title, owner: owner.id })
    if (d !== null) return new Document(d)
    else return null
  }

  static async findById(id: ObjectId): Promise<Document | null> {
    let d = await DocumentModel.findById(id)
    if (d !== null) return new Document(d)
    else return null
  }

  is_owner(u: User | null): boolean {
    return u !== undefined && u !== null && this.#model.owner.equals(u.id)
  }

  static getOwned(u: User): Promise<Document[]> {
    return DocumentModel.find({ owner: u.id.toHexString() }).then((docs) => {
      return docs.map((doc) => new Document(doc))
    })
  }

  async remove() {
    this.#model.remove();
    // @ts-ignore: The document is deleted and shouldn't be used anymore
    this.#model = undefined;
  }

  get edit_url(): string {
    return 'edit/' + this.#model.id;
  }

  get delete_fn(): string {
    return 'deleteDocument(\'' + this.id.toString() + '\')';
  }

  get client_content(): { title: string, content: string } {
    return { title: this.#model.title, content: this.#model.content }
  }
}
