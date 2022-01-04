(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  json: (opts = {}) => {
    const {
      strictParsing = false
    } = opts;

    return async (ctx, next) => {
      if (ctx.type === 'message' && ctx.message) {
        try {
          ctx.message = JSON.parse(ctx.message.trim());
        } catch (ex) {
          if (strictParsing) throw ex;
        }
      }
      return await next();
    }
  }
};

},{}],2:[function(require,module,exports){
const ctx = {
  send(...args) {
    this.client.send(...args);
  },

  get isConnection() {
    return this.type === 'connection';
  },

  get isMessage() {
    return this.type === 'message';
  },

  get isClosing() {
    return this.type === 'closing';
  }
};

module.exports = (client, type, message) => Object.assign(Object.create(ctx), {
  client,
  type,
  message
});

},{}],3:[function(require,module,exports){
const createContext = require('./ctx');

class HexNutClient {
  constructor(wsConfig = {}, WebsocketClientImpl = null) {
    this.config = {
      ...wsConfig
    };
    this.client = null;
    this.middleware = [];
    this.runSequencer = Promise.resolve();

    this.WebsocketClientImpl = WebsocketClientImpl
      ? WebsocketClientImpl
      : WebSocket;
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  onError(err, ctx) {
    if (typeof this.onerror === 'function') {
      this.onerror(err, ctx);
    }
  }

  connect(remoteAddress) {
    this.client = new this.WebsocketClientImpl(remoteAddress);
    const ctx = createContext(this, 'connection');

    this.client.onopen = () => {
      this.runSequencer = this.runSequencer.then(() => this.runMiddleware(ctx));
    }

    this.client.onerror = err => this.onError(err, ctx);

    this.client.onmessage = msg => {
      this.runSequencer = this.runSequencer.then(() => {
        ctx.message = msg.data;
        ctx.type = 'message';
        return this.runMiddleware(ctx);
      });
    };

    this.client.onclose = () => {
      this.runSequencer = this.runSequencer.then(() => {
        ctx.message = null;
        ctx.type = 'closing';
        return this.runMiddleware(ctx);
      });
    };
  }

  close() {
    this.client.close();
  }

  send(...args) {
    if (this.isReady()) {
      this.client.send(...args);
    }
    return this;
  }

  isReady() {
    return this.client && this.client.readyState === this.WebsocketClientImpl.OPEN;
  }

  runMiddleware(ctx) {
    let i = 0;
    const run = async idx => {
      if (!ctx.isComplete && typeof this.middleware[idx] === 'function') {
        return await this.middleware[idx](ctx, () => run(idx+1));
      }
    };
    return run(i).catch(err => this.onError(err, ctx));
  }
};

module.exports = HexNutClient;
},{"./ctx":2}],4:[function(require,module,exports){
const connect = handler => (ctx, next) => {
  if (ctx.isConnection) {
    return handler(ctx, next);
  }
  return next();
};

const message = handler => (ctx, next) => {
  if (ctx.isMessage) {
    return handler(ctx, next);
  }
  return next();
};

const matchMessage = (handlerCheck, handler) => (ctx, next) => {
  if (typeof handlerCheck !== 'function') {
    throw new TypeError('Hexnut Handle Middleware: handlerCheck must be a function');
  }
  if (ctx.isMessage && handlerCheck(ctx.message)) {
    return handler(ctx, next);
  }
  return next();
};

const closing = handler => (ctx, next) => {
  if (ctx.isClosing) {
    return handler(ctx, next);
  }
  return next();
};

module.exports = {
  connect,
  message,
  matchMessage,
  closing
};

},{}],5:[function(require,module,exports){
const HexNutClient = require('hexnut-client')
const handle = require('hexnut-handle')
const bodyparser = require('hexnut-bodyparser')

function main() {
    const documentINFO = document.getElementById('editorjs')
    const docId = documentINFO.dataset.documentid
    const client = new HexNutClient();
    client.connect("wss://localhost:3000/");
    client.use(bodyparser.json())
    client.use(handle.matchMessage( msg => msg.query === 'load', ctx => {
        savedData = JSON.parse(ctx.message.body.content)
            console.log('Rendering', savedData)
            if (savedData.blocks.length > 0) {
                editor.render(savedData)
            } else {
                editor.blocks.clear()
            }
        }
    ))
    client.use(handle.connect(ctx => {
        ctx.send(JSON.stringify({ query: "load", body: { id: docId } }))
    }))

    saveDocument = function () {
        editor.save().then((outputData) => {
            savedData = JSON.stringify(outputData)
            console.log('Article data: ', savedData)
            query = { query: "update", body: { id: docId, content: savedData } }
            client.send(JSON.stringify(query));
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });

    }
}

function createEditor() {
    return new EditorJS({
        /** 
         * Id of Element that should contain the Editor 
         */
        holder: 'editorjs',
        autofocus: true,

        /** 
         * Available Tools list. 
         * Pass Tool's class or Settings object for each Tool you want to use 
         */
        tools: {
            header: {
                class: Header,
                inlineToolbar: true
            },
            underline: Underline,
            Marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
            },
            paragraph: {
                class: Paragraph,
                inlineToolbar: true
            },
            inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+E',
            },
        },
        data: {},
    })
}

const editor = createEditor()
Promise.all([
    editor.isReady,
    new Promise((resolve, reject) => {
        window.addEventListener('load', (e) => {
            resolve()
        })
    })])
    .then(main)
let saveDocument = () => { }


},{"hexnut-bodyparser":1,"hexnut-client":3,"hexnut-handle":4}]},{},[5]);
