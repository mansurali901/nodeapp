<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">Select Org/All to setup</h2>
      <search-box @keypress="searchOrgs" placeholder="Search"/>
      <orgs-list nocheck="true" fakerow="true" path="sites" />
    </div>
  </nav-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
// @ is an alias to /src
import OrgsList from "@/components/OrgsList.vue";
import ActionButton from "@/components/ActionButton.vue";
import ActionButtons from "@/components/ActionButtons.vue";
import SearchBox from "@/components/SearchBox.vue";
import NavLayout from "@/components/NavLayout.vue";



const ADD_ACTION = 1;
const UPDATE_ACTION = 2;
const DELETE_ACTION = 3;

export default {
  components: {
    OrgsList,
    ActionButton,
    ActionButtons,
    SearchBox,
    NavLayout,
  },
  data: function() {
    return {
      checked: 0,
    };
  },
  computed: {
    ...mapGetters("orgs", ["orgs"]),
    ...mapState({
      saving: state => state.savingSite
    })
  },
  mounted: function() {
    this.currentSite({});
    this.listOrgs();
  },
  methods: {
    ...mapMutations(["select"]),
    ...mapMutations("setup", ["currentSite"]),
    ...mapActions("orgs", ["listOrgs","currentOrg","searchOrgs"]),
  }
};
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
</style>
