import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => ({
    plugins: [
        vue(),
        {
            name: 'local-font',
            enforce: 'pre',
            async transform(source, id) {
                if (
                    id.endsWith('/src/lib/theme.css') &&
                    !(await this.resolve('./assets/font.ttf', id))
                ) {
                    return source.replace(/@font-face\s*\{[^}]*\}/g, '')
                }
            },
        },
    ],
    base: './',
    build: {
        outDir: 'dist',
        ...(command === 'build' && mode !== 'example'
            ? {
                  lib: {
                      entry: 'src/lib/index.ts',
                      name: 'AstralUI',
                      formats: ['es'],
                      fileName: 'astral-ui',
                      cssFileName: 'astral-ui',
                  },
                  rollupOptions: { external: ['vue'] },
              }
            : {}),
    },
}))
