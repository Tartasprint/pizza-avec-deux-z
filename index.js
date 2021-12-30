const express = require('express');
const tm = require('markdown-it-texmath');
const md = require('markdown-it')({html:true})
                  .use(tm, { engine: require('katex'),
                             delimiters: 'dollars',
                             katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } });
const fs = require('fs')
const app = express();
const port = 3000;
app.set('view engine', 'pug')
app.use('/static',express.static('static'))
app.use('/static/bootstrap',express.static('node_modules/bootstrap/dist'))
app.use('/static/markdown-it',express.static('node_modules/markdown-it/dist'))
app.get('/', function (req, res) {
   res.render('index', { title: 'Hey', content: md.render(
      fs.readFileSync('./page/test.md').toString()
   ) })
 })
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
