# Docker 常见命令

![流程图](/static/docker/process.jpeg)

## docker pull — 下载镜像

### 什么是 pull？

`pull` 的中文意思是「拉取」，你可以理解为「下载」。

打个比方：你想吃泡面，先要去超市买泡面回来。`docker pull` 就是去 Docker 超市「买泡面」的动作 —— 把镜像从仓库下载到你电脑上。

### 举个例子

```bash
docker pull nginx:latest
```

这句话的意思是：从 Docker 仓库下载最新的 nginx 镜像。

就像你去超市说「给我来一包最新的泡面」一样。

### 常见用法

```bash
# 下载最新版镜像（latest 是默认标签）
docker pull nginx:latest

# 下载指定版本
docker pull mysql:8.0

# 下载私人镜像（需要登录）
docker pull my-registry.com/my-app:v1.0
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买（下载） |
| `push` | 卖给超市（上传） |
| `镜像` | 泡面（你要用的东西） |
| `仓库` | 超市（存放镜像的地方） |

## docker images — 查看本地镜像

### 什么是 images？

`images` 的中文意思是「镜像列表」，你可以理解为「查看你家里有什么泡面」。

打完比方：你去超市买了几包泡面回来，放在你家柜子里。`docker images` 就是打开柜子看看「你现在有哪些泡面」。

### 举个例子

```bash
docker images
```

执行后会列出你电脑上所有下载好的镜像，像这样：

```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    a6bd7106f0e4    2 days ago     187MB
mysql        8.0       7fa78k8l9m0n    3 days ago     450MB
redis        alpine    9f54e3f2b1c7    1 week ago     30MB
```

每列的意思：

| 列名 | 什么意思 |
|------|----------|
| REPOSITORY | 镜像的名字（泡面品牌） |
| TAG | 版本（泡面口味） |
| IMAGE ID | 镜像的唯一身份证 |
| SIZE | 镜像大小（占多少空间） |
| CREATED | 什么时候下载的 |

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `images` | 打开柜子看看家里有什么泡面 |

## docker rmi — 删除镜像

### 什么是 rmi？

`rmi` 是 `remove image` 的缩写，中文意思是「删除镜像」。

打个比方：柜子里的泡面过期了，或者你不需要了，就扔掉。`docker rmi` 就是「扔泡面」的动作 —— 删除你电脑上的镜像。

### 举个例子

```bash
# 删除指定的镜像
docker rmi nginx:latest
```

这句话的意思是：删除你电脑上的 nginx latest 镜像。

### 常见用法

```bash
# 通过名字删除
docker rmi nginx:latest

# 通过镜像ID删除（ID 只需要写前几位就够了）
docker rmi a6bd7106f0e4

# 强制删除（正在被容器使用的镜像）
docker rmi -f mysql:8.0
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `images` | 打开柜子看有什么泡面 |
| `rmi` | 把过期的泡面扔掉 |

## docker build — 构建镜像

### 什么是 build？

`build` 的中文意思是「构建」，你可以理解为「自己动手做泡面」。

打个比方：超市没有你想要的泡面口味，你就自己在家做一碗。`docker build` 就是根据你写的配方（Dockerfile），自己「做」出一个镜像来。

### 举个例子

```bash
docker build -t my-app:v1.0 .
```

这句话的意思是：根据当前目录的配方，做一个叫 `my-app:v1.0` 的镜像。

| 参数 | 什么意思 |
|------|----------|
| `-t` | 给镜像起个名字和版本号（tag） |
| `my-app:v1.0` | 镜像的名字是 my-app，版本是 v1.0 |
| `.` | 用当前目录的配方（Dockerfile） |

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `images` | 打开柜子看有什么泡面 |
| `rmi` | 把过期的泡面扔掉 |
| `build` | 自己在家做泡面 |

## docker save — 导出镜像

### 什么是 save？

`save` 的中文意思是「保存」，你可以理解为「把泡面打包带走」。

打个比方：你在家做好了泡面，想带到公司去吃。`docker save` 就是「把泡面打包成文件」的动作 —— 把镜像保存成一个压缩包，方便拷贝到其他电脑。

### 举个例子

```bash
docker save -o my-app.tar nginx:latest
```

这句话的意思是：把 nginx 镜像打包成 `my-app.tar` 文件。

| 参数 | 什么意思 |
|------|----------|
| `-o` | output，输出到文件 |
| `my-app.tar` | 打包后的文件名（一般用 .tar 结尾） |
| `nginx:latest` | 要打包的镜像 |

### 常见用法

```bash
# 导出单个镜像
docker save -o nginx.tar nginx:latest

# 导出多个镜像
docker save -o images.tar nginx:latest mysql:8.0 redis:alpine
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `images` | 打开柜子看有什么泡面 |
| `rmi` | 把过期的泡面扔掉 |
| `build` | 自己在家做泡面 |
| `save` | 把泡面打包带走 |

## docker load — 导入镜像

### 什么是 load？

`load` 的中文意思是「加载」，你可以理解为「把打包的泡面拆开」。

打个比方：朋友给你带了一包打包好的泡面到公司，你得拆开才能吃。`docker load` 就是「把打包好的文件还原成镜像」的动作 —— 把 .tar 文件导入到 Docker 里。

### 举个例子

```bash
docker load -i my-app.tar
```

这句话的意思是：把 `my-app.tar` 文件里的镜像导入到 Docker 里。

| 参数 | 什么意思 |
|------|----------|
| `-i` | input，指定要导入的文件 |

### 常见用法

```bash
# 导入镜像（-i 是 --input 的缩写）
docker load -i nginx.tar

# 导入镜像（另一种写法）
docker load < nginx.tar
```

### save 和 load 的关系

| 操作 | 比喻 |
|------|------|
| `save` | 把泡面打包带走 |
| `load` | 把打包的泡面拆开吃 |

### 使用场景

- 服务器无法联网时，用 `save` 导出镜像，拷贝到另一台服务器，再用 `load` 导入
- 备份镜像的时候用 `save`
- 重装系统后恢复镜像的时候用 `load`

## docker push — 上传镜像

### 什么是 push？

`push` 的中文意思是「推」，你可以理解为「把泡面放到超市货架上卖」。

打个比方：你家做的泡面很好吃，想让更多人吃到，就放到超市去卖。`docker push` 就是「把自己做的镜像上传到仓库」，让别人也能下载使用。

### 举个例子

```bash
docker push my-registry.com/my-app:v1.0
```

这句话的意思是：把 `my-app:v1.0` 镜像上传到仓库。

| 参数 | 什么意思 |
|------|----------|
| `my-registry.com` | 仓库地址（可以是 Docker Hub、阿里云、私有仓库等） |
| `my-app` | 镜像名字 |
| `v1.0` | 版本号 |

### 常见用法

```bash
# 上传到 Docker Hub（公共仓库）
docker push my-username/my-app:v1.0

# 上传到私有仓库
docker push my-registry.com/my-app:v1.0
```

### 前提条件

上传之前需要先登录仓库：

```bash
# 登录 Docker Hub
docker login

# 登录私有仓库
docker login my-registry.com
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `push` | 把泡面放到超市卖 |
| `save` | 把泡面打包带走 |
| `load` | 把打包的泡面拆开 |

## docker run — 创建并启动容器

### 什么是 run？

`run` 的中文意思是「运行」，你可以理解为「煮泡面开始吃」。

打个比方：你从超市买了泡面（或自己做的），现在要煮来吃。`docker run` 就是「把镜像跑起来变成容器」的动作 —— 这是 Docker 最常用的命令之一。

### 举个例子

```bash
docker run -d -p 80:80 nginx:latest
```

这句话的意思是：启动一个 nginx 容器，在后台运行，并把端口映射出来。

| 参数 | 什么意思 |
|------|----------|
| `-d` | 后台运行（detached），不占用当前终端 |
| `-p 80:80` | 把电脑的 80 端口映射到容器的 80 端口 |
| `nginx:latest` | 用哪个镜像来启动 |

### 常见用法

```bash
# 最简单的运行
docker run nginx:latest

# 后台运行
docker run -d nginx:latest

# 端口映射（访问电脑的 8080 就等于访问容器的 80）
docker run -d -p 8080:80 nginx:latest

# 给容器起个名字
docker run -d --name my-nginx nginx:latest

# 进入容器内部操作
docker run -it nginx:latest /bin/bash
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `pull` | 去超市买泡面 |
| `images` | 打开柜子看有什么泡面 |
| `rmi` | 把过期的泡面扔掉 |
| `build` | 自己在家做泡面 |
| `save` | 把泡面打包带走 |
| `load` | 把打包的泡面拆开 |
| `push` | 把泡面放到超市卖 |
| `run` | 煮泡面开始吃 |

## docker stop — 停止容器

### 什么是 stop？

`stop` 的中文意思是「停止」，你可以理解为「暂停泡面」。

打个比方：你正在吃泡面，突然有事要出门，就先把泡面放一边凉着。`docker stop` 就是「暂停容器」的动作 —— 容器还在，但已经暂停工作了。

### 举个例子

```bash
docker stop my-nginx
```

这句话的意思是：停止名为 `my-nginx` 的容器。

### 常见用法

```bash
# 通过容器名停止
docker stop my-nginx

# 通过容器ID停止
docker stop a1b2c3d4

# 停止多个容器
docker stop my-nginx my-mysql my-redis
```

### 和容器的对应关系

| 操作 | 比喻 |
|------|------|
| `run` | 煮泡面开始吃 |
| `stop` | 暂停泡面（放凉） |
| `start` | 继续吃凉了的泡面 |
| `rm` | 吃完把碗扔掉 |

### 注意

- `stop` 只是暂停，容器还在，可以用 `docker start` 重新启动
- 如果想彻底删除容器，要用 `docker rm`

## docker start — 启动容器

### 什么是 start？

`start` 的中文意思是「开始」，你可以理解为「继续吃泡面」。

打个比方：你之前有事出门，把泡面放凉了。现在事情办完了，回来继续吃。`docker start` 就是「重新启动被暂停的容器」的动作。

### 举个例子

```bash
docker start my-nginx
```

这句话的意思是：重新启动名为 `my-nginx` 的容器。

### 常见用法

```bash
# 启动容器
docker start my-nginx

# 如果要进入容器操作（交互模式）
docker start -i my-nginx

# 启动多个容器
docker start my-nginx my-mysql my-redis
```

### 和 stop 的关系

| 操作 | 比喻 |
|------|------|
| `run` | 煮泡面开始吃 |
| `stop` | 暂停泡面（放凉） |
| `start` | 继续吃凉了的泡面 |
| `rm` | 吃完把碗扔掉 |

### 简单理解

`start` 和 `stop` 是一对：
- `stop` = 暂停
- `start` = 继续

就像电视剧的「暂停」和「继续播放」一样。

## docker ps — 查看运行中的容器

### 什么是 ps？

`ps` 是 `process status` 的缩写，中文意思是「进程状态」，你可以理解为「看看桌上有哪些泡面在吃」。

打个比方：你煮了好几碗泡面，有的在吃，有的放凉了。`docker ps` 就是「看看现在哪些容器在运行」。

### 举个例子

```bash
docker ps
```

执行后会列出正在运行的容器，像这样：

```
CONTAINER ID   IMAGE        COMMAND                  CREATED        STATUS        PORTS                    NAMES
a1b2c3d4e5f6   nginx        "/docker-entrypoint.…"   2 hours ago    Up 2 hours    0.0.0.0:80->80/tcp       my-nginx
b2c3d4e5f6g7   mysql:8.0    "docker-entrypoint.s…"   3 hours ago    Up 3 hours    0.0.0.0:3306->3306/tcp   my-mysql
```

每列的意思：

| 列名 | 什么意思 |
|------|----------|
| CONTAINER ID | 容器的唯一身份证 |
| IMAGE | 用哪个镜像启动的 |
| COMMAND | 容器里运行的命令 |
| CREATED | 什么时候创建的 |
| STATUS | 容器的状态（Up 表示正在运行） |
| PORTS | 端口映射情况 |
| NAMES | 容器的名字 |

### 常见用法

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 只查看容器ID
docker ps -q
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `images` | 打开柜子看有什么泡面 |
| `ps` | 看看桌上哪些泡面在吃 |
| `stop` | 暂停泡面（放凉） |

## docker rm — 删除容器

### 什么是 rm？

`rm` 是 `remove` 的缩写，中文意思是「删除」，你可以理解为「吃完把碗扔掉」。

打个比方：你吃完泡面了，碗和筷子得扔掉。`docker rm` 就是「删除容器」的动作 —— 把容器彻底删掉，没了。

### 举个例子

```bash
docker rm my-nginx
```

这句话的意思是：删除名为 `my-nginx` 的容器。

### 常见用法

```bash
# 删除停止的容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx

# 删除多个容器
docker rm my-nginx my-mysql

# 删除所有已停止的容器
docker rm $(docker ps -a -q)
```

### rmi 和 rm 的区别

| 操作 | 比喻 | 删除的东西 |
|------|------|-----------|
| `rmi` | 扔掉泡面（柜子里的） | 镜像 |
| `rm` | 扔掉碗（吃完了的） | 容器 |

### 简单理解

| 操作 | 比喻 |
|------|------|
| `run` | 煮泡面开始吃 |
| `stop` | 暂停泡面（放凉） |
| `start` | 继续吃凉了的泡面 |
| `rm` | 吃完把碗扔掉 |

## docker logs — 查看容器日志

### 什么是 logs？

`logs` 的中文意思是「日志」，你可以理解为「看看泡面店老板记的账本」。

打个比方：泡面店老板每天把卖了多少、谁来了都记在账本上。`docker logs` 就是「查看容器运行过程中输出的日志」，方便排查问题。

### 举个例子

```bash
docker logs my-nginx
```

这句话的意思是：查看 `my-nginx` 容器的日志。

### 常见用法

```bash
# 查看日志（最新在最下面）
docker logs my-nginx

# 实时查看日志（像看电视直播一样）
docker logs -f my-nginx

# 只查看最后 100 行
docker logs --tail 100 my-nginx

# 查看指定时间之后的日志
docker logs --since 2024-01-01 my-nginx
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `logs` | 看泡面店的账本 |
| `-f` | 实时盯着账本更新 |

### 使用场景

- 网站打不开了？用 `logs` 看看容器报了什么错
- 数据库连不上？用 `logs` 看看是什么问题
- 排查问题必备命令

## docker exec — 进入容器操作

### 什么是 exec？

`exec` 的中文意思是「执行」，你可以理解为「钻进泡面碗里去看看」。

打个比方：你煮了泡面，想看看碗里水热不热、面条软不软。`docker exec` 就是「进入容器内部」执行命令，像钻进容器里一样操作。

### 举个例子

```bash
docker exec -it my-nginx /bin/bash
```

这句话的意思是：进入 `my-nginx` 容器内部，打开一个 bash 终端。

| 参数 | 什么意思 |
|------|----------|
| `-i` | interactive，保持标准输入打开 |
| `-t` | tty，分配一个终端 |
| `my-nginx` | 要进入的容器 |
| `/bin/bash` | 在容器里执行的命令（打开 bash） |

### 常见用法

```bash
# 进入容器（最常用）
docker exec -it my-nginx /bin/bash

# 进入容器（简单版）
docker exec -it my-nginx sh

# 不进入容器，执行单个命令
docker exec my-nginx ls -la

# 在 MySQL 容器里执行 SQL
docker exec -it my-mysql mysql -u root -p
```

### 简单理解

| 操作 | 比喻 |
|------|------|
| `logs` | 趴在碗边看里面 |
| `exec` | 钻进碗里去看看 |

### 使用场景

- 容器内部文件不对？用 `exec` 进去看看
- 想重启容器里的服务？用 `exec` 进去操作
- 调试容器网络？用 `exec` 进去检查
