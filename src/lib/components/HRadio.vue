<script setup lang="ts">
defineProps<{ value: string; name: string; disabled?: boolean }>()
const model = defineModel<string>({ required: true })
</script>
<template>
    <label class="h-radio"
        ><input
            v-model="model"
            type="radio"
            :value="value"
            :name="name"
            :disabled="disabled" /><span class="h-radio__circle" /><span><slot /></span
    ></label>
</template>

<style scoped>
.h-radio {
    display: inline-flex;
    position: relative;
    align-items: center;
    gap: var(--h-choice-gap, 8px);
    font-size: var(--h-choice-font-size, 12px);
    line-height: 1.5;
}
.h-radio input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    z-index: 1;
}
.h-radio__circle {
    position: relative;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 1px solid #92908a;
    border-radius: 50%;
    transition: border-color 180ms ease;
}
.h-radio__circle::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: #a08655;
    opacity: 0;
    transform: scale(0.35);
    transition:
        opacity 180ms ease,
        transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.h-radio input:checked + .h-radio__circle {
    border-color: #a08655;
}
.h-radio input:checked + .h-radio__circle::after {
    opacity: 1;
    transform: scale(1);
}
.h-radio input:active:not(:disabled) + .h-radio__circle::after {
    transform: scale(0.72);
}
.h-radio input:focus-visible + .h-radio__circle {
    outline: 2px solid var(--h-gold-dark);
    outline-offset: 3px;
}
.h-radio:has(input:disabled) {
    opacity: 0.4;
}
</style>
