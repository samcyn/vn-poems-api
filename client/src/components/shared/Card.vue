<template>
  <div class="card" v-bind:style="{ maxWidth: cardWidth }">
    <div class="card-header has-background-primary">
      <p class="card-header-title has-text-white">
        {{ headerTitle }}
      </p>
      <a href="#" class="card-header-icon has-text-white" aria-label="more options">
        <span class="icon">
          <i v-bind:class="iconClassName" aria-hidden="true"></i>
        </span>
      </a>
    </div>
    <!-- when loader shows up the initial height seems too small, to fix this set the minheight to 100px or more -->
    <div class="card-content" v-bind:style="{ minHeight: isLoading ? '100px' : 'initial' }">
      <!-- card content enter here -->
      <slot>CARD CONTENT</slot>
    </div>
    <!-- optional footer -->
    <slot name="footer"></slot>
  </div>
</template>

<script>


export default {
  name: 'card',
  props:{
    headerTitle: { default: 'Card Header' },
    iconClassName: { default: 'fa fa-user' },
    cardWidth: { default: '400px'},
    isLoading: { default: false }
  },
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    margin: 0 auto;
  }

  .card {
    border-radius: 0;
    /*-webkit-box-shadow: 0px 0px 79px -6px rgba(0,209,178,1);
    -moz-box-shadow: 0px 0px 79px -6px rgba(0,209,178,1);
    box-shadow: 0px 0px 79px -6px rgba(0,209,178,1);*/
    -webkit-box-shadow: 0px 0px 79px 6px rgba(0,209,178,0.2);
    -moz-box-shadow: 0px 0px 79px 6px rgba(0,209,178,0.2);
    box-shadow: 0px 0px 79px 6px rgba(0,209,178,0.2);
  }

  .card-content{
    position: relative;
  }

</style>
