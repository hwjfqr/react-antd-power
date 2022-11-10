import { defineConfig } from 'umi';

// const proxy = {
//   '/mock': {
//     target: 'http://xxx.com/xxx/',
//     changeOrigin: true,
//     // pathRewrite: {
//     //   '^/mock': '',
//     // },
//   },
// };

export default defineConfig({
  title: false,
  nodeModulesTransform: {
    type: 'none',
  },
  // proxy,
  routes: [
    { path: '/', redirect: '/app/curd' },
    {
      path: '/app',
      component: '@/layouts/BaseLayout',
      routes: [
        {
          path: '/app/curd',
          component: '@/pages/curd',
        },
      ],
    },
    {
      path: '/app-login',
      component: '@/pages/login',
    },
  ],
  locale: {},
  fastRefresh: {},
  targets: {
    ie: 11,
  },
  define: {
    WEB_ENV: 'local-dev',
  },
  hash: true,
  dynamicImport: {},
});
