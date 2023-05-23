<template>
  <template v-if="$user">
    <h2>Bienvenido, {{ $user.email }}</h2>
    <button @click="logout">Cerrar sesión</button>
  </template>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import { auth } from './firebase'
import router from './router'
export default {
  methods: {
    logout () {
      auth.signOut()
    }
  },
  mounted () {
    if (this.$user) {
      router.push('/Apuntes')
    }
  },
  created () {
    const script = document.createElement('script')
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3036807213049494'
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', 'true')
    document.head.appendChild(script)
  }
}
</script>
