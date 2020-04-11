<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <p
      v-if="!accesspoint.id"
      class="content has-text-info"
    >Add accesspoint, type defaults to v1 SLAP if none selected</p>
    <div class="field">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="name"
          v-model="accesspoint.name"
          placeholder="Accesspoint Name"
        >
      </div>
      <p class="help is-danger" v-if="errorname">Name is required</p>
    </div>
    <div class="field" v-if="!vaccesspoint.id">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="macaddress"
          v-model="accesspoint.macAddress"
          placeholder="macaddress"
        >
      </div>
      <div class="help is-info">Enter in the last 9 digits + 3 leading 0's ex: 00:03:FF:FF:FF:FF</div>
      <p class="help is-danger" v-if="errormac">mac address is required</p>
    </div>
    <div class="field" v-if="!vaccesspoint.id">
      <div class="select">
        <select name="apType">
          <option>Select which type (optional)</option>
          <option value="symbleAP">Access Point OG</option>
          <option value="symbleRPi">Raspberry Pi (No)</option>
        </select>
      </div>
    </div>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";

export default {
  props: ["show", "vaccesspoint"],
  data: function() {
    return {
      accesspoint: {},
      errorname: false,
      errormac: false
    };
  },
  updated() {
    if (!this.show) {
      if (this.vaccesspoint && this.vaccesspoint.id != this.accesspoint.id) {
        this.accesspoint = { ...this.vaccesspoint };
      }
    }
  },
  components: {
    ModalBase
  },
  computed: {
    title() {
      return this.vaccesspoint.id ? "Edit Accesspoint" : "Add Accesspoint";
    }
  },
  methods: {
    handleCancel() {
      this.accesspoint = {};
      this.errorname = false;
      this.errormac = false;
      this.$emit("cancel");
    },
    handleSave() {
      this.errorname = !this.accesspoint.name;
      this.errormac = !this.accesspoint.macAddress;
      if (this.errorname || this.errormac) {
        return;
      }
      this.$emit("save", this.accesspoint);
    }
  }
};
</script>