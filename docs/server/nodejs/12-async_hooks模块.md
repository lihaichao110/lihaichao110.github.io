# 全称：Asynchronous context tracking
## 中文名：异步上下文跟踪
> 它们允许在 Web 请求的整个生命周期或任何其他异步持续时间内存储数据。它类似于其他语言中的线程本地存储。

```js
// 以下示例用于 AsyncLocalStorage 构建一个简单的记录器，获取异步上下文数据
const { AsyncLocalStorage } = require('node:async_hooks')
const http = require('node:http')

const asyncLocalStorage = new AsyncLocalStorage()

function logWithId(msg) {
  const id = asyncLocalStorage.getStore()
  console.log(`${id !== undefined ? id : '--'}`, msg);
}

let idSeq = 0
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('request start')
    setImmediate(() => {
      logWithId('finish')
      res.end()
    })
  })

}).listen(8080)

http.get('http://localhost:8080')
```