# 该 node:assert 模块提供了一组用于验证不变量的断言函数。
> 介绍：类似于前端的单元测试，可以用于断言输入和输出是否符合预期。

```js
// 该 node:assert 模块提供了一组用于验证不变量的断言函数。
// 介绍：类似于前端的单元测试，可以用于断言输入和输出是否符合预期。

// 二种方式进行模块导入
// const assert = require('node:assert/strict');
const assert = require('node:assert').strict

// 示例错误差异：
assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5])

// 执行输出错误信息：
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]



// 创建错误信息
// const { message } = new assert.AssertionError({
//   actual: 1,
//   expected: 2,
//   operator: 'lhc--deepEqual',
// })

// try {
//   assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5])
// } catch (err) {
  // 输出错误信息, 自定义内容
  // assert(err instanceof assert.AssertionError)
  // assert.strictEqual(err.message, message)
  // assert.strictEqual(err.name, 'AssertionError')
  // assert.strictEqual(err.actual, 1)
  // assert.strictEqual(err.expected, 2)
  // assert.strictEqual(err.code, 'ERR_ASSERTION')
  // assert.strictEqual(err.operator, 'lhc--deepEqual')
  // assert.strictEqual(err.generatedMessage, true)
// }

```