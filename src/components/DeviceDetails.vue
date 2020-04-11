<template>
<div class="details">
  <loading-mask show="waiting"/>
  <div class="item">
    <label>Name</label>
    <div class="text">{{data.name}}</div>
  </div>
  <div class="item">
    <label>Id</label>
    <div class="text">{{data.id}}</div>
  </div>
  <div class="item">
    <label>Type</label>
    <div class="text">{{data.type}}</div>
  </div>
  <div class="item">
    <label>Site</label>
    <div class="text">{{site && site.name}}</div>
  </div>
   <div class="item">
    <label>Provisioned</label>
    <div class="text">{{data.lastProvisioned}}</div>
  </div>
  <div v-if="data && ['gateway','accesspoint'].indexOf(data.type) > -1">
    <button class="button is-danger" @click="displayRestart">Restart</button>    
  </div>
  <confirm-modal
      title="Restart"
      :show="showRestart"
      msg="Restart device?"
      primary="Ok"
      @save="handleRestart"
      @cancel="handleConfirmCancel">
      <div class="has-text-danger is-italic">Warning: This will restart the device</div>
    </confirm-modal>
</div>
</template>

<script>

import ConfirmModal from '@/components/ConfirmModal'
import LoadingMask from '@/components/LoadingMask'
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

export default {
  components:{
    ConfirmModal,
    LoadingMask,
  },
  props:['data','site'],
  data:function(){
    return{
      showRestart: false,
      confirmMsg: 'Restart device?'
    }
  },
  computed: {
    ...mapGetters('devices', ['waiting',]),
  },
  methods:{
    ...mapActions('devices',['restart']),
    displayRestart(){
      this.showRestart=true
    },
    handleRestart(){
      this.restart(this.data)
      this.showRestart = false
    },
    handleConfirmCancel(){
      this.showRestart=false
    }
  }
}
</script>

<style lang="scss" scoped>
.details{
  margin-top:10px;
  &>.item{
    margin: 15px 0;
  }
}
</style>