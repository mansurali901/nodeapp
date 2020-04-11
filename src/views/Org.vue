<template>
  <nav-layout>
    <div class="main">
      <h2 class="title">Manage Organization</h2>
      <router-link :to="path">Back</router-link>
      <org-detail :id="id" />
    </div>
  </nav-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import OrgDetail from "@/components/OrgDetail.vue";
  import NavLayout from "@/components/NavLayout.vue";

  export default {
    props: ["id"],
    components: {
      OrgDetail,
      NavLayout
    },
    data: function() {
      return {
        path: "/orgs"
      }
    },
    computed: {
      
    },

  }
</script>
