import Hexnut from 'hexnut'
import handle from 'hexnut-handle'
import bodyparser from 'hexnut-bodyparser'

import * as editor from './controllers/editor.js'
import MongoStore from 'connect-mongo'
import https from 'https'
/**
 * @param{https.Server} server
 */
export const WSApp = (server, sessionParser) => {
  const app = new Hexnut({ noServer: true });
  // @ts-ignore: Unreachable code error
  app.use(bodyparser.json());
  server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
      console.log('Session is parsed!');
      // @ts-ignore: Unreachable code error
      app.server.handleUpgrade(request, socket, head, function (ws) { // @ts-ignore
        request.headers.session = request.session
        // @ts-ignore: Unreachable code error
        app.server.emit('connection', ws, request);
      });
    });
  });
  app.use(handle.connect(ctx => {
    // @ts-ignore: Unreachable code error
    ctx.session = ctx.requestHeaders.session
  }))
  app.use(handle.matchMessage(msg => msg.query === "update", editor.update));
  app.use(handle.matchMessage(msg => msg.query === "load", editor.load));
  app.use(handle.matchMessage(msg => msg.query === "delete", editor.deleteDoc));
  app.start();
  return app
}