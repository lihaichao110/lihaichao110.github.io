# 覆盖 Express API
Express API 包含请求和响应对象上的各种方法和属性。这些方法和属性通过原型继承。Express API 有两个扩展点：
- 全局原型的 `express.request` 和 `express.response`
- `app.request` 和 `app.response` 中的特定于应用程序的原型

更改全局原型将影响同一进程中所有已加载的 Express 应用

## 方法
您可以通过分配自定义函数来用自己的方法覆盖现有方法的签名和行为。

以下是覆盖 `res.sendStatus` 行为的示例
```js
app.response.sendStatus = function (statusCode, type, message) {
  // code is intentionally kept simple for demonstration purpose
  return this.contentType(type)
    .status(statusCode)
    .send(message)
}
```
上述实现完全改变了 的原始签名res.sendStatus。它现在接受 `状态代码`、`编码类型` 和 `要发送给客户端的消息`。

重写的方法现在可以这样使用：
```js
res.sendStatus(404, 'application/json', '{"error":"resource not found"}')
```

## 特性
Express API 中的属性包括：
- 已分配的属性（例如：`req.baseUrl`，`req.originalUrl`）
- 定义为 getter (例如: `req.secure`, `req.ip`)

req.ip以下代码重写了如何获取的值。现在，它只是返回 `Client-IP` 请求标头的值。
```js
Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get: function () { return this.get('Client-IP') }
})
```

