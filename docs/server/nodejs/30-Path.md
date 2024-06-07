# Path
> 提供了用于处理文件和目录路径的实用程序. 可以使用以下方式访问它：

```js
const path = require('node:path');
```

## Windows 与 POSIX
`node:path` 模块的默认操作因运行Node.js应用程序的操作系统而异. 具体而言，在 Windows 操作系统上运行时，该 `node:path` 模块将假定正在使用 Windows 样式的路径

因此，在 POSIX 和 Windows 上使用 `path.basename()` 可能会产生不同的结果:

- 在 POSIX 上：
```js
path.basename('C:\\temp\\myfile.html');
// 返回：'C:\\temp\\myfile.html' 
```
- 在 Windows 上：
```js
path.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html' 
```
- 若要在任何操作系统上使用 Windows 文件路径时获得一致的结果，请使用 `path.win32` ：

在 POSIX 和 Windows 上：
```js
path.win32.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html' 
```
- 要在任何操作系统上使用 POSIX 文件路径时获得一致的结果，请使用 `path.posix` ：

在 POSIX 和 Windows 上：
```js
path.posix.basename('/tmp/myfile.html');
// 返回: 'myfile.html' 
```

## path.basename(path[, suffix])
- `suffix` 要删除的可选后缀

该 `path.basename()` 方法返回 path 的最后一部分，类似于 Unix basename 命令。尾随目录分隔符将被忽略。
```js
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回：'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html')
// 返回: 'quux' 
```
尽管 Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但此函数不会。例如， `C:\\foo.html` 引用 `C:\\foo.HTML` 同一文件，但 `basename` 将`扩展名视为区分大小写的字符串`：
```js
path.win32.basename('C:\\foo.html', '.html');
// 返回: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返回: 'foo.HTML' 
```
如果不是 `path` 字符串，或者 `suffix` 是给定的，但不是字符串，则抛出 `TypeError`

## path.delimiter
提供特定于平台的路径分隔符：
- `;` Windows 版
- `:` 用于 POSIX
例如，在 POSIX 上：
```js
console.log(process.env.PATH);
// 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin'] 
```
在 Windows 上：
```js
console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回 ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\'] 
```

## path.dirname(path)
该 `path.dirname()` 方法返回 path 的目录部分。
```js
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf' 
```
如果 `path` 不是字符串，则抛出 `TypeError` 

## path.extname(path)
`path.extname()` 方法返回 `path` 的扩展名，如果 `path` 不是字符串, 则抛出 `TypeError`
```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md' 
```

## path.format(pathObject)
该 `path.format()` 方法从对象返回路径字符串。这与 `path.parse()` 相反

pathObject 具有以下属性的任何 JavaScript 对象：
- `dir` 目录部分
- `root` 根部分
- `name` 文件名
- `ext` 扩展名
- `base` 去除扩展名的文件名

注意属性的优先级，pathObject 请记住，在某些组合中，一个属性优先于另一个属性：
- 如果提供了 `pathObject.dir`，则忽略 `pathObject.root`
- 如果 `pathObject.base` 存在，则忽略 `pathObject.ext` 和 `pathObject.name`

例如，在 POSIX 上：
```js
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// 返回: '/home/user/dir/file.txt'

path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// 返回: '/file.txt'

path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// 返回: '/file.txt'

path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// 返回: '/file.txt' 
```
在 Windows 上：
```js
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// 返回: 'C:\\path\\dir\\file.txt' 
```

## path.isAbsolute(path)
来确定是否 `path` 为绝对路径，如果给定 path 的字符串长度为零， 则返回 false

例如，在 POSIX 上：
```js
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false 
```

在 Windows 上：
```js
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false 
```

## path.join([...paths])
`...paths` 一系列路径段

使用特定于平台的分隔符作为分隔符将所有给定 path 的段连接在一起，然后对生成的路径进行规范化

零长度 `path` 段将被忽略。如果连接的路径字符串是零长度字符串，则 `'.'` 将返回，表示当前工作目录
```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path 必须是字符串. 收到 {}'
```

## path.normalize(path)
对给定 `path` 的、解析 `'..'` 的和 `'.'` 段进行归一化

当找到多个连续的路径段分隔字符时（例如， `/` 在 POSIX 和 `\` Windows `/` 上），它们将被特定于平台的路径段分隔符的单个实例替换（ `/` 在 POSIX 和 `\` Windows 上）。尾随分隔符被保留。

如果 是 `path` 长度为零的字符串， `'.'` 则返回，表示当前工作目录

例如，在 POSIX 上：
```js
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf' 
```
在 Windows 上：
```js
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\' 
```
由于 Windows 可识别多个路径分隔符，因此这两个分隔符都将替换为 Windows 首选分隔符 （ `\`） 的实例：
```js
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Returns: 'C:\\temp\\foo\\bar' 
```

## path.parse(path)
该 `path.parse()` 方法返回一个对象，其属性表示 的重要元素。 `path` 尾随目录分隔符将被忽略

例如，在 POSIX 上：
```js
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 
```
```bash
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```
在 Windows 上：
```js
path.parse('C:\\path\\dir\\file.txt');
// Returns:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 
```
```bash
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
```

## path.posix
该 `path.posix` 属性提供对 `path` 方法的 POSIX 特定实现的访问

该 API 可通过 `require('node:path').posix` 或 `require('node:path/posix')` 访问

## path.relative(from, to)
该 `path.relative()` 方法返回基于当前工作目录的相对 `from` 路径 `to` 。如果 `from` 和 `to` 每个解析为相同的路径（在调用 `path.resolve()` 每个路径后），则返回一个长度为零的字符串。

如果将零长度字符串作为 `from` 或 `to` 传递，则将使用当前工作目录而不是零长度字符串。

例如，在 POSIX 上：
```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Returns: '../../impl/bbb' 
```
在 Windows 上：
```js
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Returns: '..\\..\\impl\\bbb'
```
## path.resolve([...paths])
该 `path.resolve()` 方法将一系列路径或路径段解析为绝对路径。

给定的路径序列从右到左处理，每个后续路径都放在前面，直到构造绝对路径. 例如，给定路径段序列：`/foo`、`/bar`、`baz`，调用 `path.resolve('/foo', '/bar', 'baz')` 将返回 `/bar/baz`，因为 `'baz'` 不是绝对路径，但 `'/bar' + '/' + 'baz'` 是。

如果在处理完所有给定 `path` 段后，尚未生成绝对路径，则使用当前工作目录

生成的路径将被规范化，尾部斜杠将被删除，除非该路径被解析为根目录

如果未 `path` 传递任何段， `path.resolve()` 则将返回当前工作目录的绝对路径
```js
path.resolve('/foo/bar', './baz');
// Returns: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Returns: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node,
// 返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

## path.sep
提供特定于平台的路径段分隔符：
- `\` 在 Windows 上
- `/` 在POSIX上
例如，在 POSIX 上：
```js
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```
在 Windows 上：
```js
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```
在 Windows 上，正斜杠 （ `/` ） 和反斜杠 （ `\` ） 都接受为路径段分隔符;但是，这些 `path` 方法仅添加向后斜杠 （ `\` ）。

## path.toNamespacedPath(path)
仅在 Windows 系统上，返回给定 `path` 如果不是 `path` 字符串， `path` 则不加修改即可返回

此方法仅在 Windows 系统上有意义。在 POSIX 系统上，该方法是非操作的，并且始终不加修改地返回 `path` 。

## path.win32
该 `path.win32` 属性提供对 `path` 特定于 Windows 的方法实现的访问。

该 API 可通过 `require('node:path').win32` 或 `require('node:path/win32')` 访问