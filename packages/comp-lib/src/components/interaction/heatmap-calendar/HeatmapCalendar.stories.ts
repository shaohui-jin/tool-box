import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { HeatmapCalendar } from "@shaohui_jin/comp-lib";
import type { HeatmapCell } from "@shaohui_jin/comp-lib";

/** 生成最近 n 天的示例数据（含 0 值，才能看出分级） */
function makeData(days: number): HeatmapCell[] {
  const out: HeatmapCell[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    // 用日期做伪随机，保证每次渲染一致（story 截图稳定）
    const seed = d.getDate() * (d.getMonth() + 1);
    out.push({ date, count: seed % 7 === 0 ? 0 : (seed * 3) % 12 });
  }
  return out;
}

/**
 * GitHub 风格的贡献热力图。颜色分 5 级，由数据中的最大值动态换算。
 * 悬停显示「日期: 次数」，点击 emit `cell-click`。
 */
const meta = {
  title: "交互/HeatmapCalendar 热力图",
  component: HeatmapCalendar,
  tags: ["autodocs"],
  argTypes: {
    data: { control: "object", description: "热力单元格数据" },
  },
  args: {
    data: makeData(120),
  },
} satisfies Meta<typeof HeatmapCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认 120 天 */
export const Default: Story = {};

/** 一整年 */
export const FullYear: Story = {
  args: { data: makeData(365) },
};

/** 无数据时只显示空白网格 */
export const Empty: Story = {
  args: { data: [] },
};
