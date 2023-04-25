import vue from '@vitejs/plugin-vue'
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
export const plugins = [
    vue(),
    viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: false
    }),
    legacy({
        targets: [
            "> 1%, last 1 version, ie >= 11",
            "safari >= 10",
            "Android > 39",
            "Chrome >= 60",
            "Safari >= 10.1",
            "iOS >= 10.3",
            "Firefox >= 54",
            "Edge >= 15"
        ],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        polyfills: ["es.promise.finally", "es/map", "es/set"],
        modernPolyfills: ["es.promise.finally"]
    }),
    createStyleImportPlugin({
        resolves: [VantResolve()],
        libs: [{
            libraryName: 'vant',
            esModule: true,
            resolveStyle: () => {
              return `/node_modules/vant/lib/index.css`;
            },
          }]
    }),
    AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/],
        imports: ['vue', 'vue-router'],
        resolvers: [
            IconsResolver({
                prefix: 'Icon',
            })
        ],
        dts: 'scr/auto-imports.d.ts',
        eslintrc: {
            enabled: true, // 需要更新时候打开
            filepath: '.eslintrc-auto-import.json',
            globalsPropValue: true,
        }
    }),
    Components({
        resolvers: [VantResolver()],
        dts: './components.d.ts',
    }),
    Icons({
        autoInstall: true,
    })
];
