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
            <button class="button is-primary">Post Doc</button>
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
      content: ''
    }
  },
  mounted(){
    
  },
  methods: {
    async postDoc () {
      const token = this.$store.state.token;
      try {
         const response = await PoemsService.post({
          title: this.title,
          message: this.content
        }, token);
      }
      catch (err) {
        console.log(err);
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
