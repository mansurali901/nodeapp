<template>
  <nav-layout>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <router-link :to="{name:'setup-sites',params:{orgid: orgid}}">Sites</router-link>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">{{site.name}}</a>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">Areas</a>
        </li>
      </ul>
    </nav>
    <saving-mask :show="savingArea"/>
    <div class="main">
      <h2 class="title">{{siteName}}</h2>
      <p class="help is-info">Add/Edit/Delete an area here.</p>
      <div class="tool-bar">
        <button v-if="!checked" class="button is-link is-small" @click="actionHandler">Add</button>
        <button v-if="checked===1" class="button is-link is-small" @click="actionEditHandler">Edit</button>
        <button v-if="checked" class="button is-danger is-small" @click="actionDeleteHandler">Delete</button>
      </div>
      <areas-list :siteid="id" @selected="areaChecked"/>
    </div>
    <area-modal
      :varea="checked ? area : {}"
      :show="showAreaModal"
      @cancel="handleCancel"
      @save="handleAreaSave"/>
    <confirm-modal
      :title="confirmTitle"
      :show="showConfirm"
      :msg="confirmMsg"
      :primary="confirmPrimary"
      @save="handleConfirmSave"
      @cancel="handleConfirmCancel">
      <div
        class="has-text-danger is-italic"
        v-if="(confirmAction == 3)">Warning: This will remove all zones and devices associated with this area</div>
    </confirm-modal>
  </nav-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
// @ is an alias to /src
import AreasList from "@/components/AreasList.vue";
import AreaModal from "@/components/AreaModal.vue";
import ActionButton from "@/components/ActionButton.vue";
import ActionButtons from "@/components/ActionButtons";
import NavLayout from "@/components/NavLayout";
import ConfirmModal from "@/components/ConfirmModal.vue";
import SavingMask from "@/components/SavingMask.vue";

const ADD_ACTION = 1;
const UPDATE_ACTION = 2;
const DELETE_ACTION = 3;

export default {
  components: {
    AreasList,
    ActionButton,
    ActionButtons,
    NavLayout,
    AreaModal,
    ConfirmModal,
    SavingMask
  },
  props: ["id","orgid"],
  data: function() {
    return {
      checked: 0,
      showAreaModal: false,
      showConfirm: false,
      confirmAction: false,
      confirmPrimary: "Save",
      confirmTitle: "",
      confirmMsg: ""
    };
  },
  mounted: function() {
    this.getSite(this.id);
  },
  methods: {
    ...mapMutations(["select"]),
    ...mapMutations("setup", ["currentArea"]),
    ...mapActions("setup", [
      "addArea",
      "updateArea",
      "deleteArea",
      "convertAddress",
      "getSite"
    ]),
    actionHandler() {
      this.confirmAction = ADD_ACTION;
      this.showAreaModal = true;
    },
    handleConfirmSave: function() {
      this.handleSave();
      this.showConfirm = false;
    },
    handleConfirmCancel() {
      this.showConfirm = false;
    },
    actionDeleteHandler() {
      this.confirmMsg = `Delete area ${this.area.name}?`;
      this.confirmTitle = "Delete Area";
      this.confirmAction = DELETE_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionEditHandler() {
      this.confirmAction = UPDATE_ACTION;
      this.confirmTitle = "Update Area";
      this.confirmMsg = `Update area ${this.area.name}`;
      this.showAreaModal = true;
    },
    handleCancel() {
      this.showAreaModal = false;
    },
    handleAreaSave(area) {
      if (area.id) {
        this.confirmAction = UPDATE_ACTION;
      } else {
        this.confirmAction = ADD_ACTION;
        area.siteId = this.id;
        area.account = this.site.account;
      }
      this.currentArea(area);
      this.handleSave();
    },
    handleSave() {
      this.showAreaModal = false;
      if (this.confirmAction === UPDATE_ACTION) {
        this.updateArea(this.area);
      } else if (this.confirmAction === DELETE_ACTION) {
        if (this.site.id) {
          this.deleteArea(this.area);
          this.checked = 0;
        }
      } else if (this.confirmAction === ADD_ACTION) {
        this.addArea(this.area);
      }
    },
    areaChecked(area, checked) {
      if (checked) {
        this.checked = 1;
      } else {
        this.checked = 0;
      }
      this.currentArea(this.checked ? area : {});
      this.select({ namespace: "setup", type: "areas", data: area, checked, single: true });
    }
  },
  computed: {
    ...mapGetters("setup", ["site", "areas", "area", "savingArea", "convertedAddress"]),
    ...mapState("setup",{
      siteName: function(state) {
        if (!state.loadingSite) {
          return "Site - ".concat(state.site.name);
        }
        return "Loading...";
      }
    })
  }
};
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
</style>