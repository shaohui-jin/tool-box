import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { StepWizard } from "@shaohui_jin/comp-lib";

const STEPS = [
  { title: "填写基础信息", description: "名称与描述" },
  { title: "选择字段", description: "勾选需要的列" },
  { title: "确认提交", description: "核对后提交" },
];

/**
 * 步骤条 + 分步内容容器。默认页脚自带「上一步 / 下一步 / 完成」，
 * 最后一步点「完成」时 emit `finish`；也可用 `footer` 插槽完全自定义。
 */
const meta = {
  title: "交互/StepWizard 步骤向导",
  component: StepWizard,
  tags: ["autodocs"],
  argTypes: {
    steps: { control: "object", description: "步骤配置" },
    step: { control: "number", description: "当前步骤（v-model:step）" },
  },
  args: {
    steps: STEPS,
    step: 0,
  },
  render: (args) => ({
    components: { StepWizard },
    setup() {
      const current = { value: args.step ?? 0 };
      const log = { value: "—" };
      return { args, current, log };
    },
    template: `
      <div>
        <StepWizard
          v-model:step="current.value"
          :steps="args.steps"
          @finish="log.value = 'finish 事件已触发'"
        >
          <div style="padding: 24px 0; color: #606266;">
            第 {{ current.value + 1 }} 步的内容
          </div>
        </StepWizard>
        <p style="color: #909399;">{{ log.value }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof StepWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 点击「下一步」逐步推进，最后一步点「完成」触发 finish */
export const Default: Story = {};

/** 从第二步开始（常用于回填编辑态） */
export const StartFromSecond: Story = {
  args: { step: 1 },
  render: meta.render,
};

/** 自定义页脚，去掉默认按钮逻辑 */
export const CustomFooter: Story = {
  render: (args) => ({
    components: { StepWizard },
    setup() {
      const current = { value: 0 };
      return { args, current };
    },
    template: `
      <StepWizard v-model:step="current.value" :steps="args.steps">
        <div style="padding: 24px 0;">自定义内容</div>
        <template #footer="{ next, prev }">
          <button :disabled="current.value === 0" @click="prev">‹ 上一步</button>
          <button @click="next">下一步 ›</button>
        </template>
      </StepWizard>
    `,
  }),
};
