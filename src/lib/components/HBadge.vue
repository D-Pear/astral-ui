<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'gold' | 'success' | 'muted' | 'danger' }>(), { tone: 'gold' })
</script>
<template>
    <span class="h-badge" :class="`h-badge--${tone}`"><slot /></span>
</template>

<style scoped>
.h-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    padding: 3px 8px;
    border: 1px solid #aa8a4a55;
    background: #c5a66a1a;
    color: #896b35;
    font-size: 10px;
    line-height: 1.4;
}
.h-badge--success {
    border-color: #62826b44;
    background: #62826b12;
    color: #527561;
}
.h-badge--muted {
    border-color: #77777730;
    background: #7777770c;
    color: #74747a;
}
.h-badge--danger {
    border-color: #a64c4744;
    background: #a64c4712;
    color: #a64c47;
}
</style>
