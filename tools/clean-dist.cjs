const fs = require('fs/promises')
const config = require('./config.json')
const task = () =>
    fs.rm(config.distDir, { recursive: true })
        .then(() => { console.log("Cleaned.") })
        .catch((err) => { if (err.code !== 'ENOENT') { throw err } })


if (require.main === module) task()
else module.exports = task