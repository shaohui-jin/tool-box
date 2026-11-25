import type { App } from "vue";
import {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
} from "./components";
import { createCompLib } from "./config";

/** 全部组件（供按需注册或自行遍历使用） */
export {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
};

// 配置系统：createCompLib / ConfigProvider / useLibConfig / 主题预设
export {
  createCompLib,
  ConfigProvider,
  elementPlusLocale,
  useLibConfig,
  useLibPlugin,
  defaultLibConfig,
  themePresets,
  themePresetSwatches,
  primarySwatches,
  radiusTiers,
  libColorDefaults,
} from "./config";
export type {
  LibConfig,
  LibThemeConfig,
  ResolvedLibConfig,
  PersistOptions,
  LibPluginHandle,
  ThemePresetKey,
} from "./config";

// 组件类型
export type {
  TagType,
  TagProps,
  DotProps,
  Image3DProps,
  ImageCarouselProps,
  ImageCarouselEmits,
  ImageCarouselExpose,
  ImagePointerProps,
  ImagePointerEmits,
  ImageLightboxProps,
  ImageLightboxEmits,
  CodeBlockProps,
  WidgetTabsProps,
  BaseTableColumn,
  BaseTableColumnType,
  BaseTableMode,
  BaseTableProps,
  BaseTableEmits,
  BaseSearchField as SearchFieldConfig,
  BaseSearchFieldType,
  BaseSearchFieldOption,
  BaseSearchProps,
  BaseSearchEmits,
  BaseSearchFieldProps,
  BaseSearchFieldEmits,
  BaseSearchDrawerProps,
  BaseSearchDrawerEmits,
  BaseColumnSettingColumn,
  BaseColumnSettingProps,
  BaseColumnSettingEmits,
  BaseCrudProps,
  BaseCrudEmits,
  TableColumn,
  SplitPaneProps,
  SplitPaneEmits,
  DragSortItem,
  DragSortListProps,
  DragSortListEmits,
  FloatingToolbarProps,
  FloatingToolbarEmits,
  TreeTransferNode,
  TreeTransferProps,
  TreeTransferEmits,
  StepWizardStep,
  StepWizardProps,
  StepWizardEmits,
  ContextMenuItem,
  ContextMenuProps,
  ContextMenuEmits,
  CanvasTimeProps,
  CanvasCountUpProps,
  CanvasCountUpEmits,
  HeatmapCell,
  HeatmapCalendarProps,
  HeatmapCalendarEmits,
} from "./type";

// BaseTable 的列工具（不改列结构、只做增删改的小工具，独立于主题配置）
export {
  columnDefaults,
  normalizeColumns,
  withEditColumn,
  stripEditColumn,
} from "./components/crud/base-table/utils/column";

/** @deprecated 使用 createCompLib 配置代替；保留导出仅为兼容旧代码 */
export {
  tableLayoutDefaults,
  tableSurfaceConfig,
} from "./components/crud/base-table/theme/tableSurface";

const components = [
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
];

/**
 * 全量注册插件：`app.use(CompLib)`。
 *
 * 会同时安装主题配置（createCompLib 默认配置）并注册全部组件。
 * 需要自定义主题时改用 `createCompLib({ theme })`。
 */
export default {
  install(app: App) {
    const lib = createCompLib();
    lib.install(app);
    components.forEach((c) => {
      app.component(c.name ?? "AnonymousComponent", c);
    });
  },
};
