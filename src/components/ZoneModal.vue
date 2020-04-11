<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <input type="input" class="input" name="name" v-model="zone.name" placeholder="Zone Name">
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";

export default {
  props: ["show", "vzone"],
  data: function() {
    return {
      zone: {},
      errorname: false,
      errormac: false
    };
  },
  updated() {
    if (this.vzone && this.vzone.id != this.zone.id) {
      this.zone = { ...this.vzone };
    }
  },
  components: {
    ModalBase
  },
  computed: {
    title() {
      return this.zone.id ? "Edit Zone" : "Add Zone";
    }
  },
  methods: {
    reset() {
      this.zone = {},
      this.errorname = false,
      this.errormac = false
    },
    handleCancel(e) {
      this.zone = {};
      this.$emit("cancel");
    },
    handleSave(e) {
      this.$emit("save", this.zone);
      this.reset()
    }
  }
};
</script>
