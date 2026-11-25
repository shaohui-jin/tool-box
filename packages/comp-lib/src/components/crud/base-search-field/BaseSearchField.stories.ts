import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseSearchField } from "@shaohui_jin/comp-lib";

/**
 * 单个查询表单项，按 `field.type` 切换成 input / select / date / cascader 等。
 * 一般由 `BaseSearch` 内部使用；单独使用时需要自己处理 `v-model`。
 */
const meta = {
  title: "CRUD/BaseSearchField 查询字段",
  component: BaseSearchField,
  tags: ["autodocs"],
  argTypes: {
    field: { control: "object", description: "字段配置" },
    modelValue: { control: "text", description: "当前值（v-model）" },
    paramOptions: { control: "object", description: "异步加载的选项" },
  },
  args: {
    field: { key: "name", label: "服务名称", placeholder: "请输入" },
    modelValue: "",
  },
  render: (args) => ({
    components: { BaseSearchField },
    setup() {
      const value = { value: args.modelValue };
      return { args, value };
    },
    template: `
      <div style="max-width: 320px;">
        <BaseSearchField v-model="value.value" :field="args.field" :param-options="args.paramOptions" />
        <p style="color: #909399; font-size: 13px;">值：{{ JSON.stringify(value.value) }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseSearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 文本输入 */
export const Input: Story = {};

/** 下拉选择，选项来自 field.options */
export const Select: Story = {
  args: {
    field: {
      key: "status",
      label: "状态",
      type: "select",
      options: [
        { name: "成功", value: "success" },
        { name: "失败", value: "danger" },
      ],
    },
  },
  render: meta.render,
};

/** 日期区间选择 */
export const DateRange: Story = {
  args: { field: { key: "range", label: "时间范围", type: "daterange" }, modelValue: undefined },
  render: meta.render,
};

/** 单选组 */
export const RadioGroup: Story = {
  args: {
    field: {
      key: "enabled",
      label: "是否启用",
      type: "radio-group",
      options: [
        { name: "启用", value: true },
        { name: "停用", value: false },
      ],
    },
    modelValue: true,
  },
  render: meta.render,
};

/** 多行文本 */
export const Textarea: Story = {
  args: { field: { key: "remark", label: "备注", type: "textarea" } },
  render: meta.render,
};
