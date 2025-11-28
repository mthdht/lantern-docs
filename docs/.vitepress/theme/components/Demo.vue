<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    title?: string
}>()

const showCode = ref(false)
const activeTab = ref<'code' | 'spec' | 'theme'>('code')
</script>

<template>
    <div class="demo-container">
        <div v-if="title" class="demo-title">{{ title }}</div>
        
        <!-- Preview area -->
        <div class="demo-preview">
            <slot name="preview" />
        </div>
        
        <!-- Code toggle button -->
        <div class="demo-actions">
            <button 
                class="demo-toggle" 
                @click="showCode = !showCode"
                :aria-expanded="showCode"
            >
                <svg v-if="!showCode" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
                </svg>
                <svg v-else width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <span>{{ showCode ? 'Hide Code' : 'Show Code' }}</span>
            </button>
        </div>
        
        <!-- Code block with tabs (collapsible) -->
        <div v-if="showCode" class="demo-code-container">
            <!-- Tabs -->
            <div class="demo-tabs">
                <button 
                    class="demo-tab"
                    :class="{ active: activeTab === 'code' }"
                    @click="activeTab = 'code'"
                >
                    Component
                </button>
                <button 
                    v-if="$slots.spec"
                    class="demo-tab"
                    :class="{ active: activeTab === 'spec' }"
                    @click="activeTab = 'spec'"
                >
                    Spec
                </button>
                <button 
                    v-if="$slots.theme"
                    class="demo-tab"
                    :class="{ active: activeTab === 'theme' }"
                    @click="activeTab = 'theme'"
                >
                    Theme
                </button>
            </div>
            
            <!-- Tab content -->
            <div class="demo-code">
                <div v-show="activeTab === 'code'">
                    <slot name="code" />
                </div>
                <div v-if="$slots.spec" v-show="activeTab === 'spec'">
                    <slot name="spec" />
                </div>
                <div v-if="$slots.theme" v-show="activeTab === 'theme'">
                    <slot name="theme" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    margin: 24px 0;
    overflow: hidden;
}

.demo-title {
    padding: 12px 20px;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    font-weight: 600;
    font-size: 14px;
    color: var(--vp-c-text-1);
}

.demo-preview {
    padding: 32px 24px;
    background: var(--vp-c-bg);
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.demo-actions {
    padding: 8px 12px;
    background: var(--vp-c-bg-soft);
    border-top: 1px solid var(--vp-c-divider);
    display: flex;
    justify-content: flex-end;
}

.demo-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    font-size: 13px;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: all 0.2s;
}

.demo-toggle:hover {
    color: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
}

.demo-toggle svg {
    opacity: 0.7;
}

.demo-code-container {
    border-top: 1px solid var(--vp-c-divider);
}

.demo-tabs {
    display: flex;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 0 12px;
    gap: 4px;
}

.demo-tab {
    padding: 10px 16px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.demo-tab:hover {
    color: var(--vp-c-text-1);
}

.demo-tab.active {
    color: var(--vp-c-brand-1);
    border-bottom-color: var(--vp-c-brand-1);
}

.demo-code {
    background: var(--vp-c-bg-alt);
}

.demo-code :deep(div[class*="language-"]) {
    margin: 0;
    border-radius: 0;
}

.demo-code :deep(.vp-code-group) {
    margin: 0;
}
</style>