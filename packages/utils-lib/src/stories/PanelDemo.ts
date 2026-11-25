/**
 * Storybook 里给纯函数用的面板外壳。
 *
 * 工具函数没有 props，autodocs 生成不出有意义的表格，所以每个 story
 * 都是「左侧改参数、右侧看结果」的小面板。这套布局复用度太高，
 * 抽成组件比在 9 个 stories 里各写一遍内联样式好维护。
 *
 * 注意：这个文件与被它 import 的 panel.css 只被 stories 引用，
 * 不进 dist，不影响 utils-lib 的零依赖。
 */
import "./panel.css";

export const PanelDemo = {
  name: "PanelDemo",
  props: {
    /** 面板标题，通常是函数签名 */
    title: { type: String, default: "" },
  },
  template: `
    <div class="ud-panel">
      <div v-if="title" class="ud-panel__title">{{ title }}</div>
      <div class="ud-panel__body"><slot /></div>
      <div v-if="$slots.result" class="ud-panel__result">
        <span class="ud-panel__label">结果</span>
        <div class="ud-panel__value"><slot name="result" /></div>
      </div>
      <div v-if="$slots.footer" class="ud-panel__footer"><slot name="footer" /></div>
    </div>
  `,
};

/** 参数行：标签 + 控件 */
export const PanelRow = {
  name: "PanelRow",
  props: {
    label: { type: String, required: true },
    hint: { type: String, default: "" },
  },
  template: `
    <div class="ud-row">
      <label class="ud-row__label">
        {{ label }}
        <span v-if="hint" class="ud-row__hint">{{ hint }}</span>
      </label>
      <div class="ud-row__control"><slot /></div>
    </div>
  `,
};

/** 调用日志：用于 debounce / copy / 并发请求这类有副作用的函数 */
export const PanelLog = {
  name: "PanelLog",
  props: {
    /** 日志行数组，最新的在最前 */
    entries: { type: Array, default: () => [] },
  },
  template: `
    <ul class="ud-log">
      <li v-if="entries.length === 0" class="ud-log__empty">还没有调用</li>
      <li v-for="(e, i) in entries" :key="i" class="ud-log__item">{{ e }}</li>
    </ul>
  `,
};
