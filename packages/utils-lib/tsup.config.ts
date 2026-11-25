import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // 只产出 JS 与类型声明，不打包依赖（本包零运行时依赖）
  treeshake: true,
  target: "es2022",
});
