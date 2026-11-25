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
 * `id` 是 Storybook 的 story id（见 storybook-static/index.json）；
 * `clip` 用来裁掉 story 容器自带的留白 —— 直接整页截会带一圈白边，
 * 贴进 README 后各图边距不一致，看起来不整齐。
 */
const SHOTS = [
  {
    file: "hero-crud.png",
    id: "crud-basecrud-页面骨架--default",
    width: 1180,
    height: 720,
    note: "README 头图：完整 CRUD 页面骨架",
  },
  {
    file: "table-element.png",
    id: "crud-basetable-表格--element",
    width: 1180,
    height: 480,
    note: "BaseTable element 模式",
  },
  {
    file: "table-virtual.png",
    id: "crud-basetable-表格--virtual",
    width: 1180,
    height: 480,
    note: "BaseTable virtual 模式",
  },
  {
    file: "table-canvas.png",
    id: "crud-basetable-表格--canvas",
    width: 1180,
    height: 480,
    note: "BaseTable canvas 模式（与 canvas-tile 视觉一致，故只留一张）",
  },
  {
    file: "table-loading.png",
    id: "crud-basetable-表格--loading",
    width: 1180,
    height: 480,
    note: "BaseTable 加载态",
  },
  {
    file: "search-form.png",
    id: "crud-basesearch-查询表单--default",
    width: 1180,
    height: 320,
    note: "查询表单",
  },
  {
    file: "themes.png",
    id: "主题配置-configprovider--presets",
    width: 1100,
    height: 460,
    note: "四个主题预设并排",
  },
  {
    file: "components-basic.png",
    id: "基础-imagecarousel-图片轮播--default",
    width: 900,
    height: 460,
    note: "基础组件：3D 图片轮播",
  },
  {
    file: "components-interaction.png",
    id: "交互-stepwizard-步骤向导--default",
    width: 900,
    height: 420,
    note: "交互组件：步骤向导",
  },
  {
    file: "heatmap.png",
    id: "交互-heatmapcalendar-热力图--full-year",
    width: 900,
    height: 320,
    note: "热力图，一年数据",
  },
  {
    file: "canvas-time.png",
    id: "交互-canvastime-粒子时钟--dark",
    width: 640,
    height: 300,
    note: "Canvas 粒子时钟",
  },
  {
    file: "utils-panel.png",
    id: "工具-颜色-color--rgba-to-hex",
    width: 820,
    height: 320,
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

  // --silent 会吞掉地址输出，但我们需要看错误，所以只静默请求日志
  const server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["http-server", "storybook-static", "-p", String(PORT), "-c-1", "--silent"],
    { cwd: ROOT, stdio: "ignore", shell: process.platform === "win32" },
  );

  const errors = [];
  let browser;

  try {
    await waitForServer();

    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      // Retina 下清晰；同时控制总体积（见 README 的 3MB 预算）
      deviceScaleFactor: 2,
      locale: "zh-CN",
    });

    for (const shot of SHOTS) {
      const page = await context.newPage();
      await page.setViewportSize({ width: shot.width, height: shot.height });

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

        await page.screenshot({ path: join(OUT_DIR, shot.file) });
        console.log(`ok   ${shot.file}  (${shot.note})`);
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
  console.log(`\n共 ${SHOTS.length} 张，合计 ${(total / 1024 / 1024).toFixed(2)} MB -> docs/images/`);

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
