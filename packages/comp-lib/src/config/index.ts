/**
 * 组件库配置系统入口。
 *
 * 设计要点：配置在 install 时固化（代码默认值 → localStorage 覆盖 → provide + 注入 CSS 变量），
 * 运行时通过 saveConfig 写入 localStorage，下次加载生效。这样组件内部只读不改，不需要响应式传播。
 */
export { createCompLib, LIB_PLUGIN_KEY, resolveConfig, applyCssVars, configToCssVars } from "./configInjection";
export type { LibPluginHandle, PersistOptions } from "./configInjection";

export { default as ConfigProvider } from "./ConfigProvider.vue";
export { elementPlusLocale } from "./elementPlusLocale";
export { useLibConfig, useLibPlugin } from "./useLibConfig";
export { defaultLibConfig } from "./configDefaults";
export {
  primarySwatches,
  radiusTiers,
  themePresetSwatches,
  themePresets,
} from "./themePresets";
export type { ThemePresetKey } from "./themePresets";
export { libColorDefaults } from "./colorDefaults";

export type { LibConfig, LibThemeConfig, ResolvedLibConfig } from "./configTypes";
