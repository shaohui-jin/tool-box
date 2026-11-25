/**
 * 类型体操合集
 *
 * 这些类型只在编译期存在，不产生任何运行时代码。
 */

/** 将对象属性转为 getter 方法类型 */
export type getValue<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K];
};

/** 将对象属性转为 setter 方法类型 */
export type setValue<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: T[K];
};

/** 提取对象中所有可选属性 */
export type getOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};

/** 将指定属性设为可选 */
export type setOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 数组转联合类型 */
export type arrayToUnion<T extends readonly any[]> = T[number];
