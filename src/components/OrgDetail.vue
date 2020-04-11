<template>
  <div>
    <br />
    <div class="tabs">
      <ul>
        <li @click="tabIndex = 1" v-bind:class="{'is-active': tabIndex == 1}">
          <a>
            <span>Information</span>
          </a>
        </li>
        <li @click="tabIndex = 2" v-bind:class="{'is-active': tabIndex == 2}">
          <a>
            <span>Users</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="container">
      <div v-if="tabIndex == 1">
        <div class="section">
          <button class="button is-link is-small" @click="actionEditOrg">Edit</button>
          <!-- Org Details -->
          <h2 class="has-text-grey-light">Organization Details:</h2>
          <p>
            <small>Name:</small>
            {{org.name}}
          </p>
          <p>
            <small>Description:</small>
            {{org.description}}
          </p>
        </div>
        <div class="section">
          <h2 class="has-text-grey-light">Organization Location:</h2>
          <div class="address">
            {{org.address1}}
            <br />
            {{org.address2}}
            <br v-if="org.address2" />
            {{org.city}}, {{org.state}} {{org.zipcode}}
          </div>
        </div>
        <div class="section">
          <h2 class="has-text-grey-light">Primary Contact:</h2>
          <p>
            <small>Name:</small>
            {{org.primaryContact}}
          </p>
          <p>
            <small>Phone:</small>
            {{org.primaryPhone}}
          </p>
          <p>
            <small>Email:</small>
            {{org.primaryEmail}}
          </p>
        </div>
        <div class="section">
          <h2 class="has-text-grey-light">Technical Contact:</h2>
          <p>
            <small>Name:</small>
            {{org.techContact}}
          </p>
          <p>
            <small>Phone:</small>
            {{org.techPhone}}
          </p>
          <p>
            <small>Email:</small>
            {{org.techEmail}}
          </p>
        </div>
      </div>

      <div v-if="tabIndex == 2">
        <div class="section">
          <div class="tool-bar">
          <button
            v-if="!adminChecked"
            class="button is-primary is-small"
            @click="actionAddAdmin">Add</button>
          <!-- Temporarily commented due to API Limitation, can't edit an org user right now
            <button v-if="adminChecked" class="button is-link is-small" @click="actionEditAdmin">Edit</button> -->
          <button
            v-if="adminChecked"
            class="button is-link is-small is-danger"
            @click="actionDeleteAdmin">Delete</button>
          </div>
          <search-box @keypress="searchOrgAdmins" placeholder="Search on Email"/>
          <table class="table">
            <thead>
              <th>&nbsp;</th>
              <th>Email</th>
              <th>Role</th>
            </thead>
            <tbody>
              <tr v-for="admin in orgAdmins" v-bind:key="admin.userId">
                <td>
                  <div class="field">
                    <input
                      type="checkbox"
                      class="is-checkradio is-link check-only"
                      :id="`action-org-row-${admin.userId}`"
                      :checked="admin.checked"
                      @change="actionSelectAdmin(admin, $event.target.checked)"/>
                    <label :for="`action-org-row-${admin.userId}`"></label>
                  </div>
                </td>
                <td>{{admin.email}}</td>
                <td>{{admin.role}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <org-modal
      :org="this.org ? Object.assign({},this.org) : {}"
      :show="showOrgModal"
      :title="orgModalTitle"
      @save="handleSaveOrg"
      @cancel="handleCancelOrg"
    />
    <org-admin-modal
      :admin="adminChecked > 0 ? Object.assign({},this.orgAdmin) : {}"
      :show="showOrgAdminModal"
      :title="orgAdminModalTitle"
      @save="handleSaveAdmin"
      @cancel="handleCancelAdmin"
    />
    <confirm-modal
      :show="showAdminConfirm"
      :title="adminConfirmTitle"
      :primary="adminConfirmPrimary"
      :msg="adminConfirmMsg"
      @cancel="handleAdminConfirmCancel"
      @save="handleAdminConfirmSave"
    />
  </div>
</template>

<script>
import OrgModal from "@/components/OrgModal";
import OrgAdminModal from "@/components/OrgAdminModal";
import ConfirmModal from "@/components/ConfirmModal";
import SearchBox from "@/components/SearchBox";
import { mapGetters, mapMutations, mapActions } from "vuex";

// org admin confirm modal consts
const PUT_ORG_ADMIN = 0;
const DELETE_ORG_ADMIN = 1;

// confirm only occurs on add/edit/delete of admins
export default {
  props: ["id"],
  data: function() {
    return {
      tabIndex: 1,
      orgModalTitle: "",
      orgAdminModalTitle: "",
      showOrgModal: false,
      showOrgAdminModal: false,
      adminChecked: 0,
      showAdminConfirm: false,
      adminConfirmTitle: "",
      adminConfirmPrimary: "",
      adminConfirmMsg: "",
      adminConfirmAction: false,
      filterString: ""
    };
  },
  mounted() {
    this.getOrg(this.id);
    this.listOrgAdmins(this.id);
    this.listOrgSites(this.id);
  },
  components: {
    OrgModal,
    OrgAdminModal,
    ConfirmModal,
    SearchBox
  },
  computed: {
    ...mapGetters("orgs", ["org", "orgAdmin", "orgAdmins", "orgSites"])
  },
  methods: {
    ...mapActions("orgs", [
      "getOrg",
      "listOrgs",
      "addOrg",
      "updateOrg",
      "deleteOrg",
      "listOrgAdmins",
      "putOrgAdmin",
      "removeOrgAdmin",
      "listOrgSites",
      "searchOrgSites",
      "searchOrgAdmins"
    ]),
    ...mapMutations("orgs", ["currentOrgAdmin", "selectOrgAdmin"]),
    ...mapMutations(["select"]),

    // Org modal functions
    actionEditOrg() {
      this.orgModalTitle = "Edit an Organization";
      this.showOrgModal = true;
    },
    handleSaveOrg(org) {
      this.updateOrg(org);
      this.showOrgModal = false;
    },
    handleCancelOrg() {
      this.showOrgModal = false;
    },

    // Admin modal functions
    actionSelectAdmin(admin, checked) {
      if (checked) {
        this.adminChecked = 1;
      } else {
        this.adminChecked = 0;
      }
      // sets orgAdmin to admin param
      this.currentOrgAdmin(checked ? admin : {});
      // sets checked prop in matching admin on userId
      this.selectOrgAdmin({
        namespace: "orgs",
        type: "orgAdmins",
        data: admin,
        checked,
        single: true
      });
    },
    // open OrgAdminModal in add user mode
    actionAddAdmin() {
      this.orgAdminModalTitle = "Add an Organization Admin";
      this.showOrgAdminModal = true;
    },
    // open OrgAdminModal in edit user mode
    actionEditAdmin() {
      this.orgAdminModalTitle = "Edit a Organization Admin";
      this.showOrgAdminModal = true;
    },
    // save button of OrgAdminModal
    async handleSaveAdmin(admin) {
      this.currentOrgAdmin(admin);
      let adminOrg = { ...this.orgAdmin, organizationId: this.org.id };
      await this.putOrgAdmin(adminOrg);
      this.showOrgAdminModal = false;
      this.listOrgAdmins(this.id);
    },
    // cancel OrgAdminModal action
    handleCancelAdmin() {
      this.showOrgAdminModal = false;
      this.currentOrgAdmin({}); // TODO TEST might work?
    },
    // open ConfirmModal to confirm delete user
    actionDeleteAdmin() {
      this.showAdminConfirm = true;
      this.adminConfirmTitle = "Delete an Organization Admin User";
      this.adminConfirmMsg =
        "Are you sure you want to Delete an Organization Admin?";
      this.adminConfirmPrimary = "Delete";
      this.adminConfirmAction = DELETE_ORG_ADMIN;
      this.adminChecked = 0;
    },

    // Admin confirm modal functions
    handleAdminConfirmCancel() {
      this.showAdminConfirm = false;
      this.currentOrgAdmin({}); // TODO TEST might work?
    },
    handleAdminConfirmSave() {
      let adminOrg = { ...this.orgAdmin, organizationId: this.org.id };
      if (this.adminConfirmAction == DELETE_ORG_ADMIN) {
        this.removeOrgAdmin(adminOrg);
      }
      this.showAdminConfirm = false;
    }
  }
};
</script>

<style lang="scss" scoped>
small {
  display: inline-block;
  min-width: 100px;
}
h2 {
  font-weight: 500;
  padding-bottom: 5px;
}
.section {
  margin: 15px 0px 0px 0px;
}
.address {
  padding-left: 100px;
}
.id {
  font-family: monospace;
}
th {
  font-weight: normal;
  font-size: 0.875em;
}
.hidden {
  display: none !important;
}
.tool-bar {
  margin-bottom: 10px;
}
</style>
