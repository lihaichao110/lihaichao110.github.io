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



