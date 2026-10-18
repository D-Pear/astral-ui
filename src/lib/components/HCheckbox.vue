<script setup lang="ts">
import HIcon from './HIcon.vue'
defineProps<{ disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>
<template>
    <label class="h-checkbox"
        ><input v-model="model" type="checkbox" :disabled="disabled" /><span
            class="h-checkbox__box"
            aria-hidden="true"
            ><span class="h-checkbox__mark"><HIcon name="check" :size="14" /></span></span
        ><span><slot /></span
    ></label>
</template>

<style scoped>
.h-checkbox {
    display: inline-flex;
    position: relative;
    align-items: center;
    gap: var(--h-choice-gap, 8px);
    font-size: var(--h-choice-font-size, 12px);
    line-height: 1.5;
}
.h-checkbox input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    z-index: 1;
}
.h-checkbox__box {
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 1px solid #8f8d87;
    background: #ffffff3d;
    color: #f7f0df;
    transition:
        background 180ms,
        border-color 180ms;
}
.h-checkbox__mark {
    display: grid;
    place-items: center;
    opacity: 0;
    transform: scale(0.55);
    transition:
        opacity 150ms ease,
        transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.h-checkbox input:checked + .h-checkbox__box {
    background: #9a8257;
    border-color: #9a8257;
}
.h-checkbox input:checked + .h-checkbox__box .h-checkbox__mark {
    opacity: 1;
    transform: scale(1);
}
.h-checkbox input:active:not(:disabled) + .h-checkbox__box .h-checkbox__mark {
    transform: scale(0.72);
}
.h-checkbox input:focus-visible + .h-checkbox__box {
    outline: 2px solid var(--h-gold-dark);
    outline-offset: 3px;
}
.h-checkbox:has(input:disabled) {
    opacity: 0.4;
}
</style>
