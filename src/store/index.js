import Vue from 'vue'
import Vuex from 'vuex'

import UsersService from '@/services/users'
import InactivityService from '@/services/inactivity'

import orgs from './orgs'
import setup from './setup'
import devices from './devices'

import {tokenInfo, isTokenTimeValid} from '@/utils'
import constants from '@/constants'
import router from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({

  modules: {
    orgs,
    setup,
    devices,
  },
  state: {
    error: {},
    user: false,
    token: tokenInfo(),
    authenticating: false,
    resetLinkSent: false,
    inactivityWatchEnabled: false
  },
  getters:{
    tokenValid: state =>{
      let good = (24 - state.token.expires_in /(1000 * 60 * 60))
      return (good > 0.1)
    }
  },
  mutations: {
    reset(state){
      state = {
        error: {}
      }
    },
    currentUser(state, user){
      state.user = user
    },
    authenticated(state, tokenInfo){
      state.token = tokenInfo
      router.push('/')
    },
    authenticating(state, doingit){
      state.authenticating = doingit;
    },
    loggedout(state){
      state.token = null;
      router.push('/login')
    },
    error(state, error){
      state.error = error
    },
    clearError(state){
      state.error = {}
    },
    goLogin(state){
      state.token = null
      state.user = null
      router.push('/login');
    },
    selectAll(state, obj){
      let data = obj.namespace ? state[obj.namespace][obj.type] : state[obj.type]
      data.forEach(s=>Vue.set(s, 'checked',obj.checked))
    },
    select(state, obj){
      let data = obj.namespace ? state[obj.namespace][obj.type] : state[obj.type];
      let id = obj.data.id
      let single = obj.single
      data.forEach(s=>{
        // CHECKS ON ID SO WONT ALWAYS WORK DEPENDING ON OBJECT STRUCTURE YA DINGUS!
        if(s.id == id){
          Vue.set(s,'checked',obj.checked)
        }else if(single){
          Vue.set(s,'checked',false)
        }
      })
    },
    updateResetLinkSent(state, value) {
      state.resetLinkSent = value;
    },
    changeInactivityWatchState(state, value) {
      state.inactivityWatchEnabled = value;
    },
  },
  actions: {
    async checkLogin({state, dispatch}){
      const token = state.token;
      if(token && token.access_token) {
        dispatch('refreshToken');
      }
    },
    async authenticate({dispatch, commit},creds){
      commit('authenticating', true);
      commit('clearError');
      try{
        let token = await UsersService.authenticate(creds.email, creds.password);
        commit('authenticated', token);
        dispatch('startInactivityWatch');
      }catch(e){
        const error = { detail: constants.INVALID_AUTH };
        commit('error', error);
      }finally{
        commit('authenticating', false);
      }
    },
    async forgotPassword(context,payload){
      context.commit('authenticating', true);
      context.commit('clearError');
      try{
        await UsersService.forgotPassword(payload.email);
        context.commit('updateResetLinkSent', true);
      } catch(e) {
        let error;
        if (typeof e === 'string') {
          error = { detail: e };
        } else {
          error = { detail: constants.UNKNOWN_ERROR };
        }
        context.commit('error', error);
      } finally {
        context.commit('authenticating', false);
      }
    },
    async refreshToken({dispatch, commit}, nextaction){
      try{
        await UsersService.refreshToken();
        dispatch('startInactivityWatch');
        if (nextaction) {
          await dispatch(nextaction.a, nextaction.args);
        }
        // Check if the current route is login, if yes then on successful refresh redirect to home
        if (router.currentRoute.name === 'login') {
          router.push('/');
        }
      }catch(e){
        if(e === constants.NEED_LOGIN){
          dispatch('logout');
        }else{
          commit('error', e);
        }
      }
    },
    async logout({commit, dispatch}){
      dispatch('stopInactivityWatch');
      UsersService.logout();
      commit('loggedout');
    },
    async error({commit}, e){
      commit('error', e)
    },
    async clearError({commit}){
      commit('clearError')
    },
    async startInactivityWatch({dispatch, commit}) {
      InactivityService.start(() => {
        dispatch('logout');
      });
      commit('changeInactivityWatchState', true);
    },
    async stopInactivityWatch({commit}) {
      InactivityService.stop();
      commit('changeInactivityWatchState', false);
    }
  }
})

export default store;
