import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseColumnSetting } from "@shaohui_jin/comp-lib";
import { demoSettingColumns } from "../../../stories/crudFixtures";

/**
 * 列设置抽屉：控制列的显示/隐藏、冻结位置与顺序。
 *
 * `selection` / `expand` / `index` 类列固定在顶部区域，
 * `action` / `editColumn` 类列固定在底部区域，其余列可自由排序。
 * 通过 ref 调用 `open()` 打开。
 */
const meta = {
  title: "CRUD/BaseColumnSetting 列设置",
  component: BaseColumnSetting,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "object", description: "列配置（v-model:columns）" },
    title: { control: "text", description: "抽屉标题" },
    drawerWidth: { control: "text", description: "抽屉宽度" },
  },
  args: {
    columns: demoSettingColumns,
    title: "表格设置",
    drawerWidth: "592px",
  },
} satisfies Meta<typeof BaseColumnSetting>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 用按钮触发 `open()`，确认后输出新的列配置 */
export const Default: Story = {
  render: (args) => ({
    components: { BaseColumnSetting },
    setup() {
      const setting = { value: null as InstanceType<typeof BaseColumnSetting> | null };
      const cols = { value: args.columns.map((c) => ({ ...c })) };
      const log = { value: "—" };
      return { args, setting, cols, log };
    },
    template: `
      <div>
        <button @click="setting?.open()">打开列设置</button>
        <BaseColumnSetting
          ref="setting"
          v-model:columns="cols.value"
          :title="args.title"
          :drawer-width="args.drawerWidth"
          @confirm="c => log.value = '确认：' + c.map(x => x.key).join(', ')"
        />
        <p style="color: #606266; font-size: 13px;">{{ log.value }}</p>
      </div>
    `,
  }),
};
