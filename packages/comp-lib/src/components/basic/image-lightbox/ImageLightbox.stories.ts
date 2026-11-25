import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ImageLightbox } from "@shaohui_jin/comp-lib";
import { sampleImages } from "../../../stories/fixtures";

/**
 * 缩略图 + 全屏灯箱。点击缩略图打开，支持 Esc 关闭、左右方向键切换。
 * 也可通过 ref 调用 `open(index)` / `close()` 主动控制。
 */
const meta = {
  title: "基础/ImageLightbox 灯箱",
  component: ImageLightbox,
  tags: ["autodocs"],
  argTypes: {
    urls: { control: "object", description: "图片地址列表" },
    index: { control: "number", description: "当前索引（v-model:index）" },
  },
  args: {
    urls: sampleImages,
    index: 0,
  },
} satisfies Meta<typeof ImageLightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 点击任意缩略图打开灯箱 */
export const Default: Story = {};

/** 通过 ref 主动打开第 3 张 */
export const OpenProgrammatically: Story = {
  render: (args) => ({
    components: { ImageLightbox },
    setup() {
      const lb = { value: null as InstanceType<typeof ImageLightbox> | null };
      return { args, lb };
    },
    template: `
      <div>
        <button style="margin-bottom: 12px;" @click="lb?.open(2)">用 ref 打开第 3 张</button>
        <ImageLightbox ref="lb" v-bind="args" />
      </div>
    `,
  }),
};
