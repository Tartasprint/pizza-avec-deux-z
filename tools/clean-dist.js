const fs = require('fs/promises')

const task = () =>
    fs.rm("dist", { recursive: true })
        .then(() => { console.log("Cleaned.") })
        .catch((err) => { if (err.code !== 'ENOENT') { throw err } })


if (require.main === module) task()
else module.exports = task