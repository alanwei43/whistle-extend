var fs = require('fs');
var path = require('path');


function getModule(filePath) {
    let modulePath = path.join(process.cwd(), "subscriber.js");
    if (process.env.SUBSCRIBER) {
        modulePath = path.resolve(process.env.SUBSCRIBER);
    }
    if (filePath) {
        modulePath = path.resolve(filePath);
    }
    if (!fs.existsSync(modulePath)) return null;
    try {
        return require(modulePath);
    } catch (err) {
        console.warn(err);
        return null;
    }
}

module.exports = function ({
    req, res, proxy, data
}) {
    try {
        const module = getModule(proxy.config["subscriber"]);
        if (!module || typeof module !== "function") {
            return;
        }
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
        module(msg, original);
    } catch (ex) {
        console.log(ex);
    }
}