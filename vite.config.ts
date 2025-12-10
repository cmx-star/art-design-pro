import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import vueDevTools from 'vite-plugin-vue-devtools'
// import viteCompression from 'vite-plugin-compression' // 已禁用压缩功能
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from 'rollup-plugin-visualizer'

export default ({ mode }: { mode: string }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_VERSION, VITE_PORT, VITE_BASE_URL, VITE_API_URL, VITE_API_PROXY_URL } = env

  console.log(`🚀 API_URL = ${VITE_API_URL}`)
  console.log(`🚀 VERSION = ${VITE_VERSION}`)

  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION)
    },
    base: VITE_BASE_URL,
    server: {
      port: Number(VITE_PORT),
      proxy: {
        '/api': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true
        }
      },
      host: true
    },
    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': resolvePath('src/views'),
        '@imgs': resolvePath('src/assets/images'),
        '@icons': resolvePath('src/assets/icons'),
        '@utils': resolvePath('src/utils'),
        '@stores': resolvePath('src/store'),
        '@styles': resolvePath('src/assets/styles')
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除 console
          drop_console: true,
          // 生产环境去除 debugger
          drop_debugger: true,
          // 移除未使用的代码
          dead_code: true,
          // 移除未使用的函数参数
          unused: true,
          // 移除未使用的变量
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          // 优化条件表达式
          conditionals: true,
          // 合并重复的变量声明
          join_vars: true,
          // 移除不必要的代码
          passes: 2 // 多次压缩以获得更好的效果
        },
        format: {
          // 移除注释
          comments: false
        }
      },
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [],
        include: ['src/views/**/*.vue']
      },
      rollupOptions: {
        output: {
          // JS 文件分类到 assets/js/ 目录
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 资源文件分类
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            const name = assetInfo.name || ''

            // CSS 文件分类到 assets/css/ 目录
            if (/\.(css)$/i.test(name)) {
              return `assets/css/[name]-[hash].${ext}`
            }

            // 图片文件分类到 assets/images/ 目录
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(name)) {
              return `assets/images/[name]-[hash].${ext}`
            }

            // 字体文件分类到 assets/fonts/ 目录
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return `assets/fonts/[name]-[hash].${ext}`
            }

            // 视频文件分类到 assets/videos/ 目录
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(name)) {
              return `assets/videos/[name]-[hash].${ext}`
            }

            // 其他资源文件放到 assets/ 目录
            return `assets/[name]-[hash].${ext}`
          }
        }
      }
    },
    plugins: [
      vue(),
      tailwindcss(),
      // 自动按需导入 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: 'src/types/import/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
          filepath: './.auto-import.json',
          globalsPropValue: true
        }
      }),
      // 自动按需导入组件
      Components({
        dts: 'src/types/import/components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // 按需定制主题配置
      ElementPlus({
        useSource: true
      }),
      // 压缩功能已禁用（节省存储空间）
      // viteCompression({
      //   verbose: false,
      //   disable: false,
      //   algorithm: 'gzip',
      //   ext: '.gz',
      //   threshold: 10240,
      //   deleteOriginFile: false
      // }),
      // viteCompression({
      //   verbose: false,
      //   disable: false,
      //   algorithm: 'brotliCompress',
      //   ext: '.br',
      //   threshold: 10240,
      //   deleteOriginFile: false,
      //   compressionOptions: {
      //     level: 11
      //   }
      // }),
      vueDevTools()
      // 打包分析
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: 'dist/stats.html' // 分析图生成的文件名及路径
      // }),
    ],
    // 依赖预构建：避免运行时重复请求与转换，提升首次加载速度
    optimizeDeps: {
      include: [
        'crypto-js',
        'element-plus/es',
        'element-plus/es/components/*/style/css',
        'element-plus/es/components/*/style/index'
      ]
    },
    css: {
      // CSS 代码压缩（Vite 默认使用 esbuild 压缩，无需额外配置）
      preprocessorOptions: {
        // sass variable and mixin
        scss: {
          additionalData: `
            @use "@styles/core/el-light.scss" as *; 
            @use "@styles/core/mixin.scss" as *;
          `
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  })
}

function resolvePath(paths: string) {
  return path.resolve(__dirname, paths)
}
