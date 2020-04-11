import Vue from 'vue'
import Vuex from 'vuex'
import constants from '@/constants'

import AccesspointsService from '@/services/accesspoints'
import LocationsService from '@/services/locations'
import SitesService from '@/services/sites'
import ZoneService from '@/services/zones'
import GatewaysService from '@/services/gateways'
import AreasService from '@/services/areas'
import PlacesService from '@/services/places'
import StatusService from '@/services/status';

function pointFeature(g) {
  return {
    id: g.id,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: g.point
    },
    properties: {
      type: g.type,
      name: g.name,
      id: g.id
    }
  }
}
function generatePointJSON(data, filter) {
  let { prop, value } = filter || {}
  let gjson = [];
  data.forEach(g => {
    if (g.point) {
      if (prop && g[prop] == value) {
        gjson.push(pointFeature(g))
      } else if (!prop) {
        gjson.push(pointFeature(g))
      }
    }
  })
  return gjson
}

function exportCSV(filename, data) {
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style = 'display: none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

Vue.use(Vuex)

export default ({
  namespaced: true,
  state: {
    sitesLoading: false,
    siteLoading: false,
    statusLoading: false,
    beaconLoading: false,
    accessPointLoading: false,
    gatewayLoading: false,
    tagLoading: false,
    savingSite: false,
    sites: [],
    deviceStatus: [],
    beaconStatus: [],
    accessPointStatus: [],
    gatewayStatus: [],
    tagStatus: [],
    site: {},
    accesspoints: [],
    accesspoint: {},
    loadingLocations: false,
    savingLocations: false,
    locations: [],
    location: {},
    loadingZones: false,
    zoneLoading: false,
    savingZone: false,
    zone: {},
    zones: [],
    gateways: [],
    gateway: {},
    areasLoading: false,
    areaLoading: false,
    savingArea: false,
    area: {},
    areas: [],
    mapopts: {},
    gettingAddress: false,
    convertedAddress: {},
    loadingFile: false,
  },
  getters: {
    area: state => state.area,
    areas: state => state.areas,
    loadingAreas: state => state.areasLoading,
    statusLoading: state=> state.statusLoading,
    beaconLoading: state=> state.beaconLoading,
    accessPointLoading: state=> state.accessPointLoading,
    gatewayLoading: state=> state.gatewayLoading,
    tagLoading: state=> state.tagLoading,
    savingArea: state => state.savingArea,
    site: state => state.site,
    sites: state => state.sites,
    loadingSites: state => state.sitesLoading,
    accesspoints: state => state.accesspoints,
    accesspoint: state => state.accesspoint,
    checkedAccesspoints: state => state.accesspoints.filter(ap => ap.checked),
    locations: state => state.locations,
    location: state => state.location,
    checkedLocations: state => state.locations.filter(l => l.checked),
    loadingLocations: state => state.loadingLocations,
    savingLocations: state => state.savingLocations,
    showZoneModal: state => state.showZoneModal,
    zone: state => state.zone,
    zones: state => state.zones,
    loadingZones: state => state.loadingZones,
    checkedZones: state => state.zones.filter(z => z.checked),
    gateways: state => state.gateways,
    gateway: state => state.gateway,
    checkedGateways: state => state.gateways.filter(gw => gw.checked),
    mapopts: state => state.mapopts,
    gatewayStatus: state => state.gatewayStatus,
    tagStatus: state => state.tagStatus,
    beaconStatus: state => state.beaconStatus,
    accessPointStatus: state => state.accessPointStatus,
    deviceStatus: state => state.deviceStatus,
    convertedAddress: state => state.convertedAddress
  },
  mutations: {
    reset(state) {
      state = {
        accesspoints: [],
        accesspoint: {},
        sitesLoading: false,
        siteLoading: false,
        site: {},
        loadingLocations: false,
        savingLocations: false,
        locations: [],
        location: {},
        loadingZones: false,
        zoneLoading: false,
        savingZone: false,
        zone: {},
        zones: [],
        gateways: [],
        gateway: {},
        areasLoading: false,
        areaLoading: false,
        savingArea: false,
        area: {},
        areas: [],
        mapopts: {},
        gettingAddress: false,
        convertedAddress: {},
        loadingFile: false
      }
    },

    convertedAddress(state, data) { // need to determine where this lives
      let geo = data[0].geometry.location
      state.convertedAddress = geo
    },
    clearAddress(state) {
      state.convertAddress = {}
    },
    gettingAddress(state, loading) {
      state.gettingAddress = loading
    },
    loadingFile(state, loading) {
      state.loadingFile = loading
    },

    ///  AREAS

    areas(state, areas) {
      state.areas = areas
    },
    area(state, area) {
      state.area = area
      let newa = []
      let have = false
      state.areas.forEach(a => {
        if (a.id == area.id) {
          newa.push(area)
          have = true
        } else {
          newa.push(a)
        }
      })
      if (!have) {
        newa.push(area)
      }
      state.areas = newa
    },
    deletedArea(state, area) {
      state.area = {}
      let na = state.areas.filter(a => a.id != area.id)
      state.areas = na
    },
    currentArea(state, area) {
      state.area = area
    },
    loadingAreas(state, loading) {
      state.areasLoading = loading
    },
    loadingArea(state, loading) {
      state.areaLoading = loading
    },
    savingArea(state, saving) {
      state.savingArea = saving
    },

    ///  ACCESS POINTS

    accesspointDraggged(state, accesspoint) {
      console.log('dragged', accesspoint)
      state.accesspoints.forEach(ap => {
        if (ap.id == accesspoint.id) {
          Vue.set(ap, 'dragged', true)
        }
      })
    },
    accesspoints(state, accesspoints) {
      accesspoints.forEach(ap => {
        ap.id = ap.nodeAddress
      })
      state.accesspoints = accesspoints
    },
    currentAccesspoint(state, accesspoint) {
      let ap = { ...state.accesspoint }
      accesspoint.selected = ap.selected
      accesspoint.checked = ap.checked
      state.accesspoint = accesspoint
    },
    accesspoint(state, accesspoint) {
      state.accesspoint = accesspoint
      let haveit = false
      let newl = []
      state.accesspoints.forEach(ap => {
        if (ap.id == accesspoint.id) {
          accesspoint.selected = ap.selected
          accesspoint.checked = ap.checked
          ap = accesspoint
          newl.push(accesspoint)
          haveit = true
        } else {
          newl.push(ap)
        }
      })
      if (state.accesspoints.length == 0 || !haveit) {
        newl.push(accesspoint)
      }
      state.accesspoints = newl
      if (state.nonFilteredAPs) {
        let haveitf = false
        let newlf = []
        state.nonFilteredAPs.forEach(ap => {
          if (ap.id == accesspoint.id) {
            accesspoint.selected = ap.selected
            accesspoint.checked = ap.checked
            ap = accesspoint
            newl.push(accesspoint)
            haveitf = true
          } else {
            newlf.push(ap)
          }
        })
        if (state.accesspoints.length == 0 || !haveitf) {
          newlf.push(accesspoint)
        }
        state.nonFilteredAPs = newlf
      }
    },
    selectAccesspoint(state, accesspoint) {
      let s = {}
      let ls = state.accesspoints.map(ap => {
        if (ap.id == accesspoint.id) {
          ap.selected = true
          s = ap
        } else {
          ap.selected = false
        }
        return ap
      })
      state.accesspoint = s
      state.accesspoints = ls
    },
    removedAccesspoints(state, accesspoints) {
      let ls = state.accesspoints
      let i = ls.length
      if (accesspoints.length === i) {
        state.accesspoints = []
        return
      }
      while (i--) {
        accesspoints.forEach(ap => {
          if (ap.id === ls[i].id) {
            ls.splice(i, 1)
          }
        })
      }
      state.accesspoints = ls
    },
    updateAccesspoints(state, accesspoints) {
      if (accesspoints.length == state.gateways.length) {
        console.log('bug, should not be here')
        state.accesspoints = [...accesspoints]
        return
      }
      let newl = new Map()
      state.accesspoints.forEach(ap => {
        accesspoints.forEach(a => {
          if (a.id == ap.id) {
            newl.set(a.id, a);
          } else {
            if (!newl.has(ap.id)) {
              newl.set(ap.id, ap)
            }
          }
        })
      })
      state.accesspoints = Array.from(newl.values())
    },
    bulkUploadAPUpdate(state, accesspoints) {
      let newl = new Map(accesspoints.map(ap => [ap.id, ap]))
      state.accesspoints.forEach(ap => {
        if (!newl.has(ap.id)) {
          newl.set(ap.id, ap)
        }
      })
      state.accesspoints = Array.from(newl.values())
    },
    /// SITES
    sites(state, sites) {
      state.sites = sites
    },
    site(state, newsite) {
      state.site = newsite
      let have = false
      let sites = [...state.sites]
      for (let i = 0; i < sites.length; i++) {
        let s = sites[i];
        if (s.id == newsite.id) {
          have = true
          sites[i] = Object.assign({}, s, newsite)
          break
        }
      }
      if (!have) {
        state.sites.push(newsite)
      } else {
        state.sites = sites
      }
    },
    deleteSite(state, site) {
      let ns = state.sites.filter(s => s.id != site.id)

      state.sites = ns
    },
    savingSite(state, saved) {
      state.savingSite = saved
    },
    currentSite(state, site) {
      state.site = site
    },
    filteredSites(state, text) {
      if (!state.nonFilteredSites) {
        let pre = [...state.sites];
        state.nonFilteredSites = pre;
      }
      let f = state.nonFilteredSites.filter(s => {
        return (s.name.search(text) > -1)
      })
      state.sites = f;
    },
    toggleProperty(state, prop) {
      if (!state.nonFilteredSites) {
        let all = [...state.sites];
        state.nonFilteredSites = all;
      }
      if (!prop) {
        state.sites = state.nonFilteredSites
        return
      }
      let f = state.nonFilteredSites.filter(s => {
        if (prop.toggle) {
          return !!s[prop.key]
        } else {
          return !s[prop.key]
        }

      })
      state.sites = f;
    },
    loadingSites(state, loading) {
      state.sitesLoading = loading
    },
    loadingSite(state, loading) {
      state.siteLoading = loading
    },
    toggleAllProperty(state, prop) {
      if (!state.nonFilteredLocations) {
        let lbs = [...state.locations];
        state.nonFilteredLocations = lbs;
      }
      if (!state.nonFilteredGWs) {
        let gws = [...state.gateways];
        state.nonFilteredGWs = gws;
      }
      if (!state.nonFilteredAPs) {
        let aps = [...state.accesspoints];
        state.nonFilteredAPs = aps;
      }

      if (!prop) {
        state.locations = state.nonFilteredLocations
        state.accesspoints = state.nonFilteredAPs
        state.gateways = state.nonFilteredGWs
        return
      }
      function filter(list) {
        let f = list.filter(s => {
          if (prop.toggle) {
            return !!s[prop.key]
          } else {
            return !s[prop.key]
          }
        })
        return f
      }
      state.locations = filter(state.nonFilteredLocations)
      state.gateways = filter(state.nonFilteredGWs)
      state.accesspoints = filter(state.nonFilteredAPs)
    },
    ///  LOCATIONS


    loadingLocations(state, loading) {
      state.loadingLocations = loading
    },
    savingLocations(state, saving) {
      state.savingLocations = saving
    },
    removedLocations(state, locations) {
      let ls = state.locations
      let i = ls.length
      if (locations.length === i) {
        state.locations = []
        return
      }
      while (i--) {
        locations.forEach(loc => {
          if (loc.id === ls[i].id) {
            ls.splice(i, 1)
          }
        })
      }
      state.locations = ls
    },
    locations(state, locations) {
      locations.forEach(l => {
        l.id = l.nodeAddress
      })
      state.locations = locations
    },
    bulkLocationsSaved(state, locations) {
      let newl = new Map(locations.map(l => [l.id, l]))
      state.locations.forEach(loc => {
        if (!newl.has(loc.id)) {
          newl.set(loc.id, loc)
        }
      })
      state.locations = Array.from(newl.values())
    },
    updateLocations(state, locations) {
      if (locations.length == state.locations.length) {
        console.log('bug, should not be here')
        state.locations = [...locations]
        return
      }
      let newl = new Map()
      state.locations.forEach(loc => {
        locations.forEach(l => {
          if (l.id == loc.id) {
            newl.set(l.id, l);
          } else {
            if (!newl.has(loc.id)) {
              newl.set(loc.id, loc)
            }
          }
        })
      })
      state.locations = Array.from(newl.values())
    },
    currentLocation(state, location) {
      let l = { ...state.location }
      location.selected = l.selected
      location.checked = l.checked
      state.location = location
    },
    location(state, location) {
      state.location = location
      let newl = []
      let haveit = false
      state.locations.forEach(l => {
        if (l.id == location.nodeAddress) {
          location.selected = l.selected
          location.checked = l.checked
          haveit = true
          newl.push(location)
        } else {
          newl.push(l)
        }
      })
      if (state.location.length == 0 || !haveit) {
        newl.push(location)
      }
      if (state.nonFilteredLocations) {
        let newlf = []
        let haveitf = false
        state.nonFilteredLocations.forEach(l => {
          if (l.id == location.nodeAddress) {
            location.selected = l.selected
            location.checked = l.checked
            haveit = true
            newlf.push(location)
          } else {
            newlf.push(l)
          }
        })
        if (state.nonFilteredLocations.length == 0 || !haveit) {
          newlf.push(location)
        }
        state.nonFilteredLocations = newlf
      }

      state.locations = newl
    },
    selectLocation(state, location) {
      let s = {}
      let ls = state.locations.map(l => {
        if (l.id == location.id) {
          l.selected = true
          s = l
        }
        l.selected = (l.id == location.id)
        return l
      })
      state.location = s
      state.locations = ls
    },
    locationDragged(state, location) { // this might need to live with map stuff
      console.log('dragged', location)
      state.locations.forEach(l => {
        if (l.id == location.id) {
          Vue.set(l, 'dragged', true)
        }
      })
    },

    ///  ZONES

    zones(state, zones) {
      state.zones = zones
    },
    zone(state, nz) {
      state.zone = nz
      let newzs = []
      let have = false // check if already have nz in state.zones
      // update state where nz is existing
      state.zones.forEach(z => {
        if (z.id == nz.id) {
          nz.selected = z.selected
          nz.checked = z.checked
          newzs.push(nz)
          have = true
        } else {
          newzs.push(z)
        }
      })
      // take nz and append to state where nz is new
      if (state.zones.length == 0 || !have) {
        newzs.push(nz)
      }
      state.zones = newzs
    },
    deletedZone(state, zone) {
      state.zone = {}
      let nz = state.zones.filter(z => z.id != zone.id)
      state.zones = nz
    },
    currentZone(state, zone) {
      state.zone = zone
    },
    selectZone(state, zone) {
      let s = {}
      let zs = state.zones.map(z => {
        if (z.id == zone.id) {
          z.selected = true
          s = z
        } else {
          z.selected = false
        }
        return z
      })
      state.zone = s
      state.zones = zs
    },
    removedZones(state, zones) {
      let zs = state.zones
      let i = zs.length
      if (zones.length === i) {
        state.zones = []
        return
      }
      while (i--) {
        zones.forEach(z => {
          if (z.id === zs[i].id) {
            zs.splice(i, 1)
          }
        })
      }
      state.zones = zs
    },
    loadingZones(state, loading) {
      state.loadingZones = loading
    },
    loadingZone(state, loading) {
      state.zoneLoading = loading
    },
    savingZone(state, saving) {
      state.savingZone = saving
    },

    ///  GATEWAYS


    gatewayDragged(state, gateway) {
      console.log('dragged', gateway)
      state.gateways.forEach(g => {
        if (g.id == gateway.id) {
          Vue.set(g, 'dragged', true)
        }
      })
    },
    gateways(state, gateways) {
      gateways.forEach(g => {
        g.id = g.nodeAddress
      })
      state.gateways = gateways
    },
    currentGateway(state, gateway) {
      let g = { ...state.gateway }
      gateway.selected = g.selected
      gateway.checked = g.checked
      state.gateway = gateway
    },
    gateway(state, gateway) {
      state.gateway = gateway
      let haveit = false
      let newl = []
      state.gateways.forEach(g => {
        if (g.id == gateway.id) {
          gateway.selected = g.selected
          gateway.checked = g.checked
          g = gateway
          newl.push(gateway)
          haveit = true
        } else {
          newl.push(g)
        }
      })
      if (state.gateways.length == 0 || !haveit) {
        newl.push(gateway)
      }
      state.gateways = newl
      if (state.nonFilteredGWs) {
        let haveitf = false
        let newlf = []
        state.gateways.forEach(g => {
          if (g.id == gateway.id) {
            gateway.selected = g.selected
            gateway.checked = g.checked
            g = gateway
            newlf.push(gateway)
            haveitf = true
          } else {
            newlf.push(g)
          }
        })
        if (state.nonFilteredGWs.length == 0 || !haveitf) {
          newlf.push(gateway)
        }
        state.nonFilteredGWs = newlf
      }
    },
    selectGateway(state, gateway) {
      let s = {}
      console.log(gateway)
      let ls = state.gateways.map(g => {
        if (g.id == gateway.id) {
          g.selected = true
          s = g
        } else {
          g.selected = false
        }
        return g
      })
      state.gateway = s
      state.gateways = ls
    },
    removedGateways(state, gateways) {
      let ls = state.gateways
      let i = ls.length
      if (gateways.length === i) {
        state.gateways = []
        return
      }
      while (i--) {
        gateways.forEach(gw => {
          if (gw.id === ls[i].id) {
            ls.splice(i, 1)
          }
        })
      }
      state.gateways = ls
    },
    updateGateways(state, gateways) {
      if (gateways.length == state.gateways.length) {
        console.log('bug, should not be here')
        state.gateways = [...gateways]
        return
      }
      let newl = new Map()
      state.gateways.forEach(gw => {
        gateways.forEach(g => {
          if (g.id == gw.id) {
            newl.set(g.id, g);
          } else {
            if (!newl.has(gw.id)) {
              newl.set(gw.id, gw)
            }
          }
        })
      })
      state.gateways = Array.from(newl.values())
    },
    bulkUploadGWUpdate(state, gateways) {
      let newl = new Map(gateways.map(g => [g.id, g]))
      state.gateways.forEach(gw => {
        if (!newl.has(gw.id)) {
          newl.set(gw.id, gw)
        }
      })
      state.gateways = Array.from(newl.values())
    },

    /// MAP

    setMapopts(state) {
      let { area, zones, locations, gateways, accesspoints } = state;
      if (!area) {
        return {};
      }
      let m = area.indoor;
      let mo = {};
      if (area.polygon) {
        mo.geojson = [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [area.polygon]
            },
            properties: {
              type: 'area',
              id: area.id,
              name: area.name
            }
          }
        ];
        mo.fitFeature = mo.geojson[0];
      } else if (area.point) {
        mo.opts = {
          center: area.point,
          zoom: 15
        }
        mo.readonly = {
          center: area.point,
          points: true,
          data: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: area.point
              },
              properties: {
                id: area.id,
                name: area.name
              }
            }
          ]
        }
      }

      if (m && area.mapfile) {
        let nw = m.nwCorner;
        let se = m.seCorner;
        let rect = [
          [nw[0], nw[1]],
          [se[0], nw[1]],
          [se[0], se[1]],
          [nw[0], se[1]]
        ];
        let rp = rect.concat([rect[0]]);
        mo.fitFeature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: rp
          }
        };

        mo = {
          opts: {
            maxBounds: [
              [m.nwCorner[0] - 0.5, m.seCorner[1] - 0.2],
              [m.seCorner[0] + 0.5, m.nwCorner[1] + 0.2]
            ],
            center: [0, 0],
            zoom: 12.5
          },
          style: {
            version: 8,
            sources: {
              overlay: {
                type: "image",
                url: area.mapfile.preview,
                coordinates: rect
              }
            },
            layers: [
              {
                id: "background",
                type: "background",
                paint: { "background-color": "white" }
              },
              {
                id: "overlay",
                source: "overlay",
                type: "raster"
              }
            ]
          }
        };
      }
      if (zones) {
        let zjson = zones.map(z => {
          return {
            id: z.id,
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [z.polygon]
            },
            properties: {
              type: 'zone',
              name: z.name,
              id: z.id
            }
          };
        });
        if (mo.geojson) {
          mo.geojson = mo.geojson.concat(zjson);
        } else {
          mo.geojson = zjson;
        }
      }
      if (locations) {
        let ljson = generatePointJSON(locations, { prop: 'areaId', value: area.id })
        console.log('locations', ljson)
        if (mo.geojson && ljson.length > 0) {
          console.log('adding locations');
          mo.geojson = mo.geojson.concat(ljson);
        } else if (ljson.length > 0) {
          console.log('no zones just locations')
          mo.geojson = ljson;
        }
      }
      if (gateways) {
        let gjson = generatePointJSON(gateways, { prop: 'areaId', value: area.id })
        if (mo.geojson && gjson.length > 0) {
          console.log('adding gateways');
          mo.geojson = mo.geojson.concat(gjson);
        } else if (gjson.length > 0) {
          console.log('no zones or locations just gateways')
          mo.geojson = gjson;
        }
      }
      if (accesspoints) {
        let apjson = generatePointJSON(accesspoints, { prop: 'areaId', value: area.id })
        if (mo.geojson && apjson.length > 0) {
          console.log('adding acccesspoints');
          mo.geojson = mo.geojson.concat(apjson);
        } else if (apjson.length > 0) {
          console.log('only accesspoints')
          mo.geojson = apjson;
        }
      }
      mo.pointsColor = [
        'match',
        ['get', 'type'],
        'location', '#3dabff',
        'gateway', '#7cc427',
        'accesspoint', '#600080',
        '#FF4500'
      ]
      mo.pointsColorDraw = [
        'match',
        ['get', 'user_type'],
        'location', '#3dabff',
        'gateway', '#7cc427',
        'accesspoint', '#600080',
        '#FF4500'
      ]
      state.mapopts = mo;
    },
    exportLocations(state) {

    },
    
    /// Status Mutations
    loadingStatus(state,loading){
      state.statusLoading = loading;
    },
    loadingBeacon(state,loading){
      state.beaconLoading = loading;
    },
    laodingAccessPoint(state,loading){
      state.accessPointLoading = loading;
    },
    laodingGateway(state,loading){
      state.gatewayLoading = loading;
    },
    laodingTag(state,loading){
      state.tagLoading = loading;
    },
    setDeviceStatus(state,status){
      state.deviceStatus = status;
    },
    setBeaconStatus(state, status){
      state.beaconStatus = status;
    },
    setAccesPointStatus(state, status){
      state.accessPointStatus = status;
    },
    setGatewayStatus(state, status){
      state.gatewayStatus = status;
    },
    setTagStatus(state, status){
      state.tagStatus = status;
    },
  },
  actions: {
    async convertAddress({ commit, dispatch }, address) {
      commit('gettingAddress', true)
      try {
        console.log("address", address)
        let d = await PlacesService.convert(address)
        commit('convertedAddress', d)
      } catch (e) {
        await dispatch('error', e);
      } finally {
        commit('gettingAddress', false)
      }
    },
    async showUploadModal({ commit }) {
      commit('showUploadModal', true);
    },

    ///  AREAS

    async getArea({ dispatch, commit }, areaid) {
      try {
        commit('area', {})
        commit('loadingArea', true)
        let area = await AreasService.get(areaid)
        commit('area', area)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/getArea', args: areaid }, { root: true })
        } else {
          await dispatch('error', e, { root: true })
        }
      } finally {
        commit('loadingArea', false)
      }
    },
    async listAreas({ dispatch, commit }, siteid) {
      try {
        commit('loadingAreas', true)
        commit('areas', [])
        let areas = await SitesService.areas(siteid)
        commit('areas', areas)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listAreas', args: siteid }, { root: true })
        } else {
          await dispatch('error', e, { root: true })
        }
      } finally {
        commit('loadingAreas', false)
      }
    },
    async addArea({ dispatch, commit }, area) {
      commit('savingArea', true)
      try {
        if (area.address) {
          let d = await PlacesService.convert(area.address)
          if (d) {
            area.point = d
          }
        }
        let a = await AreasService.create(area)
        console.log('area created', a)
        commit('area', a)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addArea', args: area }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingArea', false)
      }

    },
    async updateArea({ dispatch, commit }, area) {
      try {
        commit('savingArea', true)
        await AreasService.update(area)
        commit('area', area)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateArea', args: area }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingArea', false)
      }
    },
    async deleteArea({ dispatch, commit }, area) {
      try {
        commit('savingArea', true)
        await AreasService.remove(area)
        commit('deletedArea', area)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteArea', args: area }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingArea', false)
      }
    },
    clearAreas({ commit }) {
      commit('areas', [])
    },
    clearArea({ commit }) {
      commit('area', {})
    },

    ///  ACCESS POINTS

    async listAccesspoints({ dispatch, commit }, { siteid, areaid }) {
      try {
        commit('loadingLocations', true)
        let accesspoints = await AccesspointsService.list(siteid)
        commit('accesspoints', accesspoints)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listAccesspoints', args: { siteid, areaid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loadingLocations', false)
      }
    },
    async bulkSaveAccesspoints({ dispatch, commit }, { siteid, file }) {
      let accesspoints = []
      try {
        commit('savingLocations', true)
        accesspoints = await AccesspointsService.bulkUpload(siteid, file)
        commit('bulkUploadAPUpdate', accesspoints)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/bulkSaveAccesspoints', args: { siteid, file } }, { root: true })
        } else {
          commit('bulkUploadAPUpdate', accesspoints)
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async addAccesspoint({ dispatch, commit }, accesspoint) {
      commit('savingLocations', true)
      try {
        let l = await AccesspointsService.create(accesspoint)
        commit('accesspoint', l)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addAccesspoint', args: accesspoint }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async updateAccesspoint({ dispatch, commit }, accesspoint) {
      commit('savingLocations', true)
      try {
        let ap = await AccesspointsService.update(accesspoint)
        commit('accesspoint', ap)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateAccesspoint', args: accesspoint }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async updateAccesspoints({ dispatch, commit }, accesspoints) {
      commit('savingLocations', true)
      try {
        let aps = await AccesspointsService.updateMany(accesspoints)
        commit('updateAccesspoints', aps)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateAccesspoints', args: accesspoints }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async wipeAccesspoints({ dispatch, commit }, accesspoints) {
      await dispatch('updateAccesspoints', accesspoints)
      commit('setMapopts')
    },
    async deleteAccesspoint({ dispatch, commit }, accesspoint) {
      try {
        commit('savingLocations', true)
        await AccesspointsService.remove(accesspoint)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteAccesspoint', args: accesspoint }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async deleteAccesspoints({ dispatch, commit }, { siteid, accesspoints }) {
      commit('savingLocations', true)
      try {
        await AccesspointsService.deleteMany(siteid, accesspoints)
        commit('removedAccesspoints', accesspoints)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteAccesspoints', args: { siteid, accesspoints } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },

    /// SITES

    async listSites({ dispatch, commit }) {
      try {
        commit('loadingSites', true)
        commit('sites', [])
        let sites = await SitesService.list()
        commit('sites', sites)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listSites' }, { root: true })
        }
      } finally {
        commit('loadingSites', false)
      }
    },
    clearSite({ commit }) {
      commit('site', {})
    },
    async getSite({ dispatch, commit }, siteid) {
      try {
        commit('loadingSite', true)
        let site = await SitesService.site(siteid)
        commit('site', site)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/getSite', args: siteid }, { root: true })
        } else {
          await dispatch('error', e, { root: true })
        }
      } finally {
        commit('loadingSite', false)
      }
    },
    async searchSites({ commit }, search) {
      commit('filteredSites', search)
    },
    async addSite({ dispatch, commit }, site) {
      try {
        commit('savingSite', true)
        let s = await SitesService.create(site)
        commit('site', s)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addSite', args: site }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingSite', false)
      }
    },
    async updateSite({ dispatch, commit }, site) {
      try {
        commit('savingSite', true)
        let s = await SitesService.update(site)
        commit('site', s)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateSite', args: site }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingSite', false)
      }
    },
    async deleteSite({ dispatch, commit }, site) {
      try {
        commit('savingSite', true)
        await SitesService.remove(site)
        commit('deleteSite', site)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteSite', args: site }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingSite', false)
      }
    },

    ///  LOCATIONS

    async listLocations({ dispatch, commit }, { siteid, areaid }) {
      try {
        commit('loadingLocations', true)
        let locations = await SitesService.locations(siteid)
        commit('locations', locations)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listLocations', args: { siteid, areaid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loadingLocations', false)
      }
    },
    async bulkSaveLocations({ dispatch, commit }, { siteid, file }) {
      try {
        commit('savingLocations', true)
        let locations = await LocationsService.bulkUpload(siteid, file)
        commit('bulkLocationsSaved', locations)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/bulkSaveLocations', args: { siteid, file } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async addLocation({ dispatch, commit }, location) {
      commit('savingLocations', true)
      try {
        let l = await LocationsService.create(location)
        commit('location', l)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addLocation', args: location }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async updateLocation({ dispatch, commit }, location) {
      commit('savingLocations', true)
      try {
        let l = await LocationsService.update(location)
        commit('location', l)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateLocation', args: location }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async updateLocations({ dispatch, commit }, locations) {
      commit('savingLocations', true)
      try {
        let locs = await LocationsService.updateMany(locations)
        commit('updateLocations', locs)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateLocations', args: locations }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }

    },
    async wipeLocations({ dispatch, commit }, locations) {
      await dispatch('updateLocations', locations)
      commit('setMapopts')
    },
    async deleteLocation({ dispatch, commit }, location) {
      try {
        commit('savingLocations', true)
        await LocationsService.remove(location)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteLocation', args: location }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async deleteLocations({ dispatch, commit }, { siteid, locations }) {
      commit('savingLocations', true)
      try {
        await LocationsService.deleteMany(siteid, locations)
        commit('removedLocations', locations)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteLocations', args: { siteid, locations } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },

    ///  ZONES

    async getZone({ dispatch, commit }, zoneid) {
      try {
        commit('loadingZone', true)
        let zone = await SitesService.zone(zoneid)
        commit('zone', zone)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/getZone', args: zoneid }, { root: true })
        } else {
          await dispatch('error', e, { root: true })
        }
      } finally {
        commit('loadingZone', false)
      }
    },
    async listZones({ dispatch, commit }, { siteid, areaid }) {
      try {
        commit('loadingZones', true)
        let zones = await SitesService.zones(siteid, areaid)
        commit('zones', zones)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listZones', args: { siteid, areaid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loadingZones', false)
      }
    },
    async addZone({ dispatch, commit }, zone) {
      commit('savingZone', true)
      try {
        let z = await ZoneService.create(zone)
        if (zone.locations && zone.locations.length > 0) {
          console.log('should be a nope', zone.locations)
          zone.locations.forEach(l => {
            l.zoneId = z.id
          })
          await dispatch('updateLocations', zone.locations)
        }
        commit('zone', z)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addZone', args: zone }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingZone', false)
      }
    },
    async updateZone({ dispatch, commit, getters }, zone) {
      console.log('updateZone', zone)
      commit('savingZone', true)
      try {
        let changed = []
        let ids = zone.locations && zone.locations.map(l => l.id)
        if (ids) {
          console.log('locations to add', ids)
          getters.locations.forEach(l => {
            if (l.zoneId == zone.id) { //existing
              if (!ids.includes(l.id)) {
                changed.push({
                  id: l.id,
                  zoneId: null
                })
              }
            } else if (ids.includes(l.id)) { //new
              changed.push({
                id: l.id,
                zoneId: zone.id
              })
            }
          })
        }

        let z = await ZoneService.update(zone)
        if (changed.length > 0) {
          dispatch('updateLocations', changed)
        }
        commit('zone', z)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateZone', args: zone }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingZone', false)
      } exportAccessPoints
    },
    async updateZoneOnly({ dispatch, commit }, zone) {
      commit('savingZone', true)
      try {
        let z = await ZoneService.update(zone)
        commit('zone', z)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateZoneOnly', args: zone }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingZone', false)
      }
    },
    async deleteZone({ dispatch, commit }, zone) {
      try {
        if (zone.locations && zone.locations.length > 0) {
          zone.locations.forEach(l => {
            l.zoneId = null
          })
          dispatch('updateLocations', zone.locations)
        }
        await ZoneService.remove(zone)
        commit('deletedZone', zone)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteZone', args: zone }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingZone', false)
      }
    },
    async deleteZones({ dispatch, commit }, zones) {
      try {
        zones.forEach(zone => {
          if (zone.locations && zone.locations.length > 0) {
            zone.locations.forEach(l => {
              l.zoneId = null
            })
            dispatch('updateLocations', zone.locations)
          }
        })
        await ZoneService.deleteMany(zones)
        commit('removedZones', zones)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteZones', args: zones }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingZone', false)
      }
    },

    ///  GATEWAYS

    async listGateways({ dispatch, commit }, { siteid, areaid }) {
      try {
        commit('loadingLocations', true)
        let gateways = await GatewaysService.list(siteid)
        commit('gateways', gateways)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listGateways', args: { siteid, areaid } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('loadingLocations', false)
      }
    },
    async bulkSaveGateways({ dispatch, commit }, { siteid, file }) {
      let gateways = []
      try {
        commit('savingLocations', true)
        gateways = await GatewaysService.bulkUpload(siteid, file)
        commit('bulkUploadGWUpdate', gateways)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/bulkSaveGateways', args: { siteid, file } }, { root: true })
        } else {
          commit('bulkUploadGWUpdate', gateways)
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async addGateway({ dispatch, commit }, gateway) {
      commit('savingLocations', true)
      try {
        let l = await GatewaysService.create(gateway)
        commit('gateway', l)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/addGateway', args: gateway }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async updateGateway({ dispatch, commit }, gateway) {
      commit('savingLocations', true)
      try {
        let l = await GatewaysService.update(gateway)
        commit('gateway', l)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateGateway', args: gateway }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async updateGateways({ dispatch, commit }, gateways) {
      commit('savingLocations', true)
      try {
        let gws = await GatewaysService.updateMany(gateways)
        commit('updateGateways', gws)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/updateGateways', args: gateways }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async wipeGateways({ dispatch, commit }, gateways) {
      await dispatch('updateGateways', gateways)
      commit('setMapopts')
    },
    async deleteGateway({ dispatch, commit }, gateway) {
      try {
        commit('savingLocations', true)
        await GatewaysService.remove(gateway)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteGateway', args: gateway }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async deleteGateways({ dispatch, commit }, { siteid, gateways }) {
      commit('savingLocations', true)
      try {
        await GatewaysService.deleteMany(siteid, gateways)
        commit('removedGateways', gateways)
        commit('setMapopts')
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/deleteGateways', args: { siteid, gateways } }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
        }
      } finally {
        commit('savingLocations', false)
      }
    },
    async exportLocations({ commit, state }) {
      let lbs = state.locations
      commit('savingLocations', true)
      let lines = lbs.map(l => `${l.name},${l.macAddress}`)
      exportCSV(`${state.site.name}-locations.csv`, lines.join('\n'))
      commit('savingLocations', false)
    },
    async exportAccesspoints({ commit, state }) {
      let aps = state.accesspoints
      commit('savingLocations', true)
      let lines = aps.map(ap => `${ap.name},${ap.macAddress}`)
      exportCSV(`${state.site.name}-accesspoints.csv`, lines.join('\n'))
      commit('savingLocations', false)
    },
    async exportGateways({ commit, state }) {
      let gws = state.gateways
      commit('savingLocations', true)
      let lines = gws.map(gw => `${gw.name},${gw.id}`)
      exportCSV(`${state.site.name}-gateways.csv`, lines.join('\n'))
      commit('savingLocations', false)
    },
    async listOrgSites({ dispatch, commit }, orgid) {
      try {
        commit('loadingSites', true)
        commit('sites', [])
        let sites = await SitesService.listbyorg(orgid)
        commit('sites', sites)
      } catch (e) {
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listOrgSites', args: orgid }, { root: true })
        }
      } finally {
        commit('loadingSites', false)
      }
    },

    // Status 
    async listDeviceStatus({dispatch,commit},siteId){
      try{
        commit('loadingStatus', true);
        let deviceStatus= await StatusService.getDeviceStatus(siteId);
        commit('setDeviceStatus',deviceStatus);
      }catch(e){
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listDeviceStatus', args: siteId }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
          commit('setDeviceStatus',[]);
        }
      }finally{
        commit('loadingStatus', false);
      }
    },
    async listBeaconStatus({dispatch,commit},siteId){
      try{
        commit('loadingBeacon', true);
        let beaconStatus= await StatusService.getBeaconStatus(siteId);
        commit('setBeaconStatus',beaconStatus);
      }catch(e){
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listBeaconStatus', args: siteId }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
          commit('setBeaconStatus',[]);
        }
      }finally{
        commit('loadingBeacon', false);
      }
    },
    async listAccessPoints({dispatch,commit},siteId){
      try {
        commit('laodingAccessPoint', true);
        let accessPoints= await StatusService.getAPStatus (siteId);
        commit('setAccesPointStatus',accessPoints);
      } catch(e){
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listAccessPoints',args:siteId }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
          commit('setAccesPointStatus',[]);
        }
      } finally{
        commit('laodingAccessPoint', false);
      }
    },
    async listGatewayStatus({dispatch,commit},siteId){
      try {
        commit('laodingGateway', true);
        let gatewayStatus= await StatusService.getGatewayStatus (siteId);
        commit('setGatewayStatus',gatewayStatus);
      } catch(e){
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listGatewayStatus', args:siteId }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
          commit('setGatewayStatus',[]);
        }
      } finally{
        commit('laodingGateway', false);
      }
    },
    async listTagStatus({dispatch,commit},siteId){
      try {
        commit('laodingTag', true);
        const tagStatus= await StatusService.getTagStatus (siteId);
        commit('setTagStatus',tagStatus);
      } catch(e){
        if (e === constants.NEED_AUTH) {
          await dispatch('refreshToken', { a: 'setup/listTagStatus', args:siteId }, { root: true })
        } else {
          await dispatch('error', e, { root: true });
          commit('setTagStatus',[]);
        }
      } finally{
        commit('laodingTag', false);
      }
    },
    resetAllStatus({commit}){
      commit('setDeviceStatus',[]);
      commit('setBeaconStatus',[]);
      commit('setAccesPointStatus',[]);
      commit('setGatewayStatus',[]);
      commit('setTagStatus',[]);
    }
  }
})
