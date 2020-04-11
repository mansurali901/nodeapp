<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    Site Name:
    <input
      type="input"
      class="input"
      name="name"
      minlength="3"
      maxlength="100"
      required
      v-model="site.name"
      @keyup="validate"
      placeholder="Site Name">
    <p class="help is-danger" v-if="errorname">Name is required</p>
    <div v-if="!orgid">
    Assigned Organization: <br>
    <div class="select">
      <select placeholder="Select an Organization" @change="selectOrg($event)">
        <option 
          value="" 
          disabled 
          :selected="!site.organizationId">Select an Organization</option>
        <option
          v-for="org in orgs"
          v-bind:value="org.id"
          v-bind:key="org.id"
          :selected="site.organizationId == org.id">
          {{org.name}}
        </option>
      </select>
    </div>
    </div>
    
  </modal-base>
</template>

<script>
import { mapActions } from "vuex";
import ModalBase from "./ModalBase";

export default {
  components: {
    ModalBase
  },
  props: ["show", "site", "orgs", "orgid"],
  data() {
    return {
      errorname: false,
      init: false,
      selectedOrgId: this.orgid
    };
  },
  computed: {
    title() {
      return this.site.id ? "Edit Site" : "Add Site";
    }
  },
  methods: {
    selectOrg(e) {
      this.selectedOrgId = e.target.value
    },
    validate() {
      if (this.site.name.length < 1) {
        this.errorname = true;
      } else {
        this.errorname = false;
      }
    },
    reset() {
      this.name = null;
      this.errorname = false;
    },
    handleCancel(e) {
      this.reset();
      this.$emit("cancel");
    },
    handleSave(e) {
      this.$emit("save", this.site.name, this.selectedOrgId);
      this.reset();
    }
  }
};
</script>
