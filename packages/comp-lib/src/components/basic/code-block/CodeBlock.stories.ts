import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CodeBlock } from "@shaohui_jin/comp-lib";

const SAMPLE = `import { ref, computed } from "vue";

// 一个示例函数
export function useCounter(initial = 0) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);
  const inc = () => count.value++;
  return { count, double, inc };
}
`;

/**
 * 带行号与复制按钮的代码块。传 `lang` 时用 highlight.js 着色；
 * 也可以直接给 `highlighted` 传已渲染好的 HTML（用于 SSR 场景）。
 */
const meta = {
  title: "基础/CodeBlock 代码块",
  component: CodeBlock,
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text", description: "原始代码文本，复制按钮复制的就是它" },
    lang: {
      control: "select",
      options: ["ts", "js", "vue", "html", "css", "json", "bash", "python"],
      description: "语法名，用于 highlight.js 着色",
    },
    highlighted: { control: "text", description: "已渲染的 HTML；传入后忽略 lang" },
    highlightLines: { control: "object", description: "需要高亮的行号（从 1 开始）" },
  },
  args: {
    code: SAMPLE,
    lang: "ts",
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认按 TS 着色 */
export const Default: Story = {};

/** 高亮指定行，常用于强调改动位置 */
export const HighlightLines: Story = {
  args: {
    highlightLines: [4, 5],
  },
};

/** 不传 lang 时退化为纯文本（同样做 HTML 转义，不会注入） */
export const PlainText: Story = {
  args: {
    lang: undefined,
    code: `<div class="demo">这段不会被当成标签解析</div>`,
  },
};
