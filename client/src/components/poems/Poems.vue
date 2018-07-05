<template>     
  <div class="container">
    <section class="docs">
      <poem-list :type="type" :docs="poems" :isLoading="loadingPoems" :hasFooter="false"></poem-list>
    </section>
  </div>
</template>

<script>
import PoemsService from '@/services/PoemsService';
import PoemList from './PoemList';

export default {
  name: 'Poems',
  components: {
    PoemList
  },
  data () {
    return {
      poems: null,
      loadingPoems: false
    }
  },
  async mounted(){
    this.loadingPoems = true;
    try {
      const response = await PoemsService.getAll();
      this.poems = response.data.poems;
      this.loadingPoems = false;
    } catch(err) {
      console.log('ERROR FETCHNG POEMS', err);
    }
  },
  computed: {
    //use this method to know which route name is currently on
    type () {
      return this.$route.name[0].toUpperCase() + this.$route.name.slice(1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
</style>
