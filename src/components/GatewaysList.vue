<template>
  <table class="table">
    <thead>
      <th>
        <div class="field">
          <input
            type="checkbox"
            id="gw-list-check"
            class="is-checkradio check-only is-link"
            @click="handleAllClick"
          >
          <label for="gw-list-check"></label>
        </div>
      </th>
      <th>Name</th>
      <th>Short Id</th>
    </thead>
    <tbody>
      <gateway-row
        :class="{'is-selected': row.selected}"
        v-for="(row, idx) in gateways"
        :gateway="row"
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
import gatewayRow from "./GatewayRow";

export default {
  props: ["siteid", "gateways"],
  components: {
    gatewayRow
  },
  methods: {
    handleAllClick(e) {
      this.$emit("selectAll", e.target.checked);
    },
    handleClick(e, gateway) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit("click", gateway);
    },
    handleChecked(gateway, checked) {
      this.$emit("selected", gateway, checked);
    },
    handleDragstart(e, gateway) {
      this.$emit("dragstart", e, gateway);
    },
    handleDragend(e, gateway) {
      this.$emit("dragend", e, gateway);
    }
  }
};
</script>
