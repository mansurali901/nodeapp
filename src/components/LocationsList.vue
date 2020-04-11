<template>
  <table class="table">
    <thead>
      <th>
        <div class="field">
          <input
            type="checkbox"
            id="loc-list-check"
            class="is-checkradio check-only is-link"
            @click="handleAllClick"
          >
          <label for="loc-list-check"></label>
        </div>
      </th>
      <th>Name</th>
      <th>Mac Address</th>
    </thead>
    <tbody>
      <location-row
        :class="{'is-selected': row.selected}"
        v-for="(row, idx) in locations"
        :location="row"
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
import LocationRow from "./LocationRow";

export default {
  props: ["siteid", "zoneid", "locations"],
  components: {
    LocationRow
  },
  methods: {
    handleAllClick(e) {
      this.$emit("selectAll", e.target.checked);
    },
    handleClick(e, location) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit("click", location);
    },
    handleChecked(location, checked) {
      this.$emit("selected", location, checked);
    },
    handleDragstart(e, location) {
      this.$emit("dragstart", e, location);
    },
    handleDragend(e, location) {
      this.$emit("dragend", e, location);
    }
  }
};
</script>
