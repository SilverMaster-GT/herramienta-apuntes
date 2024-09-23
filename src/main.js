import { createApp } from 'vue'
import VueGtm from 'vue-gtm'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { auth, firestore, analytics } from './firebase'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app.use(router)
app.config.globalProperties.$firestore = firestore
app.config.globalProperties.$Analytics = analytics
app.config.globalProperties.$Auth = auth
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// Configuración vue-gtm
app.use(VueGtm, {
  id: 'GTM-TLXXLTJ2', // Reemplaza con tu ID de Google Tag Manager
  vueRouter: router, // Si utilizas vue-router
  enabled: true, // Activa o desactiva el GTM
  debug: false, // Modo de depuración (para ver eventos en consola)
  loadScript: true, // Carga el script de GTM automáticamente
  trackOnNextTick: false // Define si quieres que los eventos se envíen en el siguiente tick
})

app.mount('#app')
app.mixin({
  mounted () {
    AOS.init()
  }
})
