<template>
  <v-app id="app">
    <the-header/>
    <router-view/>
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader'

export default {
  name: 'App',
  components: {
    TheHeader
  }
}
</script>

<style lang="scss">
#app {
  background-color: white;
  --base-color: rgba(0, 50, 255, .7);
  --table-color: rgba(50, 50, 50, 0.3);
}
</style>
