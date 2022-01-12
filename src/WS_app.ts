import Hexnut from 'hexnut'
import handle from 'hexnut-handle'
import bodyparser from 'hexnut-bodyparser'

import * as editor from './controllers/editor.js'
import { load_user } from './middleware/common_view_params'
import { Server } from 'https'
import { TOso } from 'config/initOso.js'
import { HexnutExt } from 'models/session.js'
import { Request } from 'express'
/**
 * @param{https.Server} server
 */
export const WSApp = (server: Server, sessionParser: (req: Request, res: any, next: () => void) => void, oso: TOso) => {
  const app = new Hexnut<HexnutExt>({ noServer: true });
  app.use(bodyparser.json());
  server.on('upgrade', function (request: Request, socket, head) {
    sessionParser(request, {}, () => {
      // @ts-ignore
      app.server.handleUpgrade(request, socket, head, function (ws) { // @ts-ignore
        load_user(request).then((user) => {
          // @ts-ignore
          request.ws_ctx = { user: user }
          // @ts-ignore
          app.server.emit('connection', ws, request);
        })
      });
    });
  });
  app.use(handle.connect(ctx => {
    ctx.oso = oso
    // @ts-ignore
    ctx.session = ctx['@@WebsocketRequest'].ws_ctx
  }))
  app.use(handle.matchMessage(msg => msg.query === "update", editor.update));
  app.use(handle.matchMessage(msg => msg.query === "load", editor.load));
  app.use(handle.matchMessage(msg => msg.query === "delete", editor.deleteDoc));
  app.start();
  return app
}