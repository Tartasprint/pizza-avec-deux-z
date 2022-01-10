const browserify = require("browserify");
const glob = require("glob-promise");
const fsp = require('fs/promises');
const fs = require('fs')
const path = require('path');
const { distDir, srcDir } = require('./config.json');
const { default: postcss } = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const advanced = require('cssnano-preset-advanced')

const buildCss = (processor, dist, src) => async filename => {
    const filepath = path.parse(filename)
    const outdir = `${dist}/${filepath.dir}`
    const outminfile = `${dist}/${filepath.dir}/${filepath.name}.min${filepath.ext}`
    const outfile = `${dist}/${filepath.dir}/${filepath.base}`
    const outmapfile = outminfile + '.map'
    const infile = `${src}/${filename}`
    await fsp.mkdir(outdir, { recursive: true });
    const input = await fsp.readFile(infile);
    const result = await processor.process(input, { from: outfile, to: outminfile, sourceMap: true, map: { inline: false } });
    await Promise.all([
        fsp.writeFile(outminfile, result.css),
        fsp.writeFile(outfile, input),
        fsp.writeFile(outmapfile, result.map.toString())
    ])
}

const task = async () => {
    const test = cssnano({
        preset: advanced(),
        url: false,
        sourceMap: true
    })
    const other = autoprefixer
    const processor = postcss([test])
    const files = await glob(srcDir + '/**/*.css');
    return await Promise.all(files
        .map(name => name.slice((`${srcDir}/`).length))
        .map(buildCss(processor, distDir, srcDir)));
}
if (require.main === module) task()
else module.exports = task