# Zlib
该 `node:zlib` 模块提供使用 Gzip、Deflate/Inflate 和 Brotli 实现的压缩功能。访问方式：
```js
const zlib = require('node:zlib');
```
压缩和解压缩是围绕 Node.js `Streams API` 构建的。

压缩或解压缩流（例如文件）可以通过将源流通过 `zlib` `Transform` 流传输到目标流来完成：
```js
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```




