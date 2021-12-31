const editor = new EditorJS({
    /** 
     * Id of Element that should contain the Editor 
     */
    holder: 'editorjs',

    /** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */
    tools: {
        header: Header,
    },
    data: {}
})
webSocket = new WebSocket("ws://localhost:3000/");
function save() {
    editor.save().then((outputData) => {
        console.log('Article data: ', JSON.stringify(outputData))
        
        webSocket.send(JSON.stringify(outputData));
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}
    

