<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">Devices</h2>
      <loading-mask show="loading"/>
      <p class="help-text">Search for a gateway (nodeaddress), access point (nodeaddress or mac), location beacon (nodeaddress or mac)</p>
       <div class="search-bar">
         <search-box class="what" @keypress="handleKeypress" placeholder="device id"/><button class="button is-info is-small" @click="handleSearch">Search</button>
         </div>
       <div class="section"> 
         <device-details :data="device" :site="site" v-if="device.id" />
         <pre v-if="commands && commands.issuanceId">{{commands}}</pre>
       </div>
    </div>
  </nav-layout>
</template>
//$101$0-0-0-db94eeaac
//c0003000961a
//c4:85:c4:b4:43:bb
<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

import NavLayout  from '@/components/NavLayout'
import SearchBox from '@/components/SearchBox.vue'
import DeviceDetails from '@/components/DeviceDetails.vue'
import LoadingMask from '@/components/LoadingMask.vue'

export default {
  components: {
    NavLayout,
    SearchBox,
    DeviceDetails,
    LoadingMask,
  },
  data:function(){
    return {
      searchtext:''
    }
  },
  destroyed:function(){
    this.reset()
  },
  computed: {
    ...mapGetters('devices', ['device','loading','site','commands',]),
  },
  methods:{
    ...mapActions('devices', ['search']),
    ...mapMutations('devices',['reset']),
    handleKeypress(s){
      this.searchtext =s;
    },
    handleSearch(){
      this.search(this.searchtext)
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar{
    display: flex;
    flex-flow: row;
    align-content: flex-start;
  }
</style>