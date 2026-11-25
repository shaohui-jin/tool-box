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
      return {
        presets: Object.keys(themePresets) as Array<keyof typeof themePresets>,
        swatches: themePresetSwatches,
        themePresets,
      };
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div v-for="key in presets" :key="key" style="width: 220px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i :style="{
              display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%',
              background: swatches[key]
            }" />
            <strong>{{ key }}</strong>
          </div>
          <ConfigProvider :theme="themePresets[key]">
            <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px;
              border: 1px solid #ebeef5; border-radius: 6px;">
              <Tag label="成功" type="success" />
              <Tag label="警告" type="warning" />
              <Dot color="#409eff" text="示例圆点" />
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
