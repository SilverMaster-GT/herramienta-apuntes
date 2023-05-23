<template>
  <div>
    <!-- Otras secciones de tu aplicación -->
    <Login/>
    <!-- Otras secciones de tu aplicación -->
  </div>
</template>

<script>
import Login from '@/components/LoginIndex.vue'
import { auth } from '@/firebase'
import router from '@/router'

export default {
  components: {
    Login
  },
  data () {
    return {
      user: ''
    }
  },
  created () {
    auth.onAuthStateChanged((loggedInUser) => {
      this.user = loggedInUser
    })
    if (this.user) {
      router.push('/Apuntes')
    }
  },
  methods: {
    showUser () {
      console.log(this.user)
      console.log(!this.user)
    }
  }
}
</script>
