<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">
        <img src="../assets/logo_white.png">
      </router-link>
      <div class="admin-title">ADMIN</div>
    </div>
    <div class="navbar-burger" @click="handleClick">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="nav-menu" :class="menuClass">
      <router-link to="/setup" class="navbar-item">Setup</router-link>
      <router-link to="/orgs" class="navbar-item">Orgs</router-link>
      <router-link to="/search" class="navbar-item">Search</router-link>
      <router-link to="/send" class="navbar-item">Send</router-link>
      <hr class="navbar-divider">
      <a href="#" class="navbar-item" @click="handleLogout">Logout</a>
    </div>
  </nav>
</template>

<script>
function handleOutsideClick() {
  this.$data.menuClass = "navbar-menu is-hidden";
}

import { mapActions } from "vuex";

export default {
  name: "nav-bar",
  data: () => ({
    menuClass: "navbar-menu is-hidden"
  }),
  created: function() {
    document.body.addEventListener("click", handleOutsideClick.bind(this));
  },
  beforeDestroy: function() {
    document.body.removeEventListener("click", handleOutsideClick);
  },
  methods: {
    ...mapActions(["logout"], {root:true}),
    handleClick: function(e) {
      e.preventDefault();
      e.stopPropagation();
      let c = /is-hidden/.test(this.$data.menuClass)
        ? "navbar-menu"
        : "navbar-menu is-hidden";
      this.$data.menuClass = c;
    },
    handleLogout: function() {
      this.logout();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbar {
  background-color: $light-dark-blue;
  display: flex;
  img {
    height: 50px;
    align-self: center;
    padding: 5px;
  }
  .navbar-burger {
    display: block;
    span {
      background-color: $white;
    }
  }
}
.admin-title {
  color: $orange;
  align-self: flex-end;
}
#nav-menu {
  display: flex;
  flex-flow: column;
  position: absolute;
  background-color: $white;
  top: 55px;
  right: 15px;
  width: 120px;
  box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
}
</style>
