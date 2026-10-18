<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
    HIcon,
    HButton,
    HCloseButton,
    HPanel,
    HTabs,
    HTabPanels,
    HNavigation,
    HInput,
    HSelect,
    HSwitch,
    HCheckbox,
    HRadio,
    HSlider,
    HProgress,
    HBadge,
    HModal,
    HToast,
    HEmpty,
    HFadeContainer,
} from '../lib'

const iconTab = ref('daily')
const iconTabs = [
    { value: 'daily', label: '概览', icon: 'grid' },
    { value: 'practice', label: '工具', icon: 'tools' },
    { value: 'explore', label: '记录', icon: 'list' },
    { value: 'study', label: '帮助', icon: 'book' },
]
const settingsTabs = [
    { value: 'general', label: '个人档案', icon: 'profile' },
    { value: 'graphics', label: '图像设置', icon: 'monitor' },
    { value: 'audio', label: '声音设置', icon: 'volume' },
    { value: 'other', label: '其他设置', icon: 'settings' },
]
const fadeTop = ref(true),
    fadeRight = ref(true),
    fadeBottom = ref(true),
    fadeLeft = ref(true)
const fadeEdges = computed(() =>
    (['top', 'right', 'bottom', 'left'] as const).filter(
        (edge) =>
            ({
                top: fadeTop.value,
                right: fadeRight.value,
                bottom: fadeBottom.value,
                left: fadeLeft.value,
            })[edge],
    ),
)

type Page = 'overview' | 'tools' | 'settings' | 'missions'
const navigation = [
    { value: 'overview' as Page, label: '组件总览', icon: 'grid', index: '01' },
    { value: 'tools' as Page, label: '合成工具', icon: 'tools', index: '02' },
    {
        value: 'settings' as Page,
        label: '偏好设置',
        icon: 'settings',
        index: '03',
    },
    { value: 'missions' as Page, label: '任务列表', icon: 'list', index: '04' },
]
function readPage(): Page {
    const page = location.hash.slice(1)
    return navigation.some((n) => n.value === page) ? (page as Page) : 'overview'
}
const page = ref<Page>(readPage())
const displayedPage = ref<string>(page.value)
watch(page, (value) => {
    location.hash = value
})
watch(displayedPage, () => window.scrollTo({ top: 0, behavior: 'instant' }), { flush: 'post' })
window.addEventListener('hashchange', () => {
    page.value = readPage()
})
const currentPage = computed(() => navigation.find((n) => n.value === displayedPage.value)!)
const tabs = ref('basic'),
    pill = ref('attributes'),
    nickname = ref('示例用户'),
    locationValue = ref('默认工作区'),
    exampleSearch = ref('')
const destinationOptions = [
    '默认工作区',
    '设计工作区',
    '开发工作区',
    '测试工作区',
    { label: '不可用的工作区', value: 'locked', disabled: true },
]
const buttonSparkles = ref(true)
const notify = ref(true),
    sound = ref(false),
    check = ref(true),
    unchecked = ref(false),
    radio = ref('balanced'),
    volume = ref(65)
const modal = ref(false),
    modalKind = ref('confirm'),
    toast = ref(false),
    toastMessage = ref('')
function message(text: string) {
    toastMessage.value = text
    toast.value = true
}
function openModal(kind: string) {
    modalKind.value = kind
    modal.value = true
}
const modalTitle = computed(
    () =>
        ({
            confirm: '确认操作',
            about: '关于组件库',
            craft: material.value.name,
            reset: '恢复默认设置',
            task: selectedTask.value?.title || '任务详情',
        })[modalKind.value] || '提示',
)
const loading = ref(false)
async function demoLoading() {
    if (loading.value) return
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1200))
    loading.value = false
    message('数据已同步')
}

const materials = reactive([
    {
        id: 'arrow',
        name: '精密组件',
        desc: '组件加工',
        icon: 'arrow',
        rarity: 3,
        color: '#62799c',
        cost: 80,
        owned: 12,
        ingredient: '基础零件',
        stock: 54,
    },
    {
        id: 'crystal',
        name: '复合晶体',
        desc: '高级加工材料',
        icon: 'diamond',
        rarity: 5,
        color: '#ae8a58',
        cost: 160,
        owned: 3,
        ingredient: '晶体碎片',
        stock: 18,
    },
    {
        id: 'core',
        name: '处理模块',
        desc: '模块加工材料',
        icon: 'cube',
        rarity: 3,
        color: '#62799c',
        cost: 60,
        owned: 26,
        ingredient: '基础芯片',
        stock: 87,
    },
    {
        id: 'ticket',
        name: '操作手册',
        desc: '文档整理材料',
        icon: 'book',
        rarity: 4,
        color: '#8b729c',
        cost: 100,
        owned: 8,
        ingredient: '记录页',
        stock: 42,
    },
    {
        id: 'energy',
        name: '储能单元',
        desc: '能源装配材料',
        icon: 'bolt',
        rarity: 4,
        color: '#8b729c',
        cost: 120,
        owned: 15,
        ingredient: '电池单元',
        stock: 33,
    },
    {
        id: 'shield',
        name: '防护组件',
        desc: '组件加工',
        icon: 'shield',
        rarity: 3,
        color: '#62799c',
        cost: 80,
        owned: 9,
        ingredient: '金属片',
        stock: 63,
    },
])
const selectedMaterial = ref('arrow'),
    quantity = ref(1),
    credits = ref(128640)
const material = computed(() => materials.find((m) => m.id === selectedMaterial.value)!)
const maxQuantity = computed(() =>
    Math.min(
        Math.floor(material.value.stock / 3),
        Math.floor(credits.value / material.value.cost),
        20,
    ),
)
watch(selectedMaterial, () => (quantity.value = 1))
function craft() {
    const item = material.value
    if (quantity.value < 1 || quantity.value > maxQuantity.value) {
        modal.value = false
        message('当前材料或预算不足')
        return
    }
    item.stock -= quantity.value * 3
    item.owned += quantity.value
    credits.value -= item.cost * quantity.value
    modal.value = false
    quantity.value = maxQuantity.value > 0 ? 1 : 0
    message(`合成成功 · 已获得${item.name}`)
}

const defaultSettings = {
    name: '示例用户',
    bio: '',
    world: '默认工作区',
    quality: '高',
    resolution: '1920 × 1080',
    fps: '60',
    music: 70,
    effects: 85,
    notification: true,
    motion: true,
    public: false,
}
function loadSettings() {
    try {
        return {
            ...defaultSettings,
            ...JSON.parse(localStorage.getItem('astral-ui-settings') || '{}'),
        } as typeof defaultSettings
    } catch {
        return { ...defaultSettings }
    }
}
const settings = ref(loadSettings()),
    savedSettings = ref(JSON.stringify(settings.value)),
    settingTab = ref('general'),
    nameError = ref('')
watch(
    () => settings.value.motion,
    (value) => {
        document.documentElement.dataset.hMotion = value ? 'full' : 'reduced'
    },
    { immediate: true },
)
const dirty = computed(() => JSON.stringify(settings.value) !== savedSettings.value)
function saveSettings() {
    nameError.value = settings.value.name.trim() ? '' : '请输入用户昵称'
    if (nameError.value) {
        settingTab.value = 'general'
        return
    }
    try {
        localStorage.setItem('astral-ui-settings', JSON.stringify(settings.value))
        savedSettings.value = JSON.stringify(settings.value)
        message('偏好设置已保存')
    } catch {
        message('浏览器存储不可用，本次设置仍在当前页面生效')
    }
}
function resetSettings() {
    settings.value = { ...defaultSettings }
    modal.value = false
    message('已恢复默认值，保存后生效')
}

const missions = ref([
    {
        id: 1,
        title: '完善个人资料',
        detail: '填写昵称、简介与工作区，检查表单的保存状态。',
        type: '任务列表',
        world: '默认工作区',
        icon: 'orbit',
        progress: 2,
        max: 3,
        reward: 120,
        status: '进行中',
    },
    {
        id: 2,
        title: '检查页面布局',
        detail: '检查四个示例页面在不同屏幕宽度下的排列。',
        type: '检查任务',
        world: '默认工作区',
        icon: 'monitor',
        progress: 4,
        max: 4,
        reward: 60,
        status: '可领取',
    },
    {
        id: 3,
        title: '整理材料库存',
        detail: '核对材料数量，并使用合成工具完成一次加工。',
        type: '协作任务',
        world: '设计工作区',
        icon: 'heart',
        progress: 1,
        max: 4,
        reward: 80,
        status: '进行中',
    },
    {
        id: 4,
        title: '阅读组件说明',
        detail: '了解组件的属性、插槽与键盘交互方式。',
        type: '文档任务',
        world: '开发工作区',
        icon: 'book',
        progress: 0,
        max: 3,
        reward: 40,
        status: '未开始',
    },
    {
        id: 5,
        title: '提交界面反馈',
        detail: '反馈已记录，可在此查看处理结果。',
        type: '协作任务',
        world: '测试工作区',
        icon: 'ticket',
        progress: 3,
        max: 3,
        reward: 80,
        status: '已完成',
    },
])
const missionSearch = ref(''),
    missionFilter = ref('全部任务'),
    selectedTask = ref<(typeof missions.value)[number] | null>(null)
const filteredMissions = computed(() =>
    missions.value.filter(
        (m) =>
            (missionFilter.value === '全部任务' || m.status === missionFilter.value) &&
            `${m.title}${m.detail}${m.world}`.includes(missionSearch.value),
    ),
)
const claimedReward = ref(0)
function resetMissionFilters() {
    missionSearch.value = ''
    missionFilter.value = '全部任务'
}
function claim(id: number) {
    const task = missions.value.find((m) => m.id === id)
    if (task?.status === '可领取') {
        task.status = '已完成'
        claimedReward.value += task.reward
        message(`奖励已领取 · 积分 × ${task.reward}`)
    }
}
function showTask(task: (typeof missions.value)[number]) {
    selectedTask.value = task
    openModal('task')
}
function confirmModal() {
    if (modalKind.value === 'craft') craft()
    else if (modalKind.value === 'reset') resetSettings()
    else {
        modal.value = false
        if (modalKind.value !== 'task' || selectedTask.value?.status !== '已完成')
            message(modalKind.value === 'task' ? '已追踪任务' : '已确认操作')
    }
}
</script>

<template>
    <div
        class="astral-app"
        :class="{ 'reduce-motion': !settings.motion, 'is-missions': displayedPage === 'missions' }"
    >
        <div class="starfield" aria-hidden="true" />
        <div class="orbital-lines" aria-hidden="true"><i /><i /><i /></div>
        <aside class="sidebar">
            <a class="brand"
                ><span class="brand-mark"><HIcon name="orbit" :size="40" /></span
                ><span style="vertical-align: middle"
                    >ASTRAL <b style="font-size: 32px">UI</b></span
                >
            </a>
            <div class="brand" style="margin-top: -12px">
                <div class="settings-tip">
                    <p>
                        > 组件预览预览界面 |
                        <a href="https://github.com/D-Pear/astral-ui">访问GitHub仓库</a>
                    </p>
                </div>
            </div>

            <div class="sidebar-caption">示例页面</div>
            <HNavigation
                v-model="page"
                :items="navigation"
                label="示例页面"
                class="sidebar-navigation"
            >
                <template #default="{ item, index }">
                    <span class="sidebar-nav-content">
                        <HIcon :name="navigation[index]!.icon" :size="21" />
                        <span class="sidebar-nav-text">{{ item.label }}</span>
                        <span class="nav-index">{{ navigation[index]!.index }}</span>
                    </span>
                </template>
            </HNavigation>
        </aside>

        <div class="main-shell">
            <header class="topbar">
                <div class="breadcrumb">
                    组件示例 <HIcon name="chevron" :size="12" /><span>{{ currentPage.label }}</span>
                </div>
            </header>
            <HTabPanels
                class="page-panels"
                :value="page"
                :order="navigation.map((item) => item.value)"
                axis="y"
                :animate-height="false"
                @display="displayedPage = $event"
            >
                <template #default="{ value: activePage }">
                    <main>
                        <div class="page-heading">
                            <div>
                                <h1>
                                    {{ currentPage.label }}
                                </h1>
                                <p>
                                    {{
                                        activePage === 'overview'
                                            ? '查看基础控件、交互反馈和主题样式。'
                                            : activePage === 'tools'
                                              ? '选择材料、调整数量，并预览合成消耗。'
                                              : activePage === 'settings'
                                                ? '编辑个人资料，调整显示选项并保存偏好。'
                                                : '搜索与筛选任务，查看进度并领取积分。'
                                    }}
                                </p>
                            </div>
                        </div>

                        <template v-if="activePage === 'overview'">
                            <div class="overview-toolbar">
                                <HTabs
                                    v-model="tabs"
                                    label="组件分类"
                                    :items="[
                                        { value: 'basic', label: '基础组件', icon: 'grid' },
                                        { value: 'feedback', label: '交互反馈', icon: 'bolt' },
                                        { value: 'tokens', label: '设计语言', icon: 'diamond' },
                                    ]"
                                />
                            </div>
                            <HTabPanels :value="tabs" :order="['basic', 'feedback', 'tokens']">
                                <template #default="{ value: activeTab }">
                                    <div v-if="activeTab === 'basic'" class="component-grid">
                                        <HPanel title="按钮" number="01" class="buttons-panel"
                                            ><template #action
                                                ><span class="component-count"
                                                    >操作反馈</span
                                                ></template
                                            >
                                            <div class="component-row">
                                                <HButton
                                                    variant="reward"
                                                    :sparkles="buttonSparkles"
                                                    icon="claim"
                                                    icon-shape="round"
                                                    @click="message('已确认操作')"
                                                    >确认操作</HButton
                                                ><HButton
                                                    icon="plus"
                                                    @click="message('已添加一条新记录')"
                                                    >添加记录</HButton
                                                ><HButton
                                                    variant="ghost"
                                                    @click="message('已取消操作')"
                                                    >取消</HButton
                                                >
                                            </div>
                                            <div class="component-row second-row">
                                                <HButton
                                                    size="sm"
                                                    :loading="loading"
                                                    icon="reset"
                                                    @click="demoLoading"
                                                    >{{ loading ? '同步中' : '同步数据' }}</HButton
                                                ><HButton size="sm" disabled>不可用状态</HButton
                                                ><HButton
                                                    variant="danger"
                                                    size="sm"
                                                    @click="openModal('confirm')"
                                                    >危险操作</HButton
                                                >
                                            </div>
                                            <div class="component-footnote">
                                                <HSwitch
                                                    v-model="buttonSparkles"
                                                    label="按钮星光"
                                                /></div
                                        ></HPanel>
                                        <HPanel title="标签与状态" number="02"
                                            ><div class="badge-row">
                                                <HBadge>进行中</HBadge
                                                ><HBadge tone="success">已完成</HBadge
                                                ><HBadge tone="muted">未解锁</HBadge
                                                ><HBadge tone="danger">需关注</HBadge>
                                            </div>
                                            <div class="status-showcase">
                                                <span><i class="status-dot" /> 状态正常</span
                                                ><span class="rarity-stars"
                                                    ><HIcon
                                                        v-for="n in 5"
                                                        :key="n"
                                                        name="star"
                                                        :size="14" /></span
                                                ><span class="rarity-label">五星品质</span>
                                            </div>
                                            <div class="component-footnote">
                                                <span class="tiny-diamond" /> 显示不同状态的标签
                                            </div></HPanel
                                        >
                                        <HPanel title="输入与选择" number="03"
                                            ><div class="input-grid">
                                                <HInput
                                                    v-model="nickname"
                                                    label="用户昵称"
                                                    placeholder="请输入昵称"
                                                    icon="star"
                                                /><HSelect
                                                    v-model="locationValue"
                                                    label="工作区"
                                                    :options="destinationOptions"
                                                />
                                            </div>
                                            <div class="search-demo">
                                                <HInput
                                                    v-model="exampleSearch"
                                                    icon="search"
                                                    placeholder="输入示例文本…"
                                                    aria-label="搜索组件示例"
                                                /></div
                                        ></HPanel>
                                        <HPanel title="开关与选项" number="04"
                                            ><div class="switch-grid">
                                                <HSwitch
                                                    v-model="notify"
                                                    label="接收消息通知"
                                                /><HSwitch v-model="sound" label="界面音效" />
                                            </div>
                                            <div class="choice-row">
                                                <HCheckbox v-model="check">自动保存</HCheckbox
                                                ><HCheckbox v-model="unchecked">显示提示</HCheckbox
                                                ><span class="choice-separator" /><HRadio
                                                    v-model="radio"
                                                    value="balanced"
                                                    name="quality"
                                                    >均衡</HRadio
                                                ><HRadio
                                                    v-model="radio"
                                                    value="quality"
                                                    name="quality"
                                                    >品质</HRadio
                                                >
                                            </div></HPanel
                                        >
                                        <HPanel title="滑块与进度" number="05"
                                            ><HSlider v-model="volume" label="背景音乐" />
                                            <div class="progress-demo">
                                                <HProgress :value="volume" label="完成进度" /></div
                                        ></HPanel>
                                        <HPanel title="页签与关闭" number="06"
                                            ><div class="tab-close-demo">
                                                <HTabs
                                                    v-model="pill"
                                                    variant="pill"
                                                    :items="[
                                                        { label: '属性', value: 'attributes' },
                                                        { label: '记录', value: 'history' },
                                                        { label: '设置', value: 'options' },
                                                    ]"
                                                /><HCloseButton
                                                    @click="message('已触发关闭操作')"
                                                />
                                            </div>
                                            <HTabPanels
                                                :value="pill"
                                                :order="['attributes', 'history', 'options']"
                                            >
                                                <template #default="{ value: activePill }">
                                                    <div class="tab-preview">
                                                        <HIcon
                                                            :name="
                                                                activePill === 'attributes'
                                                                    ? 'shield'
                                                                    : activePill === 'history'
                                                                      ? 'orbit'
                                                                      : 'star'
                                                            "
                                                            :size="21"
                                                        /><span>{{
                                                            activePill === 'attributes'
                                                                ? '展示当前条目的基本信息。'
                                                                : activePill === 'history'
                                                                  ? '展示当前条目的变更记录。'
                                                                  : '展示当前条目的关联设置。'
                                                        }}</span>
                                                    </div>
                                                </template>
                                            </HTabPanels>
                                            <div class="component-footnote">
                                                <span class="tiny-diamond" />
                                                试着悬停并按住右上角的关闭按钮
                                            </div></HPanel
                                        >
                                        <HPanel
                                            title="图标页签"
                                            number="12"
                                            class="icon-tabs-panel"
                                        >
                                            <div class="icon-tabs-demo">
                                                <HTabs
                                                    v-model="iconTab"
                                                    variant="icon"
                                                    :items="iconTabs"
                                                    label="图标分类"
                                                />
                                            </div>
                                            <div class="component-footnote">
                                                {{
                                                    iconTabs.find((item) => item.value === iconTab)
                                                        ?.label
                                                }}
                                            </div>
                                        </HPanel>
                                        <HPanel title="透明渐隐容器" number="13">
                                            <div class="fade-controls">
                                                <HCheckbox v-model="fadeTop">上</HCheckbox>
                                                <HCheckbox v-model="fadeRight">右</HCheckbox>
                                                <HCheckbox v-model="fadeBottom">下</HCheckbox>
                                                <HCheckbox v-model="fadeLeft">左</HCheckbox>
                                            </div>
                                            <div class="fade-demo-backdrop">
                                                <HFadeContainer
                                                    class="fade-demo"
                                                    :fade-edges="fadeEdges"
                                                    :fade-size="36"
                                                    label="渐隐材料列表"
                                                >
                                                    <div class="fade-demo-grid">
                                                        <div
                                                            v-for="n in 18"
                                                            :key="n"
                                                            class="fade-demo-card"
                                                        >
                                                            <HIcon
                                                                :name="
                                                                    ['cube', 'diamond', 'book'][
                                                                        (n - 1) % 3
                                                                    ]!
                                                                "
                                                                :size="26"
                                                            />
                                                            <span
                                                                >示例材料
                                                                {{
                                                                    String(n).padStart(2, '0')
                                                                }}</span
                                                            >
                                                        </div>
                                                    </div>
                                                </HFadeContainer>
                                            </div>
                                        </HPanel>
                                    </div>
                                    <div
                                        v-else-if="activeTab === 'feedback'"
                                        class="component-grid feedback-grid"
                                    >
                                        <HPanel title="对话弹窗" number="07"
                                            ><p class="demo-description">
                                                打开弹窗，确认或取消操作。
                                            </p>
                                            <HButton
                                                variant="primary"
                                                icon="external"
                                                @click="openModal('confirm')"
                                                >打开对话框</HButton
                                            ></HPanel
                                        ><HPanel title="轻量提示" number="08"
                                            ><p class="demo-description">显示操作结果提示。</p>
                                            <HButton icon="check" @click="message('保存成功')"
                                                >显示成功提示</HButton
                                            ></HPanel
                                        ><HPanel title="空状态" number="09" class="full-width"
                                            ><HEmpty
                                        /></HPanel>
                                    </div>
                                    <div v-else class="component-grid">
                                        <HPanel title="色彩语义" number="10"
                                            ><div class="swatches">
                                                <div
                                                    v-for="color in [
                                                        { name: '深灰', hex: '#22232C' },
                                                        { name: '纸白', hex: '#DEDEDC' },
                                                        { name: '暖金', hex: '#C7A66A' },
                                                        { name: '墨灰', hex: '#303139' },
                                                    ]"
                                                    :key="color.name"
                                                >
                                                    <i :style="{ background: color.hex }" /><span>{{
                                                        color.name
                                                    }}</span
                                                    ><small>{{ color.hex }}</small>
                                                </div>
                                            </div></HPanel
                                        ><HPanel title="字形与形制" number="11"
                                            ><div class="type-specimen">文字 Aa 0123456789</div>
                                            <p class="demo-description">系统中文字体</p>
                                            <div class="shape-specimens">
                                                <span>右上角圆角</span><span>胶囊形操作</span>
                                            </div></HPanel
                                        >
                                    </div>
                                </template>
                            </HTabPanels>
                        </template>

                        <template v-else-if="activePage === 'tools'">
                            <div class="tool-layout">
                                <HPanel title="材料仓库" number="01"
                                    ><div class="inventory-header">
                                        <span>合成材料</span
                                        ><HBadge>{{ materials.length }} 种</HBadge>
                                    </div>
                                    <div class="inventory-grid">
                                        <button
                                            v-for="item in materials"
                                            :key="item.id"
                                            class="material-card"
                                            :class="{ selected: selectedMaterial === item.id }"
                                            :style="{ '--rarity': item.color }"
                                            :aria-pressed="selectedMaterial === item.id"
                                            @click="selectedMaterial = item.id"
                                        >
                                            <div class="material-art">
                                                <HIcon :name="item.icon" :size="40" /><span
                                                    class="material-owned"
                                                    >{{ item.owned }}</span
                                                >
                                            </div>
                                            <div class="material-stars">
                                                <HIcon
                                                    v-for="n in item.rarity"
                                                    :key="n"
                                                    name="star"
                                                    :size="9"
                                                />
                                            </div>
                                            <span>{{ item.name }}</span>
                                        </button>
                                    </div>
                                    <div class="inventory-note">
                                        <HIcon name="info" :size="15" />选择材料查看合成配方
                                    </div></HPanel
                                >
                                <HPanel :title="material.name" number="02" class="synthesis-panel"
                                    ><template #action
                                        ><HBadge>{{
                                            material.desc.split(' / ')[0]
                                        }}</HBadge></template
                                    >
                                    <div class="synthesis-hero">
                                        <div class="item-orbit">
                                            <i /><i /><span :style="{ background: material.color }"
                                                ><HIcon :name="material.icon" :size="76"
                                            /></span>
                                        </div>
                                        <div class="item-rarity">
                                            <HIcon
                                                v-for="n in material.rarity"
                                                :key="n"
                                                name="star"
                                                :size="13"
                                            />
                                        </div>
                                        <p>{{ material.desc }}</p>
                                        <span
                                            >当前持有：<b>{{ material.owned }}</b></span
                                        >
                                    </div>
                                    <div class="recipe-title">所需材料</div>
                                    <div class="recipe">
                                        <div class="recipe-icon">
                                            <HIcon :name="material.icon" :size="27" />
                                        </div>
                                        <div>
                                            <strong>{{ material.ingredient }}</strong
                                            ><small>基础材料</small>
                                        </div>
                                        <span
                                            ><b
                                                :class="{
                                                    insufficient: material.stock < quantity * 3,
                                                }"
                                                >{{ material.stock }}</b
                                            >
                                            / {{ quantity * 3 }}</span
                                        >
                                    </div>
                                    <div class="quantity-control">
                                        <HSlider
                                            v-model="quantity"
                                            controls
                                            label="合成数量"
                                            :min="maxQuantity > 0 ? 1 : 0"
                                            :max="Math.max(maxQuantity, 1)"
                                            :disabled="maxQuantity === 0"
                                        />
                                    </div>
                                    <div class="craft-cost">
                                        <span>合成消耗</span
                                        ><span
                                            ><HIcon name="cube" :size="15" />{{
                                                (material.cost * quantity).toLocaleString()
                                            }}
                                            <small>/ {{ credits.toLocaleString() }}</small></span
                                        >
                                    </div>
                                    <template #footer
                                        ><div class="craft-actions">
                                            <span
                                                ><HIcon
                                                    name="info"
                                                    :size="14"
                                                />合成后将消耗相应材料</span
                                            ><HButton
                                                icon="tools"
                                                :disabled="maxQuantity === 0"
                                                @click="openModal('craft')"
                                                >合成</HButton
                                            >
                                        </div></template
                                    ></HPanel
                                >
                            </div>
                        </template>

                        <template v-else-if="activePage === 'settings'">
                            <div class="settings-layout">
                                <section class="settings-nav">
                                    <HTabs
                                        v-model="settingTab"
                                        label="设置分类"
                                        variant="icon"
                                        :items="settingsTabs"
                                    />
                                </section>
                                <form @submit.prevent="saveSettings">
                                    <HPanel
                                        :title="
                                            {
                                                general: '个人档案',
                                                graphics: '图像设置',
                                                audio: '声音设置',
                                                other: '其他设置',
                                            }[settingTab]
                                        "
                                        ><template #action
                                            ><HBadge :tone="dirty ? 'gold' : 'muted'">{{
                                                dirty ? '有未保存的更改' : '已保存'
                                            }}</HBadge></template
                                        >
                                        <HTabPanels
                                            :value="settingTab"
                                            :order="['general', 'graphics', 'audio', 'other']"
                                        >
                                            <template #default="{ value: activeSetting }">
                                                <div
                                                    v-if="activeSetting === 'general'"
                                                    class="settings-form"
                                                >
                                                    <div class="profile-preview">
                                                        <span class="profile-avatar"
                                                            ><HIcon name="orbit" :size="39"
                                                        /></span>
                                                        <div>
                                                            <strong>{{
                                                                settings.name || '示例用户'
                                                            }}</strong
                                                            ><small>本地示例 · 个人资料</small>
                                                        </div>
                                                        <HBadge>示例用户</HBadge>
                                                    </div>
                                                    <HInput
                                                        v-model="settings.name"
                                                        label="用户昵称"
                                                        :error="nameError"
                                                        maxlength="20"
                                                        placeholder="请输入昵称"
                                                    /><HInput
                                                        v-model="settings.bio"
                                                        label="个性签名"
                                                        maxlength="80"
                                                    /><HSelect
                                                        v-model="settings.world"
                                                        label="默认工作区"
                                                        :options="[
                                                            '默认工作区',
                                                            '设计工作区',
                                                            '开发工作区',
                                                            '测试工作区',
                                                        ]"
                                                    /><HSwitch
                                                        v-model="settings.public"
                                                        label="公开我的个人资料"
                                                    />
                                                </div>
                                                <div
                                                    v-else-if="activeSetting === 'graphics'"
                                                    class="setting-rows"
                                                >
                                                    <div class="setting-row">
                                                        <span>图像质量</span
                                                        ><HSelect
                                                            v-model="settings.quality"
                                                            aria-label="图像质量"
                                                            :options="['低', '中', '高', '非常高']"
                                                        />
                                                    </div>
                                                    <div class="setting-row">
                                                        <span>分辨率</span
                                                        ><HSelect
                                                            v-model="settings.resolution"
                                                            aria-label="分辨率"
                                                            :options="[
                                                                '1280 × 720',
                                                                '1920 × 1080',
                                                                '2560 × 1440',
                                                            ]"
                                                        />
                                                    </div>
                                                    <div class="setting-row">
                                                        <span>帧率</span
                                                        ><HSelect
                                                            v-model="settings.fps"
                                                            aria-label="帧率"
                                                            :options="['30', '60', '120']"
                                                        />
                                                    </div>
                                                    <div class="setting-row">
                                                        <HSwitch
                                                            v-model="settings.motion"
                                                            label="界面过渡动画"
                                                        />
                                                    </div>
                                                    <div class="settings-tip">
                                                        <HIcon name="info" :size="18" />
                                                        <p>
                                                            图像选项仅供预览，开关界面过渡动画会立即生效。
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="activeSetting === 'audio'"
                                                    class="settings-form audio-form"
                                                >
                                                    <HSlider
                                                        v-model="settings.music"
                                                        label="背景音乐音量"
                                                    /><HSlider
                                                        v-model="settings.effects"
                                                        label="音效音量"
                                                    />
                                                    <div class="settings-tip">
                                                        <HIcon name="info" :size="18" />
                                                        <p>音量设置仅供预览，此页面不播放声音。</p>
                                                    </div>
                                                </div>
                                                <div v-else class="settings-form">
                                                    <HSwitch
                                                        v-model="settings.notification"
                                                        label="接收任务提醒"
                                                    />
                                                </div>
                                            </template>
                                        </HTabPanels>
                                        <template #footer
                                            ><div class="settings-actions">
                                                <HButton
                                                    variant="ghost"
                                                    icon="reset"
                                                    @click="openModal('reset')"
                                                    >恢复默认</HButton
                                                ><HButton
                                                    type="submit"
                                                    variant="primary"
                                                    icon="check"
                                                    >保存设置</HButton
                                                >
                                            </div></template
                                        ></HPanel
                                    >
                                </form>
                            </div>
                        </template>

                        <template v-else>
                            <div class="mission-stats">
                                <div>
                                    <HIcon name="list" :size="25" /><span
                                        >任务总数<strong
                                            >{{ missions.length.toString().padStart(2, '0')
                                            }}<small>个任务</small></strong
                                        ></span
                                    >
                                </div>
                                <div>
                                    <HIcon name="orbit" :size="25" /><span
                                        >正在处理<strong
                                            >{{
                                                missions
                                                    .filter((m) => m.status === '进行中')
                                                    .length.toString()
                                                    .padStart(2, '0')
                                            }}<small>进行中</small></strong
                                        ></span
                                    >
                                </div>
                                <div>
                                    <HIcon name="diamond" :size="25" /><span
                                        >本次获得<strong
                                            >{{ claimedReward }}<small>积分</small></strong
                                        ></span
                                    >
                                </div>
                            </div>
                            <HPanel title="任务记录" class="mission-panel"
                                ><template #action
                                    ><span class="component-count"
                                        >{{ filteredMissions.length }} 条记录</span
                                    ></template
                                >
                                <div class="mission-filters">
                                    <HInput
                                        v-model="missionSearch"
                                        icon="search"
                                        placeholder="搜索任务或工作区…"
                                        aria-label="搜索任务"
                                    /><HSelect
                                        v-model="missionFilter"
                                        aria-label="任务状态"
                                        :options="[
                                            '全部任务',
                                            '进行中',
                                            '可领取',
                                            '未开始',
                                            '已完成',
                                        ]"
                                    />
                                </div>
                                <HFadeContainer
                                    class="mission-scroll"
                                    :fade-edges="['top', 'bottom']"
                                    :fade-size="40"
                                    label="任务列表"
                                >
                                    <div v-if="filteredMissions.length" class="mission-list">
                                        <article
                                            v-for="task in filteredMissions"
                                            :key="task.id"
                                            class="mission-card"
                                        >
                                            <div class="mission-symbol">
                                                <HIcon :name="task.icon" :size="27" />
                                            </div>
                                            <div class="mission-info">
                                                <div>
                                                    <h3>{{ task.title }}</h3>
                                                    <HBadge
                                                        :tone="
                                                            task.status === '已完成'
                                                                ? 'muted'
                                                                : task.status === '可领取'
                                                                  ? 'success'
                                                                  : 'gold'
                                                        "
                                                        >{{ task.status }}</HBadge
                                                    >
                                                </div>
                                                <p>{{ task.detail }}</p>
                                                <span>{{ task.type }}<i />{{ task.world }}</span
                                                ><HProgress
                                                    class="mission-progress"
                                                    :value="task.progress"
                                                    :max="task.max"
                                                    :label="`任务进度 ${task.progress}/${task.max}`"
                                                />
                                            </div>
                                            <div class="mission-reward">
                                                <span
                                                    ><HIcon name="diamond" :size="18" />{{
                                                        task.reward
                                                    }}</span
                                                ><HButton
                                                    v-if="task.status === '可领取'"
                                                    size="sm"
                                                    variant="primary"
                                                    icon="check"
                                                    @click="claim(task.id)"
                                                    >领取奖励</HButton
                                                ><HButton
                                                    v-else
                                                    size="sm"
                                                    :icon="
                                                        task.status === '已完成' ? 'book' : 'arrow'
                                                    "
                                                    @click="showTask(task)"
                                                    >{{
                                                        task.status === '已完成'
                                                            ? '查看记录'
                                                            : '查看任务'
                                                    }}</HButton
                                                >
                                            </div>
                                        </article>
                                    </div>
                                    <HEmpty
                                        v-else
                                        title="未找到相关任务"
                                        description="换一个关键词，或查看其他状态的任务。"
                                        ><HButton size="sm" @click="resetMissionFilters"
                                            >重置筛选</HButton
                                        ></HEmpty
                                    >
                                </HFadeContainer></HPanel
                            >
                        </template>
                    </main>
                </template>
            </HTabPanels>
        </div>
        <HModal
            v-model="modal"
            :title="modalTitle"
            :subtitle="modalKind === 'about' ? 'Astral UI · 组件与交互示例' : undefined"
            ><template v-if="modalKind === 'craft'" #illustration
                ><div class="modal-material-art" :style="{ '--rarity': material.color }">
                    <HIcon :name="material.icon" :size="68" />
                </div>
                <div class="item-rarity">
                    <HIcon v-for="n in material.rarity" :key="n" name="star" :size="12" />
                </div>
                <span class="modal-material-name">{{ material.name }}</span></template
            ><template v-if="modalKind === 'about'"
                ><div class="about-emblem"><HIcon name="orbit" :size="60" /></div>
                <p>
                    一套参考知名二次元回合制游戏的界面设计构建的 Vue 3 组件库，包含 19
                    个组件与四个示例页面。
                </p>
                <p class="muted-text">支持表单保存、材料合成与任务筛选。</p></template
            ><template v-else-if="modalKind === 'craft'"
                ><p class="modal-quantity">
                    {{ material.desc }}<br />{{ quantity }} × {{ material.name }}
                </p>
                <p>
                    将消耗 {{ material.ingredient }} × {{ quantity * 3 }}，以及
                    {{ material.cost * quantity }} 点预算。
                </p></template
            >
            <p v-else-if="modalKind === 'reset'">恢复默认值后，点击“保存设置”以保留更改。</p>
            <template v-else-if="modalKind === 'task' && selectedTask"
                ><HBadge>{{ selectedTask.type }} · {{ selectedTask.world }}</HBadge>
                <p>{{ selectedTask.detail }}</p>
                <HProgress
                    :value="selectedTask.progress"
                    :max="selectedTask.max"
                    label="任务进度" /></template
            ><template v-else
                ><p>确认后会显示操作结果提示。</p>
                <div class="dialog-note">
                    <HIcon name="info" :size="17" />这是交互演示，确认后将显示操作反馈。
                </div></template
            ><template #footer
                ><HButton
                    v-if="modalKind !== 'about'"
                    icon="cross"
                    icon-shape="round"
                    @click="modal = false"
                    >取消</HButton
                ><HButton
                    icon="check"
                    icon-shape="round"
                    @click="modalKind === 'about' ? (modal = false) : confirmModal()"
                    >{{
                        modalKind === 'about'
                            ? '返回示例'
                            : modalKind === 'craft'
                              ? '确认合成'
                              : modalKind === 'task'
                                ? selectedTask?.status === '已完成'
                                    ? '关闭记录'
                                    : '追踪任务'
                                : '确认'
                    }}</HButton
                ></template
            ></HModal
        >
        <HToast v-model="toast" :message="toastMessage" />
    </div>
</template>

<style scoped>
.icon-tabs-demo {
    overflow-x: auto;
    padding: 4px 0;
    background: linear-gradient(115deg, #1c2430, #2f4663);
    color: #e9ecf0;
    border-radius: 0 16px 0 0;
    --h-tabs-icon-width: 72px;
    --h-tabs-icon-height: 64px;
}
.icon-tabs-demo .h-tabs {
    --h-tabs-icon-size: 44px;
}
.fade-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
}
.fade-demo-backdrop {
    color: #f0eee8;
    background: linear-gradient(115deg, #263e53, #50405b 55%, #243e42);
    border: 1px solid #ffffff18;
}
.fade-demo {
    height: 166px;
}
.fade-demo-grid {
    display: grid;
    grid-template-columns: repeat(6, 100px);
    gap: 12px;
    padding: 10px;
    width: max-content;
}
.fade-demo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 104px;
    color: #f0eee8;
    font-size: 11px;
    border: 1px solid #e0d7c95c;
    background: #7c97be42;
}
.astral-app {
    min-height: 100dvh;
    background:
        radial-gradient(ellipse at 85% 10%, #49547c28, transparent 55%),
        radial-gradient(ellipse at 15% 90%, #304a7428, transparent 55%),
        linear-gradient(125deg, #202430, #141827);
    isolation: isolate;
}
.starfield {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: -1;
    opacity: 0.3;
    background-image:
        radial-gradient(1px 1px at 12px 56px, #c9d5ee 90%, transparent),
        radial-gradient(1px 1px at 156px 180px, #c9d5ee 90%, transparent),
        radial-gradient(1px 1px at 90px 240px, #c9d5ee 90%, transparent);
    background-size:
        297px 263px,
        439px 373px,
        577px 421px;
}
.orbital-lines {
    pointer-events: none;
    position: fixed;
    z-index: -1;
    right: -250px;
    top: -290px;
    width: 1000px;
    height: 1000px;
    opacity: 0.09;
}
.orbital-lines i {
    position: absolute;
    inset: 0;
    border: 1px solid #c7b58b;
    border-radius: 50%;
}
.orbital-lines i:nth-child(2) {
    inset: 65px;
}
.orbital-lines i:nth-child(3) {
    inset: 140px;
    border-style: dashed;
}
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 360px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #151923eb, #191d2ae6);
    border-right: 1px solid #d8d2bc14;
    padding: 34px 24px 20px 40px;
    z-index: 10;
}
.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    padding: 0 12px;
    white-space: nowrap;
}
.brand-mark {
    display: grid;
    place-items: center;
    width: 42px;
    height: 48px;
    color: #e7ce92;
}
.brand > span:last-child {
    font-size: 22px;
    letter-spacing: 2px;
}
.brand b {
    font-weight: 400;
    color: #d5ba80;
}
.brand small {
    display: block;
    font-size: 9px;
    letter-spacing: 2px;
    color: #85858d;
    margin-top: 7px;
}
.sidebar-caption {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 50px 15px 17px;
    font-size: 10px;
    color: #92919a;
    letter-spacing: 1px;
}
.sidebar-caption span {
    font-size: 8px;
    letter-spacing: 1.2px;
    color: #62636f;
}
.sidebar-navigation {
    --h-navigation-padding: 14px 15px;
}
.sidebar-nav-content {
    display: flex;
    align-items: center;
    gap: 13px;
}
.sidebar-nav-text {
    font-size: 14px;
    letter-spacing: 1px;
}
.sidebar-nav-text small {
    display: block;
    font-size: 8px;
    letter-spacing: 1.8px;
    margin-top: 6px;
    opacity: 0.6;
}
.nav-index {
    margin-left: auto;
    font-size: 10px;
    opacity: 0.5;
}
.status-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    background: #b69e68;
    border-radius: 50%;
}
.main-shell {
    margin-left: 360px;
}
.topbar {
    height: 70px;
    padding: 0 42px;
    border-bottom: 1px solid #e4daba12;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    background: #191d2933;
}
.breadcrumb {
    display: flex;
    gap: 12px;
    align-items: center;
    color: #7f8390;
}
.breadcrumb > span {
    color: #cecec9;
}
.breadcrumb svg {
    opacity: 0.5;
}
.page-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 29px;
}
.page-heading h1 {
    font-size: 30px;
    letter-spacing: 2px;
    font-weight: 400;
    margin: 12px 0 12px;
    color: #efeee9;
}
.page-heading h1 > span {
    font-size: 11px;
    letter-spacing: 3px;
    color: #737987;
    margin-left: 18px;
}
.page-heading p {
    font-size: 11px;
    line-height: 1.8;
    color: #979aa5;
    margin: 0;
    letter-spacing: 0.3px;
}
.overview-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    border-bottom: 1px solid #d5d0be22;
}
.tiny-diamond {
    display: inline-block;
    width: 4px;
    height: 4px;
    transform: rotate(45deg);
    background: #a38b56;
    flex-shrink: 0;
}
.component-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.18fr) minmax(0, 1fr);
    gap: 21px;
}
.component-count {
    color: #8a8886;
    font-size: 10px;
    white-space: nowrap;
}
.component-row {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}
.second-row {
    margin-top: 18px;
}
.component-footnote {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 9px;
    letter-spacing: 0.3px;
    color: #85817a;
    border-top: 1px solid #8c8a7d22;
    padding-top: 16px;
    margin-top: 21px;
}
.badge-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 3px;
}
.status-showcase {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 31px;
    font-size: 10px;
}
.status-showcase > span:first-child {
    display: flex;
    gap: 7px;
    align-items: center;
}
.rarity-stars {
    display: flex;
    gap: 3px;
    color: #a5874b;
    margin-left: auto;
}
.rarity-stars svg {
    fill: #ae915d22;
}
.rarity-label {
    font-size: 9px;
    color: #807970;
}
.input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}
.search-demo {
    margin-top: 19px;
}
.switch-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 7px 0 23px;
}
.choice-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 9px;
    padding-top: 23px;
    border-top: 1px solid var(--h-line);
}
.choice-separator {
    width: 1px;
    height: 15px;
    background: #9996;
}
.progress-demo {
    margin-top: 29px;
}
.tab-close-demo {
    display: flex;
    gap: 20px;
    align-items: center;
}
.tab-preview {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-top: 24px;
    color: #8a7c62;
    font-size: 10px;
}
.tab-preview > span {
    color: #757477;
}
.tab-close-demo ~ .component-footnote {
    margin-top: 19px;
}
.demo-description {
    font-size: 12px;
    line-height: 1.8;
    color: #77747a;
    margin: 0 0 24px;
}
.full-width {
    grid-column: 1/-1;
}
.swatches {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
}
.swatches > div {
    display: flex;
    flex-direction: column;
    gap: 9px;
    font-size: 12px;
}
.swatches i {
    height: 55px;
    border: 1px solid #7773;
}
.swatches small {
    font-size: 9px;
    color: #898481;
}
.type-specimen {
    font-size: 25px;
    letter-spacing: 3px;
    margin-bottom: 15px;
}
.shape-specimens {
    display: flex;
    gap: 15px;
    font-size: 10px;
    color: #8b7752;
}
.shape-specimens > span {
    border: 1px solid #ab9864;
    padding: 12px 18px;
    border-radius: 0 17px 0 0;
}
.shape-specimens > span + span {
    border-radius: 30px;
}
.tool-layout {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr);
    gap: 24px;
}
.inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 20px;
}
.inventory-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 19px 14px;
}
.material-card {
    position: relative;
    background: none;
    border: 1px solid transparent;
    padding: 3px;
    color: #4e4c4c;
    transition:
        background 0.18s,
        border-color 0.18s;
    min-width: 0;
}
.material-card:hover {
    background: #fff3;
    border-color: #f8f1dd;
}
.material-card.selected {
    border-color: #fdf7dc;
    background: #fff3;
    box-shadow: 0 0 0 1px #95805d;
}
.material-card > span {
    display: block;
    font-size: 10px;
    padding: 6px 0;
}
.material-art {
    position: relative;
    display: grid;
    place-items: center;
    height: 86px;
    background:
        radial-gradient(ellipse at 50% 80%, #fff3, transparent),
        linear-gradient(145deg, #1f2737, var(--rarity));
    color: #f8ecd4;
    border-bottom: 4px solid var(--rarity);
}
.material-art svg {
    filter: drop-shadow(2px 5px 3px #0006);
    transform: rotate(-15deg);
}
.material-owned {
    position: absolute;
    bottom: 2px;
    right: 6px;
    font-size: 10px;
    color: #fff;
}
.material-stars {
    display: flex;
    justify-content: center;
    color: #a4874e;
    gap: 1px;
    margin-top: 6px;
}
.inventory-note {
    display: flex;
    gap: 7px;
    align-items: center;
    font-size: 10px;
    color: #83807a;
    border-top: 1px solid var(--h-line);
    margin-top: 27px;
    padding-top: 18px;
}
.synthesis-hero {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 6px 0 28px;
}
.item-orbit {
    height: 178px;
    width: 178px;
    position: relative;
    display: grid;
    place-items: center;
}
.item-orbit > i {
    position: absolute;
    inset: 0;
    border: 1px solid #98886766;
    border-radius: 50%;
}
.item-orbit > i + i {
    inset: 10px;
    border-style: dashed;
    border-color: #98886744;
}
.item-orbit > span {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #f2e5c4;
    box-shadow: inset 0 0 40px #16264655;
}
.item-orbit svg {
    transform: rotate(-25deg);
    filter: drop-shadow(3px 6px 3px #0004);
}
.item-rarity {
    display: flex;
    gap: 5px;
    background: #2c2d36;
    color: #d8bb75;
    border-radius: 20px;
    padding: 5px 13px;
    margin-top: -12px;
    z-index: 1;
}
.synthesis-hero p {
    font-size: 11px;
    color: #7e7b77;
    margin: 18px 0 10px;
}
.synthesis-hero > span {
    font-size: 11px;
}
.synthesis-hero b {
    color: #a07b36;
    font-weight: 400;
    margin-left: 4px;
}
.recipe-title {
    font-size: 12px;
    border-bottom: 1px solid var(--h-line);
    padding-bottom: 12px;
}
.recipe-title > span {
    font-size: 8px;
    color: #8c8982;
    margin-left: 10px;
    letter-spacing: 1px;
}
.recipe {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 19px 0;
}
.recipe-icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    background: #8c9c9a;
    color: #eeede2;
}
.recipe strong {
    font-size: 12px;
    font-weight: 400;
}
.recipe small {
    display: block;
    font-size: 9px;
    color: #898680;
    margin-top: 7px;
}
.recipe > span {
    margin-left: auto;
    font-size: 12px;
    color: #89847b;
}
.recipe b {
    color: #7a815b;
    font-weight: 400;
}
.recipe b.insufficient {
    color: #a64c47;
}
.craft-cost {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #7f7b72;
    padding-top: 14px;
    border-top: 1px solid var(--h-line);
}
.craft-cost > span:last-child {
    display: flex;
    gap: 7px;
    align-items: center;
    color: #846b3d;
}
.craft-cost small {
    color: #88837a;
}
.craft-actions > span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
}
.settings-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 26px;
}
.settings-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.settings-nav .h-tabs {
    width: 100%;
    justify-content: center;
    --h-tabs-icon-width: min(76px, 25%);
}
.settings-tip {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    color: #8f8e83;
}
.settings-tip p {
    font-size: 10px;
    line-height: 1.9;
    color: #737b8b;
}
.settings-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    max-width: 650px;
    padding: 4px 8px 17px;
}
.profile-preview {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 0 25px;
    margin-bottom: 1px;
    border-bottom: 1px solid var(--h-line);
}
.profile-avatar {
    width: 66px;
    height: 66px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #777e8e;
    color: #e6d8b2;
    border: 3px solid #eeece0;
    box-shadow: 0 0 0 1px #9f957e;
}
.profile-preview strong {
    font-size: 18px;
    font-weight: 400;
}
.profile-preview small {
    display: block;
    font-size: 10px;
    color: #8c8781;
    margin-top: 10px;
}
.settings-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}
.setting-rows {
    min-height: 390px;
}
.setting-row {
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 24px;
    border-bottom: 1px solid var(--h-line);
    font-size: 13px;
    background: #f5f2ec22;
}
.settings-explanation {
    font-size: 11px;
    color: #87827a;
    line-height: 1.9;
    margin: 24px 0 0;
}
.setting-rows > .settings-explanation {
    padding: 0 24px;
}
.audio-form {
    min-height: 370px;
    gap: 39px;
    padding-top: 15px;
}
.mission-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}
.mission-stats > div {
    border: 1px solid #cab57930;
    background: linear-gradient(120deg, #9d957d12, #9d957d04);
    padding: 23px 25px;
    display: flex;
    gap: 22px;
    align-items: center;
}
.mission-stats svg {
    color: #c3a86e;
}
.mission-stats > div > span {
    font-size: 10px;
    color: #9194a1;
}
.mission-stats strong {
    display: block;
    font-size: 28px;
    font-weight: 400;
    color: #e0dccf;
    margin-top: 8px;
    font-variant-numeric: tabular-nums;
}
.mission-stats small {
    font-size: 9px;
    color: #7b808f;
    margin-left: 12px;
}
.mission-filters {
    display: grid;
    grid-template-columns: 1fr 180px;
    gap: 20px;
    margin-bottom: 23px;
}
.mission-card {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 22px 0;
    border-top: 1px solid var(--h-line);
}
.mission-symbol {
    display: grid;
    place-items: center;
    width: 53px;
    height: 53px;
    border: 1px solid #b8a78077;
    transform: rotate(45deg);
    margin: 0 10px;
    background: #cac7bc66;
    color: #8e7b53;
    flex-shrink: 0;
}
.mission-symbol > svg {
    transform: rotate(-45deg);
}
.mission-info {
    flex: 1;
    min-width: 0;
}
.mission-info > div:first-child {
    display: flex;
    align-items: center;
    gap: 14px;
}
.mission-info h3 {
    font-size: 15px;
    font-weight: 400;
    margin: 0;
}
.mission-info p {
    font-size: 11px;
    color: #7d7a76;
    line-height: 1.8;
    margin: 9px 0;
}
.mission-info > span {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 9px;
    color: #989086;
}
.mission-info > span i {
    width: 1px;
    height: 9px;
    background: #aba79f;
}
.mission-reward {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 19px;
    margin-left: 15px;
}
.mission-reward > span {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: #9a7e45;
}
.about-emblem {
    text-align: center;
    color: #ae925c;
}
.muted-text {
    font-size: 11px;
    color: #8a857c;
}
.modal-material-art {
    display: grid;
    place-items: center;
    width: 138px;
    height: 138px;
    border-radius: 50%;
    background: var(--rarity);
    border: 3px solid #eeede5;
    outline: 1px solid #949aa8;
    outline-offset: 5px;
    color: #efe7d2;
}
.modal-material-art > svg {
    transform: rotate(-20deg);
}
.modal-material-name {
    font-size: 11px;
    color: #85838a;
    margin-top: 18px;
}
.modal-quantity {
    line-height: 2.3;
}
.dialog-note {
    display: flex;
    gap: 8px;
    align-items: center;
    background: #b3a47517;
    border: 1px solid #a9976a44;
    padding: 12px 14px;
    font-size: 11px;
    color: #8e7e5e;
}
.quantity-control {
    display: block;
    padding: 18px 0 22px;
}
.craft-actions > span {
    max-width: none !important;
}

@media (max-width: 600px) {
    .modal-material-art {
        width: 82px;
        height: 82px;
    }
    .modal-material-art > svg {
        width: 45px;
        height: 45px;
    }
    .modal-material-name {
        font-size: 10px;
    }
}
@media (min-width: 1600px) {
    .page-heading {
        margin-bottom: 35px;
    }
    .component-grid {
        gap: 25px;
    }
    .component-row {
        gap: 21px;
    }
    .second-row {
        margin-top: 24px;
    }
}
@media (max-width: 1200px) {
    .topbar {
        padding-inline: 28px;
    }
    .brand {
        gap: 5px;
        padding-inline: 6px;
    }
    .brand > span:last-child {
        font-size: 19px;
    }
    .component-grid {
        gap: 18px;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    }
    .component-row {
        gap: 10px;
    }
    .switch-grid {
        gap: 18px;
    }
    .choice-row {
        flex-wrap: wrap;
        gap: 12px;
    }
    .choice-separator {
        display: none;
    }
    .badge-row {
        gap: 8px;
    }
    .rarity-label {
        display: none;
    }
    .tool-layout {
        grid-template-columns: 290px minmax(0, 1fr);
    }
    .inventory-grid {
        gap: 15px 8px;
    }
    .material-art {
        height: 70px;
    }
}
@media (max-width: 1000px) {
    .sidebar {
        width: 108px;
        padding: 30px 10px 20px 40px;
    }
    .brand {
        padding: 0;
        justify-content: center;
    }
    .brand > span:last-child,
    .sidebar-caption,
    .sidebar-nav-text,
    .sidebar-nav-content .nav-index {
        display: none;
    }
    .sidebar nav {
        margin-top: 45px;
        gap: 13px;
    }
    .sidebar-nav-content {
        justify-content: center;
    }
    .sidebar-navigation {
        --h-navigation-padding: 17px 10px;
    }
    .main-shell {
        margin-left: 108px;
    }
    .page-heading h1 > span {
        font-size: 9px;
        letter-spacing: 2px;
    }
    .tool-layout {
        grid-template-columns: 260px minmax(0, 1fr);
    }
}
@media (max-width: 760px) {
    .topbar {
        height: 60px;
        padding-inline: 20px;
    }
    .component-grid {
        grid-template-columns: minmax(0, 1fr);
    }
    .page-heading h1 {
        font-size: 27px;
    }
    .page-heading p {
        font-size: 10px;
    }
    .switch-grid {
        gap: 40px;
    }
    .choice-row {
        justify-content: flex-start;
        gap: 25px;
    }
    .rarity-label {
        display: inline;
    }
    .tool-layout {
        grid-template-columns: 1fr;
    }
    .inventory-grid {
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
    }
    .material-art {
        height: 65px;
    }
    .material-art svg {
        width: 30px;
    }
    .material-card > span {
        font-size: 9px;
    }
    .settings-layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 18px;
    }
    .settings-tip {
        display: none;
    }
    .mission-stats {
        gap: 10px;
    }
    .mission-stats > div {
        padding: 18px 15px;
        gap: 12px;
    }
    .mission-stats svg {
        width: 20px;
    }
    .mission-stats strong {
        font-size: 23px;
    }
    .mission-stats small {
        margin-left: 6px;
        font-size: 8px;
    }
    .mission-symbol {
        width: 38px;
        height: 38px;
        margin: 0 5px;
    }
    .mission-symbol svg {
        width: 23px;
    }
    .mission-info h3 {
        font-size: 13px;
    }
    .mission-card {
        gap: 14px;
    }
    .mission-info > div:first-child {
        flex-wrap: wrap;
        gap: 6px;
    }
    .mission-reward {
        margin-left: 0;
    }
    .mission-info p {
        font-size: 10px;
    }
}
@media (max-width: 480px) {
    .sidebar {
        width: 96px;
        padding-right: 6px;
    }
    .brand-mark {
        width: 34px;
    }
    .brand-mark svg {
        width: 28px;
    }
    .sidebar-nav-content svg {
        width: 20px;
    }
    .main-shell {
        margin-left: 96px;
    }
    .topbar {
        padding-inline: 15px;
    }
    .breadcrumb {
        font-size: 9px;
        gap: 5px;
    }
    .page-heading h1 {
        font-size: 25px;
    }
    .page-heading h1 > span {
        font-size: 7px;
        letter-spacing: 1px;
        margin-left: 10px;
    }
    .page-heading p {
        font-size: 9px;
    }
    .component-row {
        gap: 9px;
    }
    .component-count {
        font-size: 9px;
    }
    .component-footnote {
        font-size: 8px;
        line-height: 1.6;
    }
    .switch-grid {
        gap: 17px;
    }
    .choice-row {
        gap: 15px;
    }
    .input-grid {
        gap: 11px;
    }
    .rarity-stars {
        gap: 0;
    }
    .status-showcase {
        gap: 7px;
        font-size: 9px;
    }
    .rarity-label {
        font-size: 8px;
    }
    .badge-row {
        gap: 7px;
    }
    .tab-close-demo {
        gap: 10px;
    }
    .tab-preview {
        font-size: 9px;
    }
    .inventory-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 13px;
    }
    .material-art {
        height: 76px;
    }
    .quantity-control {
        gap: 12px;
    }
    .craft-actions > span {
        max-width: 100px;
        line-height: 1.8;
    }
    .profile-preview {
        gap: 10px;
    }
    .profile-preview strong {
        font-size: 15px;
    }
    .profile-preview small {
        font-size: 8px;
    }
    .profile-avatar {
        width: 49px;
        height: 49px;
    }
    .profile-avatar svg {
        width: 30px;
    }
    .settings-form {
        padding-inline: 0;
    }
    .setting-row {
        padding-inline: 18px;
    }
    .mission-stats > div {
        padding: 15px 10px;
        gap: 8px;
    }
    .mission-stats > div > svg {
        display: none;
    }
    .mission-stats strong {
        font-size: 22px;
    }
    .mission-stats small {
        font-size: 7px;
        display: block;
        margin: 4px 0 0;
    }
    .mission-filters {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .mission-symbol {
        display: none;
    }
    .mission-info h3 {
        font-size: 12px;
    }
    .mission-info > span {
        font-size: 8px;
        gap: 6px;
    }
    .mission-card {
        gap: 10px;
    }
    .swatches {
        gap: 10px;
    }
    .swatches small {
        font-size: 7px;
    }
    .type-specimen {
        font-size: 20px;
    }
}
.astral-app {
    color: #dddeda;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
}
main {
    max-width: 1560px;
    margin: auto;
    padding: 30px 32px 0;
}
.page-heading {
    margin-bottom: 24px;
}
.sidebar-caption {
    padding-top: 34px;
}
.component-grid {
    gap: 18px;
}
.component-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    --h-button-min-width: 0px;
    --h-button-padding: 6px 12px;
    --h-button-font-size: 12px;
}
.second-row {
    margin-top: 14px;
}
.component-footnote {
    padding-top: 12px;
    margin-top: 16px;
}
.overview-toolbar {
    --h-tabs-line-color: transparent;
    --h-tab-padding: 12px 16px;
}
.tab-close-demo {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 28px;
    gap: 14px;
    --h-tab-font-size: 11px;
}
.choice-row {
    --h-choice-font-size: 11px;
    --h-choice-gap: 6px;
    padding-top: 18px;
}
.progress-demo {
    margin-top: 20px;
}
.settings-form {
    gap: 18px;
    padding: 0 0 8px;
}
.setting-rows {
    min-height: 280px;
}
.setting-row {
    min-height: 58px;
    padding: 10px 0;
    gap: 18px;
}
.setting-row > :first-child:not(:only-child) {
    flex-shrink: 0;
}
.setting-row > :last-child {
    flex: 0 1 180px;
    min-width: 0;
}
.setting-row > :only-child {
    flex: 1;
}
.audio-form {
    min-height: 220px;
    gap: 26px;
}
.craft-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-block: 4px;
}
.craft-actions > :last-child {
    width: min(100%, 260px);
}
.craft-actions > span {
    max-width: none;
}
.mission-progress {
    max-width: 280px;
    margin-top: 12px;
}
.is-missions {
    height: 100dvh;
    overflow: hidden;
}
.is-missions .main-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}
.is-missions .topbar,
.is-missions .page-heading,
.is-missions .mission-stats {
    flex-shrink: 0;
}
.is-missions .page-panels {
    flex: 1;
    min-height: 0;
}
.is-missions .page-panels > :deep(.h-tab-panels__page) {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}
.is-missions main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    width: 100%;
    padding-bottom: 30px;
}
.mission-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}
.mission-panel :deep(.h-panel__header) {
    flex-shrink: 0;
}
.mission-panel :deep(.h-panel__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}
.mission-filters {
    flex-shrink: 0;
}
.mission-scroll {
    flex: 1;
    min-height: 0;
}
@media (max-width: 1000px) {
    main {
        padding: 26px 24px 0;
    }
}
@media (max-width: 760px) {
    main {
        padding: 24px 18px 0;
    }
    .switch-grid {
        --h-switch-font-size: 11px;
    }
}
@media (max-width: 480px) {
    main {
        padding: 22px 14px 0;
    }
    .component-row {
        gap: 8px;
        --h-button-padding: 6px 8px;
        --h-button-font-size: 10px;
        --h-button-gap: 6px;
    }
    .overview-toolbar {
        --h-tab-padding: 12px 7px;
        --h-tab-font-size: 10px;
        --h-tab-icon-gap: 5px;
    }
    .overview-toolbar > :first-child {
        width: 100%;
        --h-tabs-gap: 0px;
    }
    .choice-row {
        --h-choice-font-size: 10px;
    }
    .setting-row > :last-child {
        flex-basis: 140px;
    }
}
</style>
