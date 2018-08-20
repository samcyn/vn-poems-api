<template>
  <section>
    <div class="container">
     
      <card :cardWidth="cardDetails.cardWidth" :iconClassName="cardDetails.iconName" :headerTitle="cardDetails.title">
        <p class="help is-danger" v-if="error.code === 2">{{error.message}}</p>
        <form v-on:submit.prevent="register">
          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="text" placeholder="Username" v-model="username" @keyup="removeErrorMessage">
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="error.code === 3">Username taken</p>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="email" placeholder="Email" v-model="email" @keyup="removeErrorMessage">
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="error.code === 0">{{error.message}}</p>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="password" placeholder="Password" v-model="password" @keyup="removeErrorMessage">
              <span class="icon is-small is-left">
                <i class="fa fa-lock"></i>
              </span>
            </div>
             <p class="help is-danger" v-if="error.code === 1" v-html="error.message"></p>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" v-bind:class="{'is-loading': isLoading }">Submit</button>
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
      error: {
        code: null
      },
      isLoading: false
    }
  },
  methods: {
    async register () {
      // show loader
      this.isLoading = true;
      try{
        await AuthenticationService.register({
          username: this.username,
          email: this.email,
          password: this.password
        });
        //login after registration
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        this.$store.dispatch('setToken', response.data.user.tokens[response.data.user.tokens.length - 1].token);
        this.$store.dispatch('setUser', response.data.user);
        this.$router.push({
          name: 'home'
        });
        // hide loader
        this.isLoading = false;
      }
      catch(err){
        this.error = err.response.data;
         // hide loader
        this.isLoading = false;
        console.log('error message', this.error);
      }
    },
    removeErrorMessage () {
      this.error.code = null;
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
