<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string; number?: string }>()
</script>
<template>
    <section class="h-panel">
        <header v-if="title" class="h-panel__header">
            <div>
                <span v-if="number" class="h-panel__number">{{ number }}</span>
                <h2>{{ title }}</h2>
                <span v-if="subtitle" class="h-panel__subtitle">{{ subtitle }}</span>
            </div>
            <slot name="action" />
        </header>
        <div class="h-panel__body"><slot /></div>
        <footer v-if="$slots.footer" class="h-panel__footer"><slot name="footer" /></footer>
    </section>
</template>

<style scoped>
.h-panel {
    --h-scrollbar-thumb: color-mix(in srgb, currentColor 60%, transparent);
    --h-scrollbar-track: color-mix(in srgb, currentColor 6%, transparent);
    position: relative;
    background: linear-gradient(120deg, #e6e6e2, #d8d9d9);
    color: var(--h-ink);
    border: 1px solid #f4f1e82e;
    border-radius: var(--h-radius);
    box-shadow: 0 5px 20px #00000012;
}
.h-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px 13px;
    border-bottom: 1px solid var(--h-line);
}
.h-panel__header > div {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
}
.h-panel__header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}
.h-panel__number {
    font-size: 10px;
    color: #918165;
    letter-spacing: 1px;
}
.h-panel__subtitle {
    color: var(--h-muted);
    font-size: 9px;
    letter-spacing: 1.4px;
}
.h-panel__body {
    padding: 18px 20px;
}
.h-panel__footer {
    border-top: 1px solid var(--h-line);
    padding: 12px 20px;
    font-size: 11px;
    color: var(--h-muted);
}
@media (max-width: 600px) {
    .h-panel__header {
        padding: 17px;
    }
    .h-panel__body {
        padding: 18px;
    }
    .h-panel__subtitle {
        display: none;
    }
}
</style>
