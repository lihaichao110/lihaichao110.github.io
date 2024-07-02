# Web Streams API
WHATWG 流标准的实现

## 概述
WHATWG 流标准（或“Web 流”）定义了用于处理流数据的 API。它类似于 Node.js Streams API，但后来出现，并已成为跨许多 JavaScript 环境中流式传输数据的“标准”API。

对象主要有三种类型：
- `ReadableStream` - 表示流数据源。
- `WritableStream` - 表示流式处理数据的目标。
- `TransformStream` - 表示用于转换流数据的算法。

## 例子
```js
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
