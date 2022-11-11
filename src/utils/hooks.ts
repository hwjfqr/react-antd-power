import { useState, useEffect, useRef } from 'react';
import { setTimeoutAdv } from './utils';

/**
 * 设置网页标题
 * @param title
 */
export const useSetDocTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

/**
 * 判断当前设备屏幕是否收缩至指定宽度，用于响应式处理。
 * @param maxWidth 默认为 768px
 * @returns
 */
export const useIsMobile = (maxWidth = 768) => {
  const [deviceType, setDeviceType] = useState<'web' | 'mobile'>(
    window.innerWidth > maxWidth ? 'web' : 'mobile',
  );

  useEffect(() => {
    const judgeDevice = (e: UIEvent) => {
      const { innerWidth } = e.target as Window;
      if (innerWidth < maxWidth) {
        setDeviceType('mobile');
      } else {
        setDeviceType('web');
      }
    };
    window.addEventListener('resize', judgeDevice);
    return () => window.removeEventListener('resize', judgeDevice);
  }, [setDeviceType]);

  return deviceType;
};

/**
 * 获取 LocalStorage 的 Hook
 * @param name LocalStorage Key 值
 * @param options 包含初始值（initialValue）、序列化方法（serializer）、反序列化方法（deserializer）等配置。
 * @returns
 */
export function useLocalStorageValue<T>(
  name: string,
  options:
    | {
        initialValue?: T;
        serializer?: (value: T) => string;
        deserializer?: (value: string) => T;
      }
    | undefined = {
    initialValue: undefined,
    serializer: JSON.stringify,
    deserializer: JSON.parse,
  },
): [T, (value: T | ((preValue: T) => T)) => void] {
  const {
    initialValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  const [value, setValue] = useState<T>(initialValue as T);

  useEffect(() => {
    const temp: string | null = localStorage.getItem(name);
    let val;
    if (typeof temp === 'string') {
      val = deserializer(temp);
    } else {
      val = initialValue;
    }
    setValue(val);
  }, [name]);

  return [
    value,
    (val) => {
      if (typeof val === 'function') {
        setValue((pVal) => {
          const newData = (val as (preValue: T) => T)(pVal);
          localStorage.setItem(name, serializer(newData));
          return newData;
        });
      } else {
        localStorage.setItem(name, serializer(val));
        setValue(val);
      }
    },
  ];
}

/**
 * 满足已读未读的应用场景（文章列表等）
 * @param name
 * @returns
 */
export function useHaveReadData(name: string) {
  return useLocalStorageValue<Map<string, number>>(name, {
    initialValue: new Map([]),
    deserializer: (val) => {
      const data = JSON.parse(val);
      return new Map(data);
    },
    serializer: (val) => {
      return JSON.stringify([...val]);
    },
  });
}

/**
 * 用于保存用户筛选配置（存储于LocalStorage）。
 * @param name LocalStorage Key 值
 * @param initListFilterValue 筛选状态的初始值
 * @param initListFilterOnConf 根据本地存储的配置信息，自定义初始化筛选状态。
 * @param handleListFilterChange 当筛选状态变化时，要执行的回调。
 * @returns
 */
export function useInitListFilterConf<T>(
  name: string,
  initListFilterValue: T,
  initListFilterOnConf: (listFilterConf: T) => T,
  handleListFilterChange: (listFilter: T) => void,
) {
  const [listFilter, setListFilter] = useState<T>(initListFilterValue);
  const [listFilterConf, setListFilterConf] = useLocalStorageValue<any>(name, {
    initialValue: {},
  });
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current && Object.keys(listFilterConf || {}).length) {
      const initListfilter = initListFilterOnConf(listFilterConf as T);
      setListFilter(initListfilter);
      isFirstLoad.current = false;
    }
  }, [listFilterConf]);

  useEffect(() => {
    if (!isFirstLoad.current) {
      handleListFilterChange(listFilter);
      setListFilterConf(listFilter);
    } else {
      setListFilterConf((d: any) => {
        if (!Object.keys(d).length) {
          return listFilter;
        }
        return d;
      });
    }
  }, [listFilter]);

  return [listFilter, setListFilter] as [
    T,
    React.Dispatch<React.SetStateAction<T>>,
  ];
}

/**
 * 应用于轮询等场景。
 * @param cb
 * @param delay
 */
export function useInterval(cb: () => void, delay: number = 1000) {
  const refContainer = useRef(cb);
  useEffect(() => {
    refContainer.current = cb;
  });
  useEffect(() => {
    const clear = setTimeoutAdv(() => {
      refContainer.current();
    }, delay);

    return clear;
  }, [delay]);
}
