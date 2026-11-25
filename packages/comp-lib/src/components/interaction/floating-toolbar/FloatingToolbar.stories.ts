import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FloatingToolbar } from "@shaohui_jin/comp-lib";

/**
 * 选中若干行后从底部滑入的操作条。`count` 为 0 时自动隐藏。
 * 操作按钮通过默认插槽传入，插槽提供了 `on-action(name)`，
 * 点击时 emit `action`，由外层决定做什么。
 */
const meta = {
  title: "交互/FloatingToolbar 批量操作条",
  component: FloatingToolbar,
  tags: ["autodocs"],
  argTypes: {
    count: { control: "number", description: "选中数量，大于 0 时显示" },
  },
  args: {
    count: 3,
  },
} satisfies Meta<typeof FloatingToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认：显示选中数量与两个操作按钮 */
export const Default: Story = {
  render: (args) => ({
    components: { FloatingToolbar },
    setup() {
      const last = { value: "—" };
      return { args, last };
    },
    template: `
      <div style="position: relative; height: 160px; border: 1px solid #ebeef5; border-radius: 6px;">
        <FloatingToolbar v-bind="args">
          <template #default="{ onAction }">
            <button @click="onAction('delete'); last.value = 'delete'">批量删除</button>
            <button @click="onAction('export'); last.value = 'export'">导出</button>
            <span style="margin-left: auto; opacity: .7;">最近操作：{{ last.value }}</span>
          </template>
        </FloatingToolbar>
      </div>
    `,
  }),
};

/** count=0 时不渲染，可用来对比进入/离开动画 */
export const Hidden: Story = {
  args: { count: 0 },
  render: Default.render,
};
