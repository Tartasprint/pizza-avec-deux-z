const express = require('express');
const tm = require('markdown-it-texmath');
const md = require('markdown-it')({ html: true })
  .use(tm, {
    engine: require('katex'),
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });
const fs = require('fs')
const https = require('https')
const config = require('./config')
const app = express();
const { WebSocketServer } = require('ws');
const static = require('./static');

app.use('/static', static)

app.get('/editor', function (req, res) {
  res.render('editor', {
    title: 'Hey', content: md.render(
      fs.readFileSync('./page/test.md').toString()
    )
  })
})


app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey', content: md.render(
      fs.readFileSync('./page/test.md').toString()
    )
  })
})

const wsserver = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
})
const wss = new WebSocketServer({ server: wsserver });

wss.on('connection', socket => {
  console.log("New connection")
  socket.on('message', message => console.log(JSON.parse(message)));
  socket.on('close', ()=> console.log("Connection closed"))
});

const server = app.listen(config.normal_port, function () {
  console.log(`Normal server listening on port ${config.normal_port}!`)
});
wsserver.listen(config.ws_port, function () {
  console.log(`Websocket server listening on port ${config.ws_port}!`)
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});