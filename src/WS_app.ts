import Hexnut from 'hexnut'
import handle from 'hexnut-handle'
import bodyparser from 'hexnut-bodyparser'

import * as editor from './controllers/editor.js'
import { load_user } from './middleware/common_view_params'
import { Ctx as CtxExt } from './models/websocket.js'
/**
 * @param{https.Server} server
 */
export const WSApp = (server, sessionParser) => {
  const app = new Hexnut<CtxExt>({ noServer: true });
  app.use(bodyparser.json());
  server.on('upgrade', function (request, socket, head) {
    sessionParser(request, {}, () => {
      // @ts-ignore: Unreachable code error
      app.server.handleUpgrade(request, socket, head, function (ws) { // @ts-ignore
        load_user(request).then((user) => {
          request.ws_ctx = { user: user }
          // @ts-ignore: Unreachable code error
          app.server.emit('connection', ws, request);
        })
      });
    });
  });
  app.use(handle.connect(ctx => {
    ctx.session = ctx['@@WebsocketRequest'].ws_ctx
  }))
  app.use(handle.matchMessage(msg => msg.query === "update", editor.update));
  app.use(handle.matchMessage(msg => msg.query === "load", editor.load));
  app.use(handle.matchMessage(msg => msg.query === "delete", editor.deleteDoc));
  app.start();
  return app
}