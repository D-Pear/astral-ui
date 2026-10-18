import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default withVueTs(
    {
        ignores: ['dist/**', 'reference/**', 'tests/**', 'node_modules/**'],
    },
    {
        files: ['**/*.{js,mjs,ts,vue}'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    js.configs.recommended,
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    skipFormatting,
)
