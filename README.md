# comp-lib

shaohui_jin 的组件库与工具库，pnpm monorepo。

| 包 | 说明 | 依赖 |
| --- | --- | --- |
| [`@shaohui_jin/comp-lib`](packages/comp-lib) | Vue 3 组件库：基础 / 交互 / CRUD 组件 + 主题配置系统 | vue、element-plus |
| [`@shaohui_jin/utils-lib`](packages/utils-lib) | 零依赖工具函数与类型体操 | 无 |

## 环境

```bash
corepack enable        # 使用 package.json 里固定的 pnpm 10
pnpm install
```

## 常用命令

```bash
pnpm dev                # 两包并行 watch 构建
pnpm storybook          # 组件文档站，http://localhost:6006
pnpm build              # 构建两个包
pnpm build-storybook    # 构建静态文档站（storybook-static/）
pnpm typecheck          # vue-tsc + tsc
pnpm test               # utils-lib 单测
pnpm test:hooks         # 提交钩子单测
pnpm lint               # eslint + stylelint
```

## 目录

```
packages/
├── comp-lib/           # @shaohui_jin/comp-lib
│   └── src/
│       ├── components/ # basic / interaction / crud
│       ├── config/     # createCompLib、ConfigProvider、主题预设
│       ├── style/      # $lib-* SCSS 令牌
│       ├── type/       # 组件 props / emits 类型
│       └── stories/    # story 共用 fixture 与 MDX
└── utils-lib/          # @shaohui_jin/utils-lib
    └── src/            # 按主题拆分的纯函数与类型
```

## 组件文档

文档由 Storybook 生成，stories 与组件同目录（`*.stories.ts`），
Props / Events 表从 TypeScript 类型自动推导，不需要手写 API 表格。

```bash
pnpm storybook
```

## 发布

两个包独立发版，版本号各自维护在 `packages/*/package.json`。

1. 改版本号
2. 跑 `pnpm build` 与 `pnpm typecheck` 确认产物正常
3. 手动发布：

```bash
pnpm --filter @shaohui_jin/utils-lib publish
pnpm --filter @shaohui_jin/comp-lib publish
```

`.github/workflows/release.yml` 已写好自动发布流程（按 tag 闸门判断是否需要发布），
但 **push 触发分支默认注释掉**，需要时手动取消注释或走 `workflow_dispatch`。

## 提交约定

见 [CONTRIBUTING.md](CONTRIBUTING.md)。核心一条：**不留 AI 作者署名**，
由 husky 的 `commit-msg` 钩子自动剥离。
