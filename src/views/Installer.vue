<template>
  <nav-layout>
    <div class="main">
      <h3 class="title">All Sites</h3>
      <div class="tool-bar">
      <div class="select">
        <select @change="selectSite($event)" :disabled="loadingSites" class="site-select" :class="{ 'select-loader': loadingSites }">
          <option
            value=""
            disabled 
            :selected="!isSiteIdContainsInSites">Select Site</option>
          <option
            v-for="site in sites"
            v-bind:value="site.id"
            v-bind:key="site.id"
            :selected="siteid === site.id"
          >{{site.name}}</option>
        </select>
      </div>
        <button class="button is-link is-small" :disabled="!siteid" @click="siteOption('configure')">Configure</button>
        <button class="button is-link is-small" :disabled="!siteid" @click="siteOption('status')">Status</button>
      </div>
      <router-view></router-view>
    </div>
  </nav-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import router from '@/router'
import NavLayout from '@/components/NavLayout.vue';

export default {
  components: {
    NavLayout,
  },
  data: function() {
    return {
    };
  },
  props:['siteid'],
  computed: {
    ...mapGetters('setup', ['sites', 'loadingSites']),
    isSiteIdContainsInSites: function(){
      return this.sites.some(site=>site.id===this.siteid);
    }
  },
  mounted: function() {
    this.listSites();
  },
  methods: {
    ...mapActions(['clearError']),
    ...mapActions('setup', ['listSites']),
    selectSite(e) {
      this.clearError();
      router.push(`/installer/${e.target.value}`);
    },
    siteOption(value) {
      router.push(`./${value}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
.site-select {
  min-width: 325px;
}
.select-loader {
  background: url(../assets/loader.svg) center center no-repeat rgba(128, 128, 128, 0.4);
  &[disabled] {
    background-color: rgba(128, 128, 128, 0.4);
  }
}
</style>
