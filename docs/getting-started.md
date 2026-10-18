# 接入

```sh
npm ci
npm run build
```

将 `dist/` 复制到项目中：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HButton, HInput } from './dist/astral-ui.js'
import './dist/astral-ui.css'

const name = ref('')
</script>

<template>
    <HInput v-model="name" label="昵称" />
    <HButton icon="check">保存</HButton>
</template>
```

引用源码时，从 `src/lib` 导入。

## 开发

| 命令                    | 功能                 |
| ----------------------- | -------------------- |
| `npm run dev`           | 启动示例页           |
| `npm run build`         | 构建组件库至 `dist/` |
| `npm run build:example` | 构建示例页至 `dist/` |
| `npm run preview`       | 预览构建结果         |
| `npm run check`         | 检查代码、格式与构建 |
