const { body,validationResult } = require("express-validator");
const Document = require('../models/document')

exports.edit = (req, res) => {
    Document.findById(req.params.docid)
            .exec(function (err, document) {
                res.render('editor', {doc: document, title: "Edit"})
            })
}

exports.new_form = (req,res) => {
    res.render('new_doc_form', { title: 'Create a new document' });
}

exports.new = [
    
  // Validate and santize the name field.
  body('title', 'Document title required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(req.body)
    // Create a genre object with escaped and trimmed data.
    const doc = new Document(
      { title: req.body.title, content: '{"time": 1641073386823,"blocks": [],"version": "2.22.2"}'}
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('new_doc_form', { title: 'Create Document', doc: doc, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Document.findOne({ 'title': req.body.title })
        .exec( function(err, found_document) {
           if (err) { console.log("Ouhouh"); return next(err); }

           if (found_document) {
             // Genre exists, redirect to its detail page.
             console.log("Already exists")
             res.redirect(found_document.edit_url);
           }
           else {

             doc.save(function (err) {
               if (err) { return next(err); }
               // Genre saved. Redirect to genre detail page.
               console.log("Created!")
               res.redirect(doc.edit_url);
             });

           }

         });
    }
  }
];

exports.update = function (socket,message) {
  const data = message
  const update = {content: data.content}
  const id= data.id
  Document.findByIdAndUpdate(id,update, () => {
    socket.send("OK")
  })
}
exports.load = function (socket,message) {
  const data = message
  const id= data.id
  Document.findById(id, (err,doc) => {
    socket.send(JSON.stringify({query: "load", body: doc}))
  })
}

exports.list = function (req,res) {
  Document.find({}, function(err,docs){
    res.render('list_documents',{title:"The documents", documents: docs})
  })
}

exports.delete = function (socket,message) {
  Document.findByIdAndRemove(message.id).exec()
}