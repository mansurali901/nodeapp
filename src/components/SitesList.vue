<template>
  <table class="table">
    <thead>
      <th>&nbsp;</th>
      <th :colspan="orgid ? 3: ''">Name</th>
      <th v-if="!orgid">Account</th>
      <th v-if="!orgid"># Areas</th>
    </thead>
    <tbody>
      <tr v-if="loadingSites">
        <td :colspan="4" class="has-text-centered">
          <i class="fas fa-spinner fa-pulse fa-2x" />
        </td>
      </tr>
      <site-row
        v-for="(row, ridx) in sites"
        :site="row"
        :id="ridx"
        :path="row.id + '/areas'"
        :key="ridx"
        @checked="handleChecked"></site-row>
    </tbody>
  </table>
</template>

<script>
import SiteRow from "./SiteRow";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  components: {
    SiteRow
  },
  props: ["orgid"],
  mounted: function() {
    if (this.orgid) {
      this.listOrgSites(this.orgid);
    } else {
      this.listSites();
    }
  },
  computed: {
    ...mapGetters("setup", ["sites", "loadingSites"])
  },
  methods: {
    ...mapActions("setup", ["listSites","listOrgSites"]),
    handleChecked: function(site, checked) {
      this.$emit("selected", site, checked);
    }
  }
};
</script>
