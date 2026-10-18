<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import HIcon from './HIcon.vue'
const props = withDefaults(defineProps<{ message: string; duration?: number }>(), {
    duration: 3200,
})
const visible = defineModel<boolean>({ default: false })
let timer: ReturnType<typeof setTimeout> | undefined
watch(
    [visible, () => props.message],
    () => {
        clearTimeout(timer)
        if (visible.value && props.duration > 0)
            timer = setTimeout(() => (visible.value = false), props.duration)
    },
    { immediate: true },
)
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template>
    <Teleport to="body"
        ><Transition name="h-toast"
            ><div v-if="visible" class="h-toast" role="status">
                <HIcon name="check" :size="18" /><span>{{ message }}</span>
            </div></Transition
        ></Teleport
    >
</template>

<style scoped>
.h-toast {
    position: fixed;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1100;
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: calc(100% - 32px);
    padding: 15px 36px;
    color: #f5ebd1;
    background: #23242cf5;
    border: 1px solid #d8bf7f66;
    box-shadow: 0 8px 40px #0004;
    font-size: 13px;
    pointer-events: none;
}
.h-toast svg {
    color: var(--h-gold-bright);
    flex-shrink: 0;
}
.h-toast-enter-active,
.h-toast-leave-active {
    transition:
        opacity 0.2s,
        top 0.2s;
}
.h-toast-enter-from,
.h-toast-leave-to {
    opacity: 0;
    top: 20px;
}
</style>
