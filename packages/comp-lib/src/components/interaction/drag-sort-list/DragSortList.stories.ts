import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { DragSortList } from "@shaohui_jin/comp-lib";
import type { DragSortItem } from "@shaohui_jin/comp-lib";

/**
 * 原生 HTML5 拖拽排序列表。`v-model` 绑定的数组会随拖拽实时更新，
 * 同时 emit `change`，便于做「保存排序」这类副作用。
 */
const meta = {
  title: "交互/DragSortList 拖拽排序",
  component: DragSortList,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "object", description: "列表项（v-model）" },
  },
  args: {
    modelValue: [
      { id: "1", label: "首页菜单" },
      { id: "2", label: "用户管理" },
      { id: "3", label: "角色权限" },
      { id: "4", label: "系统配置" },
    ] satisfies DragSortItem[],
  },
} satisfies Meta<typeof DragSortList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 拖动条目左侧的手柄重新排序 */
export const Default: Story = {};

/** 自定义条目渲染，并在右侧显示实时顺序 */
export const CustomItem: Story = {
  render: (args) => ({
    components: { DragSortList },
    setup() {
      // 用本地副本承接 v-model 更新，story 里才能看到顺序变化
      const items = { value: [...args.modelValue] };
      return { args, items };
    },
    template: `
      <div>
        <DragSortList v-model="items.value" v-bind="{ ...args, modelValue: undefined }">
          <template #item="{ item }">
            <span style="font-weight: 600;">{{ item.label }}</span>
            <code style="margin-left: 8px; color: #909399;">#{{ item.id }}</code>
          </template>
        </DragSortList>
        <p style="margin-top: 12px; color: #606266;">
          当前顺序：{{ items.value.map(i => i.label).join(' → ') }}
        </p>
      </div>
    `,
  }),
};
