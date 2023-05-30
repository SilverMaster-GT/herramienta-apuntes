<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Login </span>
    </template>
  </el-page-header>
  <div class="login-container" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
    <h2 class="login-title">Registro de Usuario</h2>
    <form @submit.prevent="registerUser" class="login-form">
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
      <el-button type="primary" plain :icon="Key" @click="onSubmit">Registrarme</el-button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from '@/firebase'
import router from '@/router'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: '',
      imageUrl: ''
    }
  },
  mounted () {
    this.retrieveImage()
  },
  methods: {
    registerUser () {
      createUserWithEmailAndPassword(this.$Auth, this.email, this.password)
        .then(() => {
          // Registro exitoso
          router.push('/Apuntes')
        })
        .catch((error) => {
          // Error durante el registro
          this.error = error.message
        })
    },
    retrieveImage () {
      const storage = getStorage()
      const storageRef = ref(storage)
      const imagePath = 'assets/img/b41dfd09-27a1-4cef-8e2d-9ad7cecf12c3.jpg'

      getDownloadURL(ref(storageRef, imagePath))
        .then((url) => {
          console.log('URL de la imagen:', url)
          this.imageUrl = url
        })
        .catch((error) => {
          console.error('Error al obtener la imagen:', error)
        })
    },
    goBack () {
      this.$router.go(-1)
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

.error {
  color: red;
  margin-top: 10px;
}
</style>
