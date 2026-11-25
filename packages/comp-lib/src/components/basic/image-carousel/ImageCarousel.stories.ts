import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ImageCarousel } from "@shaohui_jin/comp-lib";
import { sampleImages } from "../../../stories/fixtures";

/**
 * 3D 卡片式图片轮播：非当前项按距离缩放、旋转并淡出。
 * 支持 `v-model:index` 受控，也支持 `defaultIndex` 非受控。
 */
const meta = {
  title: "基础/ImageCarousel 图片轮播",
  component: ImageCarousel,
  tags: ["autodocs"],
  argTypes: {
    imageUrls: { control: "object", description: "图片地址列表" },
    index: { control: "number", description: "当前下标（v-model:index）" },
    defaultIndex: { control: "number", description: "非受控模式的初始下标" },
    loop: { control: "boolean", description: "首尾循环" },
    autoplay: { control: "boolean", description: "自动轮播" },
    interval: { control: "number", description: "自动轮播间隔（ms）" },
    showArrows: { control: "boolean", description: "显示左右箭头" },
  },
  args: {
    imageUrls: sampleImages,
    defaultIndex: 0,
    loop: true,
    autoplay: false,
    interval: 3000,
    showArrows: true,
  },
} satisfies Meta<typeof ImageCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认：可点击箭头切换，首尾循环 */
export const Default: Story = {};

/** 自动轮播，间隔 2s */
export const Autoplay: Story = {
  args: { autoplay: true, interval: 2000 },
};

/** 关闭箭头，只靠点击两侧卡片切换 */
export const NoArrows: Story = {
  args: { showArrows: false },
};
