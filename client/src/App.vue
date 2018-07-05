<template>
  <div id="app">
    <Navigation/>

    <main>
      <router-view/>
    </main>

    <Foot/>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation';
  import Foot from '@/components/Foot';

  export default {
    name: 'App',
    components: {
      Navigation,
      Foot
    }
  }
</script>

<style>
  body {
    min-height: 100vh;
    position: relative;
    padding-bottom: 168px;
  }
  .container {
    padding: 0 12px;
  }
  
  section {
    padding: 60px 0;
  }
  
</style>

