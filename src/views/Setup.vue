<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">Sites</h2>
      <div class="content" v-if="!orgid">Sites listed that you have access directly</div>
      <div class="content" v-if="orgid">Sites listed for current org</div>
      <div class="tool-bar">
        <button v-if="!checked" class="button is-link is-small" @click="actionHandler">Add</button>
        <button v-if="checked===1" class="button is-link is-small" @click="actionEditHandler">Edit</button>
        <button class="button is-link is-small" @click="actionInstallerHandler">Configure / Status</button>
        <button v-if="checked" class="button is-danger is-small" @click="actionDeleteHandler">Delete</button>
      </div>
      <div class="search-bar"><search-box @keypress="searchSites" placeholder="Search"/>
      <button v-if="!orgid" class="button is-info is-small" @click="handleToggle">{{toggletext}}</button>
      </div>
      <sites-list @selected="siteChecked" :orgid="orgid"/>
    </div>
    <site-modal
      :orgs="Object.assign({}, orgs)"
      :orgid="orgid"
      :site="checked ? Object.assign({}, site) : {}"
      :show="showSiteModal"
      @cancel="handleCancel"
      @save="handleSiteSave"/>
    <confirm-modal
      :title="confirmTitle"
      :show="showConfirm"
      :msg="confirmMsg"
      :primary="confirmPrimary"
      @save="handleConfirmSave"
      @cancel="handleConfirmCancel">
      <div
        class="has-text-danger is-italic"
        v-if="(confirmAction == 3)">Warning: This will remove all devices, areas, zones associated with this site</div>
    </confirm-modal>
  </nav-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import router from '@/router'
// @ is an alias to /src
import SitesList from "@/components/SitesList.vue";
import ActionButton from "@/components/ActionButton.vue";
import ActionButtons from "@/components/ActionButtons.vue";
import SearchBox from "@/components/SearchBox.vue";
import NavLayout from "@/components/NavLayout.vue";
import SiteModal from "@/components/SiteModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const ADD_ACTION = 1;
const UPDATE_ACTION = 2;
const DELETE_ACTION = 3;

export default {
  components: {
    SitesList,
    ActionButton,
    ActionButtons,
    SearchBox,
    NavLayout,
    SiteModal,
    ConfirmModal
  },
  data: function() {
    return {
      checked: 0,
      showSiteModal: false,
      showConfirm: false,
      confirmAction: false,
      confirmTitle: "",
      confirmMsg: "",
      confirmPrimary: "Save",
      orgToggled: false
    };
  },
  props:['orgid'],
  computed: {
    ...mapGetters("setup", ["site"]),
    ...mapGetters("orgs", ["orgs"]),
    ...mapState({
      saving: state => state.savingSite
    }),
    toggletext(){
      if(this.orgToggled){
        return 'Show All'
      }
      return 'Show Non Org'
    }
  },
  mounted: function() {
    console.log('mounted', this.orgid)
    this.currentSite({});
    this.listOrgs()
  },
  methods: {
    ...mapMutations(["select"]),
    ...mapMutations("setup", ["currentSite","toggleProperty"]),
    ...mapActions("setup", ["addSite", "updateSite", "deleteSite", "searchSites","listOrgSites"]),
    ...mapActions("orgs", ["listOrgs"]),
    actionHandler() {
      this.confirmAction = ADD_ACTION;
      this.confirmPrimary = "Save";
      this.checked = 0;
      this.showSiteModal = true;
    },
    actionInstallerHandler() {
      if (this.checked) {
        router.push(`/installer/${this.site.id}`);
      } else {
        router.push('/installer');
      }
    },
    handleConfirmSave: function() {
      this.handleSave();
      this.showConfirm = false;
    },
    handleConfirmCancel() {
      this.showConfirm = false;
    },
    actionDeleteHandler() {
      this.confirmMsg = `Delete site ${this.site.name}?`;
      this.confirmTitle = "Delete Site";
      this.confirmAction = DELETE_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionEditHandler() {
      this.confirmAction = UPDATE_ACTION;
      this.confirmTitle = "Update Site";
      this.confirmMsg = `Update site ${this.site.name}`;
      this.confirmPrimary = "Save";
      this.showSiteModal = true;
    },
    handleCancel() {
      this.showSiteModal = false;
    },
    handleSiteSave(name, orgId) {
      if (this.site.id) {
        this.confirmAction = UPDATE_ACTION;
        this.currentSite({ ...this.site, name: name, organizationId: orgId });
      } else {
        this.confirmAction = ADD_ACTION;
        this.currentSite({ name: name, organizationId: orgId });
      }
      this.handleSave();
    },
    handleSave() {
      this.showSiteModal = false;
      if (this.confirmAction === UPDATE_ACTION) {
        this.updateSite(this.site);
      } else if (this.confirmAction === DELETE_ACTION) {
        if (this.site.id) {
          this.deleteSite(this.site);
        }
        this.checked = 0;
      } else if (this.confirmAction === ADD_ACTION) {
        this.addSite(this.site);
      }
    },
    siteChecked(site, checked) {
      if (checked) {
        this.checked = 1;
      } else {
        this.checked = 0;
      }
      this.currentSite(this.checked ? site : {});
      this.select({ namespace: "setup", type: "sites", data: site, checked, single: true });
    },
    handleToggle(){
      if(!this.orgToggled){
        this.toggleProperty({key: 'organizationId', toggle: false})
      }else{
        this.toggleProperty()
      }
      this.orgToggled = !this.orgToggled;

    }
  }
};
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
.search-bar{
  display: flex;
  flex-flow: row;
}
</style>
