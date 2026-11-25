import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Dot } from "@shaohui_jin/comp-lib";

/**
 * 彩色圆点状态指示器，用于行内以「圆点 + 文字」标识状态。
 * 默认颜色取自主题的 `libColorDefaults.neutralLamp`。
 */
const meta = {
  title: "基础/Dot 状态圆点",
  component: Dot,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color", description: "圆点颜色，任意 CSS 颜色值" },
    text: { control: "text", description: "显示文本；为空时渲染默认插槽" },
  },
  args: {
    color: "rgba(203, 206, 212, 1)",
    text: "未开始",
  },
} satisfies Meta<typeof Dot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认状态 */
export const Default: Story = {};

/** 用颜色表达不同状态 */
export const Colors: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Dot color="#67c23a" text="进行中" />
        <Dot color="#e6a23c" text="待审核" />
        <Dot color="#f56c6c" text="已失败" />
        <Dot color="rgba(203, 206, 212, 1)" text="未开始" />
      </div>
    `,
  }),
};

/** 只有圆点、不放文字时渲染默认插槽 */
export const Slot: Story = {
  render: () => ({
    components: { Dot },
    template: `<Dot color="#409eff">使用插槽的自定义内容</Dot>`,
  }),
};
