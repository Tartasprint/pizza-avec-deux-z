const js = require('./build-dist-js.cjs');
const css = require('./build-dist-css.cjs')

const task = () => { console.log("Building"); return Promise.all([js(), css()]).then(() => console.log("Built")) }
if (require.main === module) task()
else module.exports = task