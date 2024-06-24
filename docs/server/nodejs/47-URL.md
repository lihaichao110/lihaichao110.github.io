# URL
该 `node:url` 模块提供用于 URL 解析和解析的实用程序。可以使用以下方式访问它：
```js
const url = require('node:url');
```
## URL 字符串和 URL 对象
URL 字符串是包含多个有意义组件的结构化字符串。解析后，将返回一个 URL 对象，其中包含每个组件的属性。

该 `node:url` 模块提供了两个用于处理 URL 的 API：
- 一个是特定于 Node.js 的旧版 API
- 一个是实现 Web 浏览器使用的相同WHATWG URL 标准的新 API。

请注意: 虽然Node.js遗留的特有的API并没有被弃用，但是保留的目的是用于向后兼容已有应用程序。因此新的应用程序请使用WHATWG API。

下面提供了 WHATWG 和旧版 API 之间的比较。URL 上方 显示了 `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` 旧版返回的对象的属性 `url.parse()`。URL 下方是 WHATWG `URL` 对象的属性。

WHATWG URL的 `origin` 属性包括 `protocol` 和 `host`, 但不包含 `username`、`password`.
```bash
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(行中的所有空格都应被忽略。它们纯粹用于格式化)
```
使用 WHATWG API 解析 URL 字符串：
```js
const { URL } = require('url');
const myURL =
  new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
```
在浏览器中，WHATWG URL在全局总是可用的，而在Node.js中，任何情况下打开 或使用一个链接都必须事先引用'url'模块：`require('url').URL`

使用旧版 API 解析 URL 字符串：
```js
const url = require('node:url');
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```
## 从组件构建 URL 并获取构建的字符串
```js
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
要获取构造的 URL 字符串，请使用 `href` 属性访问器：
```js
console.log(myURL.href); 
```

## URL API
### new URL(input[, base])
- `input` | 要解析的绝对或相对输入 URL。如果 `input` 是相对的，则 `base` 需要。如果 `input` 是绝对的，则将`base` 被忽略。如果 `input` 不是字符串，则先将其转换为字符串。
- `base` | `input` 如果不是绝对URL，则解析的基本 URL 。如果 `base` 不是字符串，则首先将其转换为字符串。

通过解析相对于 的 来创建一个新 `URL` 对象。如果 以字符串形式传递，它将被解析为等同于。`input base base new URL(base)`
```js
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
URL 构造函数可作为全局对象的属性访问。它也可以从内置的 url 模块导入：
```js
console.log(URL === require('node:url').URL); // Prints 'true'.
```
如果 `input` 或 `base` 是无效URLs，将会抛出 `TypeError`。请注意给定值将被强制转换为字符串。例如：
```js
const { URL } = require('url');
const myURL = new URL({ toString: () => 'https://example.org/' });
  // https://example.org/
```
主机名中出现的 `Unicode` 字符将使用 `Punycode` `input` 算法自动转换为 ASCII 。
```js
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```

如果事先不知道是否 `input` 是绝对 URL 并且 `base` 提供了，建议验证对象 `origin` 的URL是否是预期的。
```js
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

## url.hash
获取并设置 URL 的片段部分。
```js
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz
```
分配给属性的值中包含的无效 URL 字符hash是 `百分比编码` 的。选择要百分比编码的字符可能与 `url.parse()` 和 `url.format()` 方法产生的结果略有不同。
## url.host
获取并设置 URL 的主机部分。

```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Prints example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Prints https://example.com:82/foo
```
分配给该属性的无效主机值 `host` 将被忽略。
## url.hostname
获取和设置 URL 的主机名部分。 `url.host` 和之间的主要区别url.hostname, 在于 `url.hostname` 不包括端口。
```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Prints example.org

// Setting the hostname does not change the port
myURL.hostname = 'example.com';
console.log(myURL.href);
// Prints https://example.com:81/foo

// Use myURL.host to change the hostname and port
myURL.host = 'example.org:82';
console.log(myURL.href);
// Prints https://example.org:82/foo
```
分配给该属性的无效主机名值 `hostname` 将被忽略。

## url.href
获取并设置序列化的 URL。

```js
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Prints https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Prints https://example.com/bar
```
获取属性的值href相当于调用 `url.toString()`。

将此属性的值设置为新值相当于URL使用 创建一个新对象 `new URL(value)`。该对象的每个URL 属性都将被修改。

如果分配给该属性的值 `href` 不是有效的 URL，TypeError` 则会抛出。

## url.origin
获取 URL 来源的只读序列化。

origin 与 hostname 相似，但 `hostname` 不包括协议。
```js
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Prints https://example.org
```
```js
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Prints https://xn--g6w251d

console.log(idnURL.hostname);
// Prints xn--g6w251d
```
## url.password
获取并设置 `URL` 的密码部分。
```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.password);
// Prints xyz

myURL.password = '123';
console.log(myURL.href);
// Prints https://abc:123@example.com/
```

## url.pathname
获取并设置 `URL` 的路径部分。不包括携带的查询字符串和片段。
```js
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Prints /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Prints https://example.org/abcdef?123
```
## url.port
获取并设置 URL 的端口部分。

端口值可以是数字或包含 到 范围内数字的字符串 `0`（`65535`含）。将值设置为给 URL定对象的默认端口`protocol`将导致该`port`值变为空字符串（`''`）。

端口值可以是空字符串，在这种情况下端口取决于协议/方案：
| 协议/方案 | 默认端口 |
| --- | --- |
| ftp | 21 |
| file | 0 |
| http | 80 |
| https | 443 |
| ws | 80 |
| wss | 443 |

为端口分配值后，该值将首先使用 转换为字符串 `.toString()` 。

如果该字符串无效但以数字开头，则将前导数字分配给 `port` 。如果数字超出上述范围，则将其忽略。
```js
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Prints 8888

// 默认端口自动转换为空字符串
// HTTPS协议默认端口为443
myURL.port = '443';
console.log(myURL.port);
// 打印空字符串
console.log(myURL.href);
// Prints https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Prints 1234
console.log(myURL.href);
// Prints https://example.org:1234/

// 完全无效的端口字符串将被忽略
myURL.port = 'abcd';
console.log(myURL.port);
// Prints 1234

// 前导数字被视为端口号
myURL.port = '5678abcd';
console.log(myURL.port);
// Prints 5678

// 非整数被截断
myURL.port = 1234.5678;
console.log(myURL.port);
// Prints 1234

// 超出范围的数字，不以科学计数法表示
// 将被忽略。
myURL.port = 1e10; // 10000000000,将按如下所述进行范围检查

console.log(myURL.port);
// Prints 1234
```
包含小数点的数字（例如浮点数或科学计数法中的数字）不属于此规则的例外。小数点前的数字将设置为 URL 的端口（假设它们有效）：
```js
myURL.port = 4.567e21;
console.log(myURL.port);
// 打印 4（因为它是字符串 '4.567e21' 中的前导数字）
```
## url.protocol
获取并设置 URL 的协议部分。
```js
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Prints https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Prints ftp://example.org/
```
WHATWG URL 标准认为，一些 URL 协议方案 在解析和序列化方式方面比较特殊 `url.protocol`。当使用其中一种特殊协议解析 URL 时，属性可以更改为另一种特殊协议，但不能更改为非特殊协议，反之亦然。

例如，从 更改 `http` 为 `https` 有效：
```js
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
但是，从 变为 `http` 假设 `fish` 协议却不行，因为新协议并不特殊。
```js
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
## url.search
获取并设置 URL 的序列化查询部分。

```js
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Prints ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Prints https://example.org/abc?abc=xyz
```
## url.searchParams
获取 `URLSearchParams` 表示 URL 查询参数的对象。此属性是只读的，但 `URLSearchParams` 它提供的对象可用于改变 URL 实例；要替换 URL 的所有查询参数，请使用 setter url.search。 URLSearchParams有关详细信息，请参阅文档。
```js
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // prints ?foo=~bar

// Modify the URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // prints ?foo=%7Ebar
```

## url.username
获取并设置 URL 的用户名部分。
```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.username);
// Prints abc

myURL.username = '123';
console.log(myURL.href);
// Prints https://123:xyz@example.com/
```

## url.toString()
`toString()` 对象上的方法返回URL序列化的 URL。返回的值相当于 `url.href` 和的值 `url.toJSON()` 

## url.toJSON()
`toJSON()` 对象上的方法返回URL序列化的 URL。返回的值相当于 `url.href` 和 的值 `url.toString()`。

URL当使用 序列化对象时，会自动调用此方法 `JSON.stringify()`。
```js
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```

## URLSearchParams


















































