import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Image3D } from "@shaohui_jin/comp-lib";
import { placeholderImage } from "../../../stories/fixtures";

/**
 * 跟随鼠标（或手指）做 3D 倾斜的图片。倾斜角度限制在 ±10 度，
 * 鼠标离开后自动回正。触屏同样可用。
 */
const meta = {
  title: "基础/Image3D 立体图片",
  component: Image3D,
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text", description: "图片地址" },
  },
  args: {
    src: placeholderImage("3D", "#6366f1", 480, 320),
  },
} satisfies Meta<typeof Image3D>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 把鼠标移到图上，观察倾斜效果 */
export const Default: Story = {};
