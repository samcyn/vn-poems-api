<template>
  <section>
    <div class="container">
      <card :cardWidth="cardDetails.cardWidth" :iconClassName="cardDetails.iconName" :headerTitle="cardDetails.title">
        <p class="help is-danger" v-if="error === 2">This {{ email }} account is currently locked.</p>
        <!-- this replaces slot in the card components -->
        <form v-on:submit.prevent="login">
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="email" placeholder="Email input" v-model="email" @keyup="removeErrorMessage">
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="error === 0">Email account not found or provided.</p>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input is-primary" type="password" placeholder="Password input" v-model="password" @keyup="removeErrorMessage">
              <span class="icon is-small is-left">
                <i class="fa fa-lock"></i>
              </span>
            </div>
            <p class="help is-danger" v-if="error === 1">Email/password mismatch.</p>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary"  v-bind:class="{'is-loading': isLoading }">Submit</button>
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
  name: 'login',
  components: {
    Card
  },
  data () {
    return {
      cardDetails: {
        title: 'Login',
        cardWidth: '400px',
        iconName: 'icon-lock'
      },
      email: '',
      password: '',
      error: null,
      isLoading: false
    }
  },
  methods: {
    async login () {
      // show loader
      this.isLoading = true;
      try{
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        this.$store.dispatch('setToken', response.data.user.tokens[response.data.user.tokens.length - 1].token);
        this.$store.dispatch('setUser', response.data.user);
        // redirect to home
        this.$router.push({
          name: 'home'
        });
        // hide loader
        this.isLoading = false;
      }
      catch(err){
        this.error = err.response.data.message;
        this.isLoading = false;
        console.log('error message', err.response.data.message);
      }
    },
    removeErrorMessage () {
      this.error = null;
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
