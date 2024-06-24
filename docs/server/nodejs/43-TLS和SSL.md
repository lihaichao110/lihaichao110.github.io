# TLS（SSL）
该 `node:tls` 模块提供了基于 `OpenSSL` 构建的传输层安全性 (TLS) 和安全套接字层 (SSL) 协议的实现。可以使用以下方式访问该模块：

```js
const tls = require('node:tls');
```
## 确定加密支持是否不可用
Node.js 可以在不包含 `node:crypto` 模块支持的情况下构建。在这种情况下，尝试 `import` from `tls` 或调用`require('node:tls')` 将导致抛出错误。

当使用 `CommonJS` 时，可以使用 `try/catch` 捕获抛出的错误：
```js
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## TLS/SSL 概念
TLS/SSL 是一组依赖公钥基础设施 (PKI) 的协议，用于实现客户端和服务器之间的安全通信。在大多数情况下，每个服务器都必须有一个私钥。

私钥可以通过多种方式生成。下面的示例说明如何使用 OpenSSL 命令行界面生成 2048 位 RSA 私钥：
```shell
openssl genrsa -out ryans-key.pem 2048
```
使用 TLS/SSL，所有服务器（和某些客户端）都必须拥有证书。证书是与私钥相对应的公钥，由证书颁发机构或私钥所有者进行数字签名（此类证书称为“自签名”）。获取证书的第一步是创建证书签名请求 (CSR) 文件。
```shell
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem 
```
一旦生成 CSR 文件，就可以将其发送到证书颁发机构进行签名，或者用于生成自签名证书。

以下示例说明了使用 OpenSSL 命令行界面创建自签名证书：
```shell
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem 
```
一旦生成证书，就可以使用它来生成 `.pfx` 或 `.p12` 文件：
```shell
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
在哪里：
- `in`：是已签名的证书
- `inkey`：是关联的私钥
- `certfile`：将所有证书颁发机构 (CA) 证书串联到一个文件中，例如 `cat ca1-cert.pem ca2-cert.pem > ca-cert.pem`








