<script setup lang="ts">
import HIcon from './HIcon.vue'
export interface TabItem {
    label: string
    value: string
    icon?: string
    iconSrc?: string
    disabled?: boolean
}
defineProps<{ items: TabItem[]; label?: string; variant?: 'line' | 'pill' | 'icon' }>()
const orbitDots = Array.from({ length: 80 }, (_, index) => {
    const angle = (index / 80) * Math.PI * 2
    const distance = Math.min(index % 40, 40 - (index % 40))
    return {
        x: 50 + Math.cos(angle) * 46,
        y: 50 + Math.sin(angle) * 46,
        large: index % 40 === 0,
        delay: `${distance * 7}ms`,
        exitDelay: `${(20 - distance) * 4}ms`,
    }
})
const model = defineModel<string>({ required: true })
function move(event: KeyboardEvent) {
    const buttons = Array.from(
        (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(
            'button:not(:disabled)',
        ),
    )
    const index = buttons.indexOf(event.target as HTMLButtonElement)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = buttons.length - 1
    else return
    event.preventDefault()
    buttons[next]?.focus()
    buttons[next]?.click()
}
</script>
<template>
    <div
        class="h-tabs"
        :class="`h-tabs--${variant || 'line'}`"
        role="tablist"
        :aria-label="label || '选项卡'"
        @keydown="move"
    >
        <button
            v-for="(item, index) in items"
            :key="item.value"
            role="tab"
            type="button"
            :aria-selected="model === item.value"
            :aria-label="variant === 'icon' ? item.label : undefined"
            :title="variant === 'icon' ? item.label : undefined"
            :tabindex="model === item.value ? 0 : -1"
            :disabled="item.disabled"
            :class="{
                'is-active': model === item.value,
                'is-before-active': items[index + 1]?.value === model,
            }"
            @click="model = item.value"
        >
            <span v-if="variant === 'pill'" class="h-tabs__capsule" aria-hidden="true" />
            <span v-if="variant === 'icon'" class="h-tabs__orbit" aria-hidden="true">
                <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle
                        v-for="(dot, dotIndex) in orbitDots"
                        :key="dotIndex"
                        :cx="dot.x"
                        :cy="dot.y"
                        :r="dot.large ? 2.8 : 1.25"
                        :class="{ 'is-large': dot.large }"
                        :style="{ '--dot-delay': dot.delay, '--dot-exit-delay': dot.exitDelay }"
                    />
                </svg>
            </span>
            <span v-if="variant === 'icon'" class="h-tabs__disc" aria-hidden="true" />
            <span class="h-tabs__content">
                <slot name="icon" :item="item">
                    <img v-if="item.iconSrc" :src="item.iconSrc" alt="" draggable="false" />
                    <HIcon
                        v-else-if="item.icon"
                        :name="item.icon"
                        :size="variant === 'icon' ? 32 : 18"
                    />
                </slot>
                <template v-if="variant !== 'icon'">{{ item.label }}</template>
            </span>
        </button>
    </div>
</template>

<style scoped>
.h-tabs {
    display: flex;
    gap: var(--h-tabs-gap, 8px);
    min-width: 0;
}
.h-tabs button {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    border: 0;
    background: transparent;
    color: inherit;
    padding: var(--h-tab-padding, 11px 16px);
    font-size: var(--h-tab-font-size, 12px);
    white-space: nowrap;
    transition: color 240ms ease;
}
.h-tabs__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--h-tab-icon-gap, 8px);
    opacity: 0.55;
    transition: opacity 240ms ease;
}
.h-tabs button:hover:not(:disabled):not(.is-active) .h-tabs__content {
    opacity: 0.85;
}
.h-tabs button.is-active .h-tabs__content {
    opacity: 1;
}
.h-tabs--line {
    border-bottom: 1px solid var(--h-tabs-line-color, #ffffff20);
}
.h-tabs--line button::after,
.h-tabs--icon button::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    width: 25%;
    height: 3px;
    background: var(--h-gold-bright);
    opacity: 0;
    transform: translateX(-50%);
    transition:
        width 260ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 240ms ease,
        background-color 120ms ease;
}
.h-tabs--line button.is-active::after,
.h-tabs--icon button.is-active::after {
    width: 100%;
    opacity: 1;
    background-color: #fff;
    transition:
        width 260ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 240ms ease,
        background-color 180ms ease 240ms;
}
.h-tabs--pill {
    position: relative;
    isolation: isolate;
    border-radius: 999px;
    gap: 0;
    padding: 0;
}
.h-tabs--pill::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 1px 0;
    border-radius: inherit;
    background: var(--h-tabs-pill-track, #c8c9c6);
    border: 1px solid #96989540;
    box-shadow:
        inset 0 0 0 3px #ffffff1a,
        inset 0 0 0 4px #85878230;
    pointer-events: none;
}
.h-tabs--pill button:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    bottom: 25%;
    width: 1px;
    background: var(--h-tabs-pill-divider, #7b7d7859);
    opacity: 1;
    transition: opacity 160ms ease;
}
.h-tabs--pill button.is-active::after,
.h-tabs--pill button.is-before-active::after {
    opacity: 0;
}
.h-tabs--pill button {
    flex: 1;
    height: var(--h-tabs-pill-height, 32px);
    padding: 0 14px;
    border-radius: 999px;
    font-size: var(--h-tab-font-size, 12px);
}
.h-tabs--pill button::before {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background: var(--h-paper-light);
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
}
.h-tabs--pill button:hover:not(:disabled):not(.is-active)::before {
    opacity: 0.28;
}
.h-tabs__capsule {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin-inline: auto;
    width: calc(100% - var(--h-tabs-pill-shrink, 28px));
    min-width: var(--h-tabs-pill-height, 32px);
    border-radius: calc(var(--h-tabs-pill-height, 32px) / 2);
    background: var(--h-paper-light);
    opacity: 0;
    transition:
        width 280ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 240ms ease,
        background-color 180ms ease;
    pointer-events: none;
    overflow: hidden;
}
.h-tabs__capsule::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid #b7b7b3;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 60ms ease;
    mask:
        linear-gradient(to right, #000 0 22px, transparent 22px 32px, #000 32px) top / 100% 2px
            no-repeat,
        linear-gradient(#000 0 0) bottom / 100% calc(100% - 2px) no-repeat;
}
.h-tabs__capsule::after {
    content: '';
    position: absolute;
    top: 4.5px;
    left: 31px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #b7b7b3;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 60ms ease;
}
.h-tabs--pill button.is-active .h-tabs__capsule::before,
.h-tabs--pill button.is-active .h-tabs__capsule::after {
    opacity: 0.5;
    transition: opacity 220ms ease 60ms;
}
.h-tabs--pill button.is-active {
    color: var(--h-ink);
}
.h-tabs--pill button.is-active .h-tabs__capsule {
    width: 100%;
    opacity: 1;
}
.h-tabs--pill button.is-active:hover:not(:disabled) .h-tabs__capsule {
    background-color: #f7f5ee;
}
.h-tabs__content img {
    width: 18px;
    height: 18px;
    object-fit: contain;
}
.h-tabs--icon {
    --h-tabs-icon-size: 46px;
    gap: 0;
    border-bottom: 1px solid var(--h-tabs-line-color, #ffffff20);
}
.h-tabs--icon button {
    width: var(--h-tabs-icon-width, 76px);
    height: var(--h-tabs-icon-height, 66px);
    flex: 0 0 auto;
    padding: 0;
    --h-tabs-icon-orbit: calc(var(--h-tabs-icon-size) * 1.3);
    --h-tabs-icon-center: calc(100% - var(--h-tabs-icon-orbit) * 0.488 - 2px);
}
.h-tabs__disc {
    position: absolute;
    width: var(--h-tabs-icon-size);
    top: var(--h-tabs-icon-center);
    transform: translateY(-50%);
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffffff06;
    border: 1px solid transparent;
    overflow: hidden;
    transition:
        background-color 180ms ease,
        border-color 180ms ease;
}
.h-tabs--icon button:hover:not(:disabled):not(.is-active) .h-tabs__disc {
    background-color: #ffffff18;
    border-color: #ffffff68;
}
.h-tabs--icon button.is-active .h-tabs__disc {
    background-color: #f2f3ee;
    transition: none;
}
.h-tabs__disc::after {
    content: '';
    position: absolute;
    inset: -50%;
    background: linear-gradient(45deg, transparent 42%, #ffcf77 46% 54%, transparent 58%);
    visibility: hidden;
}
.h-tabs--icon button.is-active .h-tabs__disc::after {
    visibility: visible;
    animation: h-tab-icon-scan 420ms cubic-bezier(0.2, 0.5, 0.3, 1) both;
}
.h-tabs--icon .h-tabs__content {
    position: absolute;
    top: var(--h-tabs-icon-center);
    transform: translateY(-50%);
    color: #e5e9ed;
    opacity: 0.7;
    transition:
        color 180ms ease,
        opacity 180ms ease;
}
.h-tabs--icon .h-tabs__content img {
    width: calc(var(--h-tabs-icon-size) * 0.84 - 2px);
    height: calc(var(--h-tabs-icon-size) * 0.84 - 2px);
}
.h-tabs--icon .h-tabs__content :deep(svg) {
    width: calc(var(--h-tabs-icon-size) * 0.7);
    height: calc(var(--h-tabs-icon-size) * 0.7);
}
.h-tabs--icon .h-tabs__content img {
    transition: filter 180ms ease;
}
.h-tabs--icon button.is-active .h-tabs__content {
    color: #080b10;
    opacity: 1;
}
.h-tabs--icon button.is-active img {
    filter: brightness(0);
}
.h-tabs__orbit {
    position: absolute;
    width: var(--h-tabs-icon-orbit);
    top: calc(var(--h-tabs-icon-center) - var(--h-tabs-icon-orbit) / 2);
    aspect-ratio: 1;
    color: #f2f3ee;
    pointer-events: none;
    animation: h-tab-icon-orbit 12s linear infinite;
    animation-play-state: paused;
}
.h-tabs__orbit svg {
    display: block;
    width: 100%;
    height: 100%;
}
.h-tabs__orbit circle {
    opacity: 0;
    transition: opacity 140ms ease var(--dot-exit-delay);
}
.h-tabs--icon button.is-active .h-tabs__orbit {
    animation-play-state: running;
}
.h-tabs--icon button.is-active .h-tabs__orbit circle {
    opacity: 0.5;
    transition: opacity 180ms ease var(--dot-delay);
}
.h-tabs--icon button.is-active .h-tabs__orbit circle.is-large {
    opacity: 1;
}
@keyframes h-tab-icon-orbit {
    from {
        transform: rotate(-30deg);
    }
    to {
        transform: rotate(330deg);
    }
}
@keyframes h-tab-icon-scan {
    from {
        transform: translate(-55%, 55%);
    }
    to {
        transform: translate(55%, -55%);
    }
}
@media (prefers-reduced-motion: reduce) {
    .h-tabs__orbit {
        animation: none;
    }
}
:global(:root[data-h-motion='reduced'] .h-tabs__orbit) {
    animation: none;
}
</style>
