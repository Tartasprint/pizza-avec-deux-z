import { body, validationResult } from "express-validator";
import { Document } from '../models/document'
import { NextFunction, Request, RequestHandler } from "express";
import { ExpressResponse, HexnutCtx } from "../models/session.js";
import { default as mongoose } from "mongoose";
import { SaveResult } from "../lib/model.js";
import { asyncHandler } from '../lib/asyncRoutes.js'
interface EditReqParams {
  docid: string
}
export const edit = asyncHandler(async (req: Request<EditReqParams>, res: ExpressResponse) => {
  console.log(res.locals)
  let id = new mongoose.Types.ObjectId(req.params.docid)
  let doc = await Document.findById(id);
  if (res.locals.user === null || doc === null) {
    res.status(403).render('unauthorized');
  } else {
    await res.locals.oso.authorize(res.locals.user, "read", doc);
    res.render('editor', { doc: doc, title: "Edit" })
  }
  return
})

export const new_form = async (req: Request, res: ExpressResponse) => {
  res.render('new_doc_form', { title: 'Create a new document' });
}

interface NewDocRecBody {
  title: string
}
export const new_doc: RequestHandler[] = [

  // Validate and santize the name field.
  body('title', 'Document title required').trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  // @ts-expect-error
  (req: Request<{}, {}, NewDocRecBody>, res: ExpressResponse, next: NextFunction) => {
    if (res.locals.user === null) {
      res.status(400).render('unauthorized');
      return;
    }
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const doc = Document.create(
      req.body.title,
      '{"time": 1641073386823,"blocks": [],"version": "2.22.2"}',
      res.locals.user.id,
    );

    if (!errors.isEmpty()) {
      res.render('new_doc_form', { title: 'Create Document', doc: doc, errors: errors.array() });
      return;
    }
    else {
      Document.findbyTitle(req.body.title, res.locals.user)
        .then((found_document) => {
          if (found_document) {
            res.redirect(found_document.edit_url);
          }
          else {
            doc.save().then((result) => {
              if (result === SaveResult.Failed) res.status(500).render('unauthorized')
              else res.redirect(doc.edit_url)
            })
          }
        })
    }
  }
];

export const update = function (ctx: HexnutCtx) {
  const data = ctx.message.body
  const id = data.id
  const user = ctx.session.user
  if (user === null) {
    ctx.send('\"unauthorized\"')
  }
  Document.findById(id)
    .then((doc) => {
      if (doc === null || !doc.is_owner(ctx.session.user)) {
        ctx.send('\"unauthorized\"')
      } else {
        doc.content = data.content
        doc.save()
      }
    })
}
export const load = function (ctx: HexnutCtx) {
  const data = ctx.message.body
  const id = data.id
  const user = ctx.session.user
  if (user === null) {
    ctx.send('\"unauthorized\"')
  } else {
    Document.findById(id).then(
      (doc: Document | null) => {
        if (doc === null || !doc.is_owner(user)) {
          ctx.send('\"unauthorized\"')
        } else {
          ctx.send(JSON.stringify({ query: "load", body: doc.client_content }))
        }
      })
  }
}

export const list = function (req: Request, res: ExpressResponse) {
  if (res.locals.user === null) return res.render('unauthorized');
  Document.getOwned(res.locals.user).then((docs) => {
    res.render('list_documents', { title: "The documents", documents: docs })
  }
  )
}

export const deleteDoc = function (ctx: HexnutCtx) {
  const data = ctx.message.body
  const id = data.id
  const user = ctx.session.user
  if (user === null) {
    ctx.send('\"unauthorized\"')
  }
  Document.findById(id)
    .then(async (doc) => {
      if (doc !== null && ctx.session.user !== null) {
        try {
          await ctx.oso.authorize(ctx.session.user, "write", doc);
          doc.remove()
        } catch {
          ctx.send('\"unauthorized\"')
        }
      } else {
        ctx.send('\"unauthorized\"')
      }
    })

}