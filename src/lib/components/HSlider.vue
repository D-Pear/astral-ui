<script setup lang="ts">
import { computed, useId } from 'vue'
import HIcon from './HIcon.vue'
const props = withDefaults(
    defineProps<{
        label: string
        min?: number
        max?: number
        step?: number
        disabled?: boolean
        controls?: boolean
    }>(),
    { min: 0, max: 100, step: 1 },
)
const model = defineModel<number>({ default: 0 })
const id = `h-slider-${useId()}`
const percent = computed(() =>
    Math.max(0, Math.min(100, ((model.value - props.min) / (props.max - props.min || 1)) * 100)),
)
function adjust(direction: number) {
    model.value = Math.max(
        props.min,
        Math.min(props.max, Number((model.value + direction * props.step).toFixed(10))),
    )
}
</script>
<template>
    <div class="h-slider" :class="{ 'h-slider--quantity': controls, 'is-disabled': disabled }">
        <label :for="id" class="h-slider__label"
            ><span>{{ label }}<span v-if="controls">：</span></span
            ><output :for="id">{{ model }}</output></label
        >
        <div class="h-slider__row">
            <button
                v-if="controls"
                type="button"
                class="h-slider__step"
                :aria-label="`减少${label}`"
                :disabled="disabled || model <= min"
                @click="adjust(-1)"
            >
                <HIcon name="minus" :size="18" />
            </button>
            <span v-if="controls" class="h-slider__bound" aria-hidden="true">{{ min }}</span>
            <div class="h-slider__control" :style="{ '--fill': `${percent}%` }">
                <span class="h-slider__track" aria-hidden="true"><span /></span>
                <input
                    :id="id"
                    v-model.number="model"
                    type="range"
                    :min="min"
                    :max="max"
                    :step="step"
                    :disabled="disabled"
                    :aria-label="label"
                />
            </div>
            <span v-if="controls" class="h-slider__bound" aria-hidden="true">{{ max }}</span>
            <button
                v-if="controls"
                type="button"
                class="h-slider__step"
                :aria-label="`增加${label}`"
                :disabled="disabled || model >= max"
                @click="adjust(1)"
            >
                <HIcon name="plus" :size="18" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.h-slider {
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
    min-width: 0;
}
.h-slider__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
}
.h-slider output {
    color: var(--h-ink);
    font-variant-numeric: tabular-nums;
}
.h-slider__row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}
.h-slider__control {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 28px;
}
.h-slider__track {
    position: absolute;
    left: 9px;
    right: 9px;
    top: calc(50% - 2px);
    height: 4px;
    background: #aaa9ad;
    pointer-events: none;
}
.h-slider__track > span {
    display: block;
    width: var(--fill);
    height: 100%;
    background: var(--h-slider-accent);
    box-shadow: 0 1px 0 #f8d39c inset;
}
.h-slider input {
    position: absolute;
    inset: 0;
    appearance: none;
    width: 100%;
    height: 28px;
    margin: 0;
    border: 0;
    background: transparent;
    outline-offset: 2px;
}
.h-slider input::-webkit-slider-runnable-track {
    height: 4px;
    background: transparent;
}
.h-slider input::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -7px;
    border: 3px solid var(--h-slider-accent);
    border-radius: 50%;
    background: #fffdf7;
    box-shadow: 0 1px 3px #9d682b33;
    transition: box-shadow 150ms;
}
.h-slider input::-moz-range-track {
    height: 4px;
    background: transparent;
}
.h-slider input::-moz-range-thumb {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 3px solid var(--h-slider-accent);
    border-radius: 50%;
    background: #fffdf7;
    box-shadow: 0 1px 3px #9d682b33;
    transition: box-shadow 150ms;
}
.h-slider input:hover:not(:disabled)::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px #eea03e33;
}
.h-slider input:hover:not(:disabled)::-moz-range-thumb {
    box-shadow: 0 0 0 3px #eea03e33;
}
.h-slider__step {
    display: grid;
    place-items: center;
    width: 43px;
    height: 23px;
    flex-shrink: 0;
    border: 1px solid #d0d0ce;
    border-radius: 999px;
    background: #f0f0ed;
    color: #28292c;
    padding: 0;
    transition:
        background 150ms,
        box-shadow 150ms;
}
.h-slider__step:hover:not(:disabled) {
    background: #fffdf8;
    box-shadow: 0 0 0 1px #fff9;
}
.h-slider__step:active:not(:disabled) {
    background: #c7c7c5;
}
.h-slider__step:disabled {
    background: transparent;
    border-color: #a8a8ae;
    color: #777881;
    opacity: 0.5;
}
.h-slider__bound {
    color: #7d7a7d;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    min-width: 10px;
    text-align: center;
}
.h-slider--quantity .h-slider__label {
    justify-content: center;
    gap: 7px;
    color: #77747a;
}
.h-slider--quantity .h-slider__label output {
    font-size: 13px;
}
.h-slider.is-disabled .h-slider__track {
    opacity: 0.38;
}
@media (max-width: 600px) {
    .h-slider__row {
        gap: 7px;
    }
    .h-slider__step {
        width: 36px;
    }
}
</style>
