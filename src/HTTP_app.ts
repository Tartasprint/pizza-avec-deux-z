import fs from 'fs';
import express from 'express';

import tm from 'markdown-it-texmath';
import { default as markdown_it } from 'markdown-it'
import { default as katex } from 'katex'
const md = markdown_it({ html: true })
  .use(tm, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });

import staticR from './routes/static.js';
import editor from './routes/editor.js';
import user from './routes/user.js';
import common_view_params from './middleware/common_view_params.js';

export const HTTPApp = (server, session_parser) => {
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
      title: 'Hey', content: md.render(
        fs.readFileSync('../page/test.md').toString()
      )
    })
  })

  server.on('request', app)
  return app
}