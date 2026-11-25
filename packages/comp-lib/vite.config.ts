import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 只有入口及其可达文件进 d.ts，避免把 stories 也声明出来
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/**/*.stories.ts", "src/**/*.test.ts"],
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 让 `@use "style/variables"` 在任意深度的组件里都能解析
        loadPaths: [fileURLToPath(new URL("./src", import.meta.url))],
      },
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.js",
    },
    // 组件库样式收敛成一个文件，使用方只需 import 一次
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: [
        "vue",
        "element-plus",
        "@element-plus/icons-vue",
        "canvaskit-wasm",
        "lodash-es",
        "highlight.js",
        /^element-plus\/.*/,
        /^@element-plus\/.*/,
        /^lodash-es\/.*/,
        /^highlight\.js\/.*/,
        /^node:.*/,
      ],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "index.css" : "assets/[name][extname]",
      },
    },
  },
});
