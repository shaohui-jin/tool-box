import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import { usePermission } from "@shaohui_jin/utils-lib";
import { PanelDemo, PanelLog, PanelRow } from "./stories/PanelDemo";

/**
 * 位运算权限管理。
 *
 * 把权限列表映射成 `1 << i`，用一个整数承载全部权限位：
 * `hasPermission` 做与运算判断，`switchPermission` 用异或切换。
 *
 * > 上限 31 个权限位（第 32 位会落到符号位）。超过这个量级请改用 Set。
 * > 名字带 `use` 但**不依赖 Vue**，它只是个返回三个纯函数的工厂。
 */
const meta = {
  title: "工具/权限 permission",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PERMISSIONS = ["add", "edit", "delete", "export"] as const;

/** 勾选权限，实时看权限值与位模式 */
export const Default: Story = {
  render: () => ({
    components: { PanelDemo, PanelRow },
    setup() {
      const { getPermission, hasPermission, switchPermission } = usePermission(PERMISSIONS);

      // 以权限值为唯一真源，切换直接走 switchPermission（异或）
      const value = ref(getPermission(["add"]));

      function toggle(p: (typeof PERMISSIONS)[number]) {
        value.value = switchPermission(value.value, p);
      }

      const checked = computed(() => PERMISSIONS.filter((p) => hasPermission(value.value, p)));

      const bits = computed(() =>
        PERMISSIONS.map((p, i) => `${p}:${(value.value >> i) & 1}`).join("  "),
      );

      const binary = computed(() => value.value.toString(2).padStart(PERMISSIONS.length, "0"));

      return { PERMISSIONS, value, checked, bits, binary, toggle };
    },
    template: `
      <PanelDemo title="usePermission(['add','edit','delete','export'])">
        <PanelRow label="权限">
          <div style="display:flex;gap:14px;flex-wrap:wrap;">
            <label v-for="p in PERMISSIONS" :key="p" style="display:flex;gap:4px;align-items:center;">
              <input type="checkbox" :checked="checked.includes(p)" @change="toggle(p)" />
              {{ p }}
            </label>
          </div>
        </PanelRow>
        <PanelRow label="位模式">
          <span style="color:#606266;">{{ binary }} （{{ bits }}）</span>
        </PanelRow>
        <template #result>权限值 {{ value }}</template>
      </PanelDemo>
    `,
  }),
};

/**
 * 未知权限的处理：`hasPermission` 会 `console.warn` 并返回 false，
 * 不会抛错。这样权限字段拼错时是「静默拒绝」而不是整页崩掉。
 */
export const UnknownPermission: Story = {
  render: () => ({
    components: { PanelDemo, PanelLog },
    setup() {
      const { hasPermission, getPermission, switchPermission } = usePermission(["add", "edit"] as const);
      const logs = ref<string[]>([]);

      function run() {
        const v = getPermission(["add"]);
        logs.value = [];

        // hasPermission 对未知字段会告警，这里把告警也抓出来展示
        const orig = console.warn;
        console.warn = (msg: string) => logs.value.push(`warn: ${msg}`);
        try {
          hasPermission(v, "nonexistent" as never);
        } finally {
          console.warn = orig;
        }

        logs.value.push(`hasPermission(1, 'add') → ${hasPermission(v, "add")}`);
        logs.value.push(`hasPermission(1, 'edit') → ${hasPermission(v, "edit")}`);

        // switchPermission 对未知字段用 `|| 0`，返回值不变
        const before = v;
        const after = switchPermission(v, "nonexistent" as never);
        logs.value.push(`switchPermission(未知字段) → ${before} → ${after}（不变）`);
      }

      return { logs, run };
    },
    template: `
      <PanelDemo title="未知权限字段的行为">
        <template #footer>
          <button class="ud-btn ud-btn--primary" @click="run">执行一次</button>
        </template>
      </PanelDemo>
      <ul class="ud-log" style="margin-top:12px;max-width:720px;">
        <li v-for="(l, i) in logs" :key="i" class="ud-log__item">{{ l }}</li>
      </ul>
    `,
  }),
};
