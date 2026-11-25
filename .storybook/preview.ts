import { setup } from "@storybook/vue3-vite";
import type { Preview } from "@storybook/vue3-vite";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createCompLib, elementPlusLocale } from "@shaohui_jin/comp-lib";

// 组件库依赖 Element Plus 的样式基线；组件库自己的样式由每个组件内联引入
setup((app) => {
  app.use(ElementPlus, { locale: elementPlusLocale });
  app.use(createCompLib());
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // 每个组件自动生成 Docs 页，Props/Events 表从 TS 类型推导
      defaultName: "文档",
    },
    options: {
      storySort: {
        order: ["基础", "交互", "CRUD", "主题配置"],
      },
    },
  },
};

export default preview;
