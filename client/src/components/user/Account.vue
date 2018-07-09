<template> 
  <div class="container"> 
    <section class="user">   
      <form>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Account</label>
          </div>
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

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Member Since:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input class="input is-primary" type="text" placeholder="Username" :value="$store.state.user.createdAt"readonly>
                <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                </span>
              </p>
            </div>
          </div>
        </div>

       

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Bio</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea class="textarea is-primary" placeholder="A brief bio"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <!-- Left empty for spacing -->
          </div>
          <div class="field-body">
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
     
    }
  },
  mounted(){
    
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
