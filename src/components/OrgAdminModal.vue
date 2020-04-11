<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <input 
        type="input"
        class="input"
        name="name"
        minlength="3"
        maxlength="100"
        required
        v-model="admin.email"
        placeholder="Email *"
        autofocus
      >
    User Role: <br>
    <div class="select">
      <select placeholder="Select a User Role" @change="selectRole($event)">
        <option 
          value="" 
          disabled 
          :selected="!admin.role">Select a Role</option>
        <option
          v-for="role in roles"
          v-bind:value="role"
          v-bind:key="role"
          :selected="admin.role == role || roles.length == 1 ? true : false">
          {{role}}
        </option>
      </select>
    </div>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";

export default {
  props: {
    admin: {
      type: Object,
      default: {
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  components: {
    ModalBase
  },
  data() {
    return {
      roles: ["admin","general","technical"],
      selectedRole: "admin"
    }
  },
  methods: {
    selectRole(e) {
      this.selectedRole = e.target.value
    },
    handleCancel(e) {
      this.$emit("cancel");
    },
    handleSave(e) {
      this.$emit("save", {
        email: this.admin.email,
        role: this.selectedRole
      });
    }
  }
}
</script>
