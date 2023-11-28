<!-- [【Nestjs 安装】](/doc/nestjs/nestjs-start.md)
[【Nestjs 概述】](/doc/nestjs/nestjs-overview.md) -->
## NestJS 使用指南
> Nest 使用强大的 HTTP 服务器框架，如 Express（默认），也可以选择配置为使用 Fastify。

### 先决条件
请确保你的操作系统上安装了 **Node.js**（版本 >= 16）
### 安装
```bash
npm i -g @nestjs/cli
nest new 项目名
```

### 备择方案
```bash
git clone https://github.com/nestjs/typescript-starter.git project
cd project
npm install
npm run start
```

你还可以通过使用 npm（或 yarn）安装核心和支持文件从头开始手动创建新项目。 在这种情况下，当然，你将负责自己创建项目样板文件。
```bash
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```

## NestJS 概述
### 目录结构
将创建 `project-name` 目录，安装 node 模块和一些其他样板文件，将创建 `src/` 目录并填充几个核心文件

```
src
|- app.controller.spec.ts
|- app.controller.ts
|- app.module.ts
|- app.service.ts
|- main.ts
```

| 文件名称 | 描述 |
| ------ | ----- |
| `app.controller.ts` | 具有单一路由的基本控制器。 |
| `app.controller.spec.ts` | 控制器的单元测试。 |
| `app.module.ts` | 应用的根模块。 |
| `app.service.ts` | 具有单一方法的基本服务。 |
| `main.ts` | 使用核心函数 NestFactory 创建 Nest 应用实例的应用入口文件。 |

### 项目框架
Nest 旨在成为一个与平台无关的框架。 平台独立性使得创建可重用的逻辑部分成为可能，开发者可以在多种不同类型的应用中利用这些逻辑部分。 从技术上讲，一旦创建了适配器，Nest 就可以与任何 Node HTTP 框架一起工作。 开箱即用地支持两个 HTTP 平台： `express` 和 `fastify`。 你可以选择最适合你需要的一种。

| 框架 | 介绍 |
| --- | --- |
| `platform-express` | Express 是一个著名的 Node.js 极简 Web 框架。 这是一个经过实战检验、可用于生产的库，其中包含社区实现的大量资源。 默认使用 `@nestjs/platform-express` 包。 许多用户使用 Express 得到了很好的服务，不需要采取任何操作来启用它。 |
| `platform-fastify` | Fastify 是一个高性能和低开销的框架，高度专注于提供最大的效率和速度。 |

### 运行应用
安装过程完成后，你可以在操作系统命令提示符下运行以下命令以启动应用监听入站 HTTP 请求：
```bash
npm run start
```

要监视文件中的更改，你可以运行以下命令来启动应用：
```bash
npm run start:dev
```
### 语法检查和格式化
**CLI** 尽最大努力构建可靠的大规模开发工作流程。 因此，生成的 Nest 项目预装了代码 **语法检查器** 和 **格式化器**（分别为 **eslint** 和 **prettier**）。
```bash
# Lint and autofix with eslint
npm run lint

# Format with prettier
npm run format
```

## 控制器
> `提示`
>
> 要使用内置的 validation 快速创建 CRUD 控制器，你可以使用 CLI 的 `增删改查生成器`： nest g resource [name]

### 路由
在下面的示例中，我们将使用 @Controller() 装饰器，即 **required** 来定义一个基本控制器。 我们将指定 `cats` 的可选路由路径前缀。 在 `@Controller()` 装饰器中使用路径前缀可以让我们轻松地对一组相关路由进行分组，并最大限度地减少重复代码。 例如，我们可以选择将一组路由分组，这些路由管理与路由 `/cats` 下的猫实体的交互。 在这种情况下，我们可以在 `@Controller()` 装饰器中指定路径前缀 `cats`，这样我们就不必为文件中的每个路由重复该部分路径。
```js
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```
就这么简单。 Nest 为所有标准的 HTTP 方法提供装饰器： `@Get()`、`@Post()`、`@Put()`、`@Delete()`、`@Patch()`、`@Options()` 和 `@Head()`。 此外，`@All()` 定义了一个端点来处理所有这些。
> `提示`
>
> 要使用 CLI 创建控制器，只需执行 $ `nest g controller [name]` 命令。

### 路由通配符
也支持基于模式的路由。 例如，星号用作通配符，将匹配任何字符组合。
```js
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```
`'ab*cd'` 路由路径将匹配 `abcd`、`ab_cd`、`abecd` 等。 字符 `?`、`+`、`*` 和 `()` 可以在路由路径中使用，并且是它们对应的正则表达式的子集。 连字符 (`-`) 和点 `(.)` 由基于字符串的路径逐字解释。
> `警告`
>
> 仅 express 支持路由中间的通配符。



### 装饰器
| 装饰器 | 关键词 |
| --- | ------------------------------------------------------- |
| `@Request(), @Req()` | `req` |
| `@Response(), @Res()` | `res` |
| `@Next()` | `next` |
| `@Session()` | `req.session` |
| `@Param(key?: string)` | `req.params / req.params[key]` |
| `@Body(key?: string)` | `req.body / req.body[key]` |
| `@Query(key?: string)` | `req.query / req.query[key]` |
| `@Headers(name?: string)` | `req.headers / req.headers[name]` |
| `@Ip()` | `req.ip` |
| `@HostParam()` | `req.hosts` |

为了与跨底层 HTTP 平台（例如 Express 和 Fastify）的类型兼容，Nest 提供了 `@Res()` 和 `@Response()` 装饰器。 `@Res()` 只是 `@Response()` 的别名。 两者都直接暴露底层原生平台 `response` 对象接口。 使用它们时，你还应该导入底层库（例如 `@types/express`）的类型以充分利用它们。 请注意，当你在方法处理程序中注入 `@Res()` 或 `@Response()` 时，你将 Nest 放入该处理程序的 **库特定模式** 中，并且你负责管理响应。 这样做时，你必须通过调用 `response` 对象（例如，`res.json(...)` 或 `res.send(...)`）来触发某种响应，否则 HTTP 服务器将挂起。

### 状态码
默认情况下响应 状态码 始终为 200，但 POST 请求除外，其为 201。 我们可以通过在处理程序级别添加 `@HttpCode(...)` 装饰器来轻松更改此行为。
```js
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```
> `提示`
>
> 从 `@nestjs/common` 包中导入 `HttpCode`。

### 标头
**要指定自定义响应标头，你可以使用 @Header() 装饰器或库特定的响应对象（并直接调用 res.header()）。**

```js
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```
> 提示
>
> 从 `@nestjs/common` 包中导入 `Header`。

### 重定向
**要将响应重定向到特定 URL，你可以使用 `@Redirect()` 装饰器或库特定的响应对象（并直接调用 `res.redirect()`）。**

**`@Redirect()` 有两个参数，`url` 和 `statusCode`，两者都是可选的。 如果省略，`statusCode` 的默认值为 `302` (`Found`)。**

```js
@Post()
@Redirect('https://docs.nestjs.com', 301)
create() {
  return 'This action adds a new cat';
}
```
> 提示
>
> 从 `@nestjs/common` 包中导入 `Redirect`。
> 有时你可能希望动态确定 HTTP 状态代码或重定向 URL。 通过返回遵循 `HttpRedirectResponse` 接口（来自 `@nestjs/common`）的对象来完成此操作。

**返回值将覆盖传递给 `@Redirect()` 装饰器的任何参数。 例如：**
```js
@Get('docs')
@Redirect('https://nest.nodejs.cn', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://nest.nodejs.cn/v5/' };
  }
}
```

### 路由参数
当你需要接受 **动态数据** 作为请求的一部分时，具有静态路径的路由将不起作用（例如，`GET /cats/1` 以获取 ID 为 `1` 的猫）。 为了定义带参数的路由，我们可以在路由的路径中添加路由参数 **tokens**，以捕获请求 URL 中该位置的动态值。 下面 `@Get()` 装饰器示例中的路由参数令牌演示了这种用法。 可以使用 `@Param()` 装饰器访问以这种方式声明的路由参数，应将其添加到方法签名中。
> 提示:
> 带参数的路由应该在任何静态路径之后声明。 这可以防止参数化路径拦截发往静态路径的流量。

```js
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```
`@Param()` 用于装饰方法参数（上例中的 `params`），并使 **route** 参数可用作方法主体内该装饰方法参数的属性。 如上面的代码所示，我们可以通过引用 `params.id` 来访问 `id` 参数。 也可以传入一个特定的参数 token 给装饰器，然后在方法体中直接通过名称引用路由参数。

> 提示：
> 从 `@nestjs/common` 包中导入 `Param`。
```js
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

### 子域路由
**`@Controller` 装饰器可以采用 `host` 选项来要求传入请求的 HTTP 主机匹配某个特定值。**
```js
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

> 警告：由于 Fastify 缺乏对嵌套路由的支持，因此在使用子域路由时，应使用（默认）Express 适配器。
与路由 `path` 类似，`hosts` 选项可以使用标记来捕获主机名中该位置的动态值。 下面 `@Controller()` 装饰器示例中的主机参数令牌演示了这种用法。 可以使用 `@HostParam()` 装饰器访问以这种方式声明的主机参数，应将其添加到方法签名中
```js
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

### 作用域
对于来自不同编程语言背景的人来说，得知在 Nest 中几乎所有内容都是在传入请求之间共享的，可能会出乎意料。 我们有一个到数据库的连接池、具有全局状态的单例服务等。请记住，Node.js 不遵循请求/响应多线程无状态模型，在该模型中每个请求都由单独的线程处理。 因此，对于我们的应用，使用单例实例完全是 **safe**。

### 异步性
我们热爱现代 JavaScript，我们知道数据提取主要是 **asynchronous**。 这就是 Nest 支持 `async` 功能并与它配合使用的原因。
> 提示：详细了解 `async / await` 功能 [此处](https://kamilmysliwiec.com/typescript-2-1-introduction-async-await)

每个异步函数都必须返回 `Promise`。 这意味着你可以返回一个 Nest 能够自行解析的延迟值。 让我们看一个例子：
```js
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```
上面的代码是完全有效的。 此外，Nest 路由处理程序更强大，因为它能够返回 RxJS [可观察流](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)。 Nest 将自动订阅下面的源并获取最后触发的值（一旦流完成）。

以上两种方法都有效，你可以使用适合你要求的任何方法。



