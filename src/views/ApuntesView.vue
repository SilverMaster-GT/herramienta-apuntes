<template>
  <div class="apuntes">
    <Apuntes />
  </div>
</template>

<script>
// @ is an alias to /src
import Apuntes from '@/components/ApuntesLocales.vue'

export default {
  name: 'HomeView',
  components: {
    Apuntes
  }
}
</script>
