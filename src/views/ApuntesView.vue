<template>
  <div class="apuntes">
    <Apuntes />
  </div>
</template>

<script>
// @ is an alias to /src
import Apuntes from '@/components/apuntesLocales.vue'

export default {
  name: 'HomeView',
  components: {
    Apuntes
  }
}
</script>
