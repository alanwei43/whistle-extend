export interface PlainObject { [key: string]: any }

export interface WhistleOptions extends PlainObject {
    /**
     * 调试模式
     */
    debugMode: boolean
    /**
     * 代理监听端口号
     */
    port: number
    /**
     * 数据存储目录
     */
    baseDir: string
    copy: string
    /**
     * 证书目录
     */
    certDir: string
    /**
     * 数据订阅JS模块地址
     */
    subscriber: string
    mode: "capture" | string
}


const whistle: (options: WhistleOptions, callback: () => void) => void
export default whistle;