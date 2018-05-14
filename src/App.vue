<template>
  <div id="app">
    <index/>
  </div>
</template>

<script>
  import index from './components/index'

  export default {
    name: 'App',
    components: {
      index
    }
  }
</script>

<style>
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling: touch;
  }
</style>
