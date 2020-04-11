<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">Organizations</h2>
      <div class="tool-bar">
        <button v-if="!checked" class="button is-link is-small" @click="actionHandler">Add</button>
        <button v-if="checked" class="button is-danger is-small" @click="actionDeleteHandler">Delete</button>
      </div>
      <search-box @keypress="searchOrgs" placeholder="Search"/>
      <orgs-list @checked="orgChecked"/>
    </div>

    <org-wizard
      :vorg="checked ? org : {}"
      :show="showOrgWizard"
      @cancel="handleCancel"
      @save="handleOrgSave"/>
    <confirm-modal
      :title="confirmTitle"
      :show="showConfirm"
      :msg="confirmMsg"
      :primary="confirmPrimary"
      @save="handleConfirmSave"
      @cancel="handleConfirmCancel">
      <div
        class="has-text-danger is-italic"
        v-if="(confirmAction == 3)">Warning: This will permanently delete an organization</div>
    </confirm-modal>
  </nav-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

import ActionButton from "@/components/ActionButton.vue";
import ActionButtons from "@/components/ActionButtons.vue";
import SearchBox from "@/components/SearchBox.vue";
import NavLayout from "@/components/NavLayout.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import OrgsList from "@/components/OrgsList.vue";
import OrgWizard from "@/components/OrgWizard.vue";
import OrgDetail from "@/components/OrgDetail.vue";

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
    OrgWizard,
    ConfirmModal,
    OrgDetail
  },
  data: function() {
    return {
      checked: 0,
      showManageAdmins: false,
      showOrgWizard: false,
      showConfirm: false,
      confirmAction: false,
      confirmTitle: "",
      confirmMsg: "",
      confirmPrimary: "Save"
    };
  },
  computed: {
    ...mapGetters("orgs", ["org", "orgs", "orgAdmins"]),
    ...mapState({
      saving: state => state.savingOrg
    })
  },
  mounted: function() {
    this.currentOrg({});
  },
  methods: {
    ...mapMutations("orgs", ["currentOrg", "selectOrg"]),
    ...mapActions("orgs", ["addOrg", "updateOrg", "deleteOrg", "searchOrgs"]),
    actionHandler() {
      this.confirmAction = ADD_ACTION;
      this.confirmPrimary = "Save";
      this.checked = 0;
      this.showOrgWizard = true;
    },
    handleConfirmSave: function() {
      this.handleSave();
      this.showConfirm = false;
    },
    handleConfirmCancel() {
      this.showConfirm = false;
    },
    actionDeleteHandler() {
      this.confirmMsg = `Delete organization ${this.org.name}?`;
      this.confirmTitle = "Delete Organization";
      this.confirmAction = DELETE_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionEditHandler() {
      this.confirmMsg = `Update organization ${this.org.name}`;
      this.confirmTitle = "Update Organization";
      this.confirmAction = UPDATE_ACTION;
      this.confirmPrimary = "Save";
      this.showOrgWizard = true;
    },
    actionAdminHandler() {
      this.showManageAdmins = true;
    },
    handleCancel() {
      this.showOrgWizard = false;
    },
    handleOrgSave(org) {
      if (this.org.id) {
        this.confirmAction = UPDATE_ACTION;
        this.currentOrg({ ...this.org, ...org }); // the 2nd prop overwrites the first
      } else {
        this.confirmAction = ADD_ACTION;
        this.currentOrg({ ...this.org, ...org });
      }
      this.handleSave();
    },
    handleSave() {
      this.showOrgWizard = false;
      if (this.confirmAction === UPDATE_ACTION) {
        this.updateOrg(this.org);
      } else if (this.confirmAction === DELETE_ACTION) {
        if (this.org.id) {
          this.deleteOrg(this.org);
        }
        this.checked = 0;
      } else if (this.confirmAction === ADD_ACTION) {
        this.addOrg(this.org);
      }
    },
    orgChecked(org, checked) {
      if (checked) {
        this.checked = 1;
      } else {
        this.checked = 0;
      }
      this.currentOrg(this.checked ? org : {});
      this.selectOrg({ type: "orgs", data: org, checked, single: true });
    }
  }
};
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
</style>
