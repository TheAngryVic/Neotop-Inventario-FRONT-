<template id="app">
  <router-view v-slot="{ Component}">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <!-- <router-view/> -->
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})
</script>

<style scoped>

  /* #app{
    font-family: 'Sanlulus';
  } */

</style>