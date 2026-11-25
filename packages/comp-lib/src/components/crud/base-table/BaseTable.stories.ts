import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BaseTable } from "@shaohui_jin/comp-lib";
import type { BaseTableMode } from "@shaohui_jin/comp-lib";
import { demoColumns, demoRows, makeBigRows, simpleColumns } from "../../../stories/crudFixtures";

/**
 * 同一套列配置，按引擎适配数据量。
 *
 * 五种模式的能力与取舍：
 *
 * | 模式 | 实现 | 适用 |
 * | --- | --- | --- |
 * | `element` | ElTable 封装 | 常规数据量，能力最全 |
 * | `virtual` | ElTableV2 虚拟滚动 | 万级行，DOM 仍可控 |
 * | `canvas` | 单 Canvas 2D 视口重绘 | 超大数据，结构简单 |
 * | `canvas-tile` | Canvas + 整表预渲染 + 裁切 | 超大数据，减少重绘 |
 * | `skia-wasm` | CanvasKit（Skia WASM） | 需加载 wasm，见下方说明 |
 *
 * > `skia-wasm` 需要额外安装 `canvaskit-wasm` 并自行提供 `canvaskit.wasm`
 * > 与中文字体 woff2，通过 `skiaWasmBaseUrl` / `skiaTypefaceUrl` 指定。
 */
const meta = {
  title: "CRUD/BaseTable 表格",
  component: BaseTable,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["element", "virtual", "canvas", "canvas-tile", "skia-wasm"] as BaseTableMode[],
      description: "渲染模式",
    },
    tableData: { control: "object", description: "表格数据" },
    columns: { control: "object", description: "列配置" },
    height: { control: "text", description: "容器高度" },
    rowKey: { control: "text", description: "行唯一标识字段" },
    loading: { control: "boolean", description: "加载状态" },
    emptyText: { control: "text", description: "空数据文案" },
    rowHeight: { control: "number", description: "行高（px）" },
    headerHeight: { control: "number", description: "表头高度（px）" },
    maxPrerenderPixels: { control: "number", description: "canvas-tile 最大预渲染像素数" },
  },
  args: {
    mode: "element",
    tableData: demoRows,
    columns: demoColumns,
    height: "380px",
    rowKey: "id",
    loading: false,
    emptyText: "暂无数据",
    rowHeight: 36,
    headerHeight: 40,
  },
} satisfies Meta<typeof BaseTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** element 模式：ElTable 封装，能力强、上手快 */
export const Element: Story = {};

/** virtual 模式：ElTableV2 虚拟滚动，适合万级行 */
export const Virtual: Story = {
  args: { mode: "virtual", tableData: makeBigRows(5000) },
};

/** canvas 模式：单 Canvas 视口重绘，适合超大数据与简单结构 */
export const Canvas: Story = {
  args: { mode: "canvas", tableData: makeBigRows(5000), columns: simpleColumns },
};

/** canvas-tile 模式：整表预渲染后按视口裁切 */
export const CanvasTile: Story = {
  args: { mode: "canvas-tile", tableData: makeBigRows(5000), columns: simpleColumns },
};

/**
 * skia-wasm 模式：需要 `canvaskit-wasm` 依赖与 wasm / 字体资源。
 * 未配置资源时组件会给出提示而不会崩，可用于确认降级行为。
 */
export const SkiaWasm: Story = {
  args: { mode: "skia-wasm", tableData: makeBigRows(2000), columns: simpleColumns },
};

/** 加载中 */
export const Loading: Story = {
  args: { loading: true },
};

/** 空数据 */
export const Empty: Story = {
  args: { tableData: [] },
};

/** 自定义 toolbar 插槽 */
export const WithToolbar: Story = {
  render: (args) => ({
    components: { BaseTable },
    setup: () => ({ args }),
    template: `
      <BaseTable v-bind="args">
        <template #toolbar>
          <div style="padding: 8px 0; display: flex; gap: 8px; align-items: center;">
            <strong>服务列表</strong>
            <span style="color: #909399; font-size: 12px;">共 {{ args.tableData.length }} 条</span>
          </div>
        </template>
      </BaseTable>
    `,
  }),
};
