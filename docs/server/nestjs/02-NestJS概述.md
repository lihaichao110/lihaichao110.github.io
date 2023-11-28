# NestJS 概述
## 目录结构
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

## 项目框架
Nest 旨在成为一个与平台无关的框架。 平台独立性使得创建可重用的逻辑部分成为可能，开发者可以在多种不同类型的应用中利用这些逻辑部分。 从技术上讲，一旦创建了适配器，Nest 就可以与任何 Node HTTP 框架一起工作。 开箱即用地支持两个 HTTP 平台： `express` 和 `fastify`。 你可以选择最适合你需要的一种。

| 框架 | 介绍 |
| --- | --- |
| `platform-express` | Express 是一个著名的 Node.js 极简 Web 框架。 这是一个经过实战检验、可用于生产的库，其中包含社区实现的大量资源。 默认使用 `@nestjs/platform-express` 包。 许多用户使用 Express 得到了很好的服务，不需要采取任何操作来启用它。 |
| `platform-fastify` | Fastify 是一个高性能和低开销的框架，高度专注于提供最大的效率和速度。 |

## 运行应用
安装过程完成后，你可以在操作系统命令提示符下运行以下命令以启动应用监听入站 HTTP 请求：
```bash
npm run start
```

要监视文件中的更改，你可以运行以下命令来启动应用：
```bash
npm run start:dev
```
## 语法检查和格式化
**CLI** 尽最大努力构建可靠的大规模开发工作流程。 因此，生成的 Nest 项目预装了代码 **语法检查器** 和 **格式化器**（分别为 **eslint** 和 **prettier**）。
```bash
# Lint and autofix with eslint
npm run lint

# Format with prettier
npm run format
```