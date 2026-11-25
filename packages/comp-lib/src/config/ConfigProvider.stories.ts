import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import {
  ConfigProvider,
  Tag,
  Dot,
  themePresets,
  themePresetSwatches,
  radiusTiers,
} from "@shaohui_jin/comp-lib";

/**
 * 主题配置系统。
 *
 * 三种用法，优先级从低到高：
 *
 * 1. `createCompLib(config)` —— 全局安装，写入 `--comp-*` / `--el-*` CSS 变量；
 * 2. `<ConfigProvider :theme>` —— 子树局部覆盖，只影响包裹范围内的组件；
 * 3. 组件自身的 `theme` prop（如 `BaseTable`）。
 *
 * 配置项见下方 `themePresets` 的四个预设，可整包切换，也可只改单个字段。
 */
const meta = {
  title: "主题配置/ConfigProvider",
  component: ConfigProvider,
  tags: ["autodocs"],
  argTypes: {
    theme: { control: "object", description: "局部主题覆盖（只写需要改的字段）" },
  },
} satisfies Meta<typeof ConfigProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 四个内置主题预设并排对比 */
export const Presets: Story = {
  render: () => ({
    components: { ConfigProvider, Tag, Dot },
    setup() {
      /**
       * 卡片必须自己消费主题变量，否则四个预设看起来一模一样。
       * ConfigProvider 注入的是 CSS 自定义属性（--comp-*），
       * 只有真正引用它们的元素才会变化 —— 写死 #fff 的容器不会。
       */
      const cardStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "14px",
        borderRadius: "var(--comp-radius-md, 6px)",
        background: "var(--comp-bg-card, #fff)",
        border: "1px solid var(--comp-border-color, #ebeef5)",
        color: "var(--comp-text-primary, #303133)",
        fontFamily: "var(--comp-font-family, system-ui)",
        fontSize: "var(--comp-font-size-base, 14px)",
      };
      const titleStyle = {
        color: "var(--comp-text-heading, #1d2129)",
        fontWeight: "600",
      };
      const mutedStyle = {
        color: "var(--comp-text-regular, #606266)",
        fontSize: "var(--comp-font-size-sm, 13px)",
      };
      return {
        presets: Object.keys(themePresets) as Array<keyof typeof themePresets>,
        swatches: themePresetSwatches,
        themePresets,
        cardStyle,
        titleStyle,
        mutedStyle,
      };
    },
    template: `
      <div style="display: inline-flex; gap: 16px; align-items: flex-start;">
        <div v-for="key in presets" :key="key" style="width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i :style="{
              display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%',
              background: swatches[key]
            }" />
            <strong style="font-size: 13px;">{{ key }}</strong>
          </div>
          <ConfigProvider :theme="themePresets[key]">
            <div :style="cardStyle">
              <div :style="titleStyle">卡片标题</div>
              <div :style="mutedStyle">正文示例文字，用来观察字号与行高</div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <Tag label="成功" type="success" />
                <Tag label="警告" type="warning" />
              </div>
              <Dot color="var(--comp-color-primary)" text="主色圆点" />
            </div>
          </ConfigProvider>
        </div>
      </div>
    `,
  }),
};

/** 只覆盖主色：局部作用域内所有组件都换色 */
export const OverridePrimary: Story = {
  render: () => ({
    components: { ConfigProvider, Tag },
    template: `
      <div style="display: flex; gap: 24px;">
        <div>
          <p style="color: #909399; font-size: 13px;">默认</p>
          <Tag label="成功" type="success" />
        </div>
        <ConfigProvider :theme="{ colorPrimary: '#6366f1', radiusMd: 10 }">
          <p style="color: #909399; font-size: 13px;">紫色 + 大圆角</p>
          <Tag label="成功" type="success" />
          <Tag label="危险" type="danger" />
        </ConfigProvider>
      </div>
    `,
  }),
};

/** 圆角联动：给一个中圆角，自动推导小/大两档 */
export const RadiusTiers: Story = {
  render: () => ({
    components: { ConfigProvider, Tag },
    setup() {
      const radius = ref(8);
      return { radius, tiers: radiusTiers, radiusTiers };
    },
    template: `
      <div>
        <div style="margin-bottom: 12px;">
          <label style="margin-right: 12px;">中圆角：{{ radius }}px</label>
          <input type="range" min="2" max="20" v-model.number="radius" />
        </div>
        <ConfigProvider :theme="radiusTiers(radius)">
          <Tag label="圆角随滑块变化" type="info" />
        </ConfigProvider>
        <pre style="margin-top: 12px; color: #909399; font-size: 12px;">{{ JSON.stringify(tiers(radius)) }}</pre>
      </div>
    `,
  }),
};
