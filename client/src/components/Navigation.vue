<template>
  <header>
    <nav class="navbar is-primary">
      <div class="navbar-brand">
        <router-link :to="{ name: 'home' }" class="navbar-item">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
        </router-link>
        
        <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" class="navbar-menu">
        <div class="navbar-start">
          <router-link :to="{ name: 'home' }" class="navbar-item">Home</router-link>
          <router-link :to="{ name: 'account' }" class="navbar-item" v-if="isUserLoggedIn">Account</router-link>          
          <router-link :to="{ name: 'addPoem' }" class="navbar-item" v-if="isUserLoggedIn">Add Doc</router-link>
        </div>

        <div class="navbar-end">
          <router-link :to="{ name: 'login' }" class="navbar-item" v-if="!isUserLoggedIn">Sign In</router-link>
          <router-link :to="{ name: 'register' }" class="navbar-item" v-if="!isUserLoggedIn">Sign Up</router-link>

          <div class="navbar-item" v-if="isUserLoggedIn">
            <div class="field is-grouped">
              <p class="control">
                <button class="button is-primary" href="#" v-on:click="logOut">
                  <span class="icon">
                    <i class="fa fa-user"></i>
                  </span>
                  <span>Log Out</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import AuthenticationService from '@/services/AuthenticationService';

export default {
  name: 'Navigation',
  data () {
    return {
    }
  },
  methods: {
    async logOut () {
      try {
        //authentication needed here...
        const token = this.$store.state.token;
        const response = await AuthenticationService.logOut(token);
        this.$store.dispatch('setToken', null);
        this.$store.dispatch('setUser', null);
        //TODO redirect to home page
        this.$router.push({
          name: 'home'
        });
      } catch(e){
        console.log(e);
      }
    }
  },
  computed : {
    ...mapState([
      'isUserLoggedIn'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
