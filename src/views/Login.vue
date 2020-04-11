<template>
  <div id="login">
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
      <form @submit="formHandler">
      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input name="email" class="input" type="text" v-model.lazy="email" placeholder="Email"/>
        </div>
      </div>
      <div class="field">
        <label class="label" for="password">Password</label>
        <div class="control">
          <input name="password" class="input" type="password" v-model.lazy="password" placeholder="Password"/>
        </div>
      </div>
      <ul v-if="authError">
        <li class="help is-danger">{{authError.detail}}</li>
      </ul>
      <div class="field">
        <div class="controls">
          <div class="link">
            <router-link to="/forgot">Reset Password</router-link>
          </div>
            <button :class="btnClass">Login</button>
        </div>
      </div>
    </form>
    </div>  
  </div>

</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data:function(){
    return {
      email: '',
      password: '',
      errors: []
    }
  },
  computed: mapState({
    authenticating: state=>state.authenticating || false,
    authError: state=>state.error,
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
  methods:{
    formHandler:function(e){
      e.preventDefault()
      e.stopPropagation()
      let errors = []
      let u = this.$data.email;
      if(!u){
        errors.push({key: 'email', msg: 'Email is required'})
      }
      let p = this.$data.password; 
      if(!p){
        errors.push({key: 'password', msg: 'Password is required'})
      }
      if(errors.length === 0){
        this.authenticate({email: u, password: p})
      }
      this.$data.errors = errors;
      
    },
    ...mapActions(['authenticate'])
  }
}
</script>

<style lang="scss" scoped>

  #login {
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
    label{
      color: $white;
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
    .login-error{
      margin-left: 20px;
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
