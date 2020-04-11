import Vue from 'vue'
import Vuex from 'vuex'
import constants from '@/constants'

import AccesspointsService from '@/services/accesspoints'
import LocationsService from '@/services/locations'
import SitesService from '@/services/sites'
import GatewaysService from '@/services/gateways'

Vue.use(Vuex)

export default ({
  namespaced: true,
  state: {
    loading: false,
    waiting: false,
    sites: [],
    site: {},
    accesspoints: [],
    accesspoint: {},
    locations: [],
    location: {},
    gateways: [],
    gateway: {},
    device: {},
    commands: {},
  },
  getters: {
    loading: state => state.loading,
    waiting: state => state.waiting,
    site: state => state.site,
    sites: state => state.sites,
    accesspoints: state => state.accesspoints,
    accesspoint: state => state.accesspoint,
    checkedAccesspoints: state => state.accesspoints.filter(ap => ap.checked),
    locations: state => state.locations,
    location: state => state.location,
    checkedLocations: state => state.locations.filter(l => l.checked),
    gateways: state => state.gateways,
    gateway: state => state.gateway,
    checkedGateways: state => state.gateways.filter(gw => gw.checked),
    device: state=> state.device,
    commands: state=>state.commands,
  },
  mutations:{
    currentDevice(state,d){
      state.device=d
    },
    loading(state, is){
      state.loading = is;
    },
    waiting(state,is){
      state.waiting = is;
    },
    commands(state, cmds){
      state.commands = cmds;
    },
    site(state,s){
      state.site = s
    },
    reset(state){
      let s ={
        loading: false,
        waiting: false,
        sites: [],
        site: {},
        accesspoints: [],
        accesspoint: {},
        locations: [],
        location: {},
        gateways: [],
        gateway: {},
        device: {},
        commands: {},
      }
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions:{
    async listSites({ dispatch, commit }) {
      try {
        commit('loading', true)
        commit('sites', [])
        let sites = await SitesService.list()
        commit('sites', sites)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/listSites' }, { root: true })
        }
      } finally {
        commit('loading', false)
      }
    },
    async getSite({ dispatch, commit }, siteid) {
      try {
        commit('loading', true)
        let site = await SitesService.site(siteid)
        commit('site', site)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/getSite', args: siteid }, { root: true })
        } else {
          await dispatch('error', e, { root: true })
        }
      } finally {
        commit('loading', false)
      }
    },
    async listAccesspoints({ dispatch, commit }, { siteid }) {
      try {
        commit('loading', true)
        let accesspoints = await AccesspointsService.list(siteid)
        commit('accesspoints', accesspoints)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/listAccesspoints', args: { siteid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async getAccesspoint({ dispatch, commit }, {id }) {
      try {
        commit('loading', true)
        let ap = await AccesspointsService.get(id)
        commit('accesspoint', ap)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/getAccesspoint', args: { id } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async restartAccesspoint({ dispatch, commit }, {id }) {
      try {
        commit('loading', true)
        let ap = await AccesspointsService.restart(id)
        commit('accesspoint', ap)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/restartAccesspoint', args: { id } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async listLocations({ dispatch, commit }, { siteid }) {
      try {
        commit('loading', true)
        let locations = await SitesService.locations(siteid)
        commit('locations', locations)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/listLocations', args: { siteid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async getLocation({ dispatch, commit }, { id }) {
      try {
        commit('loading', true)
        let location = await LocationsService.get(id)
        commit('location', location)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/getLocation', args: { id } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async listGateways({ dispatch, commit }, { siteid }) {
      try {
        commit('loading', true)
        let gateways = await GatewaysService.list(siteid)
        commit('gateways', gateways)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/listGateways', args: { siteid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async getGateway({ dispatch, commit }, { id }) {
      try {
        commit('loading', true)
        let gateway = await GatewaysService.get(id)
        commit('gateway', gateway)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/getGateway', args: { id } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loading', false)
      }
    },
    async restartGateway({ dispatch, commit }, { id }) {
      try {
        commit('waiting', true)
        let gateway = await GatewaysService.restart(id)
        commit('gateway', gateway)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/restartGateway', args: { id } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('waiting', false)
      }
    },

    async search({dispatch, commit}, rawid){
      if(!rawid){
        return
      }
      let id = rawid.replace(/:/g,'')
      commit('loading', true)
      try {
        if(id.indexOf("$101") > -1){
          //gatewway
          let gateway = await GatewaysService.get(id)
          if(gateway && gateway.siteId){
            await dispatch('getSite', gateway.siteId);
          }
          commit('currentDevice', gateway)
        }else if(id.indexOf("$301") > -1 || id.indexOf("c00") > -1){
          //access point
          let ap = await AccesspointsService.get(id)
          if(ap && ap.siteId){
            await dispatch('getSite', ap.siteId);
          }
          commit('currentDevice', ap)
        }else{
          //tag or location which either call works
          let tl = await LocationsService.get(id);
          if(tl && tl.siteId){
            await dispatch('getSite', tl.siteId);
          }
          commit('currentDevice',tl)
        }
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/search', args: rawid }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      }finally{
        commit('loading', false)
      }
      
    },
    async restart({dispatch, commit}, device){
      if(!device || !device.id){
        return
      }
      commit('waiting', true)
      try {
        if(device.type == 'gateway'){
          let results = await GatewaysService.restart(device)
          commit('commands', results)
        }else if(device.type == 'accesspoint'){
          let results = await AccesspointsService.restart(device)
          commit('commands', results)
        }
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'devices/restart', args: device }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      }finally{
        commit('waiting', false)
      }
      
    }

  }
})