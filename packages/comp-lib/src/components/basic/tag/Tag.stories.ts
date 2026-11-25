import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Tag } from "@shaohui_jin/comp-lib";

/**
 * 用于显示状态的圆角标签，视觉上等价于 `ElTag` 的 light + round 组合。
 */
const meta = {
  title: "基础/Tag 状态标签",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["success", "warning", "info", "danger"],
      description: "视觉类型",
      table: { defaultValue: { summary: "info" } },
    },
    label: { control: "text", description: "标签文案" },
  },
  args: {
    label: "成功",
    type: "success",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认状态 */
export const Default: Story = {};

/** 四种视觉类型并排对比 */
export const AllTypes: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Tag label="成功" type="success" />
        <Tag label="警告" type="warning" />
        <Tag label="信息" type="info" />
        <Tag label="危险" type="danger" />
      </div>
    `,
  }),
};
