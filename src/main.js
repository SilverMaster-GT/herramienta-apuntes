import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth, onAuthStateChanged, firestore, analytics } from './firebase'

const app = createApp(App)

app.use(router)
app.config.globalProperties.$firestore = firestore
app.config.globalProperties.$Analytics = analytics
// Configuración del estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // El usuario ha iniciado sesión
    app.config.globalProperties.$user = user
  } else {
    // El usuario ha cerrado sesión
    delete app.config.globalProperties.$user
  }
  app.mount('#app')
})
