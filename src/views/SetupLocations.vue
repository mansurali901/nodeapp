<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">{{title}}</h2>
      <div class="level">
        <search-box/>
        <button class="button is-primary is-outlined" @click="showUploadModal">File Upload</button>
      </div>
      <div class="level">
        <locations-list :siteid="id" :zoneid="zoneid"/>
      </div>
    </div>
    <action-button tooltip="Add Location"/>
  </nav-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
// @ is an alias to /src
import LocationsList from "@/components/LocationsList.vue";
import ActionButton from "@/components/ActionButton.vue";
import SearchBox from "@/components/SearchBox.vue";
import NavLayout from "@/components/NavLayout";

export default {
  props: ["id", "zoneid"],
  mounted: function() {
    this.getZone(this.zoneid);
  },
  methods: {
    ...mapActions("setup", ["addLocaton"]),
    ...mapActions("setup", ["getZone"]),
    ...mapActions(["showUploadModal"])
  },
  computed: mapState({
    showLocationModal: state => state.showLocationModal,
    zone: state => state.zone,
    geojson: state => {
      return {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: state.zone.polygon
            }
          }
        ]
      };
    },
    title: function(state) {
      if (!state.loadingZone && state.zone) {
        return state.zone.name.concat(" - Locations");
      }
      return "Loading...";
    }
  }),
  components: {
    LocationsList,
    ActionButton,
    SearchBox,
    NavLayout
  }
};
</script>