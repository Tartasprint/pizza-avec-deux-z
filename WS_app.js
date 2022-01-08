const Hexnut = require('hexnut')
const handle = require('hexnut-handle')
const bodyparser = require('hexnut-bodyparser')

const editor = require('./controllers/editor')
const MongoStore = require('connect-mongo')
const https = require('https')
/**
 * @param{https.Server} server
 */
exports.WSApp = (server, sessionParser) => {
  const app = new Hexnut({ noServer: true });
  app.use(bodyparser.json());
  server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
      console.log('Session is parsed!');
      app.server.handleUpgrade(request, socket, head, function (ws) {
        request.headers.session = request.session
        app.server.emit('connection', ws, request);
      });
    });
  });
  app.use(handle.connect(ctx => console.log(ctx.requestHeaders)))
  app.use(handle.matchMessage(msg => msg.query === "update", editor.update));
  app.use(handle.matchMessage(msg => msg.query === "load", editor.load));
  app.use(handle.matchMessage(msg => msg.query === "delete", editor.delete));
  app.start();
  return app
}