<template>
  <table class="table">
    <thead>
      <th>
        <div class="field">
          <input
            type="checkbox"
            id="zone-list-check"
            class="is-checkradio check-only is-link"
            @click="handleAllClick"
          >
          <label for="zone-list-check"></label>
        </div>
      </th>
      <th>Name</th>
    </thead>
    <tbody>
      <zone-row
        :class="{'is-selected': row.selected}"
        v-for="(row, idx) in zones"
        :zone="row"
        :key="idx"
        :id="idx"
        @clicked="handleClick"
        @checked="handleChecked"
      />
    </tbody>
  </table>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ZoneRow from "./ZoneRow";

export default {
  props: ["siteid", "areaid", "zones"],
  components: {
    ZoneRow
  },
  methods: {
    handleAllClick(e) {
      this.$emit("selectAll", e.target.checked);
    },
    handleClick(e, zone) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit("clicked", zone);
    },
    handleChecked(zone, checked) {
      this.$emit("selected", zone, checked);
    }
  }
};
</script>

<style>
table {
  align-self: flex-start;
  min-width: 240px;
  margin: 0 10px;
}
</style>
