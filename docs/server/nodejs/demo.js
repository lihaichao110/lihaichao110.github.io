const { pipeline, Readable } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
Readable.from([1, 2, 3, 4, 5]).pipe(zlib.createGzip()).pipe(fs.createWriteStream('./demo.txt.gz'));
const r = fs.createReadStream('./demo.txt');
const w = fs.createWriteStream('./demo2.txt');
r.pipe(w)