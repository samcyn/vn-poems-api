<template> 
  <div class="container"> 
    <section class="user">   
      <form>
        <div class="columns is-desktop is-multiline">

          <div class="column is-12-mobile is-4-tablet is-3-desktop">
            
            <div class="field">
              <div class="">
                <label class="file-label" @change="handleChangle($event)">
                  <input class="file-input" type="file" name="profile">
                  <img :src="img">
                </label>
              </div>
            </div>

          </div>

          <div class="column is-12-mobile is-8-tablet is-9-desktop">

           

            <div class="field">
              
              <label class="label">Account</label>
              <div class="field-body">

                <div class="field">
                  <p class="control is-expanded has-icons-left">
                    <input class="input is-primary" type="text" placeholder="Username" :value="$store.state.user.username" readonly>
                    <span class="icon is-small is-left">
                      <i class="fa fa-user"></i>
                    </span>
                  </p>
                </div>

                <div class="field">
                  <p class="control is-expanded has-icons-left">
                    <input class="input is-success" type="email" placeholder="Email" :value="$store.state.user.email" readonly>
                    <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
                  </p>
                </div>

              </div>
            </div>

            <div class="field">
              <label class="label">Member Since:</label>
              <div class="control">
                <input class="input" type="text" placeholder="Username" :value="$store.state.user.createdAt">
              </div>
            </div>


            <div class="field">
              <label class="label">Bio</label>
              <div class="control">
                <textarea class="textarea is-primary" placeholder="A brief bio"></textarea>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary">
                    Save Profile
                </button>
              </div>
            </div>

          </div>

        </div>
      </form>
    </section>
  </div>
</template>

<script>


export default {
  name: 'Account',
  components: {
   
  },
  data () {
    return {
      img: 'https://bulma.io/images/placeholders/128x128.png'
    }
  },
  mounted(){
    
  },
  methods: {
    handleChangle (event) {
      console.log(event)
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

  .file-label img{
    min-height: 200px;
    width: 100%;
  }
</style>
