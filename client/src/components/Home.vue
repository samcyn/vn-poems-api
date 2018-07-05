<template>
  <div class="sections">
    <!-- group sections containing bind by container -->
    <div class="container">

      <section class="intro">
        <div class="hero is-primary">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">VoicesNet News</h1>
              <h2 class="subtitle">Substitle</h2>
            </div>
          </div>
        </div>
      </section>

      <section class="docs">
        <!-- GRID -->
        <div class="columns">
          <!-- POEMS -->
          <div class="column">
            <poem-list :type="'Poems'" :docs="poems" :isLoading="loadingPoems"/>
          </div>
          <!-- DOCUMENTS -->
          <div class="column">
            <poem-list :type="'Documents'" />
          </div>
          <!-- COLLECTIONS -->
          <div class="column">
            <poem-list :type="'Collections'"/>
          </div>

        </div>
      </section>
    </div>
    <!-- a section not bind by container influence -->
    <section class="has-background-primary">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Documents</p>
            <p class="title has-text-white">3346</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Collections</p>
            <p class="title has-text-white">3346</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Poems</p>
            <p class="title has-text-white">3346</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Users</p>
            <p class="title has-text-white">3346</p>
          </div>
        </div>
      </nav>
    </section>

    <!-- group sections containing bind by container -->
    <div class="container">
      <section>
        <div class="has-text-centered">
          <h3>EXTRAS</h3>
        </div>
        <br><br>
        <div class="tabs is-centered">
          <ul>
            <li class="is-active">
              <a>PHOTOS</a>
            </li>
            <li>
              <a>EVENTS</a>
            </li>
            <li>
              <a>CONTESTS</a>
            </li>
          </ul>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
import PoemsService from '@/services/PoemsService';
import PoemList from './poems/PoemList';

export default {
  name: 'Home',
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tabs li.is-active a {
    border-bottom-color: #00d1b2 !important;
    color: #00d1b2 !important;
  }
  
</style>
