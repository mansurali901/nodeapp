<template>
  <div id="app">
    <nav-bar/>
    <notice-box :show="!!error.message" :msg="error.message" :click="clearError"/>
    <slot></slot>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar";
import NoticeBox from "@/components/NoticeBox";

export default {
  name: "nav-layout",
  components: {
    NavBar,
    NoticeBox
  },
  methods: {
    ...mapActions(["clearError"], {root:true})
  },
  computed: mapState({
    error: state => state.error
  })
};
</script>
