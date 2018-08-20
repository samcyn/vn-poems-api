<template> 
  <div class="container"> 
    <section class="user">   
      <form v-on:submit.prevent="postDoc">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input class="input is-primary" type="text" placeholder="Doc Title" v-model="title">
          </div>
        </div>

        <div class="field">
          <label class="label">Content</label>
          <div class="control">
            <textarea class="textarea is-primary" placeholder="Doc Content" v-model="content" rows="16"></textarea>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary"  v-bind:class="{'is-loading': isLoading }">Post Doc</button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script>

import PoemsService from '@/services/PoemsService';

export default {
  name: 'AddPoem',
  components: {
   
  },
  data () {
    return {
      title: '',
      content: '',
      isLoading: false
    }
  },
  mounted(){
    
  },
  methods: {
    async postDoc () {
      this.isLoading = true;
      const token = this.$store.state.token;
      try {
        const response = await PoemsService.post({
          title: this.title,
          message: this.content
        }, token);
        this.title = '';
        this.content = '';
        this.isLoading = false;
      }
      catch (err) {
        console.log({err});
        this.isLoading = false;
      } 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user{
    margin: 0 auto;
    max-width: 900px;

  }
</style>
