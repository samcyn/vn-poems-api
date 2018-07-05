<template>     
  <router-link :to="{ name: routeValue , params: { docId: doc._id } }" class="panel-block">
    <div>
      <p>{{ doc.title }}</p>
      <small>by @{{ doc._creator.username }}</small>
    </div>
  </router-link>
</template>

<script>

export default {
  name: 'PoemItem',
  props: {
    doc: { default: null } ,
    routeValue: { default: 'poem' }   
      
  },
  data () {
    return {
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
</style>
