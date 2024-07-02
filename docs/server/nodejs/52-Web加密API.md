# Web Crypto API
`使用这个 API 需要 Nodejs 版本，>= 18.4.0`

Node.js提供了标准 Web 加密 API 的实现。

使用 `globalThis.crypto` 或 `require('node:crypto').webcrypto` 访问此模块。
```js
const { subtle } = globalThis.crypto;

(async function() {

  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const enc = new TextEncoder();
  const message = enc.encode('I love cupcakes');

  const digest = await subtle.sign({
    name: 'HMAC',
  }, key, message);

})();
```

## 示例
### 生成密钥
该 `SubtleCrypto` 类可用于生成对称（密钥）密钥或非对称密钥对（公钥和私钥）

### AES 密钥
```js
const { subtle } = globalThis.crypto;

async function generateAesKey(length = 256) {
  const key = await subtle.generateKey({
    name: 'AES-CBC',
    length,
  }, true, ['encrypt', 'decrypt']);

  return key;
}
```
### ECDSA 密钥对
```js
const { subtle } = globalThis.crypto;

async function generateEcKey(namedCurve = 'P-521') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'ECDSA',
    namedCurve,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}
```

