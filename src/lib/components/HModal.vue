<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import HCloseButton from './HCloseButton.vue'
defineProps<{ title: string; subtitle?: string }>()
const open = defineModel<boolean>({ default: false })
const dialog = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
let previousOverflow = ''
let previousGutter: { value: string; priority: string } | null = null
function onKey(event: KeyboardEvent) {
    if (event.key === 'Escape') open.value = false
    if (event.key !== 'Tab') return
    const items = Array.from(
        dialog.value?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) || [],
    )
    if (!items.length) {
        event.preventDefault()
        return
    }
    const first = items[0],
        last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
    }
}
function release() {
    document.body.style.overflow = previousOverflow
    if (previousGutter) {
        document.documentElement.style.setProperty(
            'scrollbar-gutter',
            previousGutter.value,
            previousGutter.priority,
        )
        previousGutter = null
    }
    document.removeEventListener('keydown', onKey)
    previousFocus?.focus({ preventScroll: true })
    previousFocus = null
}
watch(
    open,
    async (value) => {
        if (value) {
            previousFocus = document.activeElement as HTMLElement
            previousOverflow = document.body.style.overflow
            const root = document.documentElement
            if (
                window.innerWidth > root.clientWidth &&
                getComputedStyle(root).scrollbarGutter === 'auto'
            ) {
                previousGutter = {
                    value: root.style.getPropertyValue('scrollbar-gutter'),
                    priority: root.style.getPropertyPriority('scrollbar-gutter'),
                }
                root.style.setProperty('scrollbar-gutter', 'stable')
            }
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', onKey)
            await nextTick()
            dialog.value?.querySelector<HTMLElement>('.h-close')?.focus({ preventScroll: true })
        } else if (previousFocus) release()
    },
    { immediate: true },
)
onBeforeUnmount(() => {
    if (open.value) release()
})
</script>
<template>
    <Teleport to="body">
        <Transition name="h-modal">
            <div v-if="open" class="h-modal-backdrop" @click.self="open = false">
                <div class="h-modal-shell">
                    <section
                        ref="dialog"
                        class="h-modal"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title"
                    >
                        <div
                            class="h-modal__content"
                            :class="{ 'h-modal__content--illustrated': $slots.illustration }"
                        >
                            <aside v-if="$slots.illustration" class="h-modal__illustration">
                                <slot name="illustration" />
                            </aside>
                            <header class="h-modal__header">
                                <div class="h-modal__title-row">
                                    <h2>{{ title }}</h2>
                                    <HCloseButton @click="open = false" />
                                </div>
                                <p v-if="subtitle">{{ subtitle }}</p>
                            </header>
                            <div class="h-modal__body"><slot /></div>
                        </div>
                        <footer v-if="$slots.footer" class="h-modal__footer">
                            <slot name="footer" />
                        </footer>
                    </section>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.h-modal-backdrop {
    position: fixed;
    z-index: 1000;
    inset: 0;
    background: #0a0d224d;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}
.h-modal-shell {
    position: relative;
    width: 760px;
    max-width: 100%;
    color: var(--h-ink);
}
.h-modal-shell::before {
    content: '';
    position: absolute;
    inset: 7px 7px -7px -7px;
    border: 1px solid #e3e3e34d;
    pointer-events: none;
}
.h-modal {
    --h-scrollbar-thumb: color-mix(in srgb, currentColor 60%, transparent);
    --h-scrollbar-track: color-mix(in srgb, currentColor 6%, transparent);
    display: flex;
    flex-direction: column;
    position: relative;
    max-height: 86dvh;
    background: #d8d8d9;
    border: 0;
    border-radius: 0 27px 0 0;
    overflow: hidden;
    box-shadow: none;
}
.h-modal__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
}
.h-modal__header {
    padding: 24px 28px 0;
    min-width: 0;
}
.h-modal__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #aaaaad;
    padding-bottom: 11px;
}
.h-modal__title-row h2 {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
}
.h-modal__title-row .h-close {
    width: 30px;
    height: 30px;
    color: #27272a;
}
.h-modal__header p {
    font-size: 12px;
    color: var(--h-muted);
    line-height: 1.8;
    margin: 12px 0 0;
}
.h-modal__body {
    padding: 15px 28px 28px;
    font-size: 13px;
    line-height: 1.9;
    min-width: 0;
}
.h-modal__body > :slotted(p:first-child) {
    margin-top: 0;
}
.h-modal__body > :slotted(p:last-child) {
    margin-bottom: 0;
}
.h-modal__content--illustrated {
    grid-template-columns: 190px minmax(0, 1fr);
    grid-template-rows: auto 1fr;
}
.h-modal__content--illustrated .h-modal__header {
    grid-column: 2;
    padding-left: 12px;
}
.h-modal__content--illustrated .h-modal__body {
    grid-column: 2;
    padding-left: 12px;
}
.h-modal__illustration {
    position: relative;
    grid-column: 1;
    grid-row: 1 / span 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 18px;
    overflow: hidden;
    isolation: isolate;
}
.h-modal__illustration::before,
.h-modal__illustration::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 220px;
    height: 220px;
    border: 1px solid #8d91a22b;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
}
.h-modal__illustration::after {
    width: 270px;
    height: 270px;
    border-color: #8d91a21c;
}
.h-modal__footer {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    gap: 36px;
    padding: 16px 28px;
}
.h-modal__footer::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(
            circle at 50% -70px,
            transparent 125px,
            #c4b88812 126px 127px,
            transparent 128px 137px,
            #c4b8880c 138px 139px,
            transparent 140px
        ),
        #272727;
    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.h-modal-enter-from .h-modal__footer::before,
.h-modal-leave-to .h-modal__footer::before {
    transform: translateY(100%);
}
.h-modal-leave-active .h-modal__footer::before {
    transition: transform 426.67ms linear;
}
.h-modal-enter-active .h-modal__footer :slotted(.h-button) {
    animation: h-modal-footer-actions 240ms ease 80ms both;
}
.h-modal-leave-active .h-modal__footer :slotted(.h-button) {
    transition: opacity 426.67ms linear;
}
.h-modal-leave-to .h-modal__footer :slotted(.h-button) {
    opacity: 0;
}
@keyframes h-modal-footer-actions {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.h-modal-enter-active,
.h-modal-leave-active {
    transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1);
}
.h-modal-enter-active .h-modal-shell,
.h-modal-leave-active .h-modal-shell {
    transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
}
.h-modal-enter-from,
.h-modal-leave-to {
    opacity: 0;
}
.h-modal-enter-from .h-modal-shell,
.h-modal-leave-to .h-modal-shell {
    transform: translateY(8px);
}
@media (max-width: 600px) {
    .h-modal-backdrop {
        padding: 20px;
    }
    .h-modal__header {
        padding: 20px 20px 0;
    }
    .h-modal__body {
        padding: 15px 20px 24px;
    }
    .h-modal__title-row h2 {
        font-size: 18px;
    }
    .h-modal__footer {
        padding: 15px 20px;
        gap: 18px;
    }
    .h-modal__content--illustrated {
        grid-template-columns: 112px minmax(0, 1fr);
    }
    .h-modal__content--illustrated .h-modal__header {
        grid-column: 1/-1;
        grid-row: 1;
        padding-left: 20px;
    }
    .h-modal__content--illustrated .h-modal__body {
        grid-column: 2;
        grid-row: 2;
        padding-top: 20px;
        padding-left: 4px;
    }
    .h-modal__illustration {
        grid-row: 2;
        padding: 22px 12px;
    }
}
.h-modal__footer :slotted(.h-button) {
    flex: 1 1 0;
    width: 100%;
    min-width: 0;
    max-width: 240px;
    --h-button-min-width: 0px;
    --h-button-height: 38px;
    --h-button-font-size: 14px;
    --h-button-bg: #e4e4e4;
    --h-button-color: #222326;
    --h-button-frame: #bfc0bd;
}
@media (max-width: 600px) {
    .h-modal__footer :slotted(.h-button) {
        --h-button-font-size: 12px;
        --h-button-padding: 6px 12px;
    }
}
</style>
