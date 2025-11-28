import DefaultTheme from 'vitepress/theme'
import Demo from './components/Demo.vue'
import './style.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // Register Demo component globally
        app.component('Demo', Demo)
    }
}