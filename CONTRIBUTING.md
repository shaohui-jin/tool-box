# 参与维护

一个 pnpm monorepo，两个包：`@shaohui_jin/comp-lib`（Vue 组件）与
`@shaohui_jin/utils-lib`（纯 TS 工具）。包边界要守住：

- **utils-lib 不依赖 vue 或任何运行时库**。它要能被 Node 脚本、SSR、非 Vue 前端直接 import。
- **comp-lib 只依赖 utils-lib 的纯函数**，不反向依赖。utils-lib 也不知道组件库的存在。

---

## 环境

```bash
corepack enable
pnpm install
```

pnpm 版本固定在 `package.json` 的 `packageManager`，`.npmrc` 里开了 `package-manager-strict`，
用 npm / yarn 装依赖会直接报错，这是有意的。

---

## 提交前必跑

```bash
pnpm typecheck   # comp-lib 用 vue-tsc，utils-lib 用 tsc
pnpm build       # 两包都要产出 dist
pnpm test        # utils-lib 单测
pnpm lint        # eslint + stylelint
```

只改文档时至少跑 `pnpm build-storybook`，确认 stories 没写坏。

---

## 新增一个组件

1. **类型先写**：在 `src/type/<分组>.ts` 声明 `XxxProps` / `XxxEmits`，带注释 ——
   Storybook 的 Props 表格直接从这些注释和类型生成，注释就是文档。
2. **组件**：`src/components/<分组>/<kebab-name>/Xxx.vue`，用 `defineOptions({ name: "Xxx" })`
   显式命名（`app.component` 注册、DevTools 都靠它）。
3. **导出**：加进 `src/components/index.ts` 与 `src/index.ts` 的具名导出和 `components` 数组。
4. **story**：同目录 `Xxx.stories.ts`，`title` 用 `"基础/交互/CRUD/主题配置"` 作为一级分组。
5. **样式**：颜色、圆角、字号必须走 `@use "style/variables" as *;` 里的 `$lib-*` 令牌，
   不要硬编码色值 —— 这些令牌是 CSS 变量，主题切换靠它们生效。

## 新增一个工具函数

- 放 `src/<主题>.ts`，并在 `src/index.ts` 里 `export *`。
- 能写成纯函数就别依赖 DOM；确实依赖浏览器的（如 `copyToClipboard`）在注释里写明。
- 加对应测试到 `src/index.test.ts`。

---

## 提交与推送

- 信息用中文，前缀 `feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`
- 正文写「为什么」和「代价」，不逐条罗列改了哪些文件
- **不加 AI 作者**：不写 `Co-authored-by:` 尾注，不加「Generated with …」footer，
  `Author` 与 `Committer` 只留仓库主人

### AI 尾注由 husky 兜底

「不加 AI 作者」不靠自觉：Cursor 会在提交时把命令改写成带
`--trailer "Co-authored-by: Cursor <cursoragent@cursor.com>"` 的形式，
尾注是工具加的，不是你写的。

钩子定义在 [.husky/commit-msg](.husky/commit-msg)，逻辑在
[scripts/hooks/strip-ai-trailers.mjs](scripts/hooks/strip-ai-trailers.mjs)，
在提交落盘前剥掉这类尾注：

```
[commit-msg] 已移除 1 条 AI 协作尾注（约定：不加 AI 作者）
[commit-msg]   - Co-authored-by: Cursor <cursoragent@cursor.com>
```

**只删 AI 署名**。真人的 `Co-authored-by`（结对编程）会保留。

钩子退出码恒为 0 —— 这是清理，不是拦截。拦下来只会逼人 `--no-verify`，
而 `--no-verify` 会连带跳过所有别的检查。

修改剥离规则后，务必跑 `pnpm test:hooks`；测试里覆盖了「正文提到 `Co-authored-by`
不能被误删」「真人署名必须保留」这些踩过的坑。

---

## 发布

版本号各自维护在 `packages/*/package.json`。两个包独立发版，
但 comp-lib 依赖 utils-lib，所以 **utils-lib 先发**。

`prepublishOnly` 会自动跑 `typecheck && build`，不会把没编译的产物传上去。
