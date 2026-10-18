<script setup lang="ts">
import HIcon from './HIcon.vue'
withDefaults(defineProps<{ title?: string; description?: string }>(), {
    title: '暂无记录',
    description: '试试调整筛选条件，或添加一条记录。',
})
</script>
<template>
    <div class="h-empty">
        <HIcon name="orbit" :size="44" />
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <slot />
    </div>
</template>

<style scoped>
.h-empty {
    text-align: center;
    padding: 45px 20px;
    color: #8d8a81;
}
.h-empty > svg {
    color: #a98c59;
    opacity: 0.65;
}
.h-empty h3 {
    font-size: 16px;
    color: #55545b;
    font-weight: 500;
}
.h-empty p {
    font-size: 12px;
    line-height: 1.8;
}
</style>
