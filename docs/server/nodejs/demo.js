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