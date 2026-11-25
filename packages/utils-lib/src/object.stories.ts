import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import { flattenObj, unFlatten, isObjEqual, isObjEmpty } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelRow } from "./stories/PanelDemo";

/**
 * 对象工具：扁平化与还原、深度比较、判空。
 *
 * `flattenObj` / `unFlatten` 是一对逆运算。注意 `flattenObj` 用 `.` 作为路径分隔符，
 * 如果键名本身含 `.`，还原时会被拆错 —— 遇到这种数据别用这一对。
 */
const meta = {
  title: "工具/对象 object",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_JSON = `{
  "user": { "name": "张三", "address": { "city": "杭州" } },
  "active": true,
  "tags": ["a", "b"]
}`;

/** 嵌套对象压平成一层，键用 . 连接 */
export const FlattenObj: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const input = ref(SAMPLE_JSON);
      const result = computed(() => {
        try {
          return JSON.stringify(flattenObj(JSON.parse(input.value)), null, 2);
        } catch {
          return "JSON 解析失败";
        }
      });
      return { input, result };
    },
    template: `
      <PanelDemo title="flattenObj(obj, prefix?)">
        <PanelRow label="输入 JSON">
          <textarea v-model="input" rows="8" />
        </PanelRow>
        <template #result><pre style="margin:0; white-space:pre-wrap;">{{ result }}</pre></template>
      </PanelDemo>
    `,
  }),
};

/** 把扁平结构还原成嵌套，与 flattenObj 互逆 */
export const UnFlatten: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const input = ref(`{
  "user.name": "张三",
  "user.address.city": "杭州",
  "active": true
}`);
      const result = computed(() => {
        try {
          return JSON.stringify(unFlatten(JSON.parse(input.value)), null, 2);
        } catch {
          return "JSON 解析失败";
        }
      });
      return { input, result };
    },
    template: `
      <PanelDemo title="unFlatten(obj) — 键含 . 的扁平对象">
        <PanelRow label="输入 JSON">
          <textarea v-model="input" rows="8" />
        </PanelRow>
        <template #result><pre style="margin:0; white-space:pre-wrap;">{{ result }}</pre></template>
      </PanelDemo>
    `,
  }),
};

/** 深度比较：两边同时改，实时看是否相等 */
export const IsObjEqual: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const left = ref(`{ "a": 1, "b": { "c": [1, 2] } }`);
      const right = ref(`{ "a": 1, "b": { "c": [1, 2] } }`);
      const parsed = computed(() => {
        try {
          return { a: JSON.parse(left.value), b: JSON.parse(right.value) };
        } catch {
          return null;
        }
      });
      const result = computed(() => {
        if (!parsed.value) return "JSON 解析失败";
        return isObjEqual(parsed.value.a, parsed.value.b) ? "相等 true" : "不等 false";
      });
      return { left, right, result };
    },
    template: `
      <PanelDemo title="isObjEqual(obj1, obj2)">
        <PanelRow label="obj1"><textarea v-model="left" rows="6" /></PanelRow>
        <PanelRow label="obj2"><textarea v-model="right" rows="6" /></PanelRow>
        <template #result>{{ result }}</template>
      </PanelDemo>
    `,
  }),
};

/**
 * 判空只看自有可枚举键。
 *
 * 注意 `{ a: undefined }` 有键，所以**不算**空 —— 这一点和「内容都是空值」的
 * 直觉不同。story 里用代码构造（JSON 没有 undefined，表达不了这个用例）。
 */
export const IsObjEmpty: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const cases = [
        { label: "{}", value: {} },
        { label: "{ a: 1 }", value: { a: 1 } },
        { label: "{ a: undefined }", value: { a: undefined } },
        { label: "{ a: null }", value: { a: null } },
      ];
      const picked = ref(0);
      const result = computed(() => {
        const target = cases[picked.value].value;
        return isObjEmpty(target) ? "空 true" : "非空 false";
      });
      return { cases, picked, result };
    },
    template: `
      <PanelDemo title="isObjEmpty(obj)">
        <PanelRow label="选择对象">
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button
              v-for="(c, i) in cases" :key="c.label"
              class="ud-btn"
              :class="{ 'ud-btn--primary': picked === i }"
              @click="picked = i"
            >{{ c.label }}</button>
          </div>
        </PanelRow>
        <template #result>{{ result }}</template>
      </PanelDemo>
    `,
  }),
};
