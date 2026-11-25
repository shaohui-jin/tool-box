/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
  ],
  rules: {
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["deep", "slotted", "global"] }],
    "scss/at-rule-no-unknown": true,
    // 组件库大量使用 Element Plus 的 CSS 变量，声明顺序不作强制
    "declaration-block-no-redundant-longhand-properties": null,
  },
};
