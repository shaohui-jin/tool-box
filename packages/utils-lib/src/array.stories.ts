import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import { flattenTree, isArrEqual } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow } from "./stories/PanelDemo";

/**
 * 数组工具：树形扁平化与无序比较。
 *
 * `flattenTree` 会**把父节点也留在结果里**（先 concat 自身再递归 children），
 * 所以结果长度是「全部节点数」而不是「叶子数」。需要只取叶子时自行 filter。
 */
const meta = {
  title: "工具/数组 array",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 递归展开 children，父子都在结果里 */
export const FlattenTree: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const tree = ref([
        {
          id: 1,
          label: "研发中心",
          children: [
            { id: 2, label: "前端组" },
            { id: 3, label: "后端组" },
          ],
        },
        { id: 4, label: "产品部" },
      ]);
      const key = ref("children");

      const flat = computed(() => flattenTree(tree.value, key.value));
      const summary = computed(() => flat.value.map((n) => `${n.id}:${n.label}`).join(" → "));

      function addChild() {
        const parent = tree.value[0];
        const nextId = Math.max(...flat.value.map((n) => n.id)) + 1;
        (parent.children as Array<{ id: number; label: string }>).push({
          id: nextId,
          label: `新节点 ${nextId}`,
        });
      }

      return { tree, key, summary, flat, addChild };
    },
    template: `
      <PanelDemo title="flattenTree(arr, childrenKey = 'children')">
        <PanelRow label="childrenKey">
          <input v-model="key" type="text" />
        </PanelRow>
        <PanelRow label="原始树">
          <pre style="margin:0;font-size:12px;color:#606266;white-space:pre-wrap;">{{ JSON.stringify(tree, null, 2) }}</pre>
        </PanelRow>
        <template #result>
          {{ summary }}
          <div style="color:#909399;font-size:12px;margin-top:6px;">
            共 {{ flat.length }} 项（含父节点）
          </div>
        </template>
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="addChild">往第一个父节点加子节点</button>
        </template>
      </PanelDemo>
    `,
  }),
};

/** 无序比较：换顺序仍相等，元素不同则不等 */
export const IsArrEqual: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const left = ref("1, 2, 3");
      const right = ref("3, 1, 2");
      const parse = (s: string) =>
        s
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => (/^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v));
      const result = computed(() => {
        const a = parse(left.value);
        const b = parse(right.value);
        return isArrEqual(a, b)
          ? `相等 true（${JSON.stringify(a)} ↔ ${JSON.stringify(b)}）`
          : `不等 false（${JSON.stringify(a)} ↔ ${JSON.stringify(b)}）`;
      });
      return { left, right, result };
    },
    template: `
      <PanelDemo title="isArrEqual(arr1, arr2) — 与顺序无关">
        <PanelRow label="arr1" hint="逗号分隔">
          <input v-model="left" type="text" />
        </PanelRow>
        <PanelRow label="arr2" hint="逗号分隔">
          <input v-model="right" type="text" />
        </PanelRow>
        <template #result>{{ result }}</template>
        <template #footer>
          <span style="color:#909399;font-size:12px;font-family:system-ui;">
            只接受 string / number；长度不同直接返回 false
          </span>
        </template>
      </PanelDemo>
    `,
  }),
};
