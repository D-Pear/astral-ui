<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        value: string
        order: string[]
        axis?: 'x' | 'y'
        animateHeight?: boolean
    }>(),
    { axis: 'x', animateHeight: true },
)
const emit = defineEmits<{ display: [value: string] }>()
const container = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const displayedValue = ref(props.value)
const moving = ref(false)
const concealed = ref(false)
const animations = new Set<Animation>()
let revision = 0
watch(displayedValue, (value) => emit('display', value), { flush: 'sync' })

function translate(distance: number) {
    return `translate${props.axis.toUpperCase()}(${distance}px)`
}

function reducedMotion() {
    return (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.dataset.hMotion === 'reduced'
    )
}
function freeze() {
    for (const animation of animations) {
        const element = (animation.effect as KeyframeEffect).target
        if (element?.isConnected) animation.commitStyles()
        animation.cancel()
    }
    animations.clear()
}
async function animate(
    element: HTMLElement,
    frames: Keyframe[],
    duration: number,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
) {
    const animation = element.animate(frames, {
        duration,
        easing,
        fill: 'both',
    })
    animations.add(animation)
    try {
        await animation.finished
        if (element.isConnected) animation.commitStyles()
        animation.cancel()
        return true
    } catch {
        return false
    } finally {
        animations.delete(animation)
    }
}
function settle() {
    if (container.value) container.value.style.height = ''
    if (panel.value) {
        panel.value.style.opacity = ''
        panel.value.style.transform = ''
    }
    concealed.value = false
    moving.value = false
}
watch(
    () => props.value,
    async (target) => {
        const currentRevision = ++revision
        const root = container.value
        const oldPanel = panel.value
        if (!root || !oldPanel) return
        const startHeight = root.getBoundingClientRect().height
        freeze()
        if (reducedMotion()) {
            displayedValue.value = target
            await nextTick()
            if (currentRevision === revision) settle()
            return
        }
        if (props.animateHeight) root.style.height = `${startHeight}px`
        moving.value = true
        const direction =
            props.order.indexOf(target) >= props.order.indexOf(displayedValue.value) ? 1 : -1
        const leaveDuration = props.axis === 'y' ? 180 : 160
        const enterDuration = props.axis === 'y' ? 240 : 180
        if (displayedValue.value !== target) {
            const current = getComputedStyle(oldPanel)
            const opacity = Number(current.opacity)
            if (opacity > 0.001) {
                await animate(
                    oldPanel,
                    [
                        { opacity, transform: current.transform },
                        { opacity: 0, transform: translate(-direction * 48) },
                    ],
                    leaveDuration,
                    'cubic-bezier(0.4, 0, 1, 1)',
                )
                if (currentRevision !== revision) return
            }
            concealed.value = true
            displayedValue.value = target
            await nextTick()
            if (currentRevision !== revision) return
            if (panel.value) panel.value.style.transform = translate(direction * 48)
        }
        const nextPanel = panel.value
        if (!nextPanel) return
        const endHeight = nextPanel.getBoundingClientRect().height
        const current = getComputedStyle(nextPanel)
        await Promise.all([
            props.animateHeight
                ? animate(
                      root,
                      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
                      enterDuration,
                  )
                : Promise.resolve(),
            animate(
                nextPanel,
                [
                    { opacity: Number(current.opacity), transform: current.transform },
                    { opacity: 1, transform: translate(0) },
                ],
                enterDuration,
                'cubic-bezier(0, 0, 0.2, 1)',
            ),
        ])
        if (currentRevision === revision) settle()
    },
    { flush: 'post' },
)
onBeforeUnmount(() => {
    revision++
    animations.forEach((animation) => animation.cancel())
    animations.clear()
})
</script>

<template>
    <div ref="container" class="h-tab-panels" :class="{ 'is-moving': moving }">
        <div
            :key="displayedValue"
            ref="panel"
            class="h-tab-panels__page"
            :style="{ opacity: concealed ? 0 : undefined }"
        >
            <slot :value="displayedValue" />
        </div>
    </div>
</template>

<style scoped>
.h-tab-panels {
    position: relative;
    min-width: 0;
    overflow-anchor: none;
}
.h-tab-panels.is-moving {
    overflow: hidden;
}
.h-tab-panels__page {
    display: flow-root;
    min-width: 0;
}
</style>
