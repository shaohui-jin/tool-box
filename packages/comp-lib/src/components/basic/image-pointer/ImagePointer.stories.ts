import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ImagePointer } from "@shaohui_jin/comp-lib";
import { sampleImages } from "../../../stories/fixtures";

/**
 * 图片墙 + 跟随高亮框。鼠标悬停在哪张图上，指示框就移到哪张，
 * 位移带过渡动画，用于展示「当前选中项」。
 */
const meta = {
  title: "基础/ImagePointer 图片指示框",
  component: ImagePointer,
  tags: ["autodocs"],
  argTypes: {
    imageUrls: { control: "object", description: "图片地址列表" },
    index: { control: "number", description: "当前高亮下标（v-model:index）" },
    gap: { control: "number", description: "图片间距（px）" },
    pointerColor: { control: "color", description: "指示框边框颜色" },
  },
  args: {
    imageUrls: sampleImages,
    gap: 20,
    pointerColor: "#409eff",
  },
} satisfies Meta<typeof ImagePointer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 悬停查看指示框移动 */
export const Default: Story = {};

/** 缩略图 + 更紧凑的间距 */
export const Compact: Story = {
  args: { gap: 8 },
};
