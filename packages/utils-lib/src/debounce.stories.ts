import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { debounce } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow, PanelLog } from "./stories/PanelDemo";

/**
 * 防抖包装。
 *
 * 连续调用时只执行最后一次；`immediate: true` 时**第一次立即执行**，
 * 后续在窗口期内被合并丢弃。
 *
 * 本包只提供纯函数版本。Vue 响应式的 `useDebounceRef` 需要 `customRef`，
 * 会让整个工具库依赖 vue，已明确移除 —— 需要时在业务层自己包一层。
 */
const meta = {
  title: "工具/防抖 debounce",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 连点按钮，观察「点击次数」与「实际执行次数」的差异 */
export const Debounced: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const delay = ref(500);
      const immediate = ref(false);
      const clicks = ref(0);
      const executed = ref(0);
      const logs = ref<string[]>([]);
      const lastValue = ref("—");

      // 延迟/模式变化时重建，否则改动参数不生效
      let fn = debounce(
        (value: string) => {
          executed.value++;
          lastValue.value = value;
          const time = new Date().toLocaleTimeString();
          logs.value = [`${time}  执行 "${value}"`, ...logs.value].slice(0, 12);
        },
        delay.value,
        immediate.value,
      );

      function rebuild() {
        fn = debounce(
          (value: string) => {
            executed.value++;
            lastValue.value = value;
            const time = new Date().toLocaleTimeString();
            logs.value = [`${time}  执行 "${value}"`, ...logs.value].slice(0, 12);
          },
          delay.value,
          immediate.value,
        );
      }

      function bump() {
        clicks.value++;
        fn(`第 ${clicks.value} 次`);
      }

      return { delay, immediate, clicks, executed, logs, lastValue, rebuild, bump };
    },
    template: `
      <PanelDemo title="debounce(fn, delay = 300, immediate = false)">
        <PanelRow label="delay" hint="ms">
          <input v-model.number="delay" type="number" min="0" step="100" @change="rebuild" />
        </PanelRow>
        <PanelRow label="immediate" hint="首次立即执行">
          <input v-model="immediate" type="checkbox" @change="rebuild" />
        </PanelRow>
        <PanelRow label="计数">
          <span style="color:#606266;">点击 {{ clicks }} 次，实际执行 {{ executed }} 次</span>
        </PanelRow>
        <template #result>最后执行的参数：{{ lastValue }}</template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="bump">点我（连点测试）</button>
          <button class="ud-btn" @click="clicks = 0; executed = 0; logs = []; lastValue = '—'">
            重置
          </button>
        </template>
      </PanelDemo>
      <div style="margin-top:16px;max-width:720px;">
        <PanelLog :entries="logs" />
      </div>
    `,
  }),
};

/**
 * immediate 模式最容易误解的一点：窗口期内**完全不执行**，
 * 而不是「先执行一次，然后继续防抖到窗口结束」。
 */
export const ImmediateMode: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const logs = ref<string[]>([]);
      let n = 0;
      const fn = debounce(
        () => {
          n++;
          logs.value = [`${new Date().toLocaleTimeString()}  第 ${n} 次执行`, ...logs.value].slice(
            0,
            10,
          );
        },
        800,
        true,
      );
      return { logs, fn };
    },
    template: `
      <PanelDemo title="immediate = true，delay = 800ms">
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="fn">连续点 5 次</button>
          <span style="color:#909399;font-size:12px;font-family:system-ui;align-self:center;">
            800ms 内点再多也只执行 1 次
          </span>
        </template>
      </PanelDemo>
      <div style="margin-top:16px;max-width:720px;">
        <PanelLog :entries="logs" />
      </div>
    `,
  }),
};

/** 返回的函数保留调用时的 this 与参数 */
export const PreserveThis: Story = {
  render: () => ({
    components: { PanelDemo },
    setup() {
      const output = ref("—");
      const obj = {
        name: "计数器",
        hits: 0,
        report(this: { name: string; hits: number }) {
          this.hits++;
          output.value = `${this.name} 命中 ${this.hits} 次`;
        },
      };
      obj.report = debounce(obj.report, 200);
      return { obj, output };
    },
    template: `
      <PanelDemo title="debounce 包裹后 this 仍指向原对象">
        <template #result>{{ output }}</template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="obj.report()">调用 obj.report()</button>
        </template>
      </PanelDemo>
    `,
  }),
};
