import type { CanvasKit, Typeface } from "canvaskit-wasm";

/**
 * 解析 Skia 绘制文字用的 Typeface。
 *
 * 字体文件和 wasm 一样属于「可选能力」：组件库不内联 4MB+ 的中文字体，
 * 也不去猜 node_modules 的相对路径（发布后不成立）。两个来源：
 *
 * 1. 调用方通过 `typefaceUrl` 指定（推荐，可指向 CDN 或自建静态目录）；
 * 2. 未指定时尝试与当前 JS chunk 同目录的 `NotoSansSC-400.woff2`。
 *
 * 都取不到就回退 CanvasKit 内置默认字体 —— 中文会缺字形，但不会崩。
 */
export async function resolveSkiaTypeface(
  ck: CanvasKit,
  typefaceUrl?: string,
): Promise<Typeface | null> {
  const fallback = ck.Typeface.GetDefault();
  try {
    const url =
      typefaceUrl ?? /* @vite-ignore */ new URL("./NotoSansSC-400.woff2", import.meta.url).href;
    const buf = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    });
    return ck.Typeface.MakeTypefaceFromData(buf) ?? fallback;
  } catch {
    return fallback;
  }
}
