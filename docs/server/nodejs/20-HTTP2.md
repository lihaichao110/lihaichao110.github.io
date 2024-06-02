# HTTP/2
> 该 node:http2 模块提供了 HTTP/2 协议的实现。可以使用以下方式访问它：

```js
const http2 = require('node:http2');
```

## 确定加密支持是否可用
如果不予许使用，将导致引发错误
```js
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 支持被禁用！');
} 
```

### 使用 ESM 时，如果代码有可能在未启用加密支持的 Node.js 版本上运行
```js
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 不予许禁用！');
} 
```

## 服务器端示例
```js
const http2 = require('node:http2')
const fs = require('node:fs')

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
})

server.on('error', (err) => console.log('error', err))

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  })

  stream.end('<h1>Hello World</h1>')
})

server.listen(8443)
// 访问地址：https://localhost:8443/
```

### 若要生成此示例的证书和密钥，请运行：
```js
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

## 客户端示例
```js
const http2 = require('node:http2')
const fs = require('node:fs')

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem')
})

client.on('error', (err) => console.log('error', err))

const req = client.request({ ':path': '/' })

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
})

req.setEncoding('utf8')

let data = ''
req.on('data', (chunk) => data += chunk)
req.on('end', () => {
  console.log(`\n${data}`)
  client.close()
})

req.end()
```