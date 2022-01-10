import { Router } from 'express';
const router = Router();
import { edit, new_form, new_doc, list } from '../controllers/editor.js';
import auth from '../middleware/auth.js';
router.use(auth())
router.get('/edit/:docid', edit)
router.get('/new', new_form)
router.post('/new', new_doc)
router.get('/list', list)

export default router