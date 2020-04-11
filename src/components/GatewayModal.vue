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
          v-model="gateway.name"
          placeholder="Gateway Name"
        >
      </div>
      <p class="help is-danger" v-if="errorname">Name is required</p>
    </div>
    <div class="field" v-if="!vgateway.id">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="id"
          v-model="gateway.id"
          placeholder="id"
        >
      </div>
      <p class="help">You can enter the id ex:  $101$0-0-0-db94e5a6f</p>
      <p class="help is-danger" v-if="errormac">Id is required</p>
    </div>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";
// eslint-disable-next-line
const GW_SHORT_REGEX = /^[A-Za-z0-9]{9}$/;
const GW_PREFIX = "$101$0-0-0";
// eslint-disable-next-line
const GW_REGEX = /^\$101\$0\-0\-0\-[A-Za-z0-9]{9}/;

export default {
  props: ["show", "vgateway"],
  data: function() {
    return {
      gateway: {},
      errorname: false,
      errormac: false
    };
  },
  updated() {
    if (!this.show) {
      if (this.vgateway && this.vgateway.id != this.gateway.id) {
        this.gateway = { ...this.vgateway };
      }
    }
  },
  components: {
    ModalBase
  },
  computed: {
    title() {
      return this.vgateway.id ? "Edit Gateway" : "Add Gateway";
    }
  },
  methods: {
    formatId(id) {
      //final $101$0-0-0-db94e5a6f
      if (id.match(GW_REGEX)) {
        return; //assume good, they typed that match
      }
      if (id.match(/^[A-Za-z0-9]+$/)) {
        //format
        let p1 = id.slice(0, 3);
        let p2 = id.slice(3);
        return GW_PREFIX.concat(p1, "-", p2);
      } else if (id.match(GW_SHORT_REGEX)) {
        return GW_PREFIX.concat(id);
      }
      return id;
    },
    handleCancel() {
      this.gateway = {};
      this.errorname = false;
      this.errormac = false;
      this.$emit("cancel");
    },
    handleSave() {
      this.errorname = !this.gateway.name;
      this.errormac = !this.gateway.id || this.gateway.id.length < 12;
      if (this.errorname || this.errormac) {
        return;
      }
      this.$emit("save", this.gateway);
    }
  }
};
</script>