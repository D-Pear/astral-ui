import type { App } from 'vue'
import HIcon from './components/HIcon.vue'
import HButton from './components/HButton.vue'
import HCloseButton from './components/HCloseButton.vue'
import HPanel from './components/HPanel.vue'
import HTabs from './components/HTabs.vue'
import HTabPanels from './components/HTabPanels.vue'
import HNavigation from './components/HNavigation.vue'
import HInput from './components/HInput.vue'
import HSelect from './components/HSelect.vue'
import HSwitch from './components/HSwitch.vue'
import HCheckbox from './components/HCheckbox.vue'
import HRadio from './components/HRadio.vue'
import HSlider from './components/HSlider.vue'
import HProgress from './components/HProgress.vue'
import HBadge from './components/HBadge.vue'
import HModal from './components/HModal.vue'
import HToast from './components/HToast.vue'
import HEmpty from './components/HEmpty.vue'
import HFadeContainer from './components/HFadeContainer.vue'
import './theme.css'
export {
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
}
const components = {
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
}
export default {
    install(app: App) {
        for (const [name, component] of Object.entries(components)) app.component(name, component)
    },
}
