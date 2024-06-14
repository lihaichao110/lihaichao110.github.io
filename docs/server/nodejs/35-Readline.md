# Readline
在控制台进行输入读取，这是一个非常有用的功能。

该 `node:readline` 模块提供了一个接口，用于一次一行从可读流（例如 `process.stdin` ）读取数据

要使用基于 promise 的 API，请执行以下操作：
```js
const readline = require('node:readline/promises');
```
要使用回调和同步 API，请执行以下操作：
```js
const readline = require('node:readline');
```
以下简单示例说明了该 `node:readline` 模块的基本用法
```js
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('你认为你会输入什么? ', (answer) => {
  console.log(`你输入的值: ${answer}`);

  rl.close();
});
```
调用此代码后，Node.js应用程序不会终止，直到关闭 `readline.Interface` ，因为接口会等待 `input` 在流上接收数据

## InterfaceConstructor
`InterfaceConstructor` 该类的实例是使用 `readlinePromises.createInterface()` or `readline.createInterface()` 方法构造的。每个实例都与一个 `input` 可读流和一个 `output` 可写流相关联。流 `output` 用于打印用户输入的提示，这些输入到达 `input` 流并从流中读取

## close 事件
当发生下列情况之一时，将发出该 `'close'` 事件：
- 调用该 `rl.close()` 方法
- `input` 流接收其 `'end'` 事件
- `input` 流接收 `Ctrl + D` 的信号
- `input` 流接收 `Ctrl` + `C` 信号 `SIGINT`, 并且 `InterfaceConstructor` 没有在实例上注册 `'SIGINT'` 事件侦听器
在不传递任何参数的情况下调用侦听器函数

发出 `'close'` 事件后， `InterfaceConstructor` 实例即完成

## line 事件
每当 `input` 流接收到行尾输入（`\n`、`\r` 或 `\r\n`）时，则会触发 `'line'` 事件。这通常在用户按 `Enter` 或 `Return` 时发生

如果从流中读取了新数据并且该流在没有最终行尾标记的情况下结束，也会触发 `'line'` 事件

使用包含单行接收输入的字符串调用监听器函数。
```js
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
## history 事件
每当历史数组发生更改时，则会触发 `'history'` 事件

使用包含历史数组的数组调用监听器函数。它将反映由于 `historySize` 和 `removeHistoryDuplicates` 引起的所有更改、添加的行和删除的行。

主要目的是允许监听器保留历史记录。监听器也可以更改历史对象。这可能有助于防止将某些行添加到历史记录中，例如密码

## pause 事件
发生以下情况之一时会触发 `'pause'` 事件：
- `input` 流已暂停
- `input` 流没有暂停并接收 `'SIGCONT'` 事件

## resume 事件
每当 `input` 流恢复时，则会触发 `'resume'` 事件。

调用监听器函数时不传入任何参数。

## SIGCONT 事件
当先前使用 `Ctrl`+`Z`（即 `SIGTSTP`）移至后台的 Node.js 进程随后使用 fg(1p) 返回前台时，会触发 `'SIGCONT'` 事件。

如果 `input` 流在 `SIGTSTP` 请求之前暂停，则不会触发此事件。

调用监听器函数时不传入任何参数。

`Windows` 不支持 `'SIGCONT'` 事件。

## SIGINT 事件
每当 `input` 流接收到 `Ctrl` + `C` 输入（通常称为 `SIGINT`）时，就会触发 `'SIGINT'` 事件。如果在 `input` 流接收到 `SIGINT` 时没有注册 `'SIGINT'` 事件监听器，则将触发 `'pause'` 事件。

## SIGTSTP 事件
当 `input` 流接收到 `Ctrl+Z` 输入（通常称为 `SIGTSTP`）时，会触发 `'SIGTSTP'` 事件。如果 `input` 流接收到 `SIGTSTP` 时没有注册 `'SIGTSTP'` 事件监听器，则 Node.js 进程将被发送到后台。

当使用 fg(1p) 恢复程序时，则将触发 `'pause'` 和 `'SIGCONT'` 事件。这些可用于恢复 `input` 流。

如果 input 在进程发送到后台之前暂停，则不会触发 `'pause'` 和 `'SIGCONT'` 事件。

调用监听器函数时不传入任何参数。