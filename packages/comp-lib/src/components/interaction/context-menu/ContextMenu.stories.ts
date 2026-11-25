import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ContextMenu } from "@shaohui_jin/comp-lib";

/**
 * 右键菜单。把内容包在默认插槽里，在区域内点右键即弹出；
 * 点击任一项 emit `select`，`danger: true` 的项显示为危险色。
 */
const meta = {
  title: "交互/ContextMenu 右键菜单",
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object", description: "菜单项配置" },
  },
  args: {
    items: [
      { label: "打开", action: "open", shortcut: "⏎" },
      { label: "重命名", action: "rename", shortcut: "F2" },
      { label: "复制链接", action: "copy" },
      { label: "删除", action: "delete", danger: true, shortcut: "Del" },
    ],
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 在虚线区域内点右键 */
export const Default: Story = {
  render: (args) => ({
    components: { ContextMenu },
    setup() {
      const chosen = { value: "—" };
      return { args, chosen };
    },
    template: `
      <div>
        <ContextMenu :items="args.items" @select="item => chosen.value = item.label">
          <div style="
            padding: 48px; border: 1px dashed #dcdfe6; border-radius: 6px;
            text-align: center; color: #909399; user-select: none;
          ">在此区域内点击鼠标右键</div>
        </ContextMenu>
        <p style="color: #606266;">最近选择：{{ chosen.value }}</p>
      </div>
    `,
  }),
};
