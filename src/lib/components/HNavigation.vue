<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = withDefaults(
    defineProps<{
        items: { value: string; label: string; disabled?: boolean }[]
        label?: string
        horizontal?: boolean
        responsive?: boolean
    }>(),
    { label: '导航' },
)
const model = defineModel<string>({ required: true })
const root = useTemplateRef<HTMLElement>('root')

function navigate(event: KeyboardEvent, index: number) {
    const horizontal =
        props.horizontal || (props.responsive && matchMedia('(max-width: 760px)').matches)
    const previous = horizontal ? 'ArrowLeft' : 'ArrowUp'
    const next = horizontal ? 'ArrowRight' : 'ArrowDown'
    if (![previous, next, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const enabled = props.items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0)
    if (!enabled.length) return
    const position = enabled.indexOf(index)
    const target =
        event.key === 'Home'
            ? enabled[0]
            : event.key === 'End'
              ? enabled.at(-1)
              : enabled[
                    (position + (event.key === next ? 1 : -1) + enabled.length) % enabled.length
                ]
    if (target === undefined) return
    model.value = props.items[target]!.value
    root.value?.querySelectorAll('button')[target]?.focus()
}
</script>

<template>
    <nav
        ref="root"
        class="h-navigation"
        :class="{ 'is-horizontal': horizontal, 'is-responsive': responsive }"
        :aria-label="label"
    >
        <button
            v-for="(item, index) in items"
            :key="item.value"
            type="button"
            class="h-navigation__item"
            :class="{ 'is-active': model === item.value }"
            :aria-current="model === item.value ? 'page' : undefined"
            :aria-label="item.label"
            :title="item.label"
            :disabled="item.disabled"
            @click="model = item.value"
            @keydown="navigate($event, index)"
        >
            <span class="h-navigation__fill" aria-hidden="true">
                <span class="h-navigation__trail" />
                <span class="h-navigation__front" />
            </span>
            <span class="h-navigation__arrow" aria-hidden="true">
                <svg viewBox="0 0 40 28" fill="none">
                    <path d="M10 8V2L28 14 10 26V20M1 14 10 8 19 14 10 20Z" />
                </svg>
            </span>
            <span class="h-navigation__label"
                ><slot :item="item" :index="index">{{ item.label }}</slot></span
            >
        </button>
    </nav>
</template>

<style scoped>
.h-navigation {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}
.h-navigation__item {
    position: relative;
    isolation: isolate;
    min-height: 52px;
    padding: var(--h-navigation-padding, 12px 20px);
    border: 0;
    border-bottom: 1px solid #ffffff18;
    background: #ffffff02;
    color: #dededc;
    text-align: left;
    font-size: 14px;
    transition:
        background 180ms ease-out,
        color 220ms ease-out;
}
.h-navigation__item::before {
    content: '';
    position: absolute;
    inset: 1px auto 1px 1px;
    width: 4px;
    background: #888887;
    z-index: 1;
    transition: background 240ms ease-out;
}
.h-navigation__item::after {
    content: '';
    position: absolute;
    inset: -1px;
    border: 1px solid #fffef0c9;
    box-shadow:
        0 0 5px #ffffff38,
        0 0 12px #ffffff18;
    opacity: 0;
    pointer-events: none;
    transition: opacity 240ms ease-out;
}
.h-navigation__item:hover:not(:disabled) {
    background: #ffffff0d;
}
.h-navigation__fill {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: -1;
    pointer-events: none;
}
.h-navigation__trail,
.h-navigation__front {
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    transition: transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.h-navigation__trail {
    right: -26px;
    background: #a9abad;
    clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%);
    visibility: hidden;
    transition: none;
}
.h-navigation__front {
    background: #e6e6e6;
    transition-duration: 220ms;
}
.h-navigation__label {
    position: relative;
}
.h-navigation__arrow {
    position: absolute;
    z-index: 2;
    left: -18px;
    top: 50%;
    width: 24px;
    height: 16.8px;
    margin-top: -8.4px;
    opacity: 0;
    color: #f1eee5;
    pointer-events: none;
    transition: opacity 180ms ease-out;
}
.h-navigation__arrow svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linejoin: miter;
    filter: drop-shadow(0 0 0.5px #ffffff66);
    animation: navigation-arrow 450ms ease-in-out infinite alternate;
}
.h-navigation__item.is-active {
    color: #242528;
    transition:
        background 180ms ease-out,
        color 120ms ease-out;
}
.is-active::before {
    background: #b5a475;
}
.is-active::after,
.is-active .h-navigation__arrow {
    opacity: 1;
}
.is-active .h-navigation__trail,
.is-active .h-navigation__front {
    transform: translateX(0);
}
.is-active .h-navigation__trail {
    visibility: visible;
    transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.is-active .h-navigation__front {
    transition-duration: 420ms;
}
.h-navigation__item:disabled {
    opacity: 0.4;
}
.is-horizontal {
    flex-direction: row;
    gap: 6px;
}
.is-horizontal .h-navigation__item {
    flex: 1;
    min-width: 0;
    padding: 12px 6px;
    font-size: 11px;
    text-align: center;
}
.is-horizontal .h-navigation__arrow {
    display: none;
}
@media (max-width: 760px) {
    .is-responsive {
        flex-direction: row;
        gap: 6px;
    }
    .is-responsive .h-navigation__item {
        flex: 1;
        min-width: 0;
        padding: 12px 6px;
        font-size: 11px;
        text-align: center;
    }
    .is-responsive .h-navigation__arrow {
        display: none;
    }
}
@keyframes navigation-arrow {
    from {
        transform: translateX(-3px);
    }
    to {
        transform: translateX(0);
    }
}
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        transition: none !important;
        animation: none !important;
    }
}
</style>
