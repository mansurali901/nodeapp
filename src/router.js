import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Setup from './views/Setup.vue'
import SetupOrgList from './views/SetupOrgList.vue'
import SetupAreas from './views/SetupAreas.vue'
import SetupZones from './views/SetupZones.vue'
import SetupLocations from './views/SetupLocations.vue'
import Installer from './views/Installer.vue'
import SiteConfigure from './views/SiteConfigure.vue'
import SiteStatus from './views/SiteStatus.vue'
import Orgs from './views/Orgs.vue'
import Org from './views/Org.vue'
import Login from './views/Login.vue'
import Forgot from './views/Forgot.vue'
import Devices from './views/Devices.vue'

import store from './store/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupOrgList,
      meta: {
        requiresAuth: true
      },
    }, {
      path: '/setup/:orgid?/sites',
      name: 'setup-sites',
      component: Setup,
      meta: {
        requiresAuth: true
      },
      props:true,
    },{
      path: '/setup/:orgid?/sites/:id/areas',
      name: 'setup-areas',
      component: SetupAreas,
      meta: {
        requiresAuth: true
      },
      props: true
    }, {
      path: '/setup/:orgid?/sites/:id/areas/:areaid/zones',
      name: 'setup-devices',
      component: SetupZones,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/setup/:orgid?/sites/:id/areas/:areaid/zones/:zoneid/locations',
      name:'setup-locations',
      component: SetupLocations,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/installer',
      name:'installer',
      component: Installer,
      meta: {
        requiresAuth: true
      }
    },
    // Duplicate path necessary to avoid ambiguity
    {
      path: '/installer/:siteid',
      name:'installer',
      component: Installer,
      meta: {
        requiresAuth: true
      },
      props: true,
      children: [
        { path: '', redirect: 'status' },
        {
          path: 'configure',
          component: SiteConfigure,
          props: true
        },
        {
          path: 'status',
          component: SiteStatus,
          props: true
        }
      ]
    },
    {
      path: '/orgs',
      component: Orgs,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orgs/:id',
      component: Org,
      meta: {
        requiresAuth: true
      },
      props:true
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: Forgot
    },
    {
      path: '/devices',
      name: 'devices',
      component: Devices,
      meta: {
        requiresAuth: true
      },
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && (!store.state.token || !store.state.token.access_token)) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
  else {
    next()
  }
})

export default router;