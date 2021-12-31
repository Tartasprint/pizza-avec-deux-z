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
module.exports=mongoose.model('Document', DocumentSchema ); 