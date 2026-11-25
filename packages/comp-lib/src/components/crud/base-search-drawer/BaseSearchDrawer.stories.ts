import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseSearchDrawer } from "@shaohui_jin/comp-lib";
import { demoSearchParams } from "../../../stories/crudFixtures";

/**
 * 高级筛选抽屉。组件本身不显示入口，需要通过 ref 调用 `open()` 打开；
 * 点「确定」emit `search`，点「取消」emit `reset`。
 */
const meta = {
  title: "CRUD/BaseSearchDrawer 高级筛选",
  component: BaseSearchDrawer,
  tags: ["autodocs"],
  argTypes: {
    params: { control: "object", description: "字段配置" },
    modelValue: { control: "object", description: "表单数据（v-model）" },
    title: { control: "text", description: "抽屉标题" },
    drawerWidth: { control: "text", description: "抽屉宽度" },
    paramOptions: { control: "object", description: "异步选项" },
  },
  args: {
    params: demoSearchParams,
    modelValue: { name: "订单" },
    title: "高级筛选",
    drawerWidth: "500px",
  },
} satisfies Meta<typeof BaseSearchDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 用按钮触发 `open()` */
export const Default: Story = {
  render: (args) => ({
    components: { BaseSearchDrawer },
    setup() {
      const drawer = { value: null as InstanceType<typeof BaseSearchDrawer> | null };
      const form = { value: { ...args.modelValue } };
      const log = { value: "—" };
      return { args, drawer, form, log };
    },
    template: `
      <div>
        <button @click="drawer?.open()">打开高级筛选</button>
        <BaseSearchDrawer
          ref="drawer"
          v-model="form.value"
          v-bind="{ ...args, modelValue: undefined }"
          @search="d => log.value = 'search: ' + JSON.stringify(d)"
          @reset="log.value = 'reset'"
        />
        <p style="color: #606266; font-size: 13px;">{{ log.value }}</p>
      </div>
    `,
  }),
};
