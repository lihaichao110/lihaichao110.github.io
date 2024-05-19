# DNS
该 `node:dns` 模块支持名称解析。例如，使用它来查找主机名的 IP 地址。

```js
const dns = require('node:dns')

// dns.lookup() 使用操作系统工具执行名称解析。它可能不需要执行任何网络通信
dns.lookup('blog.lihaichao.cn', (err, address, family) => {
  console.log('IP地址: %j IP类型: IPv%s', address, family);
  // 输出结果：IP地址: "139.196.175.142" IP类型: IPv4
})

dns.lookup('csdn.net', (err, addresses) => {
  if (err) throw err

  console.log(`IP地址数组: ${JSON.stringify(addresses)}`);

  // dns.reverse 执行反向 DNS 查询，将 IPv4 或 IPv6 地址解析为 主机名数组
  // lookupService ip 加端口进行解析
  dns.reverse(addresses, (err, hostnames) => {
    if (err) throw err;
    console.log(hostnames);
  })
})
```