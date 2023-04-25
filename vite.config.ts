import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import { plugins } from './vite.plugins';
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/

export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_REQUEST_ADDRESS } = env;
  return defineConfig({
    define: {
      'process.env': env,
    },
    plugins: plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              'last 2 versions', // 所有主流浏览器最近2个版本
            ],
            grid: true
          }),
          require('postcss-pxtorem')({
            rootValue: 375/10,
            unitPrecision: 6, // 保留6位
            selectorBlackList: [], // 要忽略的选择器并保留为px。
            propList: ['*'], // 感叹号开头不转换
            replace: true, // 不保留原单位
            mediaQuery: true,
            minPixelValue: 0,
            exclude: /node_modules/i // 排除
          }),
          tailwindcss(),
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@assets/scss/theme.scss";`
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1500,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString()
            }  
          },
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: '[ext]/[name].[hash].[ext]',
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
          },
        }
      }
    },
    optimizeDeps: {
      exclude: ['vue', 'vue-router', 'vant', 'pinia', 'axios']
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: VITE_REQUEST_ADDRESS,
          ws: true,
          changeOrigin: true
        }
      }
    }
  })
}
