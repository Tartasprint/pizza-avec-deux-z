const fs = require('fs')
const express = require('express');

const tm = require('markdown-it-texmath');
const md = require('markdown-it')({ html: true })
  .use(tm, {
    engine: require('katex'),
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });

const static = require('./routes/static')
const editor = require('./routes/editor')
const user = require('./routes/user');
const config = require('./config')
const common_view_params = require('./middleware/common_view_params')

exports.HTTPApp = (server, session_parser) => {
  const app = express();

  app.set('view engine', 'pug')
  app.set('views', "../views")
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session_parser)

  app.use(common_view_params);

  app.use('/static', static)
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