/**
 * Storybook 用的占位图。
 *
 * 用内联 SVG data URL 而不是外链：story 离线也要能看，
 * 也不能依赖 picsum 这类服务可用性。
 */
export function placeholderImage(label: string, color: string, width = 640, height = 420): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0.45" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
  <text x="50%" y="50%" fill="#fff" font-family="system-ui, sans-serif" font-size="48"
    text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 一组固定配色的示例图，用于画廊类组件 */
export const sampleImages = [
  placeholderImage("1", "#409eff"),
  placeholderImage("2", "#67c23a"),
  placeholderImage("3", "#e6a23c"),
  placeholderImage("4", "#f56c6c"),
];
