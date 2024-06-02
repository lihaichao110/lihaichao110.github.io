# HTTPS
> HTTPS 是基于 TLS/SSL 的 HTTP 协议。在Node.js中，这是作为一个单独的模块实现的

**使用前：要确定加密支持是否可用**
## 捕获错误
```js
let https;
try {
  // 使用 ESM 时，如果代码有可能在未启用加密支持的 Node.js 版本上运行，
  // 请考虑使用该 import() 函数而不是 lexical import 关键字：
  // https = await import('node:https');
  https = require('node:https');
} catch (err) {
  console.error('https 模块不可用!');
} 
```

## https.Agent
> 类似于 的 HTTPS Agent 对象 http.Agent 
```js
new Agent([options])
options = {
  maxCachedSessions: 'TLS 缓存会话的最大数目。用于 0 禁用 TLS 会话缓存。默认值： 100'
  servername: '要发送到服务器的“服务器名称指示”扩展名的值, 使用空字符串 '' 禁用发送扩展, 
  // 默认值：目标服务器的主机名，除非使用 IP 地址指定目标服务器，在这种情况下，默认值为 '' （无扩展名）'
}
```

## keylog事件
>当由此代理管理的连接生成或接收密钥材料时（通常在握手完成之前，但不一定），将发出该 keylog 事件。可以存储此密钥材料以进行调试，因为它允许解密捕获的 TLS 流量。对于每个套接字，它可以多次发出。

一个典型的用例是将接收到的行附加到一个通用的文本文件中，稍后由软件（如 Wireshark）使用该文件来解密流量：
```js
const https = require('node:https')
const fs = require('node:fs')

https.globalAgent.on('keylog', (line, tlsSocket) => {
  console.log(line, 'line')
  fs.appendFileSync('./ssl-keys.log', line + '\n', { mode: 0o600 })
})
```

## https.Server
`参照http.server`
