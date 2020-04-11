<template>
    <table class="table">
      <thead>
        <th>&nbsp;</th>
        <th>Name</th>
        <th>Description</th>
        <th>Location</th>
        <th>Status</th>
      </thead>
      <tbody>
        <tr v-if="loadingOrgs">
          <td :colspan="5" class="has-text-centered">
            <i class="fas fa-spinner fa-pulse fa-2x"/>
          </td>
        </tr>
        <org-row
          v-for="(row, ridx) in orgs"
          :nocheck="nocheck || false"
          :org="row"
          :id="ridx"
          :key="ridx"
          :path="path ? `${row.id}/${path}` : row.id"
          @checked="handleChecked"></org-row>
          <org-row
          v-if="fakerow"
          :nocheck="nocheck || false"
          :org="{name:'All direct access sites', id: null, location: null, status: null}"
          :path="path"
          :id="999999"
          :key="99999"
          @checked="handleChecked"></org-row>
      </tbody>
    </table>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('orgs')

import OrgRow from "./OrgRow";

export default {
  components: {
    OrgRow
  },
  props: ['nocheck','fakerow','path'],
  mounted() {
    this.listOrgs()
  },
  computed: {
    ...mapGetters(["loadingOrgs", "orgs"])
  },
  methods: {
    ...mapActions(["listOrgs"]),
    handleChecked: function(org, checked) {
      this.$emit("checked", org, checked);
    }
  }
}
</script>
