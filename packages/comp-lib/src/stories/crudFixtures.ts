import type {
  BaseColumnSettingColumn,
  BaseTableColumn,
  SearchFieldConfig,
} from "@shaohui_jin/comp-lib";

/** 表格示例数据：字段覆盖各列类型（文本 / 数字 / 状态 / 开关 / 图片） */
export const demoRows: Record<string, unknown>[] = [
  {
    id: 1,
    name: "订单中心",
    owner: "张三",
    amount: 12800,
    status: "success",
    enabled: true,
    updatedAt: "2026-11-20 10:24",
  },
  {
    id: 2,
    name: "用户服务",
    owner: "李四",
    amount: 8300,
    status: "warning",
    enabled: true,
    updatedAt: "2026-11-21 08:15",
  },
  {
    id: 3,
    name: "支付网关",
    owner: "王五",
    amount: 46000,
    status: "danger",
    enabled: false,
    updatedAt: "2026-11-22 17:40",
  },
  {
    id: 4,
    name: "消息推送",
    owner: "赵六",
    amount: 2100,
    status: "info",
    enabled: true,
    updatedAt: "2026-11-23 09:02",
  },
  {
    id: 5,
    name: "数据看板",
    owner: "孙七",
    amount: 15700,
    status: "success",
    enabled: true,
    updatedAt: "2026-11-24 14:33",
  },
];

/** 大数据量：用于观察 canvas / virtual 模式的表现 */
export function makeBigRows(count: number): Record<string, unknown>[] {
  const owners = ["张三", "李四", "王五", "赵六", "孙七"];
  const statuses = ["success", "warning", "danger", "info"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `服务节点 ${i + 1}`,
    owner: owners[i % owners.length],
    amount: ((i * 7919) % 90000) + 1000,
    status: statuses[i % statuses.length],
    enabled: i % 3 !== 0,
    updatedAt: `2026-11-${String((i % 28) + 1).padStart(2, "0")} 12:00`,
  }));
}

/** 覆盖全部内置列类型的列配置 */
export const demoColumns: BaseTableColumn[] = [
  { key: "selection", type: "selection", width: 40 },
  { key: "index", type: "index", width: 52 },
  { key: "name", label: "服务名称", width: 160 },
  { key: "owner", label: "负责人", width: 100 },
  {
    key: "amount",
    label: "调用量",
    width: 110,
    align: "right",
    formatter: (row) => Number(row.amount).toLocaleString(),
  },
  {
    key: "status",
    label: "状态",
    width: 110,
    type: "status-custom",
    colorMap: {
      success: "#67c23a",
      warning: "#e6a23c",
      danger: "#f56c6c",
      info: "#909399",
    },
  },
  { key: "enabled", label: "启用", width: 90, type: "switch" },
  { key: "updatedAt", label: "更新时间", width: 160 },
];

/** 简单列配置：只看文本，便于对比渲染引擎差异 */
export const simpleColumns: BaseTableColumn[] = [
  { key: "index", label: "#", type: "index", width: 60 },
  { key: "name", label: "服务名称", width: 180 },
  { key: "owner", label: "负责人", width: 120 },
  { key: "amount", label: "调用量", width: 120, align: "right" },
  { key: "updatedAt", label: "更新时间" },
];

/** 搜索栏字段 */
export const demoSearchParams: SearchFieldConfig[] = [
  { key: "name", label: "服务名称", placeholder: "请输入", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    fixed: true,
    options: [
      { name: "成功", value: "success" },
      { name: "警告", value: "warning" },
      { name: "失败", value: "danger" },
      { name: "信息", value: "info" },
    ],
  },
  { key: "owner", label: "负责人", placeholder: "请输入" },
  {
    key: "enabled",
    label: "是否启用",
    type: "radio-group",
    options: [
      { name: "启用", value: true },
      { name: "停用", value: false },
    ],
  },
  { key: "updatedAt", label: "更新时间", type: "daterange" },
];

/** 可配置列（含冻结位置），给 BaseColumnSetting 用 */
export const demoSettingColumns: BaseColumnSettingColumn[] = [
  { key: "name", label: "服务名称", width: 160, fixed: "left" },
  { key: "owner", label: "负责人", width: 100 },
  { key: "amount", label: "调用量", width: 110 },
  { key: "status", label: "状态", width: 110 },
  { key: "updatedAt", label: "更新时间", width: 160, fixed: "right" },
];
