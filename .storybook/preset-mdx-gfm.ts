/**
 * 给 MDX 编译管线补上 GFM。
 *
 * 为什么需要这个文件：Storybook 内置的 MDX 走 CommonMark，**不含 GFM**，
 * 所以管道表格不会被解析成 <table>，而是变成一个普通段落 —— 所有 `|`
 * 和分隔行原样显示成一长串文本。
 *
 * 接入点选 `mdxLoaderOptions` 而不是 `docs.mdxPluginOptions`：
 * addon-docs 的 Vite 插件在编译前会
 *   presets.apply("mdxLoaderOptions", fallback)
 * 而 `mdxLoaderOptions` 的返回值会**整体替换** fallback（不是深度合并），
 * 所以这里必须把 existing 展开回来，否则 providerImportSource 与
 * rehype 插件都会丢，MDX 里的 <Meta> / 组件引用将解析不到。
 */
import remarkGfm from "remark-gfm";

export function mdxLoaderOptions(existing: Record<string, unknown> = {}) {
  return {
    ...existing,
    mdxCompileOptions: {
      ...((existing.mdxCompileOptions as Record<string, unknown> | undefined) ?? {}),
      remarkPlugins: [remarkGfm],
    },
  };
}
