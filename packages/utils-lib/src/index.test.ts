/**
 * utils-lib 的行为测试。
 *
 * 用 Node 自带的 test runner 直接跑 .ts（Node 24 默认开启类型擦除），
 * 不引测试框架：工具函数没有组件那样的生命周期，断言足够。
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  flattenTree,
  isArrEqual,
  rgbaToHex,
  hexToRGBA,
  colorToRGBA,
  getRandom,
  scaleFormat,
  flattenObj,
  unFlatten,
  isObjEqual,
  isObjEmpty,
  usePermission,
  debounce,
} from "./index.ts";

test("flattenTree 递归展开 children", () => {
  const input = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }, { id: 4 }];
  assert.deepEqual(
    flattenTree(input).map((n) => n.id),
    [1, 2, 3, 4],
  );
});

test("flattenTree 可自定义 children 键与关闭递归", () => {
  const input = [{ id: 1, nodes: [{ id: 2 }] }];
  assert.deepEqual(
    flattenTree(input, "nodes").map((n) => n.id),
    [1, 2],
  );
  // childrenKey 传空串时不再往下看，只拍平一层
  assert.deepEqual(
    flattenTree(input, "").map((n) => n.id),
    [1],
  );
});

test("isArrEqual 与顺序无关", () => {
  assert.equal(isArrEqual([1, 2, 3], [3, 2, 1]), true);
  assert.equal(isArrEqual(["a", "b"], ["a", "b", "c"]), false);
  assert.equal(isArrEqual([1, 2], [1, 3]), false);
});

test("颜色转换互相自洽", () => {
  assert.equal(rgbaToHex("rgb(64, 158, 255)"), "#409eff");
  assert.equal(hexToRGBA("#409eff"), "rgb(64, 158, 255)");
  assert.equal(hexToRGBA("#409eff", 0.5), "rgba(64, 158, 255, 0.5)");
  assert.deepEqual(colorToRGBA("#409eff"), { r: 64, g: 158, b: 255 });
});

test("rgbaToHex 会把半透明按白底预乘", () => {
  // alpha=0 时结果应是纯白
  assert.equal(rgbaToHex("rgba(0, 0, 0, 0)"), "#ffffff");
});

test("getRandom 落在闭区间内", () => {
  for (let i = 0; i < 200; i++) {
    const v = getRandom(1, 6);
    assert.ok(v >= 1 && v <= 6, `越界：${v}`);
    assert.equal(Number.isInteger(v), true);
  }
});

test("scaleFormat 补齐小数位", () => {
  assert.equal(scaleFormat("1.005", 2), "1.00");
  assert.equal(scaleFormat("2", 3), "2.000");
  // 默认值：0 保留两位
  assert.equal(scaleFormat(), "0.00");
});

test("flattenObj / unFlatten 是一对逆运算", () => {
  const nested = { a: { b: 1, c: { d: 2 } }, e: 3 };
  const flat = flattenObj(nested);
  assert.deepEqual(flat, { "a.b": 1, "a.c.d": 2, e: 3 });
  assert.deepEqual(unFlatten(flat), nested);
});

test("isObjEqual 深度比较", () => {
  assert.equal(isObjEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } }), true);
  assert.equal(isObjEqual({ a: 1 }, { a: 2 }), false);
  assert.equal(isObjEqual({ a: 1 }, { b: 1 }), false);
  // 空值直接判不等（与原实现一致）
  assert.equal(isObjEqual(null as any, { a: 1 }), false);
});

test("isObjEmpty 只看自有可枚举键", () => {
  assert.equal(isObjEmpty({}), true);
  assert.equal(isObjEmpty({ a: undefined }), false);
});

test("usePermission 位运算增删查", () => {
  const { getPermission, hasPermission, switchPermission } = usePermission([
    "add",
    "edit",
    "delete",
  ] as const);

  const v = getPermission(["add", "delete"]);
  assert.equal(v, 0b101);
  assert.equal(hasPermission(v, "add"), true);
  assert.equal(hasPermission(v, "edit"), false);

  // 切换开 → 关
  assert.equal(hasPermission(switchPermission(v, "add"), "add"), false);
  // 切换关 → 开
  assert.equal(hasPermission(switchPermission(v, "edit"), "edit"), true);
});

test("usePermission 遇到未知权限告警并返回 false", () => {
  const { hasPermission } = usePermission(["add"] as const);
  const warn = console.warn;
  let warned = "";
  console.warn = (msg: string) => (warned = msg);
  try {
    assert.equal(hasPermission(1, "nope" as any), false);
  } finally {
    console.warn = warn;
  }
  assert.match(warned, /nope/);
});

test("debounce 合并高频调用，只执行最后一次", async () => {
  let calls = 0;
  const fn = debounce(() => calls++, 20);
  fn();
  fn();
  fn();
  assert.equal(calls, 0);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(calls, 1);
});

test("debounce immediate 首次立即执行，后续仍防抖", async () => {
  let calls = 0;
  const fn = debounce(() => calls++, 20, true);
  fn();
  assert.equal(calls, 1);
  fn();
  fn();
  assert.equal(calls, 1);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(calls, 2);
});
