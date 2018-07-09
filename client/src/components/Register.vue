<template>
  <section>
    <div class="container">
      <card :cardWidth="cardDetails.cardWidth" :iconClassName="cardDetails.iconName" :headerTitle="cardDetails.title">
        <form v-on:submit.prevent="register">
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="text" placeholder="Username" v-model="username">
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <p class="help is-danger">This email is invalid</p>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="email" placeholder="Email" v-model="email">
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
            </div>
            <p class="help is-danger">This email is invalid</p>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="password" placeholder="Password" v-model="password">
              <span class="icon is-small is-left">
                <i class="fa fa-lock"></i>
              </span>
            </div>
            <p class="help is-danger">This password is invalid</p>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary">Submit</button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </section>
</template>

<script>

import AuthenticationService from '@/services/AuthenticationService';
import Card from './shared/Card';

export default {
  name: 'register',
  components: {
    Card
  },
  data () {
    return {
      cardDetails: {
        title: 'Register',
        cardWidth: '400px',
        iconName: 'icon-lock'
      },
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
  .card {
    margin: 0 auto;
    max-width: 400px;
  }
</style>
