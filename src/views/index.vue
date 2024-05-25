<script setup lang="ts">
import { useDark } from '@vueuse/core'

import { useCounterStore } from '@/stores/counter'

const isDark = useDark()
// 从 vite 环境变量获取命名空间
const namespace = import.meta.env.VITE_NAMESPACE

const counterStore = useCounterStore()
const { count, doubleCount } = toRefs(counterStore)
const { increment } = counterStore
</script>

<template>
    <div class="p-20">
        <div class="switch-container">
            <span>isDark:{{ isDark }}</span>
            <label class="switch">
                <input v-model="isDark" type="checkbox">
                <span class="slider" />
            </label>
            <span>namespace:{{ namespace }}</span>
            <div mt-20>
                <button @click="increment">
                    count is: {{ count }}
                </button>
                <br>
                <button @click="increment">
                    doubleCount is: {{ doubleCount }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.switch-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #2196f3;
}

input:checked + .slider:before {
    transform: translateX(26px);
}
</style>
