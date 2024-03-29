/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * 关于基于 Fetch 的请求库不能获取上传进度问题的解决方式：https://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html

 */
import { extend, ResponseError } from 'umi-request';
import { notification, message } from 'antd';

const codeMessage: { [prop: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理（http 状态码不在大于等于 200 以及小于 300 的区间时，会触发 HttpError）
 * Restful API 情况下错误处理
 */
const errorHandler: ((error: ResponseError<any>) => void) | undefined = (
  error,
) => {
  const { response, data } = error;
  const { status_code: code = 0, message: msg = '' } = data || {};

  if (code) {
    message.error(`${msg || '服务器发生错误'}（错误码：${code}）`);
  } else {
    const { status, url = '', statusText = '' } = response || {};
    const errortext: string = codeMessage[status] || statusText;
    notification.error({
      message: `请求错误 ${status || ''} ${url}`,
      description: errortext,
    });
  }

  // 返回 blob 类型的值无法被展开，直接交由请求函数处理（针对文件上传逻辑）。
  if (error.request?.options?.responseType === 'blob') {
    return data;
  }

  return {
    isError: true,
    ...data,
  };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// 请求拦截器
request.interceptors.request.use(
  (url, options) => {
    let link = url;
    let opts = { ...options };
    return {
      url: window.encodeURI(link),
      options: opts,
    };
  },
  { global: false },
);

// 响应拦截器(非 Restful API 错误处理)
request.interceptors.response.use(
  async (response) => {
    // 非 JSON 类型的响应数据（blob）无法通过 JSON 解析，因此需要排除。
    // if (response.ok && config.responseType !== 'blob') {
    //   const data = await response.clone().json();
    //   const { code, msg } = data;
    //   if (code !== '0' && code !== 0) {
    //     message.error(msg || '服务端发生错误');
    //   }
    // }
    return response;
  },
  { global: false },
);

export default request;
