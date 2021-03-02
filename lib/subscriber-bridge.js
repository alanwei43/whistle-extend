var fs = require('fs');
var path = require('path');
var config = require('./config');

/**
 * subscriber.js 的桥接
 */

let subModule = {
    onHttp: function () { },
    onSendWebSocket: function () { },
    onReceiveWebSocket: function () { }
};

function initSubModule() {
    let modulePath = path.join(process.cwd(), "subscriber.js");
    if (process.env.SUBSCRIBER) {
        modulePath = path.resolve(process.env.SUBSCRIBER);
    }
    if (config.subscriber) {
        modulePath = path.resolve(config.subscriber);
    }

    if (!fs.existsSync(modulePath)) {
        console.log(`subscriber模块(${modulePath})不存在.`);
        return;
    }
    try {
        subModule = require(modulePath);
    } catch (err) {
        console.warn(`subscriber 模块(${modulePath})加载失败: `, err);
    }
}

/**
 * HTTP请求响应
 */
function emitHttp({
    req, res, proxy, data
}) {
    try {
        if (subModule && typeof subModule.onHttp === "function") {
            const host = req.hostname;
            const original = arguments[0];
            const msg = {
                config: {
                    name: proxy.config.name,
                    version: proxy.config.version,
                    dataDirname: proxy.config.dataDirname,
                    localUIHost: proxy.config.localUIHost,
                    port: proxy.config.port,
                    // sockets: proxy.config.sockets,
                    timeout: proxy.config.timeout,
                    enableH2: proxy.config.enableH2,
                    CONN_TIMEOUT: proxy.config.CONN_TIMEOUT,
                    baseDir: proxy.config.baseDir,
                    SYSTEM_PLUGIN_PATH: proxy.config.SYSTEM_PLUGIN_PATH,
                    CUSTOM_PLUGIN_PATH: proxy.config.CUSTOM_PLUGIN_PATH,
                    CUSTOM_CERTS_DIR: proxy.config.CUSTOM_CERTS_DIR,
                    uiport: proxy.config.uiport,
                    shadowRules: proxy.config.shadowRules,
                    middlewares: proxy.config.middlewares,
                    uiHostList: proxy.config.uiHostList,
                    rulesDir: proxy.config.rulesDir,
                    valuesDir: proxy.config.valuesDir,
                    propertiesDir: proxy.config.propertiesDir,
                    clientId: proxy.config.clientId,
                    LOCAL_FILES: proxy.config.LOCAL_FILES,
                    systemPluginPath: proxy.config.systemPluginPath,
                    // runtimeId: proxy.config.runtimeId,
                    // reqCacheSize: proxy.config.reqCacheSize,
                    // frameCacheSize: proxy.config.frameCacheSize,
                },
                req: {
                    isHttps: req.isHttps,
                    isWebProtocol: req.isWebProtocol,
                    isH2: req.isH2,
                    fullUrl: req.fullUrl,
                    host: host,
                    hostIp: req.hostIp,
                    clientIp: req.clientIp,
                    method: req.method,
                    httpVersion: req.httpVersion,
                    noReqBody: req.noReqBody,
                    query: req.query,
                    xhr: req.xhr,
                    headers: data.req.headers,
                    body: {
                        size: data.req.size,
                        base64: Buffer.isBuffer(data.req.body) ? data.req.body.toString("base64") : null
                    }
                },
                res: {
                    realUrl: res.realUrl,
                    headers: data.res.headers,
                    statusCode: res.statusCode,
                    port: data.res.port,
                    body: {
                        size: data.res.size,
                        base64: Buffer.isBuffer(data.res.body) ? data.res.body.toString("base64") : null
                    }
                },
                data: {
                    dnsTime: data.dnsTime,
                    endTime: data.endTime,
                    requestTime: data.requestTime,
                    id: data.id,
                    rules: data.rules
                }
            };
            subModule.onHttp(msg, original);
        }
    } catch (ex) {
        console.log(`subscriber 模块的 onHttp 方法抛出异常: `, ex);
    }
}

/**
 * 发送 WebSocket
 */
function emitWebSocketSender(frame) {
    try {
        if (subModule && typeof subModule.onSendWebSocket === "function") {
            subModule.onSendWebSocket(frame);
        }
    } catch (ex) {
        console.log(`subscriber 模块的 onSendWebSocket 方法抛出异常: `, ex);
    }
}

/**
 * 接收 WebSocket
 */
function emitWebSocketReceiver(frame) {
    try {
        if (subModule && typeof subModule.onReceiveWebSocket === "function") {
            subModule.onReceiveWebSocket(frame);
        }
    } catch (ex) {
        console.log(`subscriber 模块的 onReceiveWebSocket 方法抛出异常: `, ex);
    }
}

module.exports.emitHttp = emitHttp;
module.exports.emitWebSocketSender = emitWebSocketSender;
module.exports.emitWebSocketReceiver = emitWebSocketReceiver;
module.exports.initSubscribeModule = initSubModule;
