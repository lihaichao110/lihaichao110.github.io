# util
该 `node:util` 模块支持 Node.js 内部 API 的需求。许多实用程序对应用程序和模块开发人员也很有用。要访问它：
```js
const util = require('node:util');
```
## util.callbackify(original)
接受一个 `async` 函数（或返回 的函数 `Promise` ），并返回一个遵循错误优先回调风格的函数，即以 `(err, value) => ...` 回调作为最后一个参数。在回调中，第一个参数将是拒绝原因（或null是否Promise 已解决），第二个参数将是已解决的值。
```js
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
将打印：

```markdown
hello world2
```

## util.types
`util.types` 为不同类型的内置对象提供类型检查。与 `instanceof` 或不同 `Object.prototype.toString.call(value)`，这些检查不会检查对象中可从 JavaScript 访问的属性（如其原型），并且通常具有调用 C++ 的开销。

结果通常不保证值在 JavaScript 中会显示哪些类型的属性或行为。它们主要对喜欢在 JavaScript 中进行类型检查的插件开发人员有用。

`require('node:util').types` 可以通过或访问 API `require('node:util/types')`

### util.types.isPromise(value)
检查 `value` 是否为 Promise。
```js
const util = require('node:util');

async function fn() {
  return 'hello world';
}

const isPromise = util.types.isPromise(fn());

console.log(isPromise);
```
更多判断类型的查看 [nodejs](https://nodejs.org/docs/latest/api/util.html)




