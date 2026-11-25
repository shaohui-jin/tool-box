import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CanvasCountUp } from "@shaohui_jin/comp-lib";

/**
 * 数字滚动动画，用 `requestAnimationFrame` + ease-out 缓动，
 * 比定时器更平滑。`value` 变化时自动重新滚动。
 */
const meta = {
  title: "交互/CanvasCountUp 数字滚动",
  component: CanvasCountUp,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number", description: "目标数值" },
    duration: { control: "number", description: "动画时长（ms）" },
  },
  args: {
    value: 12800,
    duration: 2000,
  },
  render: (args) => ({
    components: { CanvasCountUp },
    setup: () => ({ args }),
    template: `<CanvasCountUp v-bind="args" style="font-size: 40px; font-weight: 700;" />`,
  }),
} satisfies Meta<typeof CanvasCountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认 2s 滚到 12800 */
export const Default: Story = {};

/** 缩短时长，用于「刷新数据」这类频繁更新的场景 */
export const Fast: Story = {
  args: { value: 998, duration: 600 },
};

/** 值变化后重新滚动 */
export const ChangeValue: Story = {
  render: (args) => ({
    components: { CanvasCountUp },
    setup() {
      const value = { value: 1000 };
      return { args, value };
    },
    template: `
      <div>
        <CanvasCountUp :value="value.value" :duration="args.duration"
          style="font-size: 40px; font-weight: 700;" />
        <div style="margin-top: 16px;">
          <button @click="value.value = Math.floor(Math.random() * 100000)">换一个数字</button>
        </div>
      </div>
    `,
  }),
};
