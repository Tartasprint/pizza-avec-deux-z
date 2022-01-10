import { default as mongoose } from 'mongoose';
const { Schema, model } = mongoose
const DocumentSchema = new Schema({
  title: String,
  content: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

DocumentSchema.virtual('edit_url')
  .get(function () {
    return 'edit/' + this._id;
  });
DocumentSchema.virtual('delete_fn')
  .get(function () {
    return 'deleteDocument(\'' + this._id + '\')';
  });
export default model('Document', DocumentSchema); 