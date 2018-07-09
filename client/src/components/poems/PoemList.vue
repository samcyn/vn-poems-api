<template>     
  <card :cardWidth="cardWidth" :iconClassName="iconValue" :headerTitle="type" :isLoading="isLoading">
    <div class="panel" v-if="docs">
      <!-- poem item -->
      <poem-item v-for="doc in docs" :key="doc._id" :doc="doc" :routeValue="routeValue"/>
    </div>
    <!-- show coming soon for documents and collections -->
    <div v-if="!docs" class="has-text-centered">
      <p>Comming Soon</p>
    </div>

    <!-- footer slot -->
    <footer class="card-footer" slot="footer" v-if="docs && !isLoading && hasFooter">
      <router-link :to="{ name: routesValue }" class="card-footer-item has-text-primary">View All</router-link>
    </footer>

    <!-- show loader once poems/docs/collections are loading -->
    <Loader v-if="!docs && isLoading" :size="'40px'"/>
  </card>

</template>

<script>
import Card from '../shared/Card';
import Loader from '../shared/Loader';
import PoemItem from './PoemItem';

export default {
  name: 'PoemList',
  props: {
    docs: { default: null },
    type: { default: 'poems', required: true },
    isLoading: { default: false },
    hasFooter: { default: true }
  },
  components: {
    Card, PoemItem, Loader
  },
  data () {
    return {
      cardWidth: '100%'
    }
  },
  created (){
  },
  computed: {
    iconValue (){
      if(this.type.toLowerCase() === 'poems') {
        return 'icon-book-open';
      }
      else if (this.type.toLowerCase() === 'documents') {
        return 'icon-doc';
      }
      else if (this.type.toLowerCase() === 'collections') {
        return 'icon-docs';
      }
    },
    //a reevaluated value to help with routing to poems, pome, documents and so on
    routesValue () {
      return this.type.toLowerCase();
    },
    //note this is singular
    routeValue() {
      return this.type.toLowerCase().slice(0, this.type.length - 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
</style>
