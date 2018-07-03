<template>
  <form v-on:submit.prevent="register">
    <div class="field">
      <label class="label">Username</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Email input" v-model="username">
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <p class="help is-danger">This email is invalid</p>
    </div>
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="email" placeholder="Email input" v-model="email">
        <span class="icon is-small is-left">
          <i class="fa fa-envelope"></i>
        </span>
      </div>
      <p class="help is-danger">This email is invalid</p>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="password" placeholder="Password input" v-model="password">
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </div>
      <p class="help is-danger">This password is invalid</p>
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
  name: 'register',
  data () {
    return {
      username:'',
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async register () {
      try{
        const response = await AuthenticationService.register({
          username: this.username,
          email: this.email,
          password: this.password
        });
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
