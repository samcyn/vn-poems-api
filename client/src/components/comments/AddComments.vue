<template>     
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png">
      </p>
    </figure>
    <form class="media-content" v-on:submit.prevent="submitComment">
      <div class="field">
        <p class="control">
          <textarea class="textarea is-primary" placeholder="Add a comment..." v-model="message"></textarea>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="button is-primary">{{ submitText }}</button>
        </p>
      </div>
    </form>
  </article>
</template>

<script>
import CommentService from '@/services/CommentService';

export default {
  name: 'AddComment',
  props: {
    submitText: { default: 'Post Comment' },
    commentId: { type: String, default: null },
    poemId: { required: true }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async submitComment () {
      const token = this.$store.state.token;
      try{
        const response = await CommentService.post({
          poemId: this.poemId,
          commentId: this.commentId,
          message: this.message
        }, token);
        console.log(response);
      }
      catch(err){
        this.error = err.response.data.message;
        console.log('error message', err.response.data.message);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
