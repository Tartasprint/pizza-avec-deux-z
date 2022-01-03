const Hexnut = require('hexnut')
const handle = require('hexnut-handle')
const bodyparser = require('hexnut-bodyparser')

const editor = require('./controllers/editor')

exports.WSApp = (server) => {
  const app = new Hexnut({ server: server });
  app.use(bodyparser.json());
  app.use(handle.connect(ctx => {
    ctx.send('Welcome!');
    ctx.state = {
      messagesReceived: 0
    };
  }));
  app.use(handle.matchMessage(msg => msg.query === "update", editor.update));
  app.use(handle.matchMessage(msg => msg.query === "load", editor.load));
  app.use(handle.matchMessage(msg => msg.query === "delete", editor.delete));
  app.start()
  return app
}