# @shaohui_jin/comp-lib

Vue 3 组件库：基础组件、交互组件、CRUD 表格（5 种渲染模式）与主题配置系统。

## 安装

```bash
pnpm add @shaohui_jin/comp-lib element-plus @element-plus/icons-vue vue
```

`vue`、`element-plus`、`@element-plus/icons-vue` 都是 peerDependency，需要宿主自己安装。

## 快速开始

```ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@shaohui_jin/comp-lib/style.css";
import CompLib, { createCompLib, elementPlusLocale } from "@shaohui_jin/comp-lib";

const app = createApp(App);

app.use(ElementPlus, { locale: elementPlusLocale });
// 自定义主题；不传则用默认配色
app.use(createCompLib({ theme: { colorPrimary: "#6366f1" } }));
// 全量注册组件；也可以只 import 需要的
app.use(CompLib);

app.mount("#app");
```

按需引入：

```ts
import { BaseTable, Tag, type BaseTableColumn } from "@shaohui_jin/comp-lib";
```

## 组件

| 分组 | 组件 |
| --- | --- |
| 基础 | `Tag` `Dot` `Image3D` `ImageCarousel` `ImagePointer` `ImageLightbox` `CodeBlock` `WidgetTabs` |
| 交互 | `SplitPane` `DragSortList` `FloatingToolbar` `TreeTransfer` `StepWizard` `ContextMenu` `CanvasTime` `CanvasCountUp` `HeatmapCalendar` |
| CRUD | `BaseTable` `BaseSearch` `BaseSearchField` `BaseSearchDrawer` `BaseColumnSetting` `BaseCrud` |

## 主题

组件库暴露两套 CSS 变量：

- `--comp-*` — 组件库自有变量（文字色、背景色、圆角、字号）
- `--el-*` — 同步给 Element Plus，保证原生组件与库内组件视觉一致

三种改主题方式，优先级递增：

| 方式 | 范围 | 用法 |
| --- | --- | --- |
| `createCompLib(config)` | 全局 | `app.use(createCompLib({ theme }))` |
| `<ConfigProvider :theme>` | 子树 | 包裹需要覆盖的 DOM |
| 组件 `theme` prop | 单组件 | 如 `BaseTable` |

## BaseTable 的 5 种渲染模式

| 模式 | 实现 | 适用 |
| --- | --- | --- |
| `element` | ElTable 封装 | 常规数据量，能力最全 |
| `virtual` | ElTableV2 虚拟滚动 | 万级行，DOM 可控 |
| `canvas` | Canvas 2D 视口重绘 | 超大数据，结构简单 |
| `canvas-tile` | Canvas 整表预渲染 + 裁切 | 超大数据，减少重绘 |
| `skia-wasm` | CanvasKit（Skia WASM） | 需要 wasm，见下 |

### skia-wasm 模式（可选）

该模式依赖 CanvasKit，`canvaskit-wasm` 是**可选** peerDependency，不进本包：

```bash
pnpm add canvaskit-wasm
```

wasm 与中文字体需要自己提供，通过 props 指定：

```vue
<BaseTable
  mode="skia-wasm"
  :table-data="rows"
  :columns="columns"
  skia-wasm-base-url="/wasm/"
  skia-typeface-url="/fonts/NotoSansSC-400.woff2"
/>
```

不配置时组件回退到 CanvasKit 内置字体（中文缺字形，但不会崩）。

## 完整文档

交互式文档（每个组件都有可操作示例，Props/Events 表自动生成）：

https://shaohui-jin.github.io/tool-box/

## License

MIT
