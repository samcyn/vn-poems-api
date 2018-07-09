<template>     
  <div>
    <article class="media" v-for="comment, index in comments" :key="comment._id">
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
            <small>
              <a class="has-text-primary" v-if="depth < depthSize">Like</a> · 
              <a class="has-text-primary" @click="toggleReply(comment._id)" v-if="depth < depthSize">
              {{ showReply ? 'Close' : 'Reply'}}</a> · 
              {{ comment.createdAt }}
            </small>
          </p>
        </div>
        <!-- reply comment -->
        <add-comments :submitText="'Reply'" :commentId="comment._id" :poemId="poemId" v-if="depth < depthSize" v-show="showReply"/>
        <!-- recursion happening -->
        <comments :comments="comment._comments" :poemId="poemId"  :depth=" depth + 1" v-if="depth < depthSize" :depthSize="depthSize"/>

      </div>
    </article>
  </div>
</template>

<script>

import AddComments from './AddComments';

export default {
  name: 'Comments',
  components: {
    AddComments
  },
  props: {
    comments: { required: true },
    poemId: { type: String },
    depth: { required: true },
    depthSize: { default: 2 }
  },
  data () {
    return {
      showChildren: false,
      showReply: false,
     
    }
  },
  methods: {
    toggleChildren() {
      this.showChildren = !this.showChildren;
    },
    toggleReply(arg) {
      this.showReply = !this.showReply;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
