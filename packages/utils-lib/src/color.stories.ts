import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import { rgbaToHex, hexToRGBA, colorToRGBA } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow } from "./stories/PanelDemo";

/**
 * 颜色格式转换。三个函数的换算方向互补：
 *
 * - `rgbaToHex`：`rgb()` / `rgba()` 字符串 → `#rrggbb`（半透明按白底预乘）
 * - `hexToRGBA`：`#rrggbb` → `rgb()` 或 `rgba()`
 * - `colorToRGBA`：`#rrggbb` → `{ r, g, b }` 对象，给 Canvas 类 API 用
 *
 * > 半透明值有损：转成 hex 会丢掉 alpha。需要保留透明度就别走 hex。
 */
const meta = {
  title: "工具/颜色 color",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** rgba 字符串转十六进制，alpha 按白底预乘 */
export const RgbaToHex: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const input = ref("rgba(64, 158, 255, 1)");
      const result = computed(() => {
        try {
          return rgbaToHex(input.value);
        } catch {
          return "格式无法解析";
        }
      });
      const swatch = computed(() => (/^#[0-9a-f]{6}$/i.test(result.value) ? result.value : ""));
      return { input, result, swatch };
    },
    template: `
      <PanelDemo title="rgbaToHex(color)">
        <PanelRow label="颜色字符串" hint="rgb() 或 rgba()">
          <input v-model="input" type="text" />
        </PanelRow>
        <template #result>
          <span :style="{ color: result }">{{ result }}</span>
          <span v-if="swatch" :style="{
            display: 'inline-block', width: '18px', height: '18px',
            borderRadius: '3px', background: swatch, verticalAlign: 'middle',
            border: '1px solid #dcdfe6'
          }" />
        </template>
      </PanelDemo>
    `,
  }),
};

/** 十六进制转 rgb / rgba 字符串 */
export const HexToRgba: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const hex = ref("#409eff");
      const hasAlpha = ref(false);
      const alpha = ref(0.5);
      const result = computed(() => {
        try {
          return hasAlpha.value ? hexToRGBA(hex.value, alpha.value) : hexToRGBA(hex.value);
        } catch {
          return "需要 #rrggbb 格式";
        }
      });
      return { hex, hasAlpha, alpha, result };
    },
    template: `
      <PanelDemo title="hexToRGBA(hex, alpha?)">
        <PanelRow label="hex" hint="#rrggbb">
          <input v-model="hex" type="text" />
        </PanelRow>
        <PanelRow label="带透明度">
          <input v-model="hasAlpha" type="checkbox" />
        </PanelRow>
        <PanelRow v-if="hasAlpha" label="alpha" hint="0 ~ 1">
          <input v-model.number="alpha" type="range" min="0" max="1" step="0.05" />
        </PanelRow>
        <template #result>{{ result }}</template>
      </PanelDemo>
    `,
  }),
};

/** 转成 { r, g, b } 对象，给 Canvas / WebGL 这类需要数值的 API */
export const HexToRgbObject: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const hex = ref("#67c23a");
      const result = computed(() => {
        try {
          const { r, g, b } = colorToRGBA(hex.value);
          return `{ r: ${r}, g: ${g}, b: ${b} }`;
        } catch {
          return "需要 #rrggbb 格式";
        }
      });
      return { hex, result };
    },
    template: `
      <PanelDemo title="colorToRGBA(hex) → { r, g, b }">
        <PanelRow label="hex">
          <input v-model="hex" type="text" />
        </PanelRow>
        <template #result>{{ result }}</template>
      </PanelDemo>
    `,
  }),
};
