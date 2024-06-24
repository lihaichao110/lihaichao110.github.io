# dgram (数据报)
`dgram` 模块提供了 UDP 数据包 `socket` 的实现。
```js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`服务器异常：\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`服务器收到：${msg} 来自 ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`服务器监听 ${address.address}:${address.port}`);
});

server.bind(41234);
// 服务器监听 0.0.0.0:41234
```

## dgram.Socket 类
封装数据报功能。

`dgram.Socket` 使用 创建的新实例 `dgram.createSocket()`。`new` 关键字 不可用于创建 `dgram.Socket` 实例。
### 事件：'close'
`'close'` 使用 关闭套接字后，将发出此事件 `close()`。一旦触发，`'message'` 此套接字上将不再发出任何新事件。
### 事件：'connect'
`'connect'` 当套接字由于调用成功而与远程地址关联时，会发出该事件 `connect()`。
### 事件：'error'
每当发生任何错误时，都会发出该 `'error'` 事件。事件处理函数会传递一个 `Error` 对象。
### 事件：'listening'
一旦可寻址并可接收数据，就会 `'listening'` 发出该事件。这种情况会显式地发生，或者在第一次使用 发送数据时隐式发生。在监听之前，底层系统资源不存在，并且诸如和 之类的调用将失败。`dgram.Socketsocket.bind()socket.send()dgram.Socketsocket.address()socket.setTTL()`
### 事件：'message'
`'message'` 当套接字上有新的数据报可用时，会发出此事件。事件处理函数传递两个参数：`msg` 和 `rinfo`。

- `msg` | 消息。
- `rinfo` | 远程地址信息。
  - `address` | 发件人地址。
  - `family` | 地址系列（`'IPv4'` 或 `'IPv6'`）。
  - `port` | 发送方端口。
  - `size` | 消息大小。
















