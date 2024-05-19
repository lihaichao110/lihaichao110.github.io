# HTTP
:::tip
要使用 HTTP 服务器和客户端，必须 `require('node:http')`
:::

## request
```js
request.flushHeaders() // 刷新请求标头
request.getHeader('Content-Type') // 读出请求的标头。该名称不区分大小写。返回值的类型取决于提供给 request.setHeader() 的参数。
request.getHeaderNames() // 返回一个数组，其中包含当前传出标头的唯一名称。 所有标头名称均为小写, ['foo', 'cookie']
request.getRawHeaderNames() // 返回一个数组，其中包含当前传出原始数据的唯一名称 头。返回标头名称，并设置其确切大小写, ['Foo', 'Set-Cookie'] 
request.hasHeader('content-type') // 如果当前在传出标头中设置了标识的 name 标头，则返回 true 。标头名称匹配不区分大小写。
request.maxHeadersCount // 限制最大响应标头计数。如果设置为 0，则不会应用任何限制。
request.path // 请求路径
request.method // 请求方法
request.host // 请求主机
request.protocol // 请求协议
request.removeHeader(name) // 删除已定义到 headers 对象中的标头 
request.setHeader(name, value) // 设置 headers 对象的单个标头值。如果此标头已存在于待发送标头中，则其值将被替换
```

## response
```js
// 此方法向服务器发出信号，表明所有响应标头和正文都已发送;该服务器应将此消息视为完整。必须在每个响应时调用方法 response.end() 
// 如果 data 指定，则其效果类似于后跟 response.end(callback) 的调用 response.write(data, encoding) 
// 如果 callback 指定，则将在响应流完成时调用它
response.end([data[, encoding]][, callback])
response.statusCode // 此属性控制在刷新标头时将发送到客户端的状态代码
response.statusMessage // 此属性控制在刷新标头时将发送到客户端的状态消息
```

## http
| 方法    | 描述      |
| ------ | ------- |
|http.METHODS | 分析器支持的 HTTP 方法的列表 |
| http.STATUS_CODES | 所有标准 HTTP 响应状态代码的集合，以及每个代码的简短说明 |
| http.validateHeaderName | 验证给定的标头名称是否有效 |
| http.validateHeaderValue | 验证给定的标头值是否有效 |
| http.setMaxIdleHTTPParsers(max) | 设置最大空闲 HTTP 解析器的数量 |

## createServer
`http.createServer([options][, requestListener])`
```js
const http  = require('node:http')
// 以下二种办法都可以实现网络请求
// http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' })
//   res.end(JSON.stringify({
//     data: 'hello'
//   }))
// }).listen(3007)


// `requestListener` 自动添加到 `request` 事件中的函数
const server = http.createServer()
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }))
}).listen(3007)
```

## get
`http.get(options[, callback])` 或者 `http.get(url[, options][, callback])`

调用 API 发送请求, 只能发送 get 请求
```js
const http  = require('node:http')

http.get('http://localhost:3007/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Any 2xx status code signals a successful response but
  // here we're only checking for 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
      // 输出结果：{ data: 'Hello World!' }
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});


// `requestListener` 自动添加到 `request` 事件中的函数
const server = http.createServer()
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }))
}).listen(3007)
```

## request
`http.request(options[, callback])` 或 `http.request(url[, options][, callback])`

调用 API 发送请求，可自定义请求方法类型
```js
const http  = require('node:http')

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  method: 'get',
  path: '/',
  port: 3007,
  hostname: 'localhost',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

const req = http.request(options, (res) => {
  console.log(`状态: ${res.statusCode}`);
  console.log(`header: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`数据: ${chunk}`);
  });
  res.on('end', () => {
    console.log('没有更多数据了');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();

http.createServer((req, res) => {
  res.end('Hello World!');
}).listen(3007)
```