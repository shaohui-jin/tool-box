import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseSearch } from "@shaohui_jin/comp-lib";
import { demoSearchParams } from "../../../stories/crudFixtures";

/**
 * 可折叠的查询表单。`fixed: true` 的字段始终显示，其余收进「展开」里。
 * 回车默认触发查询，也可以关掉单个字段的 `keydownSearch`。
 */
const meta = {
  title: "CRUD/BaseSearch 查询表单",
  component: BaseSearch,
  tags: ["autodocs"],
  argTypes: {
    params: { control: "object", description: "字段配置" },
    modelValue: { control: "object", description: "表单数据（v-model）" },
    loading: { control: "boolean", description: "查询按钮 loading" },
    paramOptions: { control: "object", description: "异步选项，key 为字段 key" },
  },
  args: {
    params: demoSearchParams,
    modelValue: {},
    loading: false,
  },
  render: (args) => ({
    components: { BaseSearch },
    setup() {
      const form = { value: { ...args.modelValue } };
      const log = { value: "—" };
      return { args, form, log };
    },
    template: `
      <div>
        <BaseSearch
          v-model="form.value"
          :params="args.params"
          :loading="args.loading"
          @search="d => log.value = 'search: ' + JSON.stringify(d)"
          @reset="log.value = 'reset'"
        />
        <p style="margin-top: 12px; color: #606266; font-size: 13px;">{{ log.value }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认：前两个字段固定，其余折叠 */
export const Default: Story = {};

/** 带初始值 */
export const WithValue: Story = {
  args: { modelValue: { name: "订单", status: "success" } },
  render: meta.render,
};

/** 查询按钮 loading 态 */
export const Loading: Story = {
  args: { loading: true },
  render: meta.render,
};

/** 只放一个字段时不会出现「展开」按钮 */
export const SingleField: Story = {
  args: { params: [{ key: "name", label: "服务名称", placeholder: "请输入" }] },
  render: meta.render,
};
