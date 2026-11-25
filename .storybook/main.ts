import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import type { StorybookConfig } from "@storybook/vue3-vite";

/**
 * Storybook 10 + Vite。
 *
 * stories 直接写在各自包的 src 内，和源码同目录，
 * 实现改动与示例一眼能对上。
 */
const config: StorybookConfig = {
  stories: [
    "../packages/comp-lib/src/**/*.mdx",
    "../packages/comp-lib/src/**/*.stories.ts",
    "../packages/utils-lib/src/**/*.mdx",
    "../packages/utils-lib/src/**/*.stories.ts",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  /**
   * MDX 编译管线的补丁，见 preset-mdx-gfm.ts。
   *
   * Storybook 内置 MDX 是 CommonMark，不含 GFM，管道表格会被渲染成一整行文本。
   */
  presets: [fileURLToPath(new URL("./preset-mdx-gfm.ts", import.meta.url))],
  async viteFinal(config) {
    const srcDir = fileURLToPath(new URL("../packages/comp-lib/src", import.meta.url));

    // 显式加入 Vue 插件：story 直接 import 源码 .vue 时，
    // 框架自带的 templateCompilation 只覆盖部分场景
    config.plugins = [...(config.plugins ?? []), vue()];

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // story 里用包名导入，写法与真实使用者一致；指向源码便于热更新
      "@shaohui_jin/comp-lib": fileURLToPath(
        new URL("../packages/comp-lib/src/index.ts", import.meta.url),
      ),
      "@shaohui_jin/utils-lib": fileURLToPath(
        new URL("../packages/utils-lib/src/index.ts", import.meta.url),
      ),
    };

    config.css = config.css ?? {};
    config.css.preprocessorOptions = {
      ...config.css.preprocessorOptions,
      scss: {
        ...(config.css.preprocessorOptions?.scss as object),
        loadPaths: [srcDir],
      },
    };

    return config;
  },
};

export default config;
