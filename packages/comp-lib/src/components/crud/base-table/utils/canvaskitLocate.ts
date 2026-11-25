/**
 * CanvasKit `locateFile`：把 wasm 文件名解析成可 fetch 的 URL。
 *
 * 与站点版的关键区别：组件库发布后，`node_modules` 的相对深度不再成立，
 * 所以**不再猜路径**，只认两个来源：
 *
 * 1. 调用方通过 `skiaWasmBaseUrl`（BaseTable prop）或 `customBaseUrl` 指定的静态目录；
 * 2. 未指定时按「与当前 JS chunk 同目录」解析——这是 Vite / Rollup 打包后的默认布局，
 *    使用方把 `canvaskit.wasm` 放到 `assets/` 即可命中。
 *
 * skia 模式依赖 wasm，属于可选能力：`canvaskit-wasm` 是 optional peerDependency，
 * 使用方需要自己安装并自行提供 wasm 文件（详见 README）。
 *
 * 注意：`new URL` 的首参需避免模板字符串，否则 Vite 可能错误折叠静态资源路径。
 */
export function canvaskitLocateFile(file: string, customBaseUrl?: string): string {
  if (customBaseUrl) {
    return `${customBaseUrl.replace(/\/$/, "")}/${file}`;
  }
  // 浏览器环境才有 import.meta.url 指向 chunk 的能力；SSR / 测试环境给个占位
  if (typeof document === "undefined") {
    return file;
  }
  return new URL("./" + file, import.meta.url).href;
}
