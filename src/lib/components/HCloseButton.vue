<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: '关闭' })
</script>
<template>
    <button type="button" class="h-close" :aria-label="label">
        <span class="h-close__dot" /><i
            v-for="n in 4"
            :key="n"
            :class="`h-close__arm h-close__arm--${n}`"
        />
    </button>
</template>

<style scoped>
.h-close {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 36px;
    background: none;
    border: 0;
    color: inherit;
    flex-shrink: 0;
}
.h-close__dot {
    position: absolute;
    width: 3px;
    height: 3px;
    left: calc(50% - 1.5px);
    top: calc(50% - 1.5px);
    background: currentColor;
    border-radius: 50%;
    transition:
        transform 160ms,
        opacity 100ms;
}
.h-close__arm {
    position: absolute;
    left: calc(50% - 1px);
    top: calc(50% - 1px);
    width: 11px;
    height: 2px;
    background: currentColor;
    transform-origin: 1px 1px;
    --angle: 45deg;
    transform: rotate(var(--angle)) translateX(5px);
    transition: transform 160ms;
}
.h-close__arm--2 {
    --angle: 135deg;
}
.h-close__arm--3 {
    --angle: 225deg;
}
.h-close__arm--4 {
    --angle: 315deg;
}
.h-close:hover .h-close__dot {
    transform: scale(1.65);
}
.h-close:hover .h-close__arm {
    transform: rotate(var(--angle)) translateX(6px);
}
.h-close:active .h-close__arm {
    transform: rotate(var(--angle)) translateX(0);
}
.h-close:active .h-close__dot {
    opacity: 0;
}
</style>
