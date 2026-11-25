import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { SplitPane } from "@shaohui_jin/comp-lib";

/**
 * 可拖拽的左右分栏。支持 `v-model:ratio` 受控、双击分隔条回到 50%，
 * 拖拽时自动夹在 `minRatio` / `maxRatio` 之间。
 */
const meta = {
  title: "交互/SplitPane 分栏",
  component: SplitPane,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "range", min: 0.1, max: 0.9, step: 0.05 }, description: "左侧占比（v-model:ratio）" },
    minRatio: { control: "number", description: "最小占比" },
    maxRatio: { control: "number", description: "最大占比" },
  },
  args: {
    ratio: 0.5,
    minRatio: 0.2,
    maxRatio: 0.8,
  },
  render: (args) => ({
    components: { SplitPane },
    setup: () => ({ args }),
    template: `
      <div style="height: 240px; border: 1px solid #ebeef5; border-radius: 6px; overflow: hidden;">
        <SplitPane v-bind="args" style="height: 100%;">
          <template #left>
            <div style="padding: 16px; background: #f5f7fa; height: 100%; box-sizing: border-box;">
              左侧面板
            </div>
          </template>
          <template #right>
            <div style="padding: 16px; height: 100%; box-sizing: border-box;">右侧面板</div>
          </template>
        </SplitPane>
      </div>
    `,
  }),
} satisfies Meta<typeof SplitPane>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 拖动中间分隔条；双击可复位到 50% */
export const Default: Story = {};

/** 初始偏向左侧，且左右各限 30%~70% */
export const CustomRatio: Story = {
  args: { ratio: 0.3, minRatio: 0.3, maxRatio: 0.7 },
};
