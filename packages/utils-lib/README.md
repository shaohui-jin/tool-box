# @shaohui_jin/utils-lib

零依赖的 TypeScript 工具函数与类型体操合集。

「零依赖」是硬约束：能被 Node 脚本、SSR、非 Vue 前端直接 import，包内不引用 vue、lodash
或任何运行时库。产物只有几 KB。

## 安装

```bash
pnpm add @shaohui_jin/utils-lib
```

## 使用

```ts
import { debounce, flattenTree, rgbaToHex } from "@shaohui_jin/utils-lib";

// 类型体操，零运行时开销
import type { getOptional, arrayToUnion } from "@shaohui_jin/utils-lib";
```

## 模块

| 模块     | 导出                                                             |
| -------- | ---------------------------------------------------------------- |
| 颜色     | `rgbaToHex` `hexToRGBA` `colorToRGBA`                            |
| 数字     | `getRandom` `scaleFormat`                                        |
| 对象     | `flattenObj` `unFlatten` `isObjEqual` `isObjEmpty`               |
| 数组     | `flattenTree` `isArrEqual`                                       |
| 剪贴板   | `copyToClipboard`                                                |
| 防抖     | `debounce`                                                       |
| 性能     | `performChunk` `concurRequest`                                   |
| 权限     | `usePermission`                                                  |
| 类型体操 | `getValue` `setValue` `getOptional` `setOptional` `arrayToUnion` |

## 完整文档

交互式文档（每个函数都能在页面上改参数看结果）：

https://shaohui-jin.github.io/tool-box/

## 注意

- `copyToClipboard` 只能在浏览器调用，Node / SSR 下会抛错
- `usePermission` 用位运算，上限 31 个权限位
- `flattenObj` / `unFlatten` 用 `.` 作路径分隔符，键名本身含 `.` 时不要用这一对
- `scaleFormat` 内部是 `toFixed`，`1.005` 会得到 `"1.00"`（IEEE 754 固有行为）

## License

MIT
