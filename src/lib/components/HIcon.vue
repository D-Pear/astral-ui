<script setup lang="ts">
withDefaults(defineProps<{ name?: string; size?: number | string }>(), { name: 'star', size: 20 })

const paths: Record<string, string> = {
    profile: 'M 16 7 A 4 4 0 1 1 8 7 A 4 4 0 0 1 16 7 Z M 4 21 V 19 A 8 6 0 0 1 20 19 V 21',
    star: 'M 12 3 L 14.8 8.7 L 21 9.6 L 16.5 14 L 17.6 20.2 L 12 17.2 L 6.4 20.2 L 7.5 14 L 3 9.6 L 9.2 8.7 Z',
    orbit: 'M 20 12 A 8 8 0 1 1 12 4 M 16 4 H 20 V 8 M 8 12 H 16 M 12 8 V 16',
    grid: 'M 3 3 H 10 V 10 H 3 Z M 14 3 H 21 V 10 H 14 Z M 3 14 H 10 V 21 H 3 Z M 14 14 H 21 V 21 H 14 Z',
    tools: 'M 14 4 A 5 5 0 0 0 8 10 L 3.8 16.2 A 2.8 2.8 0 0 0 7.8 20.2 L 14 14 A 5 5 0 0 0 20 8 L 16 11 L 13 8 Z',
    settings:
        'M 4 6 H 7 M 11 6 H 20 M 4 12 H 13 M 17 12 H 20 M 4 18 H 7 M 11 18 H 20 M 7 4 V 8 M 13 10 V 14 M 7 16 V 20',
    list: 'M 9 5 H 20 M 9 12 H 20 M 9 19 H 20 M 4 5 H 4.01 M 4 12 H 4.01 M 4 19 H 4.01',
    book: 'M 12 5 Q 8 2 3 4 V 19 Q 8 17 12 20 Q 16 17 21 19 V 4 Q 16 2 12 5 Z M 12 5 V 20 M 6 8 H 9 M 15 8 H 18 M 6 12 H 9 M 15 12 H 18',
    arrow: 'M 4 12 H 20 M 14 6 L 20 12 L 14 18',
    claim: 'M 12 3 V 15 M 7 10 L 12 15 L 17 10 M 4 17 V 21 H 20 V 17',
    chevron: 'M 9 5 L 16 12 L 9 19',
    down: 'M 5 9 L 12 16 L 19 9',
    check: 'M 4 12 L 9 17 L 20 6',
    cross: 'M 6 6 L 18 18 M 18 6 L 6 18',
    plus: 'M 12 4 V 20 M 4 12 H 20',
    minus: 'M 4 12 H 20',
    search: 'M 18 10.5 A 7.5 7.5 0 1 1 3 10.5 A 7.5 7.5 0 0 1 18 10.5 Z M 16 16 L 21 21',
    info: 'M 21 12 A 9 9 0 1 1 3 12 A 9 9 0 0 1 21 12 Z M 12 11 V 17 M 12 7 H 12.01',
    diamond: 'M 12 3 L 21 12 L 12 21 L 3 12 Z',
    cube: 'M 12 3 L 21 8 V 16 L 12 21 L 3 16 V 8 Z M 12 12 L 21 8 M 3 8 L 12 12 V 21',
    bolt: 'M 13 3 L 4 14 H 11 L 10 21 L 20 10 H 13 Z',
    reset: 'M 4 10 A 8 8 0 1 1 5 17 M 4 4 V 10 H 10',
    volume: 'M 3 9 H 7 L 12 4 V 20 L 7 15 H 3 Z M 16 9 A 5 5 0 0 1 16 15 M 19 6 A 9 9 0 0 1 19 18',
    monitor: 'M 3 4 H 21 V 17 H 3 Z M 12 17 V 21 M 7 21 H 17',
    trophy: 'M 7 3 H 17 V 10 A 5 5 0 0 1 7 10 Z M 7 6 H 3 V 8 A 5 5 0 0 0 8 13 M 17 6 H 21 V 8 A 5 5 0 0 1 16 13 M 12 15 V 21 M 7 21 H 17',
    heart: 'M 12 21 L 4.5 13 A 5.5 5.5 0 0 1 12 5 A 5.5 5.5 0 0 1 19.5 13 Z',
    clock: 'M 21 12 A 9 9 0 1 1 3 12 A 9 9 0 0 1 21 12 Z M 12 7 V 12 L 16 14',
    code: 'M 7 6 L 2 12 L 7 18 M 17 6 L 22 12 L 17 18 M 14 3 L 10 21',
    download: 'M 12 3 V 15 M 7 10 L 12 15 L 17 10 M 4 17 V 21 H 20 V 17',
    ticket: 'M 3 5 H 21 V 10 A 2 2 0 0 0 21 14 V 19 H 3 V 14 A 2 2 0 0 0 3 10 Z M 15 5 V 8 M 15 11 V 13 M 15 16 V 19',
    shield: 'M 12 3 L 20 6 V 12 C 20 16 12 21 12 21 C 12 21 4 16 4 12 V 6 Z M 8 12 L 11 15 L 16 9',
    moon: 'M 20 15 A 9 9 0 0 1 9 4 A 9 9 0 1 0 20 15 Z',
    external: 'M 14 3 H 21 V 10 M 21 3 L 11 13 M 10 4 H 4 V 20 H 20 V 14',
}
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        <path :d="paths[name] || paths.star" />
    </svg>
</template>
