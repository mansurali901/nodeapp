<template>
  <modal-base
    :show="show"
    :title="title"
    :primary="primary"
    @cancel="handleCancel"
    @save="handleOk">
    <p>{{this.msg || 'Save changes?'}}</p>
    <slot></slot>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";

export default {
  props: ["show", "msg", "title", "primary"],
  data: function() {
    return {
      showFlag: this.show
    };
  },
  components: {
    ModalBase
  },
  methods: {
    handleCancel: function() {
      this.$emit("cancel");
    },
    handleOk: function() {
      this.$emit("save");
    }
  }
};
</script>
