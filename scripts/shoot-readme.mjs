/**
 * 为 README 截取 Storybook 的真实页面。
 *
 * 为什么要真截图而不是画示意图：组件库的卖点就是「实际长什么样」，
 * 生成的插图看不出渲染效果，也发现不了 Canvas 未绘制、字体回落这类问题。
 *
 * 脚本自包含：自己起静态服务、截完关掉，不需要另外开终端。
 *
 * 运行：pnpm build-storybook && pnpm shoot:readme
 * 产物：docs/images/*.png
 *
 * 截图策略：用元素截图（locator.screenshot）而不是整页截图。
 * 整页截图会带上 story 容器的大量空白 —— 实测 BaseSearch 内容只有 88px 高，
 * 整页截 640px 高就是 86% 纯白。裁到元素后图里只剩内容。
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC_DIR = join(ROOT, "storybook-static");
const OUT_DIR = join(ROOT, "docs", "images");
const PORT = 6017;
const BASE = `http://127.0.0.1:${PORT}`;

/**
 * 要截的页面。
 *
 * `id` 是 Storybook 的 story id（见 storybook-static/index.json）。
 * `width` 是 viewport 宽度 —— 它决定内容宽度，不能随便改小：
 * 窄了横向表单会换行、表格列会被压缩。高度不指定，由元素截图自动裁。
 *
 * `minHeight` 用于内容特别扁的场景（如查询栏只有 88px），
 * 给它一点上下留白，免得在 README 里成一条线。
 */
const SHOTS = [
  {
    file: "hero-crud.png",
    id: "crud-basecrud-页面骨架--default",
    // demoSettingColumns 列宽合计约 640px + 选择/索引列，
    // 容器再宽表格也不会拉伸，只会多出右侧空白
    width: 820,
    note: "README 头图：完整 CRUD 页面骨架",
  },
  {
    file: "table-element.png",
    id: "crud-basetable-表格--element",
    width: 900,
    note: "BaseTable element 模式",
  },
  {
    file: "table-virtual.png",
    id: "crud-basetable-表格--virtual",
    width: 900,
    note: "BaseTable virtual 模式",
  },
  {
    file: "table-canvas.png",
    id: "crud-basetable-表格--canvas",
    width: 900,
    note: "BaseTable canvas 模式（与 canvas-tile 视觉一致，故只留一张）",
  },
  {
    file: "table-loading.png",
    id: "crud-basetable-表格--loading",
    width: 900,
    note: "BaseTable 加载态",
  },
  {
    file: "search-form.png",
    id: "crud-basesearch-查询表单--default",
    // 查询栏把操作按钮推到最右，宽了中间会空一大片，900 更紧凑
    width: 900,
    minHeight: 130,
    note: "查询表单",
  },
  {
    file: "themes.png",
    id: "主题配置-configprovider--presets",
    // 四个 200px 卡片 + 三个 16px 间距 = 848，取 880 留一点余量
    width: 880,
    note: "四个主题预设并排",
  },
  {
    file: "components-basic.png",
    id: "基础-imagecarousel-图片轮播--default",
    width: 900,
    note: "基础组件：3D 图片轮播",
  },
  {
    file: "components-interaction.png",
    id: "交互-stepwizard-步骤向导--default",
    width: 900,
    note: "交互组件：步骤向导",
  },
  {
    file: "heatmap.png",
    id: "交互-heatmapcalendar-热力图--full-year",
    width: 900,
    minHeight: 130,
    note: "热力图，一年数据",
  },
  {
    file: "canvas-time.png",
    id: "交互-canvastime-粒子时钟--dark",
    width: 640,
    note: "Canvas 粒子时钟",
  },
  {
    file: "utils-panel.png",
    id: "工具-颜色-color--rgba-to-hex",
    width: 820,
    minHeight: 180,
    note: "工具库交互面板",
  },
];

/** 轮询直到静态服务可访问 */
async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/index.json`);
      if (res.ok) return;
    } catch {
      /* 还没起来 */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`静态服务 ${timeoutMs}ms 内未就绪`);
}

function pngSize(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
}

async function main() {
  if (!existsSync(STATIC_DIR)) {
    console.error("找不到 storybook-static/。先跑：pnpm build-storybook");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const server = spawn(
    "npx.cmd",
    ["http-server", "storybook-static", "-p", String(PORT), "-c-1", "--silent"],
    {
      cwd: ROOT,
      stdio: "ignore",
      shell: true,
    },
  );

  const errors = [];
  let browser;

  try {
    await waitForServer();

    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      // Retina 下清晰；同时控制总体积
      deviceScaleFactor: 2,
      locale: "zh-CN",
    });

    for (const shot of SHOTS) {
      const page = await context.newPage();
      await page.setViewportSize({ width: shot.width, height: 900 });

      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`[${shot.file}] console: ${msg.text()}`);
      });
      page.on("pageerror", (err) => errors.push(`[${shot.file}] pageerror: ${err.message}`));

      const url = `${BASE}/iframe.html?id=${encodeURIComponent(shot.id)}&viewMode=story`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        // 字体先就绪，否则截到的是回退字形
        await page.evaluate(() => document.fonts.ready);
        // Canvas / 动画类组件需要额外时间才是稳定帧
        await page.waitForTimeout(900);

        // 截 story 根节点的第一个子元素：它才是真正的内容。
        // #storybook-root 是撑满 viewport 的 block，截它会带回整页留白。
        const target = page.locator("#storybook-root > *").first();
        const box = await target.boundingBox();
        if (!box) throw new Error("找不到内容元素");

        // 内容过扁时补一点上下留白（改 padding 而非放大画布）
        if (shot.minHeight && box.height < shot.minHeight) {
          await page.addStyleTag({
            content: `#storybook-root > * { padding-top: 12px; padding-bottom: 12px; }`,
          });
          await page.waitForTimeout(120);
        }

        await target.screenshot({ path: join(OUT_DIR, shot.file) });

        const finalBox = (await target.boundingBox()) ?? box;
        console.log(
          `ok   ${shot.file}  ${Math.round(finalBox.width)}x${Math.round(finalBox.height)}`,
        );
      } catch (e) {
        console.error(`ERR  ${shot.file}: ${e.message}`);
        errors.push(`[${shot.file}] ${e.message}`);
      } finally {
        await page.close();
      }
    }

    await context.close();
  } finally {
    await browser?.close();
    server.kill();
  }

  const total = pngSize(OUT_DIR);
  console.log(
    `\n共 ${SHOTS.length} 张，合计 ${(total / 1024 / 1024).toFixed(2)} MB -> docs/images/`,
  );

  if (errors.length) {
    console.log(`\n发现 ${errors.length} 个运行时问题：`);
    for (const e of errors) console.log(`  x ${e}`);
    process.exitCode = 1;
  } else {
    console.log("无控制台错误 / 页面异常");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
