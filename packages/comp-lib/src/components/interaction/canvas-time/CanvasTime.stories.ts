import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CanvasTime } from "@shaohui_jin/comp-lib";

/**
 * Canvas 粒子时钟：用粒子拼出当前时间，数字变化时粒子飞向新位置。
 *
 * 组件占满父容器（`width/height: 100%`），所以 story 里必须给一个定高容器，
 * 否则高度为 0 时什么都看不到。
 */
const meta = {
  title: "交互/CanvasTime 粒子时钟",
  component: CanvasTime,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color", description: "粒子颜色" },
    bgColor: { control: "color", description: "画布背景色" },
  },
  args: {
    color: "#409eff",
    bgColor: "#ffffff",
  },
  render: (args) => ({
    components: { CanvasTime },
    setup: () => ({ args }),
    template: `
      <div style="width: 480px; height: 200px; border: 1px solid #ebeef5; border-radius: 6px; overflow: hidden;">
        <CanvasTime v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof CanvasTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认配色 */
export const Default: Story = {};

/** 深色背景 */
export const Dark: Story = {
  args: { color: "#7aa2f7", bgColor: "#1a1b26" },
};
