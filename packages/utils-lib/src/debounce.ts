/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（ms），默认 300
 * @param immediate 是否首次立即执行
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isFirst = immediate;
  return function (this: any, ...args: Parameters<T>) {
    if (isFirst) {
      fn.apply(this, args);
      isFirst = false;
      return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
