<template>     
  <div class="container">
    <section class="docs">
      <article class="message is-primary">
        <div class="message-header">
          <p>Primary</p>
          <i class="fa fa-user"></i>
        </div>
        <div class="message-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
          
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import PoemsService from '@/services/PoemsService';
import PoemList from './PoemList';

export default {
  name: 'Poem',
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
 
</style>
