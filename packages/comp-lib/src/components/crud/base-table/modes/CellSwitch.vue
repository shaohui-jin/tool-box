<script setup lang="ts">
import { ref, watch } from "vue";
import { ElSwitch } from "element-plus";

defineOptions({ name: "CellSwitch" });

const props = defineProps<{
  row: Record<string, unknown>;
  colKey: string;
  activeValue?: string | number | boolean;
  inactiveValue?: string | number | boolean;
  disabled?: boolean;
  beforeChange?: () => boolean | Promise<boolean>;
}>();

const localValue = ref<string | number | boolean | undefined>(
  props.row[props.colKey] as string | number | boolean | undefined,
);
watch(
  () => props.row[props.colKey],
  (v) => {
    localValue.value = v as string | number | boolean | undefined;
  },
);

/**
 * 写回行数据。这是有意为之：表格单元格的开关必须改到源数据上，
 * 否则父组件的 tableData 与界面会脱节。
 */
function onUpdate(val: string | number | boolean) {
  localValue.value = val;
  // eslint-disable-next-line vue/no-mutating-props -- 见上方说明，改的是行对象内部字段而非 prop 本身
  props.row[props.colKey] = val;
}
</script>

<template>
  <ElSwitch
    :model-value="localValue"
    :active-value="activeValue ?? true"
    :inactive-value="inactiveValue ?? false"
    :disabled="disabled ?? false"
    :before-change="beforeChange"
    @update:model-value="onUpdate"
  /></template>
