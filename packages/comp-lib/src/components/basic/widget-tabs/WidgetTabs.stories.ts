import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { WidgetTabs } from "@shaohui_jin/comp-lib";

const SAMPLE = `<script setup lang="ts">
import { Tag } from "@shaohui_jin/comp-lib";
</script>

<template>
  <Tag label="成功" type="success" />
</template>
`;

/**
 * 「预览 / 代码」双 Tab 容器，是文档站里展示组件最常用的外壳。
 * `flush` 控制预览区是否贴边（去掉内边距），默认 true。
 */
const meta = {
  title: "基础/WidgetTabs 预览容器",
  component: WidgetTabs,
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text", description: "代码 Tab 展示的源码" },
    lang: { control: "text", description: "源码语法名" },
    flush: { control: "boolean", description: "预览区是否贴边" },
  },
  args: {
    code: SAMPLE,
    lang: "vue",
    flush: true,
  },
} satisfies Meta<typeof WidgetTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认：预览区贴边 */
export const Default: Story = {
  render: (args) => ({
    components: { WidgetTabs },
    setup: () => ({ args }),
    template: `
      <WidgetTabs v-bind="args">
        <div style="padding: 16px;">这里是默认插槽里的预览内容</div>
      </WidgetTabs>
    `,
  }),
};

/** flush=false 时预览区带内边距 */
export const NotFlush: Story = {
  ...Default,
  args: { ...Default.args, flush: false },
};
