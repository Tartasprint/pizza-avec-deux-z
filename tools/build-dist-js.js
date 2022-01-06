const browserify = require("browserify");
const glob = require("glob-promise");
const fsp = require('fs/promises');
const fs = require('fs')
const path = require('path');
const { distDir, srcDir } = require('./config.json');
const { sleep } = require("sleep");
const task = async () => {
  const files = await glob(srcDir + '/**/*.js');
  return await Promise.all(files
    .map(name => name.slice((`${srcDir}/`).length))
    .map(async filename => {
      await fsp.mkdir(path.dirname(`${distDir}/${filename}`), { recursive: true });
      const output = fs.createWriteStream(`${distDir}/${filename}`);
      browserify(filename, { basedir: srcDir })
        .plugin('tinyify').bundle().pipe(output);
    }));
}
if (require.main === module) task()
else module.exports = task