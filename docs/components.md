# 组件接口

| 组件             | 主要属性 / 插槽                                                                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HIcon`          | `name`、`size`，未知名称回退为星形；纯装饰，父控件负责无障碍名称                                                                                                           |
| `HButton`        | `variant`: primary / secondary / ghost / danger / reward；`size`: sm / md；`icon`、`iconShape`: plain / round、`sparkles`、`loading`、`disabled`、`type`                   |
| `HCloseButton`   | `label` 默认为“关闭”；中心点与四条线独立动画                                                                                                                               |
| `HPanel`         | `title`、`subtitle`、`number`；默认内容、`action`、`footer` 插槽                                                                                                           |
| `HTabs`          | 字符串 `v-model`；`items`: `{label,value,icon?,iconSrc?,disabled?}[]`；`variant`: line / pill / icon；`#icon="{ item }"` 自定义图标；左右键及 Home / End 导航              |
| `HTabPanels`     | `value` 为当前内容，`order` 为页签值的顺序数组；`axis`: x / y；`animateHeight` 默认 true；默认插槽接收 `{value}`，`display` 事件传出实际显示值                             |
| `HFadeContainer` | `fadeEdges`: top / right / bottom / left 数组，默认四边；`fadeSize`: 像素数或 CSS 长度，默认 32；`overflow`: auto / hidden；`label`；默认插槽；通过 CSS 设置容器高度或宽度 |
| `HNavigation`    | 字符串 `v-model`；`items`: `{label,value,disabled?}[]`；`label`、`horizontal`、`responsive`；方向键及 Home / End；默认插槽接收 `{item,index}`，可添加图标和副标题          |
| `HInput`         | 字符串 `v-model`；`label`、`icon`、`error`、`placeholder`、`disabled`、`type`；原生属性传递给 input                                                                        |
| `HSelect`        | 自定义下拉面板，字符串 `v-model`；`label`、`options`、`disabled`；选项为字符串或 `{label,value,disabled?}`；`change` 事件传出选中值；`name` 可用于原生表单提交             |
| `HSwitch`        | 布尔 `v-model`；必填 `label`、`disabled`                                                                                                                                   |
| `HCheckbox`      | 布尔 `v-model`、`disabled`；默认插槽为标签                                                                                                                                 |
| `HRadio`         | 字符串 `v-model`；`value`、`name`、`disabled`；默认插槽为标签                                                                                                              |
| `HSlider`        | 数字 `v-model`；`label`、`min`、`max`、`step`、`disabled`；`controls` 开启合成数量样式，显示两端数值及胶囊加减按钮                                                         |
| `HProgress`      | `value`、`max`、`label`                                                                                                                                                    |
| `HBadge`         | `tone`: gold / success / muted / danger                                                                                                                                    |
| `HModal`         | 布尔 `v-model`；`title`、`subtitle`；默认、`footer` 和可选的左侧 `illustration` 插槽；背景点击、Esc 关闭、焦点限制与恢复。当前适用于单层弹窗                               |
| `HToast`         | 布尔 `v-model`；`message`、`duration`，默认 3200ms，0 为不自动隐藏；`role=status`                                                                                          |
| `HEmpty`         | `title`、`description`，可插入重置按钮                                                                                                                                     |

## 页签与内容联动

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HTabs, HTabPanels } from './lib'

const selected = ref('profile')
const items = [
    { value: 'profile', label: '资料', icon: 'profile' },
    { value: 'options', label: '设置', icon: 'settings' },
]
</script>

<template>
    <HTabs v-model="selected" :items="items" label="资料分类" />
    <HTabPanels :value="selected" :order="items.map((item) => item.value)">
        <template #default="{ value }">
            <div v-if="value === 'profile'">个人资料内容</div>
            <div v-else>偏好设置内容</div>
        </template>
    </HTabPanels>
</template>
```

跨页签保留的数据放在父组件中。固定高度布局设置 `:animate-height="false"`。
