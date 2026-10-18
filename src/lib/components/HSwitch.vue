<script setup lang="ts">
defineProps<{ label: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>
<template>
    <label class="h-switch-label"
        ><span>{{ label }}</span
        ><button
            type="button"
            class="h-switch"
            role="switch"
            :aria-label="label"
            :aria-checked="model"
            :disabled="disabled"
            :class="{ 'is-on': model }"
            @click="model = !model"
        >
            <span /></button
    ></label>
</template>

<style scoped>
.h-switch-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--h-switch-font-size, 12px);
}
.h-switch {
    position: relative;
    isolation: isolate;
    width: 37px;
    height: 20px;
    padding: 2px;
    background: #484a55;
    border: 0;
    border-radius: 999px;
    transition:
        background-color 220ms cubic-bezier(0, 0, 0, 1),
        box-shadow 140ms ease;
    flex-shrink: 0;
}
.h-switch::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid #72768080;
    border-radius: inherit;
    pointer-events: none;
    transition: border-color 220ms cubic-bezier(0, 0, 0, 1);
}
.h-switch > span {
    position: relative;
    display: block;
    width: 16px;
    height: 16px;
    background: #f7f7f7;
    border-radius: 50%;
    box-shadow: 0 1px 3px #00000026;
    transition: transform 220ms cubic-bezier(0, 0, 0, 1);
}
.h-switch.is-on {
    background: #ffc46e;
}
.h-switch.is-on::before {
    border-color: #a8753780;
}
.h-switch.is-on > span {
    transform: translateX(17px);
}
.h-switch:hover:not(:disabled) {
    box-shadow: 0 0 0 2px #fff;
}
</style>
