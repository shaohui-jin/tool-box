import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import { getRandom, scaleFormat } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow, PanelLog } from "./stories/PanelDemo";

/**
 * 数字相关工具。
 *
 * - `getRandom(min, max)`：闭区间随机整数，`max` **会**取到
 * - `scaleFormat(value, scale)`：修浮点显示，内部走 `toFixed`，结果是**字符串**
 *
 * > `scaleFormat` 不四舍五入到「更准」的方向，`1.005` 会得到 `"1.00"`。
 * > 这是 IEEE 754 的固有行为，不是 bug；要精确舍入请用 decimal 库。
 */
const meta = {
  title: "工具/数字 number",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 闭区间随机整数，可以连点看分布 */
export const GetRandom: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const min = ref(1);
      const max = ref(6);
      const samples = ref<number[]>([]);

      function roll() {
        const lo = Math.min(min.value, max.value);
        const hi = Math.max(min.value, max.value);
        samples.value = [getRandom(lo, hi), ...samples.value].slice(0, 20);
      }

      const counts = computed(() => {
        const map = new Map<number, number>();
        for (const v of samples.value) map.set(v, (map.get(v) ?? 0) + 1);
        return [...map.entries()].sort((a, b) => a[0] - b[0]);
      });

      return { min, max, samples, counts, roll };
    },
    template: `
      <PanelDemo title="getRandom(min, max) — 闭区间">
        <PanelRow label="min"><input v-model.number="min" type="number" /></PanelRow>
        <PanelRow label="max" hint="会取到"><input v-model.number="max" type="number" /></PanelRow>
        <template #result>
          {{ samples.length ? samples[0] : '点击下方按钮抽取' }}
        </template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="roll">抽一次</button>
          <button class="ud-btn" @click="samples = []">清空</button>
        </template>
      </PanelDemo>
      <div style="margin-top: 16px; max-width: 720px;">
        <div style="color: #909399; font-size: 13px; margin-bottom: 6px;">
          最近 {{ samples.length }} 次结果（数字：出现次数）
        </div>
        <PanelLog :entries="counts.map(([v, c]) => v + ' : ' + c + ' 次')" />
      </div>
    `,
  }),
};

/** 修浮点显示问题，结果恒为固定位数的字符串 */
export const ScaleFormat: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const value = ref("1.005");
      const scale = ref(2);
      const result = computed(() => {
        try {
          return scaleFormat(value.value, scale.value);
        } catch {
          return "无法解析为数字";
        }
      });
      return { value, scale, result };
    },
    template: `
      <PanelDemo title="scaleFormat(value, scale)">
        <PanelRow label="value" hint="字符串">
          <input v-model="value" type="text" />
        </PanelRow>
        <PanelRow label="scale" hint="小数位">
          <input v-model.number="scale" type="number" min="0" max="10" />
        </PanelRow>
        <template #result>{{ result }}</template>
        <template #footer>
          <span style="color: #909399; font-size: 12px; font-family: system-ui;">
            注意结果类型是 string，不是 number
          </span>
        </template>
      </PanelDemo>
    `,
  }),
};

/** 空参默认值：value "0"、scale 2 */
export const ScaleFormatDefaults: Story = {
  render: () => ({
    components: { PanelDemo },
    setup() {
      return { result: scaleFormat() };
    },
    template: `<PanelDemo title="scaleFormat()"><template #result>{{ result }}</template></PanelDemo>`,
  }),
};
