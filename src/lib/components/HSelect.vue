<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
    label?: string
    options: (string | { label: string; value: string; disabled?: boolean })[]
    disabled?: boolean
}>()
const emit = defineEmits<{ change: [value: string] }>()
const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const id = useId()
const listId = `h-select-list-${id}`
const labelId = `h-select-label-${id}`
const triggerId = `h-select-trigger-${id}`
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()
const open = ref(false)
const active = ref(-1)
const placement = ref<'below' | 'above'>('below')
const menuStyle = ref<CSSProperties>({})
const items = computed(() =>
    props.options.map((option) =>
        typeof option === 'string' ? { label: option, value: option, disabled: false } : option,
    ),
)
const selected = computed(() => items.value.find((option) => option.value === model.value))
function buttonAttrs() {
    return Object.fromEntries(
        Object.entries(attrs).filter(([key]) => !['class', 'style', 'name'].includes(key)),
    )
}
let typeahead = ''
let typeTimer: ReturnType<typeof setTimeout> | undefined
let frame = 0

function lastEnabled() {
    for (let index = items.value.length - 1; index >= 0; index--)
        if (!items.value[index]?.disabled) return index
    return -1
}
function positionMenu() {
    if (!open.value || !trigger.value) return
    const rect = trigger.value.getBoundingClientRect()
    const viewport = window.visualViewport
    const viewportTop = viewport?.offsetTop || 0
    const viewportLeft = viewport?.offsetLeft || 0
    const viewportBottom = viewportTop + (viewport?.height || innerHeight)
    const viewportRight = viewportLeft + (viewport?.width || innerWidth)
    const below = viewportBottom - rect.bottom - 12
    const above = rect.top - viewportTop - 12
    const desiredHeight = Math.min(280, items.value.length * 43 + 2)
    placement.value = below < desiredHeight && above > below ? 'above' : 'below'
    const available = Math.max(0, placement.value === 'above' ? above : below)
    const height = Math.min(desiredHeight, available)
    const width = Math.min(rect.width, viewportRight - viewportLeft - 16)
    menuStyle.value = {
        position: 'fixed',
        width: `${width}px`,
        maxHeight: `${height}px`,
        left: `${Math.max(viewportLeft + 8, Math.min(rect.left, viewportRight - width - 8))}px`,
        top: `${placement.value === 'above' ? rect.top - height - 4 : rect.bottom + 4}px`,
    }
}
function queuePosition() {
    if (open.value) {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(positionMenu)
    }
}
function revealActive() {
    nextTick(() =>
        document.getElementById(`${listId}-${active.value}`)?.scrollIntoView({ block: 'nearest' }),
    )
}
function show(last = false) {
    if (props.disabled) return
    open.value = true
    active.value = items.value.findIndex(
        (option) => option.value === model.value && !option.disabled,
    )
    if (active.value < 0)
        active.value = last ? lastEnabled() : items.value.findIndex((option) => !option.disabled)
    positionMenu()
    revealActive()
}
function close() {
    open.value = false
    typeahead = ''
    clearTimeout(typeTimer)
}
function choose(index: number) {
    const option = items.value[index]
    if (!option || option.disabled) return
    const changed = model.value !== option.value
    model.value = option.value
    close()
    trigger.value?.focus({ preventScroll: true })
    if (changed) emit('change', option.value)
}
function move(direction: number) {
    for (let offset = 1; offset <= items.value.length; offset++) {
        const index = (active.value + direction * offset + items.value.length) % items.value.length
        if (!items.value[index]?.disabled) {
            active.value = index
            revealActive()
            return
        }
    }
}
function onKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
        close()
        return
    }
    if (event.key === 'Escape') {
        if (open.value) {
            event.preventDefault()
            event.stopPropagation()
            close()
        }
        return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        if (!open.value) {
            show(event.key === 'ArrowUp' || event.key === 'End')
            return
        }
        if (event.key === 'Enter' || event.key === ' ') {
            choose(active.value)
            return
        }
        if (event.key === 'Home' || event.key === 'End') {
            active.value =
                event.key === 'Home'
                    ? items.value.findIndex((option) => !option.disabled)
                    : lastEnabled()
            revealActive()
        } else move(event.key === 'ArrowDown' ? 1 : -1)
        return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        if (!open.value) show()
        clearTimeout(typeTimer)
        typeahead += event.key.toLocaleLowerCase()
        const match = items.value.findIndex(
            (option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeahead),
        )
        if (match >= 0) {
            active.value = match
            revealActive()
        }
        typeTimer = setTimeout(() => (typeahead = ''), 650)
    }
}
function onPointerDown(event: PointerEvent) {
    const target = event.target as Node
    if (!root.value?.contains(target) && !menu.value?.contains(target)) close()
}
function onFocusOut(event: FocusEvent) {
    if (!menu.value?.contains(event.relatedTarget as Node)) close()
}
watch(
    () => props.disabled,
    (value) => {
        if (value) close()
    },
)
watch(items, () => {
    if (open.value) {
        active.value = items.value.findIndex(
            (option) => option.value === model.value && !option.disabled,
        )
        queuePosition()
    }
})
onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', queuePosition)
    window.addEventListener('scroll', queuePosition, true)
    window.visualViewport?.addEventListener('resize', queuePosition)
})
onBeforeUnmount(() => {
    close()
    cancelAnimationFrame(frame)
    document.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('resize', queuePosition)
    window.removeEventListener('scroll', queuePosition, true)
    window.visualViewport?.removeEventListener('resize', queuePosition)
})
</script>

<template>
    <div
        ref="root"
        class="h-field h-dropdown"
        :class="[{ 'is-open': open }, attrs.class]"
        :style="attrs.style as CSSProperties"
    >
        <label
            v-if="label"
            :id="labelId"
            :for="String(attrs.id || triggerId)"
            class="h-field__label"
            >{{ label }}</label
        >
        <button
            :id="String(attrs.id || triggerId)"
            ref="trigger"
            v-bind="buttonAttrs()"
            type="button"
            class="h-select"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="listId"
            :aria-labelledby="label ? labelId : undefined"
            :aria-activedescendant="open && active >= 0 ? `${listId}-${active}` : undefined"
            :disabled="disabled"
            @click="open ? close() : show()"
            @keydown="onKey"
            @blur="onFocusOut"
        >
            <span>{{ selected?.label || '请选择' }}</span
            ><span class="h-select__arrow" aria-hidden="true" />
        </button>
        <input
            v-if="attrs.name"
            type="hidden"
            :name="String(attrs.name)"
            :value="model"
            :disabled="disabled"
        />
    </div>
    <Teleport to="body">
        <Transition name="h-dropdown">
            <div
                v-if="open"
                :id="listId"
                ref="menu"
                class="h-select-menu"
                :class="`h-select-menu--${placement}`"
                role="listbox"
                :aria-label="label || String(attrs['aria-label'] || '选项')"
                :style="menuStyle"
                @mousedown.prevent
            >
                <div
                    v-for="(option, index) in items"
                    :id="`${listId}-${index}`"
                    :key="option.value"
                    role="option"
                    class="h-select-option"
                    :class="{
                        'is-selected': model === option.value,
                        'is-highlighted': active === index,
                        'is-disabled': option.disabled,
                    }"
                    :aria-selected="model === option.value"
                    :aria-disabled="!!option.disabled"
                    @pointermove="!option.disabled && (active = index)"
                    @click="choose(index)"
                >
                    <span>{{ option.label }}</span
                    ><span class="h-select-option__mark" aria-hidden="true" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.h-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    min-width: 0;
    height: 38px;
    min-height: 38px;
    border: 1px solid #99999e60;
    background: #e8e8e780;
    color: var(--h-ink);
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.5;
    text-align: left;
    transition:
        background var(--h-duration),
        border-color var(--h-duration);
}
.h-select > span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.h-select:hover:not(:disabled) {
    background: #f2f1ee;
    border-color: #a8a49a;
}
.h-dropdown.is-open .h-select {
    border-color: #aaa69a;
    background: #e4e4e3;
}
.h-select__arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 7px solid #4d4e50;
    flex-shrink: 0;
    transition: transform 240ms ease;
}
.h-dropdown.is-open .h-select__arrow {
    transform: rotate(180deg);
}
.h-select-menu {
    --h-scrollbar-thumb: color-mix(in srgb, currentColor 60%, transparent);
    --h-scrollbar-track: color-mix(in srgb, currentColor 6%, transparent);
    z-index: 1200;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0;
    background: #eee;
    box-shadow: 0 3px 8px #14192726;
    border: 1px solid #bfc2c8;
    color: var(--h-ink);
    font-family: var(--h-font);
    transform-origin: top;
    cursor: var(--h-cursor);
}
.h-select-menu--above {
    transform-origin: bottom;
}
.h-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-height: 43px;
    padding: 10px 13px;
    font-size: 12px;
    line-height: 1.5;
    transition:
        background 140ms,
        color 140ms;
    position: relative;
}
.h-select-option + .h-select-option::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    height: 1px;
    background: #c9c9c9;
    pointer-events: none;
}
.h-select-option > span:first-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.h-select-option.is-highlighted:not(.is-disabled) {
    background: #d9d5c844;
}
.h-select-option.is-disabled {
    opacity: 0.35;
}
.h-select-option__mark {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1px solid #a9abae;
    flex-shrink: 0;
    position: relative;
    margin-right: 3px;
}
.h-select-option__mark::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--h-slider-accent);
    opacity: 0;
    transform: scale(0.5);
    transition:
        opacity 160ms,
        transform 160ms;
}
.h-select-option.is-selected .h-select-option__mark {
    border: 2px solid var(--h-slider-accent);
    box-shadow: 0 0 0 1px #eea03e22;
}
.h-select-option.is-selected .h-select-option__mark::after {
    inset: 2px;
    opacity: 1;
    transform: scale(1);
}
.h-dropdown-enter-active,
.h-dropdown-leave-active {
    transition:
        transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
        opacity 160ms ease;
}
.h-dropdown-enter-from,
.h-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-3px) scaleY(0.92);
}
.h-select-menu--above.h-dropdown-enter-from,
.h-select-menu--above.h-dropdown-leave-to {
    transform: translateY(3px) scaleY(0.92);
}
</style>
