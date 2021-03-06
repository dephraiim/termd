const fs = require('fs');
const { resolve } = require('path');
const tsc = require('tsc-prog');
const rm = require('rimraf');
const package = require('./package.json');

if (fs.existsSync(resolve('dist'))) rm.sync('dist');

const file = resolve('index.ts');
let fileContents = fs.readFileSync(file, 'utf8');
let formatted = fileContents.replace(/#!\/usr\/bin\/env ts-node/g, '#!/usr/bin/env node');
package.bin.termd = 'index.js';

fs.writeFileSync(file, formatted, 'utf8');

tsc.build({
    basePath: __dirname,
    configFilePath: 'tsconfig.json',
    compilerOptions: {
        outDir: 'dist',
        declaration: true,
        skipLibCheck: true,
    },
    exclude: ['./test'],
});

fileContents = fs.readFileSync(file, 'utf8');
formatted = fileContents.replace(/#!\/usr\/bin\/env node/g, '#!/usr/bin/env ts-node');
fs.writeFileSync(file, formatted, 'utf8');

fs.copyFileSync('package.json', './dist/package.json');
fs.copyFileSync('readme.md', './dist/readme.md');

package.bin.termd = 'index.ts';
