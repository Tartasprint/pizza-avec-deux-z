const HexNutClient = require('hexnut-client')
const handle = require('hexnut-handle')
const bodyparser = require('hexnut-bodyparser')

function main() {
    const documentINFO = document.getElementById('editorjs')
    const docId = documentINFO.dataset.documentid
    const client = new HexNutClient();
    client.connect("wss://localhost:3000/");
    client.use(bodyparser.json())
    client.use(handle.matchMessage(msg => msg.query === 'load', ctx => {
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
window.saveDocument = () => { }

