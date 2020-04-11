<template>
  <table class="table">
    <thead>
      <th>&nbsp;</th>
      <th v-for="(col, idx) in columns" :key="idx">{{col.label}}</th>
    </thead>
    <tbody>
      <tr v-if="loadingAreas">
        <td :colspan="columns.length + 1" class="has-text-centered">
          <i class="fas fa-spinner fa-pulse fa-2x"/>
        </td>
      </tr>
      <tr v-if="!loadingAreas && areas.length === 0">
        <td :colspan="columns.length + 1">
          <h1 class="has-text-centered has-text-info">To add area, click the + button.</h1>
        </td>
      </tr>
      <area-row
        v-for="(row, ridx) in areas"
        :id="ridx"
        :area="row"
        :path="row.id + '/zones'"
        :key="ridx"
        @checked="handleChecked"
      />
    </tbody>
  </table>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import AreaRow from "./AreaRow";

export default {
  props: ["siteid"],
  components: {
    AreaRow
  },
  data: function() {
    return {
      columns: [
        {
          label: "Name"
        },
        {
          label: "Address"
        },
        {
          label: "Address Point"
        },
        {
          label: "# Zone"
        },
        {
          label: "Indoor"
        },
        {
          label: "Geo Referenced"
        },
        {
          label: "Polygon"
        },
        {
          label: "# Locations"
        }
      ]
    };
  },
  mounted: function() {
    //get data
    this.listAreas(this.siteid);
  },
  beforeDestroy: function() {
    this.clearAreas();
  },
  computed: {
    ...mapGetters("setup", ["areas", "loadingAreas"])
  },
  methods: {
    ...mapActions("setup", ["listAreas", "clearAreas"]),
    handleChecked(area, checked) {
      this.$emit("selected", area, checked);
    }
  }
};
</script>
