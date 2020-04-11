import Vue from 'vue'
import Vuex from 'vuex'
import constants from '@/constants'

import OrgsService from '@/services/orgs'

Vue.use(Vuex)

export default ({
  namespaced: true,
  state: {
    org: {},
    orgAdmins: [],
    orgAdmin: {},
    orgs: [],
    orgsLoading: false,
    orgSites: []
  },
  getters: {
    org: state=>state.org,
    getOrg: (state) => (id) => {
      return state.orgs.find(thing => thing.id === id)
    },
    orgAdmins: state=>state.orgAdmins,
    orgAdmin: state=>state.orgAdmin,
    orgs: state=>state.orgs,
    loadingOrgs: state=>state.orgsLoading,
    orgSites: state=>state.orgSites
  },
  mutations: {
    reset(state) {
      state = {
        org: {},
        orgAdmins: [],
        orgAdmin: {},
        orgs: [],
        orgsLoading: false,
        orgsSites: []
      }
    },
    orgSites(state, sites) {
      state.orgSites = sites
    },
    orgs(state, orgs){
      state.orgs = orgs
    },
    org(state, neworg){
      state.org = neworg
      let have = false
      let orgs = [...state.orgs]
      for(let i = 0;i < orgs.length; i++){
        let s = orgs[i];
        if(s.id == neworg.id){
          have = true
          orgs[i] = Object.assign({}, s, neworg)
          break
        }
      }
      if(!have){
        state.orgs.push(neworg)
      }else{
        state.orgs = orgs
      }
    },
    orgAdmins(state, admins){
      state.orgAdmins = admins;
    },
    orgAdmin(state, admin){
      state.orgAdmin = admin
      let have = false
      let orgAdmins = [...state.orgAdmins]
      for(let i=0;i < orgAdmins.length; i++){
        let s = orgAdmins[i]
        if(s.userId == admin.userId){
          have = true
          orgAdmins[i] = Object.assign({}, s, admin)
          break
        }
        if(!have){
          state.orgs.push(admin)
        } else {
          state.orgAdmins = admins
        }
      }
    },
    currentOrgAdmin(state, admin){
      state.orgAdmin = admin;
    },
    resetNonFilteredOrgAdmin(state){
        state.nonFilteredOrgAdmins= null;
    },
    removeOrgAdmin(state, admin){
      let filtered = state.orgAdmins.filter(a =>a.email != admin.email)
      state.orgAdmins = filtered
    },
    removeNonFilteredOrgAdmin(state, admin){
      if(state.nonFilteredOrgAdmins){
        let filtered = state.nonFilteredOrgAdmins.filter(a =>a.email != admin.email)
        state.nonFilteredOrgAdmins = filtered
      }
    },
    deleteOrg(state,org){
      let ns = state.orgs.filter(s=>s.id!=org.id)
      state.orgs = ns
    },
    savingOrg(state,saved){
      state.savingOrg = saved
    },
    currentOrg(state, org){
      state.org = org
    },
    filteredOrgs(state, text){
      if(!state.nonFilteredOrgs){
        let pre = [...state.orgs];
        state.nonFilteredOrgs = pre;
      }
      let f = state.nonFilteredOrgs.filter(s=>{
        return (s.name.toLowerCase().search(text.toLowerCase()) > -1)
      })
      state.orgs = f;
    },
    filteredOrgAdmins(state, text){
      if(!state.nonFilteredOrgAdmins){
        let pre = [...state.orgAdmins];
        state.nonFilteredOrgAdmins = pre;
      }
      console.log(state.nonFilteredOrgAdmins)
      let f = state.nonFilteredOrgAdmins.filter(s=>{
        return (s.email.toLowerCase().search(text.toLowerCase()) > -1)
      })
      state.orgAdmins = f;      
    },
    filteredOrgSites(state, text){
      console.log(text)
      if(!state.nonFilteredOrgSites){
        let pre = [...state.orgSites];
        state.nonFilteredOrgSites = pre;
      }
      console.log(state.nonFilteredOrgSites)
      let f = state.nonFilteredOrgSites.filter(s=>{
        return (s.value.toLowerCase().search(text.toLowerCase()) > -1)
      })
      state.orgSites = f;
    },
    loadingOrgs(state, loading){
      state.orgsLoading = loading
    },
    selectOrg(state, obj){
      let data = state[obj.type]
      let id = obj.data.id
      let {single} = obj
      data.forEach(s=>{
        if(s.id == id){
          Vue.set(s, 'checked',obj.checked)
        }else if(single){
          Vue.set(s,'checked', false)
        }
      })
    },
    selectOrgAdmin(state, obj){
      let data = state[obj.type];
      let id = obj.data.userId
      let single = obj.single
      data.forEach(s=>{
        if(s.userId == id){
          Vue.set(s,'checked',obj.checked)
        }else if(single){
          Vue.set(s,'checked',false)
        }
      })
    }
  },
  actions: {
    clearOrg({ commit }) {
      commit('org', {})
    },
    async getOrg({dispatch, commit}, id){
      try {
        commit('loadingOrgs', true)
        commit('org', {})
        let org = await OrgsService.getOrg(id)
        commit('org', org)
      } catch(e) {
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/getOrg', args: id}, {root: true})
        }else{
          await dispatch('error', e, {root: true})
        }
      } finally {
        commit('loadingOrgs', false)
      }
    },
    // call api async
    async listOrgs({dispatch, commit}){
      try{
        commit('loadingOrgs', true)
        commit('orgs', [])
        let orgs = await OrgsService.list()
        commit('orgs', orgs)
      }catch(e){
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/listOrgs'}, {root: true})
        }else{
          await dispatch('error', e, {root: true})
        }
      }finally{
        commit('loadingOrgs', false)
      }
    },
    async searchOrgs({commit}, search){
      commit('filteredOrgs', search)
    },
    async searchOrgAdmins({commit}, search){
      commit('filteredOrgAdmins', search)
    },
    async searchOrgSites({commit}, search){
      commit('filteredOrgSites', search)
    },
    async addOrg({dispatch, commit}, org){
      try{
        commit('savingOrg', true)
        let s = await OrgsService.create(org)
        commit('org', s)
      }catch(e){
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/addOrg', args: org}, {root: true})
        }else{
          await dispatch('error', e, {root: true});
        }
      }finally{
        commit('savingOrg', false)
      }
    },
    async updateOrg({dispatch, commit}, org){
      try{
        commit('savingOrg', true)
        let s = await OrgsService.update(org)
        commit('org', s)
      }catch(e){
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/updateOrg', args: org}, {root: true})
        }else{
          await dispatch('error', e, {root: true});
        }
      }finally{
        commit('savingOrg', false)
      }
    },
    async deleteOrg({dispatch, commit}, org){
      try{
        commit('savingOrg', true)
        await OrgsService.remove(org)
        commit('deleteOrg', org)
      }catch(e){
        console.log(e)
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/deleteOrg', args: org}, {root: true})
        }else{
          await dispatch('error', e, {root: true});
        }
      }finally{
        commit('savingOrg', false)
      }
    },

    async listOrgSites({dispatch, commit}, id) {
      try{
        commit('orgSites', [])
        let sites = await OrgsService.listOrgSites(id)
        commit('orgSites', sites)
      }catch(e){
        console.log(e)
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/listOrgSites', args: id}, {root: true}) // need to understand more
        }else{
          await dispatch('error', e, {root: true});
        }     
      }
    },

    // Organization Super Admin service calls
    // Get a list of org admins for a specific organization id
    async listOrgAdmins({dispatch, commit}, id){
      try{
        commit('orgAdmins', [])
        let admins = await OrgsService.listOrgAdmins(id)
        commit('orgAdmins', admins)
      }catch(e){
        console.log(e)
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/listOrgAdmins', args: id}, {root: true}) // need to understand more
        }else{
          await dispatch('error', e, {root: true});
        }        
      }
    },
    // Add an org admin for a specific organization id
    async putOrgAdmin({dispatch, commit}, admin){
      try{
        dispatch('clearError', null, {root: true});
        await OrgsService.putOrgAdmin(admin);
        commit('resetNonFilteredOrgAdmin');
      }catch(e){
        console.log(e)
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/putOrgAdmin', args: admin}, {root: true})
        }else{
          await dispatch('error', e, {root: true});
        }
      }
    },
    // Add an org admin for a specific organization id
    async removeOrgAdmin({dispatch, commit}, admin){
      try{
        dispatch('clearError', null, {root: true});
        await OrgsService.removeOrgAdmin(admin)
        commit('removeOrgAdmin', admin);
        commit('removeNonFilteredOrgAdmin',admin);
      }catch(e){
        console.log(e)
        if(e === constants.NEED_AUTH){
          await dispatch('refreshToken', {a:'orgs/removeOrgAdmin', args: admin}, {root: true})
        }else{
          await dispatch('error', e, {root: true});
        }
      }
    }


  }
})
