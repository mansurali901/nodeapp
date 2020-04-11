<template>
  <div id="forgot">
      <div class="logo-header">
        <img src="../assets/logo_white.png">
        <div>ADMIN</div>
      </div>
      <div class="box">
        <ul v-if="errors.length > 0" class="login-error">
          <li v-for="item in errors" :key="item.key" class="help is-warning">
            *{{item.msg}}
          </li>
        </ul>
      <form v-if="!resetLinkSent" @submit="formHandler">
        <div class="info-message">
          To reset your password, enter your email used to login
        </div>
        <div class="field">
          <div class="control">
            <input name="email" class="input" type="text" v-model.lazy="email" placeholder="Email"/>
          </div>
        </div>
        <ul v-if="authError">
          <li class="help is-danger">{{authError.detail}}</li>
        </ul>
        <div class="field">
          <div class="controls">
            <div class="link">
              <router-link to="/login">Login</router-link>
            </div>
            <button :class="btnClass">Reset Password</button>
          </div>
        </div>
      </form>
      <div v-if="resetLinkSent">
        <div class="info-message">
          An email has been sent with instructions to reset your password
        </div>
        <div class="back">
          <router-link to="/login">Back to Login</router-link>
        </div>
      </div>
    </div>  
  </div>

</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  data:function(){
    return {
      email: '',
      errors: []
    }
  },
  computed: mapState({
    authenticating: state=>state.authenticating || false,
    authError: state=>state.error,
    resetLinkSent: state=>state.resetLinkSent || false,
    btnClass: state=>{
        let cls = 'button is-link';
        if(state.authenticating){
          cls = cls.concat(' is-loading')
        }
        return cls
      }
  }),
  components: {
  },
  mounted: function() {
    this.updateResetLinkSent(false);
  },
  methods:{
    formHandler:function(e){
      e.preventDefault()
      e.stopPropagation()
      let errors = []
      let u = this.$data.email;
      if(!u){
        errors.push({key: 'email', msg: 'Email is required'})
      }
      if(!errors.length){
        this.forgotPassword({email: u})
      }
      this.$data.errors = errors;
      
    },
    ...mapActions(['forgotPassword']),
    ...mapMutations(['updateResetLinkSent'])
  }
}
</script>

<style lang="scss" scoped>

  #forgot {
    height: 100vh;
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background-color: $light-dark-blue;
    img{
      height: 100px;
    }
    .logo-header{
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-bottom: 20px;
      div{
        color:$orange;
        align-self: flex-end;
        font-size:1.2em;
      }
    }
    .box{
      background-color: $dark-blue;
      color: $white;
      width: 25vh;
      min-width: 305px;
      display: flex;
      flex-flow: column;
      justify-content: center;
    }
    form{
      flex: 1;
      padding: 0;
      margin:20px;
    }
    .info-message{
      padding-bottom: 20px
    }
    .login-error{
      margin-left: 20px;
    }
    .back{
      display: flex;
      justify-content: center;
    }
    .controls{
      display: flex;
      justify-content: space-between;
      .link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.8em;
      }
    }
  }
</style>
