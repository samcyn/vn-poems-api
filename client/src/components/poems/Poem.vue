<template>     
  <div class="container">
    <section class="docs">
      <article class="message is-primary">
        <div class="message-header">
          <p>{{ poem.title }}</p>
          <i class="icon-book-open"></i>
        </div>
        <div class="message-body">
          {{ poem.message }}
          <Loader v-if="loadingPoem"/>
        </div>
      </article>
      <br/><br/>
      <!-- Add Comments -->
      <card :headerTitle="'Add Comment'" :cardWidth="cardWidth" :iconClassName="'icon-book-open'">
        <add-comments :poemId="poem._id"/>
      </card>
      <br/><br/>
      <!-- commentList -->
      <card :headerTitle="'Comments'" :cardWidth="cardWidth" :iconClassName="'icon-bubbles'">
        <comments :comments="poem._comments" :poemId="poem._id"  :depth="0" :depthSize="3"/>
      </card>
    </section>
  </div>
</template>

<script>
import PoemsService from '@/services/PoemsService';
import Loader from '../shared/Loader';
import AddComments from '../comments/AddComments';
import Comments from '../comments/Comments';
import Card from '../shared/Card';

export default {
  name: 'Poem',
  components: {
    Loader, AddComments, Comments, Card
  },
  data () {
    return {
      poem: {},
      loadingPoem: false,
      cardWidth: '100%'
    }
  },
  async mounted(){
    this.loadingPoem = true;
    try {
      const response = await PoemsService.getOne(this.$store.state.route.params.docId);
      this.poem = response.data.poem;
      this.loadingPoem = false;
      //console.log(this.poem._comments);
    } catch(err) {
      //console.log('ERROR FETCHNG POEMS', err);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .docs{
    margin: 0 auto;
    max-width: 900px;

  }
  .message-body {
    position: relative;
    min-height: 100px;
  }
</style>
