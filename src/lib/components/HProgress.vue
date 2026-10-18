<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ value: number; max?: number; label?: string }>(), {
    max: 100,
    label: '',
})
const percent = computed(() => Math.max(0, Math.min(100, (props.value / (props.max || 1)) * 100)))
</script>
<template>
    <div class="h-progress">
        <div v-if="label" class="h-progress__label">
            <span>{{ label }}</span
            ><span
                >{{ value }} <small>/ {{ max }}</small></span
            >
        </div>
        <div
            class="h-progress__track"
            role="progressbar"
            :aria-valuenow="value"
            :aria-valuemin="0"
            :aria-valuemax="max"
            :aria-label="label || '进度'"
        >
            <span :style="{ width: `${percent}%` }" />
        </div>
    </div>
</template>

<style scoped>
.h-progress__label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 12px;
}
.h-progress__label small {
    font-size: 10px;
    color: var(--h-muted);
}
.h-progress__track {
    height: 4px;
    background: #b3b3b0;
    overflow: hidden;
}
.h-progress__track > span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #9d814e, #d5bb7f);
    transition: width 0.4s;
}
</style>
