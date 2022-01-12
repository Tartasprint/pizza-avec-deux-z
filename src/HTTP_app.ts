import fs from 'fs';
import express from 'express';
import staticR from './routes/static.js';
import editor from './routes/editor.js';
import user from './routes/user.js';
import common_view_params from './middleware/common_view_params.js';
import { Server } from 'https'

export const HTTPApp = (server: Server, session_parser: express.RequestHandler) => {
  const app = express();

  app.set('view engine', 'pug')
  app.set('views', "../views")
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session_parser)

  app.use(common_view_params);

  app.use('/static', staticR)
  app.use('/editor', editor)
  app.use('/auth', user)

  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Hey', content: fs.readFileSync('../page/test.md').toString()
    })
  })

  server.on('request', app)
  return app
}