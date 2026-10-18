<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, reactive, ref } from 'vue'

type Edge = 'top' | 'right' | 'bottom' | 'left'
const props = withDefaults(
    defineProps<{
        fadeEdges?: Edge[]
        fadeSize?: number | string
        overflow?: 'auto' | 'hidden'
        label?: string
    }>(),
    {
        fadeEdges: () => ['top', 'right', 'bottom', 'left'],
        fadeSize: 32,
        overflow: 'auto',
        label: '滚动内容',
    },
)
const viewport = ref<HTMLElement>()
const content = ref<HTMLElement>()
const remaining = reactive({ top: 0, right: 0, bottom: 0, left: 0 })
const bounds = reactive({ width: 0, height: 0, x: 0, y: 0 })
let observer: ResizeObserver | undefined

function refresh() {
    const el = viewport.value
    if (!el) return
    bounds.width = el.clientWidth
    bounds.height = el.clientHeight
    bounds.x = el.scrollLeft
    bounds.y = el.scrollTop
    remaining.top = Math.max(0, el.scrollTop)
    remaining.left = Math.max(0, el.scrollLeft)
    remaining.bottom = Math.max(0, el.scrollHeight - el.clientHeight - el.scrollTop)
    remaining.right = Math.max(0, el.scrollWidth - el.clientWidth - el.scrollLeft)
}
const maskStyle = computed(() => {
    const size =
        typeof props.fadeSize === 'number' ? `${Math.max(0, props.fadeSize)}px` : props.fadeSize
    const edges = Object.fromEntries(
        (['top', 'right', 'bottom', 'left'] as const).map((edge) => [
            `--h-fade-${edge}`,
            `${props.fadeEdges.includes(edge) ? remaining[edge] : 0}px`,
        ]),
    )
    return {
        ...edges,
        '--h-fade-size': size,
        '--h-fade-width': `${bounds.width}px`,
        '--h-fade-height': `${bounds.height}px`,
        '--h-fade-x': `${bounds.x}px`,
        '--h-fade-y': `${bounds.y}px`,
    }
})
onMounted(() => {
    observer = new ResizeObserver(refresh)
    if (viewport.value) observer.observe(viewport.value)
    if (content.value) observer.observe(content.value)
    refresh()
})
onUpdated(refresh)
onBeforeUnmount(() => observer?.disconnect())
defineExpose({ refresh, viewport })
</script>

<template>
    <div
        ref="viewport"
        class="h-fade-container"
        :class="{
            'has-vertical-scrollbar': overflow === 'auto' && remaining.top + remaining.bottom > 0,
            'has-horizontal-scrollbar': overflow === 'auto' && remaining.left + remaining.right > 0,
        }"
        :style="[maskStyle, { overflow }]"
        role="region"
        :aria-label="label"
        tabindex="0"
        @scroll.passive="refresh"
    >
        <div ref="content" class="h-fade-container__content"><slot /></div>
    </div>
</template>

<style scoped>
.h-fade-container {
    --h-scrollbar-thumb: color-mix(in srgb, currentColor 60%, transparent);
    --h-scrollbar-track: color-mix(in srgb, currentColor 6%, transparent);
    min-width: 0;
    min-height: 0;
    overscroll-behavior: contain;
}
.h-fade-container__content {
    display: flow-root;
    min-width: 100%;
    width: fit-content;
    --fade-x: min(50%, var(--h-fade-size));
    --fade-y: min(50%, var(--h-fade-size));
    --fade-left: min(var(--fade-x), var(--h-fade-left));
    --fade-right: min(var(--fade-x), var(--h-fade-right));
    --fade-top: min(var(--fade-y), var(--h-fade-top));
    --fade-bottom: min(var(--fade-y), var(--h-fade-bottom));
    mask-image:
        linear-gradient(
            to right,
            transparent calc(var(--fade-left) - var(--fade-x)),
            #000 var(--fade-left),
            #000 calc(100% - var(--fade-right)),
            transparent calc(100% - var(--fade-right) + var(--fade-x))
        ),
        linear-gradient(
            to bottom,
            transparent calc(var(--fade-top) - var(--fade-y)),
            #000 var(--fade-top),
            #000 calc(100% - var(--fade-bottom)),
            transparent calc(100% - var(--fade-bottom) + var(--fade-y))
        );
    mask-composite: intersect;
    mask-repeat: no-repeat;
    mask-size: var(--h-fade-width) var(--h-fade-height);
    mask-position: var(--h-fade-x) var(--h-fade-y);
}
.has-vertical-scrollbar > .h-fade-container__content {
    padding-inline-end: var(--h-scrollbar-gap, 12px);
}
.has-horizontal-scrollbar > .h-fade-container__content {
    padding-block-end: var(--h-scrollbar-gap, 12px);
}
</style>
