import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// DSFR styles
import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'

// vue-dsfr styles
import '@gouvminint/vue-dsfr/styles'

// CESIZen custom styles
import '@/assets/cesizen.css'

// vue-dsfr plugin
import VueDsfr from '@gouvminint/vue-dsfr'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueDsfr)

app.mount('#app')
