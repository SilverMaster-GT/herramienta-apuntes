import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth, onAuthStateChanged, firestore, analytics } from './firebase'

const app = createApp(App)

app.use(router)
app.config.globalProperties.$firestore = firestore
app.config.globalProperties.$Analytics = analytics
app.config.globalProperties.$Auth = auth
// Configuración del estado de autenticación
onAuthStateChanged(auth, (loggedInUser) => {
  if (loggedInUser) {
    // El usuario ha iniciado sesión
    app.config.globalProperties.$user = loggedInUser
  } else {
    // El usuario ha cerrado sesión
    delete app.config.globalProperties.$user
  }
  app.mount('#app')
})
