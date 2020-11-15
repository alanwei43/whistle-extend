项目 fork 自 [whistle](https://github.com/avwo/whistle), 扩展了一个功能, 将请求响应数据暴露给外部, 方便扩展更多功能(比如自动下载文件).

具体步骤如下:

```bash
mkdir whistle-test # 创建一个目录
cd whistle-test # 进入到目录
npm init -y # 初始化一个项目
npm install @js-core/whistle # 执行安装
touch subscriber.js # 项目根目录创建名为 subscriber.js 的文件, 如果文件存在于其他地方, 可以
npx w2 start --baseDir ./storage --port 3210 --certDir ./cert # 启动代理
```

`subscriber.js`文件内容如下

```js
module.exports = function({config, req, res, data}) {
	// your code
}
```