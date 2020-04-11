<template>
<nav-layout>
  <div class="main">
  <div class="tile">
    <div class="tile is-parent is-row is-12">
      <div class="tile is-child is-3">&nbsp;</div>
      <div class="tile is-parent is-6">
        <div class="tile is-parent is-vertical">
            <router-link to="/setup" class="tile is-child notification is-primary">
                <div class="title is-size-4-mobile">Setup Locations, Access Points, Gateways</div>
                <div class="content">Setup and admin</div>
                <i class="fas fa-map-marked-alt"></i>
            </router-link>
            <router-link to="/orgs" class="tile is-child notification is-info">
              <div class="title is-size-4-mobile">
                <div class="main-link">Manage Organizations</div>
              </div>
              <div class="content">Create and provision organizations</div>
              <i class="fas fa-city"></i>
            </router-link>
            <router-link to="/devices" class="tile is-child notification is-info">
              <div class="title is-size-4-mobile">
                <div class="main-link">Search Provisioned Devices</div>
              </div>
              <div class="content">Find devices that are in provisioned to be reclaimed</div>
              <i class="fas fa-layer-group"></i>
            </router-link>
            <!-- <router-link to="/" class="tile is-child notification is-danger">
                <div class="title is-size-4-mobile">
                  <div class="main-link">Send cmds</div>
                </div>
              <div class="content">Send commands to a device(s)</div>
              <i class="fab fa-creative-commons-sampling"></i>
            </router-link> -->
      </div>
    </div>
   
    <div class="tile is-child is-3">&nbsp;</div>
    </div>
   
  </div>
  </div>
</nav-layout>
</template>


<script>
import NavLayout  from '@/components/NavLayout'

export default {
  components: {
    NavLayout
  }
}
</script>


<style lang="scss" scoped>
  a{
    flex: 0.33; 
    .fas, .fab{
      font-size: 10em;
    }
    @media screen and (max-width: $tablet) {
      flex: 0.1;
      .fas, .fab{
        font-size:3em;
      }
    }
    
  }
  a:hover{
    background-color: $med-blue;
  }

</style>
