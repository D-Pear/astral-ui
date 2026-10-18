<script setup lang="ts">
import HIcon from './HIcon.vue'
defineOptions({ inheritAttrs: false })
defineProps<{
    label?: string
    icon?: string
    error?: string
    disabled?: boolean
    placeholder?: string
    type?: string
    id?: string
}>()
const model = defineModel<string>({ default: '' })
</script>
<template>
    <label class="h-field" :class="{ 'has-error': error }"
        ><span v-if="label" class="h-field__label">{{ label }}</span
        ><span class="h-input-wrap"
            ><HIcon v-if="icon" :name="icon" :size="17" /><input
                v-bind="$attrs"
                :id="id"
                v-model="model"
                class="h-input"
                :type="type || 'text'"
                :placeholder="placeholder"
                :disabled="disabled"
                :aria-invalid="!!error" /></span
        ><span v-if="error" class="h-field__error">{{ error }}</span></label
    >
</template>

<style scoped>
.h-input-wrap {
    display: flex;
    align-items: center;
    position: relative;
    background: #f5f4ef80;
    border: 1px solid #99999e60;
    height: 38px;
    min-height: 38px;
    transition:
        background-color var(--h-duration),
        border-color var(--h-duration),
        box-shadow var(--h-duration);
}
.h-input-wrap > svg {
    margin-left: 10px;
    color: #7b7a7d;
    flex-shrink: 0;
}
.h-input-wrap:hover:not(:has(input:disabled)) {
    background: #f2f1ee;
    border-color: #a8a49a;
}
.h-input-wrap:focus-within:not(:has(input:disabled)) {
    border-color: var(--h-gold-dark);
    box-shadow: inset 0 0 0 1px #bca06b55;
}
.h-input {
    width: 100%;
    min-width: 0;
    background: transparent;
    color: var(--h-ink);
    border: 0;
    outline: none;
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.5;
}
.h-input::placeholder {
    color: #929196;
}
.has-error .h-input-wrap {
    border-color: var(--h-danger);
}
.h-field__error {
    font-size: 10px;
    color: var(--h-danger);
}
</style>
