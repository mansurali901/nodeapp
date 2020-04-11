<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <div class="field">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="name"
          v-model="location.name"
          placeholder="Location Name"
        >
      </div>
      <p class="help is-danger" v-if="errorname">Name is required</p>
    </div>
    <div class="field" v-if="location.id">
      <div class="control">
        <label>{{location.macAddress}}</label>
      </div>
    </div>
    <div class="field" v-if="!location.id">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="macAddress"
          v-model="location.macAddress"
          placeholder="macaddress"
        >
      </div>
      <p class="help is-danger" v-if="errormac">Macaddress is required</p>
    </div>
  </modal-base>
</template>

<script>
import { mapActions } from "vuex";
import ModalBase from "./ModalBase";

export default {
  props: ["show", "vlocation"],
  data: function() {
    return {
      location: {},
      errorname: false,
      errormac: false
    };
  },
  updated() {
    if (this.vlocation && this.vlocation.id != this.location.id) {
      this.location = { ...this.vlocation };
    }
  },
  components: {
    ModalBase
  },
  computed: {
    title() {
      return this.location.id ? "Edit Location" : "Add Location";
    }
  },
  methods: {
    handleCancel(e) {
      this.location = {};
      this.errorname = false;
      this.errormac = false;
      this.$emit("cancel");
    },
    handleSave(e) {
      this.errorname = !this.location.name;
      this.errormac = !this.location.macAddress;
      if (this.errorname || this.errormac) {
        return;
      }
      this.$emit("save", this.location);
    }
  }
};
</script>