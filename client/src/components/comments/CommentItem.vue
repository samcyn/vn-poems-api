<template>
  <div>
    <article class="media" v-for="comment in comments">
      <figure class="media-left">
        <p class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/128x128.png">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ comment._creator.username }}</strong>
            <br>
              {{ comment.message }}
            <br>
            <small><a>Like</a> · <a>Reply</a> · {{ comment.createdAt }}</small>
          </p>
        </div>
        
        <comments :comments="comment._comments"/>

      </div>
    </article>
  </div>
</template>

<script>
//import Comments from './Comments';

export default {
  name: 'CommentItem',
  components: {
   // Comments
  },
  props: {
    comments: { default: null, required: true }
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
