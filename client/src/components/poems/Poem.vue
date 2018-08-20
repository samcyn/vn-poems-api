<template>     
  <div class="container">
    <section class="docs">
      
      <card :headerTitle="poem.title" :cardWidth="cardWidth" :iconClassName="'icon-book-open'">
        <div class="content">
          {{ poem.message }}
          <Loader v-if="loadingPoem"/>
        </div>
        <div class="votes">
          <a class="votes__upvote is-block has-text-primary" @click="upVote(poem)">
            <i class="icon-arrow-up"></i>
          </a>
          <div class="votes__amount">
            <span class="has-text-primary">{{ votes }}</span>
          </div>
          <a class="votes__downvote is-block has-text-primary" @click="downVote(poem)">
            <i class="icon-arrow-down"></i>
          </a>
        </div>
        <footer class="card-footer" slot="footer">
          <a href="#" class="card-footer-item has-text-primary">
            Edit
          </a>
          <a href="#" class="card-footer-item has-text-primary">
            Delete
          </a>
        </footer>
      </card>
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

import votesService from '@/services/votesService';


export default {
  name: 'Poem',
  components: {
    Loader, AddComments, Comments, Card
  },
  data () {
    return {
      poem: {},
      loadingPoem: false,
      cardWidth: '100%',
      votes: 0
    }
  },
  async mounted() {
    this.loadingPoem = true;
    try {
      const response = await PoemsService.getOne(this.$store.state.route.params.docId);
      this.poem = response.data.poem;
      this.votes = response.data.poem.voteScore;      
      this.loadingPoem = false;
      //console.log(this.poem._comments);
    } catch(err) {
      //console.log('ERROR FETCHNG POEMS', err);
    }
  },
  methods: {
    async upVote (poem) {
      try {
        const poemId = poem._id;
        const token = this.$store.state.token;   
        const response = await votesService.upVote(poemId, token);
        this.votes = response.data.poem.voteScore;
      } catch (err) {
        console.log('ERROR Upvoting', err.response.data.message);
      }
    },
    async downVote (poem) {
      try {
        const poemId = poem._id;
        const token = this.$store.state.token;   
        const response = await votesService.downVote(poemId, token);
        this.votes = response.data.poem.voteScore;
      } catch (err) {
        console.log('ERROR Upvoting', err.response.data.message);
      }
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
  .content {
    position: relative;
    min-height: 100px;
  }

  .votes {
    width: 100px;
    /* background: red; */
    text-align: center;
    font-weight: bold;
    position: absolute;
    top: -48px;
    left: -100px;
  }
</style>
