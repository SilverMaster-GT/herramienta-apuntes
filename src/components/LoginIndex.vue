<template>
  <el-row class="login-container" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
    <h2 class="login-title">Herramienta Gratuita de Apuntes <br /> ¡Lleva a donde quieras tu informacion importante!</h2>
    <h2 class="login-title">Iniciar sesión</h2>
    <form class="login-form" id="login-form" >
      <el-input v-model="email" placeholder="TuEmail@email.com" size="large">
        <template #prepend>Correo Electronico:</template>
      </el-input>
      <br />
      <br />
      <el-input v-model="password" size="large" type="password" show-password>
        <template #prepend>Contraseña:</template>
      </el-input>
      <br />
      <br />
      <el-button type="primary" plain :icon="Key" @click="login()" id="login-button" >Iniciar sesión</el-button>
    </form>
    <p v-if="error" class="login-error">{{ error }}</p>
    <br>
    <el-tag
      class="mx-1"
      effect="light"
    >
      Click aquí para <router-link :to="{ name: 'register' }">Registrarte</router-link>
    </el-tag>
  </el-row>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import router from '@/router'
import { Key } from '@element-plus/icons-vue'
export default {
  data () {
    return {
      email: '',
      password: '',
      error: '',
      imageUrl: '',
      Key
    }
  },
  mounted () {
    this.retrieveImage()
  },
  methods: {
    async login () {
      await signInWithEmailAndPassword(this.$Auth, this.email, this.password)
        .then((data) => {
          // Inicio de sesión exitoso
          router.push('/Apuntes')
        })
        .catch((error) => {
          // Error durante el inicio de sesión
          this.error = error.message
        })
    },
    retrieveImage () {
      const storage = getStorage()
      const storageRef = ref(storage)
      const imagePath = 'assets/img/1643c710-c644-4ecb-b571-01dc1548b5fc.jpg'

      getDownloadURL(ref(storageRef, imagePath))
        .then((url) => {
          console.log('URL de la imagen:', url)
          this.imageUrl = url
        })
        .catch((error) => {
          console.error('Error al obtener la imagen:', error)
        })
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: auto;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-shadow: -2px -2px 6px white, 2px 2px 6px white;
}

.login-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 400px;
}

.login-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.login-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 10px;
  width: 90%;
}

.login-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.login-button:hover {
  background-color: #0056b3;
}

.login-error {
  color: red;
  margin-top: 10px;
}
</style>
