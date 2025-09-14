# 使用 Go 和 Gin 开发 RESTful API

## 教程简介

本教程基于 Go 官方文档，介绍如何使用 Go 和 Gin Web 框架编写 RESTful Web 服务 API 的基础知识。

**🎯 学习目标：** 构建一个具有两个端点的 RESTful API 服务器，管理复古爵士乐唱片数据。

### 前置条件

- **Go 1.16 或更高版本**
- **代码编辑工具**（任何文本编辑器都可以）
- **命令终端**（Linux/Mac 终端或 Windows PowerShell/cmd）
- **curl 工具**（用于测试 API）

## 第一步：设计 API 端点

在开发 API 时，通常从设计端点开始。如果端点易于理解，API 用户将获得更多成功。

### 端点设计

我们将创建以下端点：

#### `/albums`
- **GET** – 获取所有专辑的列表，以 JSON 形式返回
- **POST** – 从以 JSON 形式发送的请求数据中添加新专辑

#### `/albums/:id`
- **GET** – 通过 ID 获取专辑，以 JSON 形式返回专辑数据

## 第二步：创建项目文件夹

### 初始化项目

```bash
# 1. 创建项目目录
mkdir web-service-gin
cd web-service-gin

# 2. 创建模块管理依赖项
go mod init example/web-service-gin
# 输出：go: creating new go.mod: module example/web-service-gin
```

这个命令会创建一个 `go.mod` 文件，用于跟踪添加的依赖项。

## 第三步：创建数据

为了简化教程，我们将数据存储在内存中。更典型的 API 会与数据库交互。

**注意：** 将数据存储在内存中意味着每次停止服务器时专辑集都会丢失，然后在启动时重新创建。

### 编写代码

1. **创建 main.go 文件**

```go
package main
```

2. **定义专辑结构体**

```go
// album 表示有关专辑的数据
type album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}
```

**结构标记说明：** `json:"artist"` 指定当结构的内容序列化为 JSON 时字段的名称。如果没有它们，JSON 将使用结构体的大写字段名称——这种样式在 JSON 中并不常见。

3. **添加示例数据**

```go
// 专辑切片以填充专辑数据记录
var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}
```

## 第四步：编写处理程序返回所有项目

当客户端在 `GET /albums` 上发出请求时，我们希望以 JSON 格式返回所有专辑。

### 编写代码

1. **添加 getAlbums 函数**

```go
// getAlbums 以 JSON 格式响应所有专辑的列表
func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}
```

**代码解析：**
- 编写一个带 `gin.Context` 参数的 `getAlbums` 函数
- `gin.Context` 是 Gin 最重要的部分，它携带请求详细信息、验证和序列化 JSON 等
- 调用 `Context.IndentedJSON` 将结构序列化为 JSON 并添加到响应中
- 第一个参数是要发送到客户端的 HTTP 状态代码（`200 OK`）

2. **设置路由和启动服务器**

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.Run("localhost:8080")
}
```

**代码解析：**
- 使用 `Default` 初始化 Gin 路由器
- 使用 `GET` 函数将 `GET` HTTP 方法和 `/albums` 路径与处理程序函数相关联
- 传递 `getAlbums` 函数的**名称**（不是结果）
- 使用 `Run` 函数将路由器连接到 `http.Server` 并启动服务器

3. **添加导入语句**

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)
```

### 运行代码

1. **添加 Gin 模块依赖**

```bash
go get .
# 输出：go get: added github.com/gin-gonic/gin v1.7.2
```

2. **运行代码**

```bash
go run .
```

3. **测试 API**

```bash
curl http://localhost:8080/albums
```

**预期输出：**
```json
[
    {
        "id": "1",
        "title": "Blue Train",
        "artist": "John Coltrane",
        "price": 56.99
    },
    {
        "id": "2",
        "title": "Jeru",
        "artist": "Gerry Mulligan",
        "price": 17.99
    },
    {
        "id": "3",
        "title": "Sarah Vaughan and Clifford Brown",
        "artist": "Sarah Vaughan",
        "price": 39.99
    }
]
```

## 第五步：编写处理程序添加新项目

当客户端在 `/albums` 发出 `POST` 请求时，我们希望将请求正文中描述的专辑添加到现有专辑数据中。

### 编写代码

1. **添加 postAlbums 函数**

```go
// postAlbums 从请求体中收到的JSON中添加一个专辑
func postAlbums(c *gin.Context) {
    var newAlbum album

    // 调用 BindJSON 将收到的 JSON 绑定到 newAlbum
    if err := c.BindJSON(&newAlbum); err != nil {
        return
    }

    // 将新专辑添加到切片
    albums = append(albums, newAlbum)
    c.IndentedJSON(http.StatusCreated, newAlbum)
}
```

**代码解析：**
- 使用 `Context.BindJSON` 将请求正文绑定到 `newAlbum`
- 将从 JSON 初始化的 `album` 结构追加到 `albums` 切片
- 向响应添加 `201` 状态代码，以及表示添加的专辑的 JSON

2. **更新 main 函数**

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)
    router.Run("localhost:8080")
}
```

### 运行代码

1. **重新启动服务器**

```bash
go run .
```

2. **测试 POST 请求**

```bash
curl http://localhost:8080/albums \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"id": "4","title": "The Modern Sound of Betty Carter","artist": "Betty Carter","price": 49.99}'
```

**预期输出：**
```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Wed, 02 Jun 2021 00:34:12 GMT
Content-Length: 116

{
    "id": "4",
    "title": "The Modern Sound of Betty Carter",
    "artist": "Betty Carter",
    "price": 49.99
}
```

3. **验证专辑已添加**

```bash
curl http://localhost:8080/albums \
    --header "Content-Type: application/json" \
    --request "GET"
```

## 第六步：编写处理程序返回特定项目

当客户端向 `GET /albums/[id]` 发出请求时，我们希望返回 ID 与 `id` 路径参数匹配的专辑。

### 编写代码

1. **添加 getAlbumByID 函数**

```go
// getAlbumByID 查找 ID 值与客户端发送的 id 参数匹配的专辑，然后返回该专辑作为响应
func getAlbumByID(c *gin.Context) {
    id := c.Param("id")

    // 循环浏览专辑列表，查找 ID 值与参数匹配的专辑
    for _, a := range albums {
        if a.ID == id {
            c.IndentedJSON(http.StatusOK, a)
            return
        }
    }
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}
```

**代码解析：**
- 使用 `Context.Param` 从 URL 中检索 `id` 路径参数
- 循环访问切片中的 `album` 结构，查找其 `ID` 字段值与 `id` 参数值匹配的结构
- 如果找到，将该 `album` 结构序列化为 JSON 并返回 `200 OK`
- 如果专辑没有找到则返回 HTTP `404` 错误

2. **更新 main 函数**

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)
    router.Run("localhost:8080")
}
```

**注意：** 在 Gin 中，路径中项目前面的冒号表示该项目是路径参数。

### 运行代码

1. **重新启动服务器**

```bash
go run .
```

2. **测试根据 ID 获取专辑**

```bash
curl http://localhost:8080/albums/2
```

**预期输出：**
```json
{
    "id": "2",
    "title": "Jeru",
    "artist": "Gerry Mulligan",
    "price": 17.99
}
```

## 完整代码

以下是本教程构建的完整应用程序代码：

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

// album 表示有关专辑的数据
type album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}

// 专辑切片以填充专辑数据记录
var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)

    router.Run("localhost:8080")
}

// getAlbums 以 JSON 格式响应所有专辑的列表
func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

// postAlbums 从请求体中收到的JSON中添加一个专辑
func postAlbums(c *gin.Context) {
    var newAlbum album

    // 调用 BindJSON 将收到的 JSON 绑定到 newAlbum
    if err := c.BindJSON(&newAlbum); err != nil {
        return
    }

    // 将新专辑添加到切片
    albums = append(albums, newAlbum)
    c.IndentedJSON(http.StatusCreated, newAlbum)
}

// getAlbumByID 查找 ID 值与客户端发送的 id 参数匹配的专辑，然后返回该专辑作为响应
func getAlbumByID(c *gin.Context) {
    id := c.Param("id")

    // 循环浏览专辑列表，查找 ID 值与参数匹配的专辑
    for _, a := range albums {
        if a.ID == id {
            c.IndentedJSON(http.StatusOK, a)
            return
        }
    }
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}
```

## 总结

恭喜！您刚刚使用 Go 和 Gin 编写了一个简单的 RESTful Web 服务。

### 核心概念回顾

1. **Gin 路由器**：使用 `gin.Default()` 创建路由器
2. **路由定义**：使用 `router.GET()`, `router.POST()` 等方法定义路由
3. **处理函数**：接收 `*gin.Context` 参数的函数
4. **JSON 处理**：使用 `c.IndentedJSON()` 返回 JSON 响应
5. **参数获取**：使用 `c.Param()` 获取路径参数，`c.BindJSON()` 绑定请求体
6. **HTTP 状态码**：使用 `http.StatusOK`, `http.StatusCreated` 等常量

### 小白总结

**开发 RESTful API 的基本步骤：**

1. 🏗️ **设计端点**：确定需要哪些 URL 和 HTTP 方法
2. 📊 **定义数据结构**：创建表示数据的结构体
3. 🎯 **编写处理函数**：为每个端点编写处理逻辑
4. 🛣️ **配置路由**：将 URL 映射到处理函数
5. 🚀 **启动服务器**：运行应用程序

**记住这个模式：**
```go
// 1. 创建路由器
router := gin.Default()

// 2. 定义路由
router.GET("/path", handlerFunction)

// 3. 启动服务器
router.Run(":8080")
```

### 建议的下一步主题

- 如果您是 Go 新手，可以查看 [Effective Go](https://golang.org/doc/effective_go.html) 和 [如何编写 Go 代码](https://golang.org/doc/code.html)
- [Go Tour](https://tour.golang.org/) 是对 Go 基础知识的很好的分步介绍
- 有关 Gin 的更多信息，请参阅 [Gin Web 框架包文档](https://pkg.go.dev/github.com/gin-gonic/gin) 或 [Gin Web 框架文档](https://gin-gonic.com/)

## 参考资料

- [Go 官方 Gin 教程](https://go.dev/doc/tutorial/web-service-gin)
- [Gin 框架官方文档](https://gin-gonic.com/)
- [Go 语言官方文档](https://golang.org/doc/)