# whistle-extend

项目 fork 自 [whistle](https://github.com/avwo/whistle), 在此基础上扩展了一个功能: 将请求响应数据暴露给外部, 方便扩展更多功能(比如自动下载文件).

## 安装

```bash
mkdir whistle-test # 创建一个目录
cd whistle-test # 进入到目录
npm init -y # 初始化一个项目
npm install whistle-extend # 执行安装
touch subscriber.js # 项目根目录创建名为 subscriber.js 的文件(文件要存在项目根目录下)
```

## 命令行启动

```bash
npx w2 start --baseDir ./storage --port 3210 --certDir ./cert # 启动代理
```

## 程序启动

```js
const w2 = require('whistle-extend');
const path = require('path');

const PORT = 3210;
const dir = process.cwd();
w2({
    'port': PORT, // 代理监听的端口号
    'baseDir': path.join(dir, 'test', 'storage'), // 代理数据存储目录
    'copy': true, 
    'certDir': path.join(dir, 'test', 'storage', 'certs'), // 证书目录
    'subscriber': "subscriber.js", // 设置订阅 HTTP 和 WebSocket 值的Node模块地址
    "mode": "capture|classic", // 设置
}, function () {
    console.log(`access http://localhost:${PORT}`);
});
```

注意上述代码里的 `mode` 参数用于设置 Whistle 启动模式, 同时设置多个用 `|` 分隔开，如 `-M "pureProxy|debug|multiEnv|capture|disableH2|network|rules|plugins"`, 可选值参考 [命令行参数](https://wproxy.org/whistle/options.html)(命令行模式为: `w2 start[run] -M mode`): 

* `pureProxy`： 纯代理模式，对一些内置界面域名 local.whistlejs.com 也当初普通请求
* `debug`： 调试模式，会禁用一些超时设置及 dnsCache（不建议使用）
* `multiEnv`： 除了 Default 其它规则都不能启用，应用参见：** https://github.com/nohosts/nohost
* `capture`： 默认开启 Capture TUNNEL CONNECTs(是否开启HTTPS抓包)
* `disableH2`： 默认禁用 Enable HTTP/2
* `network`： 配置界面只显示 Network，支持 network|rules 或 netowrk|plugins
* `rules`： 配置界面只显示 Rules，支持 network|rules 或 rules|plugins，
* `plugins`： 配置界面只显示 Plugins，支持 rules|plugins 或 netowrk|plugins
* `safe`： 安全模式，禁用 rejectUnauthorized，如果服务端返回自定义证书会报错，默认忽略错误
* `notAllowedDisableRules`： 不允许禁用规则
* `notAllowedDisablePlugins`： 不允许禁用插件
* `classic`： 左侧菜单不显示 checkbox
* `socks`： socks模式，通过socks转发的请求默认走tunnel
* `keepXFF`： 是否自动带上 x-forwarded-for 请求头
* `buildIn`： 插件是否使用跟主进程一样的 Node 版本，默认是全局 Node，一般用于打包 electron 应用时使用

## `subscriber.js`文件内容如下

```js
module.exports = {
  /**
   * 接收HTTP请求
   */
  onHttp: function ({ req, res, proxy, data }) { },
  /**
   * 客户端向服务器发送 WebSocket 数据
   */
  onSendWebSocket: function ({ frame, error, extend }) { 
    // frame: { reqId, frameId, bin, length }
    // extend: { data, opts }
  },
  /**
   * 服务器向客户端发送 WebSocket 数据
   */
  onReceiveWebSocket: function ({ frame, error, extend }) { 
    // frame: { reqId, frameId, bin, length }
    // extend: { data, opts }
  }
}
```