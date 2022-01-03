const mongoose = require('mongoose');
const Schema = mongoose.Schema
const DocumentSchema = new Schema({
    title: String,
    content: String,
});

DocumentSchema.virtual('edit_url')
.get(function () {
  return 'edit/'+this._id;
});
DocumentSchema.virtual('delete_fn')
.get(function () {
  return 'deleteDocument(\''+this._id+'\')';
});
module.exports=mongoose.model('Document', DocumentSchema ); 