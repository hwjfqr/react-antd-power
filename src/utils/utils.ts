import React from 'react';

/**
 * 基于流的文件下载方法
 * @param blob
 * @param filename
 */
export const downloadFileOnBlob = (
  blob: Blob,
  filename: string = '未命名文件',
) => {
  const blobObj = new Blob([blob]);
  const blobUrl = window.URL.createObjectURL(blobObj);
  const a = document.createElement('a');
  a.download = filename;
  a.href = blobUrl;
  a.click();
};

/**
 * 搜索结果按关键字高亮方法
 * @param text
 * @param keyword
 * @param filter
 * @returns
 */
export const getHighlightText = (
  text: string,
  keyword: string,
  filter?: string,
) => {
  const k = keyword ? keyword.split(/[,\s，；。’:：';|、`·\\-]/g) : [];
  const f = filter ? filter.split(/[,\s，；。’:：';|、`·\\-]/g) : [];
  const keywords = [...new Set([...k, ...f])];
  let content = text;
  keywords.forEach((item) => {
    // 去除空白字符
    if (item) {
      content = content.replace(
        new RegExp(item, 'g'),
        `<span style="color:#f5222d">${item}</span>`,
      );
    }
  });
  return React.createElement('span', {
    dangerouslySetInnerHTML: {
      __html: content,
    },
  });
};

/**
 * 适用于描述列表项（Antd Description 组件）的 span 值的适配算法，按内容长度计算出 span 值。
 * @param list
 * @param contentMaxLength
 * @param columnValue
 * @returns
 */
export const describeItemAdaptationAlg = (
  list: { label: string; value: any; [prop: string]: any }[],
  contentMaxLength: number = 50,
  columnValue: number = 3,
) => {
  const tList = [...list];
  let spanCount = 0;
  tList.forEach(({ value }, idx) => {
    if (value && value.length > contentMaxLength) {
      tList[idx].span = columnValue;
      const prevItem = tList[idx - 1];
      let payload = 0;
      if (spanCount % columnValue !== 0) {
        payload = columnValue - (spanCount % columnValue);
        prevItem.span += payload;
      }
      spanCount += payload + columnValue;
    } else {
      tList[idx].span = 1;
      spanCount += 1;
    }
  });
  return tList;
};

/**
 * 使用 setTimeout 实现类 setInterval（时间间隔精准），应用于轮询请求等场景。
 * @param cb
 * @param dely
 * @returns
 */
export const setTimeoutAdv = (cb: () => void, dely = 1000) => {
  let timer: number;
  const inner = (cb: () => void) => {
    if (cb) {
      cb();
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(inner, dely, cb);
    return timer;
  };
  timer = inner(cb);
  const clear = () => {
    clearTimeout(timer);
  };
  return clear;
};

/**
 * 防抖
 * @param cb
 * @param dely
 * @returns
 */
export function debounce(cb: (...args: any[]) => void, dely: number) {
  let timer: number;
  return function (this: any, ...args: any[]) {
    let _this = this;
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(function () {
      cb.call(_this, ...args);
    }, dely);
  };
}

/**
 * 节流
 * @param cb
 * @param dely
 * @returns
 */
export function throttle(cb: (...args: any[]) => void, dely: number) {
  let timer: number | undefined;
  return function (this: any, ...args: any[]) {
    if (timer) return;
    let _this = this;
    timer = window.setTimeout(function () {
      cb.call(_this, ...args);
      timer = undefined;
    }, dely);
  };
}
