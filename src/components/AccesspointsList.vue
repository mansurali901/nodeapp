<template>
  <table class="table">
    <thead>
      <th>
        <div class="field">
          <input
            type="checkbox"
            id="ap-list-check"
            class="is-checkradio check-only is-link"
            @click="handleAllClick"
          >
          <label for="ap-list-check"></label>
        </div>
      </th>
      <th>Name</th>
      <th>Mac</th>
    </thead>
    <tbody>
      <accesspoint-row
        :class="{'is-selected': row.selected}"
        v-for="(row, idx) in accesspoints"
        :accesspoint="row"
        :key="idx"
        :id="idx"
        @clicked="handleClick"
        @checked="handleChecked"
        @dragstart="handleDragstart"
        @dragend="handleDragend"
      />
    </tbody>
  </table>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import accesspointRow from "./AccesspointRow";

export default {
  props: ["siteid", "accesspoints"],
  components: {
    accesspointRow
  },
  methods: {
    handleAllClick(e) {
      this.$emit("selectAll", e.target.checked);
    },
    handleClick(e, accesspoint) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit("click", accesspoint);
    },
    handleChecked(accesspoint, checked) {
      this.$emit("selected", accesspoint, checked);
    },
    handleDragstart(e, accesspoint) {
      this.$emit("dragstart", e, accesspoint);
    },
    handleDragend(e, accesspoint) {
      this.$emit("dragend", e, accesspoint);
    }
  }
};
</script>
