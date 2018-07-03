<template>
  <form v-on:submit.prevent="login">
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="email" placeholder="Email input" v-model="email">
        <span class="icon is-small is-left">
          <i class="fa fa-envelope"></i>
        </span>
      </div>
      
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="password" placeholder="Password input" v-model="password">
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </div>
      
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-info">Submit</button>
      </div>
    </div>
  </form>
</template>

<script>

import AuthenticationService from '@/services/AuthenticationService';

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try{
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        console.log(response);
        this.$store.dispatch('setToken', response.data.user.tokens[response.data.user.tokens.length - 1].token);
        this.$store.dispatch('setUser', response.data.user);
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
