import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseCrud } from "@shaohui_jin/comp-lib";
import {
  demoColumns,
  demoRows,
  demoSearchParams,
  demoSettingColumns,
  makeBigRows,
} from "../../../stories/crudFixtures";

/**
 * CRUD 页面骨架：查询栏 + 高级筛选 + 表格 + 列设置，四块拼好并互相打通。
 *
 * 它不持有业务状态，全部通过 `v-model` 和事件交给外层：
 * `search` / `reset` / `selectionChange` / `columnConfirm`。
 */
const meta = {
  title: "CRUD/BaseCrud 页面骨架",
  component: BaseCrud,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["element", "virtual", "canvas", "canvas-tile", "skia-wasm"],
      description: "表格渲染模式",
    },
    columns: { control: "object", description: "列配置（v-model:columns）" },
    tableData: { control: "object", description: "表格数据" },
    searchModel: { control: "object", description: "搜索表单（v-model:searchModel）" },
    searchParams: { control: "object", description: "搜索栏字段；为空则不渲染搜索栏" },
    drawerParams: { control: "object", description: "高级筛选字段；为空则不显示入口" },
    loading: { control: "boolean", description: "查询 loading" },
    tableHeight: { control: "text", description: "表格高度" },
    rowKey: { control: "text", description: "行主键字段" },
    showColumnSetting: { control: "boolean", description: "是否显示列设置入口" },
  },
  args: {
    mode: "element",
    columns: demoSettingColumns,
    tableData: demoRows,
    searchModel: {},
    searchParams: demoSearchParams,
    drawerParams: demoSearchParams,
    loading: false,
    tableHeight: "380px",
    rowKey: "id",
    showColumnSetting: true,
  },
} satisfies Meta<typeof BaseCrud>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 完整形态：查询栏 + 高级筛选 + 列设置 */
export const Default: Story = {
  render: (args) => ({
    components: { BaseCrud },
    setup() {
      const cols = { value: args.columns.map((c) => ({ ...c })) };
      const form = { value: { ...args.searchModel } };
      const log = { value: "—" };
      return { args, cols, form, log };
    },
    template: `
      <BaseCrud
        v-bind="args"
        v-model:columns="cols.value"
        v-model:search-model="form.value"
        @search="d => log.value = 'search: ' + JSON.stringify(d)"
        @reset="log.value = 'reset'"
        @column-confirm="c => log.value = '列已更新：' + c.length + ' 列'"
      />
    `,
  }),
};

/** 只有表格：不传 searchParams / drawerParams，也不显示列设置 */
export const TableOnly: Story = {
  args: {
    searchParams: [],
    drawerParams: [],
    showColumnSetting: false,
    columns: demoColumns,
  },
  render: Default.render,
};

/** 大数据量 + virtual 模式 */
export const LargeDataset: Story = {
  args: {
    mode: "virtual",
    tableData: makeBigRows(5000),
    columns: demoSettingColumns,
  },
  render: Default.render,
};

/** 查询中 */
export const Loading: Story = {
  args: { loading: true },
  render: Default.render,
};
