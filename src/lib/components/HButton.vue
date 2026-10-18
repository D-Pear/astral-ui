<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import HIcon from './HIcon.vue'
withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'reward'
        icon?: string
        iconShape?: 'plain' | 'round'
        disabled?: boolean
        loading?: boolean
        sparkles?: boolean
        type?: 'button' | 'submit' | 'reset'
        size?: 'sm' | 'md'
    }>(),
    { variant: 'secondary', type: 'button', size: 'md', iconShape: 'plain', icon: '' },
)
const sparkleLayer = ref<HTMLElement>()
const sparkleWidth = ref(116)
const randomStar = () => ({
    top: `${8 + Math.random() * 84}%`,
    size: `${1.5 + Math.random() * 3}px`,
    twinkle: `${1 + Math.random() * 1.8}s`,
    phase: `${-Math.random() * 3}s`,
})
const stars = ref(Array.from({ length: 10 }, () => ({ ...randomStar(), progress: Math.random() })))
const sparkleStyle = computed(() => ({
    '--star-distance': `${sparkleWidth.value + 8}px`,
    '--star-duration': `${(sparkleWidth.value + 8) / 22}s`,
}))
let observer: ResizeObserver | undefined
watch(
    sparkleLayer,
    (layer) => {
        observer?.disconnect()
        if (!layer) return
        sparkleWidth.value = layer.clientWidth
        observer = new ResizeObserver(([entry]) => {
            if (entry) sparkleWidth.value = entry.contentRect.width
        })
        observer.observe(layer)
    },
    { flush: 'post' },
)
onBeforeUnmount(() => observer?.disconnect())
function renewStar(index: number) {
    const star = stars.value[index]
    if (star) Object.assign(star, randomStar())
}
</script>
<template>
    <button
        :type="type"
        class="h-button"
        :class="[`h-button--${variant}`, `h-button--${size}`]"
        :disabled="disabled || loading"
        :aria-busy="loading"
    >
        <span
            v-if="sparkles"
            ref="sparkleLayer"
            class="h-button__sparkles"
            :style="sparkleStyle"
            aria-hidden="true"
        >
            <span
                v-for="(star, index) in stars"
                :key="index"
                class="h-button__star"
                :style="{
                    top: star.top,
                    '--star-size': star.size,
                    '--star-twinkle': star.twinkle,
                    '--star-phase': star.phase,
                    animationDelay: `${(-star.progress * (sparkleWidth + 8)) / 22}s`,
                }"
                @animationiteration.self="renewStar(index)"
                ><i
            /></span>
        </span>
        <span class="h-button__frame" aria-hidden="true" /><span
            class="h-button__dot"
            aria-hidden="true"
        />
        <span v-if="loading" class="h-spinner" />
        <span
            v-else-if="icon"
            class="h-button__icon"
            :class="{ 'h-button__icon--round': iconShape === 'round' }"
            ><HIcon :name="icon" :size="13"
        /></span>
        <span class="h-button__label"><slot /></span>
    </button>
</template>

<style scoped>
.h-button {
    --h-button-default-bg: var(--h-paper-light);
    --h-button-default-color: var(--h-ink);
    --h-button-default-frame: #b7b7b3;
    --h-button-current-frame: var(--h-button-frame, var(--h-button-default-frame));
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--h-button-gap, 8px);
    min-width: var(--h-button-min-width, 116px);
    min-height: var(--h-button-height, 36px);
    padding: var(--h-button-padding, 6px 22px);
    border: 0;
    border-radius: 999px;
    background: var(--h-button-bg, var(--h-button-default-bg));
    color: var(--h-button-color, var(--h-button-default-color));
    font-size: var(--h-button-font-size, 13px);
    line-height: 1.5;
    white-space: nowrap;
    box-shadow: none;
    transition:
        background-color 100ms ease,
        box-shadow 140ms ease;
}
.h-button::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 140ms ease;
}
.h-button::after {
    inset: 1px;
    border: 2px solid var(--h-button-current-frame);
}
.h-button:hover:not(:disabled) {
    box-shadow: 0 0 0 2px #fff;
}
.h-button:hover:not(:disabled)::after {
    opacity: 0.5;
}
.h-button__frame {
    position: absolute;
    inset: 4px;
    border: 1px solid var(--h-button-current-frame);
    border-radius: inherit;
    pointer-events: none;
    opacity: 0.5;
    mask:
        linear-gradient(to right, #000 0 22px, transparent 22px 32px, #000 32px) top / 100% 2px
            no-repeat,
        linear-gradient(#000 0 0) bottom / 100% calc(100% - 2px) no-repeat;
}
.h-button__dot {
    position: absolute;
    top: 4.5px;
    left: 31px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: var(--h-button-current-frame);
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0.5;
}
.h-button:active:not(:disabled) {
    --h-button-current-frame: color-mix(
        in srgb,
        var(--h-button-frame, var(--h-button-default-frame)),
        #000 25%
    );
    background: color-mix(in srgb, var(--h-button-bg, var(--h-button-default-bg)), #000 22%);
    color: color-mix(in srgb, var(--h-button-color, var(--h-button-default-color)), #000 22%);
}
.h-button:active:not(:disabled) .h-button__icon,
.h-button:active:not(:disabled) .h-button__sparkles {
    filter: brightness(0.78);
}
.h-button--primary {
    --h-button-default-bg: var(--h-dark);
    --h-button-default-color: #f5e9c8;
    --h-button-default-frame: #b89d64;
}
.h-button--ghost {
    --h-button-default-bg: transparent;
}
.h-button--reward {
    --h-button-default-bg: #ffcc5c;
    --h-button-default-color: #24231d;
    --h-button-default-frame: #c99b37;
}
.h-button--reward::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid #efb52d;
    border-radius: inherit;
    pointer-events: none;
}
.h-button--reward:active:not(:disabled)::before {
    border-color: #b38822;
}
.h-button__sparkles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
}
.h-button__star {
    position: absolute;
    left: calc(100% + 4px);
    width: var(--star-size);
    height: var(--star-size);
    animation: h-star-drift var(--star-duration) linear infinite;
}
.h-button__star i {
    display: block;
    width: 100%;
    height: 100%;
    background: #fff8da;
    clip-path: polygon(50% 0, 62% 36%, 100% 50%, 62% 64%, 50% 100%, 38% 64%, 0 50%, 38% 36%);
    animation: h-star-twinkle var(--star-twinkle) ease-in-out var(--star-phase) infinite;
}
.h-button:disabled .h-button__star,
.h-button:disabled .h-button__star i {
    animation-play-state: paused;
}
.h-button__icon,
.h-button__label {
    position: relative;
}
@keyframes h-star-drift {
    to {
        transform: translateX(calc(-1 * var(--star-distance)));
    }
}
@keyframes h-star-twinkle {
    0%,
    100% {
        opacity: 0.12;
        transform: scale(0.5);
    }
    50% {
        opacity: 0.95;
        transform: scale(1);
    }
}
:global(html[data-h-motion='reduced'] .h-button__sparkles) {
    display: none;
}
@media (prefers-reduced-motion: reduce) {
    .h-button__sparkles {
        display: none;
    }
}
.h-button--reward .h-button__icon--round svg {
    width: 9px;
    height: 9px;
}
.h-button--reward .h-button__icon--round {
    color: #ffe4a4;
    background: #24231d;
    box-shadow: 0 0 0 1px #b89b53;
}
.h-button--danger {
    --h-button-default-color: var(--h-danger);
    --h-button-default-frame: #a64c4777;
}
.h-button--sm {
    min-height: var(--h-button-height, 28px);
    min-width: var(--h-button-min-width, 82px);
    font-size: var(--h-button-font-size, 11px);
    padding: var(--h-button-padding, 5px 16px);
}
.h-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.h-button__icon--round {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #242421;
    color: #f4edda;
    box-shadow: 0 0 0 1px #b3a071;
}
.h-button__icon--round svg {
    width: 12px;
    height: 12px;
}
.h-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: h-spin 0.7s linear infinite;
}
@keyframes h-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
