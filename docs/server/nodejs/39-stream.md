# stream
流是用于在 Node.js 中处理流数据的抽象接口。`node:stream` 模块提供了用于实现流接口的 API。

Node.js 提供了许多流对象。例如，向 `HTTP` 服务器请求 和 `process.stdout` 

流可以是可读的、可写的、或两者兼而有之。所有的流都是 `EventEmitter` 的实例

node:stream 模块对于创建新类型的流实例很有用。通常不需要使用 `node:stream` 模块来消费流。

## 流的类型
Node.js 中有四种基本的流类型：
- `Writable`：可以写入数据的流（例如，`fs.createWriteStream()`）
- `Readable`：可以从中读取数据的流（例如，`fs.createReadStream()`）
- `Duplex`：Readable 和 Writable 的流（例如，`net.Socket`）
- `Transform`：可以对数据进行转换的流（例如，`zlib.createGzip()`）

此外，此模块还包括实用函数 `stream.pipeline()`、`stream.finished()`、`stream.Readable.from()` 和 `stream.addAbortSignal()`

## 流 Promise API
`stream/promises` API 为返回 `Promise` 对象（而不是使用回调）的流提供了一组替代的异步实用函数。API 可通过 `require('node:stream/promises')` 或 `require('node:stream').promises` 访问。
### stream.pipeline(source[, ...transforms], destination[, options])
### stream.pipeline(streams[, options])
简单示例：
```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```