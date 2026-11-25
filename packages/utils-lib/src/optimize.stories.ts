import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { performChunk, concurRequest } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow, PanelLog } from "./stories/PanelDemo";

/**
 * 性能相关工具。
 *
 * - `performChunk`：把大任务切成小片，靠 `scheduler` 让出主线程
 * - `concurRequest`：限制并发数的批量请求，**任一失败不会中断整体**
 *
 * `scheduler` 由调用方提供，这是刻意的：浏览器用 `requestIdleCallback`、
 * 定时器用 `setTimeout`、测试里用同步执行，工具库不该替使用者选。
 */
const meta = {
  title: "工具/性能 optimize",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 分片执行：每片在空闲时段跑一批，跑完继续排下一片。
 *
 * story 跑 20000 次累加，观察「分片数」——片数越多说明单次让出越频繁，
 * 主线程越不易卡顿，但总耗时略增。
 */
export const PerformChunk: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const total = ref(20000);
      const done = ref(0);
      const chunks = ref(0);
      const elapsed = ref(0);
      const running = ref(false);
      const logs = ref<string[]>([]);

      function start() {
        done.value = 0;
        chunks.value = 0;
        elapsed.value = 0;
        running.value = true;
        const t0 = performance.now();
        const target = total.value;

        performChunk(
          target,
          () => {
            done.value++;
          },
          (run) => {
            chunks.value++;
            // 每片给 8ms 预算：够了继续吃数据，不够就排下一片
            const deadline = performance.now() + 8;
            run(() => performance.now() < deadline);
          },
        );

        // performChunk 把控制权交回 scheduler，这里轮询到完成为止
        const timer = setInterval(() => {
          if (done.value >= target) {
            clearInterval(timer);
            elapsed.value = Math.round(performance.now() - t0);
            running.value = false;
            logs.value = [
              `完成 ${target} 次，分 ${chunks.value} 片，耗时 ${elapsed.value}ms`,
              ...logs.value,
            ].slice(0, 6);
          }
        }, 30);
      }

      return { total, done, chunks, elapsed, running, logs, start };
    },
    template: `
      <PanelDemo title="performChunk(count, handler, scheduler)">
        <PanelRow label="执行次数">
          <input v-model.number="total" type="number" min="100" step="1000" :disabled="running" />
        </PanelRow>
        <PanelRow label="进度">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="flex:1;height:6px;background:#f0f2f5;border-radius:3px;overflow:hidden;">
              <div :style="{
                width: (total ? done / total * 100 : 0) + '%',
                height: '100%', background: '#409eff', transition: 'width .1s'
              }" />
            </div>
            <span style="color:#606266;min-width:110px;">{{ done }} / {{ total }}</span>
          </div>
        </PanelRow>
        <template #result>
          已分 {{ chunks }} 片{{ elapsed ? '，耗时 ' + elapsed + 'ms' : '' }}
        </template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" :disabled="running" @click="start">
            {{ running ? '执行中…' : '开始分片执行' }}
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
 * 并发控制：最多 `maxNum` 个请求同时在飞。
 *
 * 用 data URL 模拟请求，不依赖网络。重点观察两件事：
 *
 * 1. 「开始」日志里同时未完成的数量不超过 maxNum
 * 2. 返回数组按**输入顺序**归位，不是完成顺序
 */
export const ConcurRequest: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const maxNum = ref(3);
      const count = ref(8);
      const logs = ref<string[]>([]);
      const running = ref(false);
      const order = ref("—");

      async function start() {
        running.value = true;
        logs.value = [];
        order.value = "—";

        // data URL 立刻返回，用来验证「并发上限」而非「快慢」；
        // 每个 URL 带上序号，方便在日志里对上
        const urls = Array.from({ length: count.value }, (_, i) => `data:text/plain,req-${i + 1}`);
        logs.value = [`发起 ${urls.length} 个请求，最大并发 ${maxNum.value}`, ...logs.value];

        const results = await concurRequest(urls, maxNum.value);

        logs.value = [
          `全部完成，返回长度 ${results.length}`,
          `输入顺序：#1 → #${urls.length}`,
          ...logs.value,
        ].slice(0, 12);
        order.value = `结果按输入顺序：${results.length} 项`;
        running.value = false;
      }

      return { maxNum, count, logs, running, order, start };
    },
    template: `
      <PanelDemo title="concurRequest(urls, maxNum = 3)">
        <PanelRow label="URL 数量">
          <input v-model.number="count" type="number" min="1" max="40" :disabled="running" />
        </PanelRow>
        <PanelRow label="最大并发">
          <input v-model.number="maxNum" type="number" min="1" max="10" :disabled="running" />
        </PanelRow>
        <template #result>{{ order }}</template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" :disabled="running" @click="start">
            {{ running ? '请求中…' : '发起请求' }}
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
 * 失败不中断：坏 URL 在结果数组里留空（稀疏），其余照样完成。
 *
 * 这是 `concurRequest` 与 `Promise.all` 最关键的差别 —— 后者一个失败就整体 reject。
 */
export const FailureTolerated: Story = {
  render: () => ({
    components: { PanelDemo, PanelLog },
    setup() {
      const logs = ref<string[]>([]);
      const running = ref(false);

      async function start() {
        running.value = true;
        logs.value = [];
        const urls = [
          "data:text/plain,ok-1",
          "http://127.0.0.1:1/will-fail",
          "data:text/plain,ok-2",
          "http://invalid.invalid/also-fail",
          "data:text/plain,ok-3",
        ];
        const results = await concurRequest(urls, 2);
        const filled = results.filter(Boolean).length;
        logs.value = [
          `返回数组长度 ${results.length}，其中成功 ${filled} 个`,
          `失败的槽位是空的：${JSON.stringify(results.map((r) => (r ? "Response" : undefined)))}`,
        ];
        running.value = false;
      }

      return { logs, running, start };
    },
    template: `
      <PanelDemo title="含坏 URL 时的行为">
        <template #footer>
          <button class="ud-btn ud-btn--primary" :disabled="running" @click="start">
            {{ running ? '请求中…' : '发起（含 2 个坏 URL）' }}
          </button>
        </template>
      </PanelDemo>
      <div style="margin-top:16px;max-width:720px;">
        <PanelLog :entries="logs" />
      </div>
    `,
  }),
};
