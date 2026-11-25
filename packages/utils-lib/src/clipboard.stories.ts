import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { copyToClipboard } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow, PanelLog } from "./stories/PanelDemo";

/**
 * 复制文本到剪贴板。
 *
 * 优先用 `navigator.clipboard.writeText`，失败时回退到 `document.execCommand("copy")`
 * （旧浏览器、非 HTTPS 环境）。返回 `boolean` 表示是否成功，不抛错。
 *
 * > 只能在浏览器里调用。SSR / Node 下访问 `document` 会抛错。
 * > 另外 `navigator.clipboard` 需要安全上下文（https 或 localhost）。
 */
const meta = {
  title: "工具/剪贴板 clipboard",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 点按钮复制，日志里会记录每次结果 */
export const Copy: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow, PanelLog },
    setup() {
      const text = ref("Hello from @shaohui_jin/utils-lib");
      const logs = ref<string[]>([]);

      async function run() {
        const ok = await copyToClipboard(text.value);
        const time = new Date().toLocaleTimeString();
        logs.value = [`${time}  ${ok ? "成功" : "失败"}  "${text.value}"`, ...logs.value].slice(
          0,
          10,
        );
      }

      return { text, logs, run };
    },
    template: `
      <PanelDemo title="copyToClipboard(text): Promise<boolean>">
        <PanelRow label="要复制的文本">
          <input v-model="text" type="text" />
        </PanelRow>
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="run">复制</button>
          <span style="color:#909399;font-size:12px;font-family:system-ui;align-self:center;">
            复制后到别处粘贴，确认内容
          </span>
        </template>
      </PanelDemo>
      <div style="margin-top:16px;max-width:720px;">
        <PanelLog :entries="logs" />
      </div>
    `,
  }),
};

/** 空字符串也能复制（会清空剪贴板内容） */
export const EmptyString: Story = {
  render: () => ({
    components: { PanelDemo },
    setup() {
      const logs = ref<string[]>([]);
      async function run() {
        const ok = await copyToClipboard("");
        logs.value = [`复制空字符串 → ${ok}`, ...logs.value].slice(0, 5);
      }
      return { logs, run };
    },
    template: `
      <PanelDemo title="copyToClipboard('')">
        <template #footer>
          <button class="ud-btn" @click="run">复制空串</button>
        </template>
      </PanelDemo>
      <ul class="ud-log" style="margin-top:12px;max-width:720px;">
        <li v-for="(l, i) in logs" :key="i" class="ud-log__item">{{ l }}</li>
      </ul>
    `,
  }),
};
