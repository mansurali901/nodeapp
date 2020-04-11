<template>
  <div>
    <!-- <div class="main">
      <div>
        <span><strong>Mode: </strong> </span>
        <span>PRODUCTION</span>
      </div>
      <div>
        <span><strong>Last Changed: </strong> </span>
      </div>
    </div> -->
    <div class="refresh-button">
        <button class="button is-link is-small" @click="fetchAllStatus()">Refresh</button>
    </div>
    
    <div class="main site">
      <grid :columns="getDeviceStatusColumns"  :rows="deviceStatus" :header="deviceStatusHeader" :isLoading="statusLoading" height="160px" class="site-status"></grid>
      <grid :columns="getGatewayColumns" :rows="gatewayStatus" header="Gateways" :isLoading="gatewayLoading" defModalId="gateway-modal"></grid>
      <grid :columns="getAccesPointColumns" :rows="accessPointStatus" header="Access Points" :isLoading="accessPointLoading" defModalId="accessPointModal-modal"></grid>
      <grid :columns="getBeachStatusColumns" :rows="beaconStatus" header="Location Beacons" :isLoading="beaconLoading" defModalId="beaconStatus-modal"></grid>
      <grid :columns="getTagColumns" :rows="tagStatus" header="Tags" :isLoading="tagLoading"></grid>
    </div>
  </div>
</template>

<script>
import Grid from '@/components/Grid'
import { GatewayStatus, APStatus, BeaconStatus, SiteStatus, TagStatus } from '../constants';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Grid
  },
  data: function() {
    return {
      deviceStatusTitle: 'Device Report',
      deviceStatusHeaderSuffix: ""
    };
  },
  beforeMount() {
  },
  props:['siteid'],
  computed: {
    ...mapGetters('setup',[
      'site',
      'sites',
      'statusLoading', 
      'beaconLoading',
      'accessPointLoading', 
      'gatewayLoading',
      'tagLoading',
      'deviceStatus', 
      'beaconStatus',
      'accessPointStatus',
      'gatewayStatus',
      'tagStatus'
    ]),
    ...mapGetters('orgs',['org']),
    getDeviceStatusColumns: function(){
      return SiteStatus;
    },
    getBeachStatusColumns: function(){
      return BeaconStatus;
    },
    getAccesPointColumns: function(){
      return APStatus;
    },
    getGatewayColumns: function(){
      return GatewayStatus;
    },
    getTagColumns: function(){
      return TagStatus;
    },
    deviceStatusHeader: function() {
      let headers = [];
      if (this.deviceStatusHeaderSuffix) {
        headers.push(
          `${this.deviceStatusTitle} | ${this.deviceStatusHeaderSuffix}`
        );
      } else {
        headers.push(this.deviceStatusTitle);
      }
      let siteIdHeader = "Site ID: ";
      if (this.siteid) {
        siteIdHeader = `${siteIdHeader}${this.siteid}`;
      }
      headers.push(siteIdHeader);

      if (this.org && this.org.name) {
        headers.push(`Org Name: ${this.org.name}`);
      }

      let siteNameHeader = "Site Name: ";
      if (this.site && this.site.name) {
        siteNameHeader = `${siteNameHeader}${this.site.name}`;
      }
      headers.push(siteNameHeader);

      return headers;
    }
  },
  created:function(){
    this.resetAllStatus();
  },
  mounted: function() {
    this.fetchAllStatus();
  },
  watch:{
    $route(){
      this.fetchAllStatus();
    }
  },
  methods: {
    ...mapActions('setup', [
      'getSite',
      'clearSite',
      'listDeviceStatus',
      'listBeaconStatus',
      'listAccessPoints',
      'listGatewayStatus',
      'listTagStatus',
      'resetAllStatus'
    ]),
    ...mapActions('orgs', ['getOrg', 'clearOrg']),
    fetchAllStatus(){
      this.getSiteAndOrgInfo();
      this.getDeviceStatus();
      this.listBeaconStatus(this.siteid);
      this.listAccessPoints(this.siteid);
      this.listGatewayStatus(this.siteid);
      this.listTagStatus(this.siteid);
    },
    async getSiteAndOrgInfo() {
      await this.clearSite();
      await this.clearOrg();
      await this.getSite(this.siteid);
      if (this.site.organizationId) {
        await this.getOrg(this.site.organizationId);
      }
    },
    async getDeviceStatus() {
      await this.listDeviceStatus(this.siteid);
      this.setDeviceReportHeader();
    },
    setDeviceReportHeader() {
      const currentDateTime = new Date();
      const currentTime = currentDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
      const currentDate = currentDateTime.toLocaleDateString();
      const timeZoneRegex = /\((.*)\)/;
      const regexResult = timeZoneRegex.exec(currentDateTime.toString());
      if (regexResult && regexResult[1]) {
        const bigTimeZone = regexResult[1];
        const shortTimeZone = bigTimeZone
          .split(" ")
          .map(word => word[0])
          .join("");
        this.deviceStatusHeaderSuffix = `Generated ${currentDate} @ ${currentTime} ${shortTimeZone}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.refresh-button{
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
  margin: 0;
}
</style>

<style lang="scss">
.site {
  .site-status {
    .ag-header-cell,
    .ag-cell {
      font-size: 16px;
    }
  }
}
</style>
