<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <slot></slot>
    <div class="field">
      <div class="file is-info has-name">
        <label class="file-label">
          <input class="file-input" ref="fileInput" type="file" name="file" @change="handleChange">
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">Choose file…</span>
          </span>
          <span class="file-name">{{file.name || 'Filename shows here'}}</span>
        </label>
      </div>
    </div>
  </modal-base>
</template>

<script>
import { mapActions } from "vuex";
import ModalBase from "./ModalBase";

export default {
  props: ["show", "title", "msg"],
  data: function() {
    return {
      file: {}
    };
  },
  components: {
    ModalBase
  },
  methods: {
    reset: function() {
      let input = this.$refs.fileInput;
      input.value = null;
      this.file = {};
    },
    handleCancel: function(e) {
      this.$emit("cancel");
      this.reset();
    },
    handleSave: function(e) {
      this.$emit("save", this.file);
      this.reset();
    },
    handleChange: function(e) {
      this.file = e.target.files[0];
    }
  }
};
</script>
