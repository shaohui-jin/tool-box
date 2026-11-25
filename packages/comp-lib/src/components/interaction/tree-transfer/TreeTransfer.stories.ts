import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { TreeTransfer } from "@shaohui_jin/comp-lib";
import type { TreeTransferNode } from "@shaohui_jin/comp-lib";

const TREE: TreeTransferNode[] = [
  {
    id: "dev",
    label: "研发中心",
    children: [
      { id: "fe", label: "前端组" },
      { id: "be", label: "后端组" },
      { id: "qa", label: "测试组" },
    ],
  },
  {
    id: "ops",
    label: "运维中心",
    children: [
      { id: "sre", label: "SRE" },
      { id: "dba", label: "DBA" },
    ],
  },
  { id: "pm", label: "产品部" },
];

/**
 * 带层级结构的穿梭框：左侧全量树，右侧已选树，中间按钮双向移动。
 * `v-model` 绑定已选叶子节点 id 数组。
 */
const meta = {
  title: "交互/TreeTransfer 树穿梭框",
  component: TreeTransfer,
  tags: ["autodocs"],
  argTypes: {
    data: { control: "object", description: "树形数据" },
    modelValue: { control: "object", description: "已选节点 id（v-model）" },
  },
  args: {
    data: TREE,
    modelValue: ["fe"],
  },
  render: (args) => ({
    components: { TreeTransfer },
    setup() {
      const selected = { value: [...args.modelValue] };
      return { args, selected };
    },
    template: `
      <div>
        <TreeTransfer v-model="selected.value" :data="args.data" />
        <p style="margin-top: 12px; color: #606266;">已选：{{ selected.value.join(', ') || '（空）' }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof TreeTransfer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 勾选左侧节点后点 › 移入右侧 */
export const Default: Story = {};

/** 初始已选较多，用来观察右侧分组显示 */
export const Prefilled: Story = {
  args: { modelValue: ["fe", "be", "dba"] },
  render: meta.render,
};
