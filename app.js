const fs = require('fs')
const https = require('https')
const express = require('express');

const tm = require('markdown-it-texmath');
const md = require('markdown-it')({ html: true })
  .use(tm, {
    engine: require('katex'),
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });

const config = require('./config')
const static = require('./routes/static')
const editor = require('./routes/editor')

const app = express();

app.set('view engine', 'pug')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', static)
app.use('/editor', editor)

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey', content: md.render(
      fs.readFileSync('./page/test.md').toString()
    )
  })
})

exports.app = app

exports.server = https.createServer(config.credentials,app).listen(config.normal_port, function () {
    console.log(`Normal server listening on port ${config.normal_port}!`)
  });