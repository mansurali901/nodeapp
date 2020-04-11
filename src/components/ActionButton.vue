<template>
  <div class="action-btn" :class="type ? type : 'primary'" @click="clickHandler" :title="tooltip">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "action-button",
  props: ["tooltip", "type"],
  methods: {
    clickHandler: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss">
.action-btn {
  color: $white;
  z-index: 100;
  text-align: center;
  font-size: 1.5em;
  height: 40px;
  width: 40px;
  border-radius: 30px 30px;

  &:hover {
    cursor: pointer;
  }
  &.primary {
    border: 1px solid $med-blue;
    background-color: $med-blue;

    &:hover {
      background-color: $med-light-blue;
    }
  }
  &.secondary {
    font-size: 1.25em;
    height: 30px;
    width: 30px;
    border-radius: 20px 20px;
  }
  &.info {
    border: 1px solid #00d1b2;
    background-color: #00d1b2;
    &:hover {
      border-color: #009e86;
      background-color: #009e86;
    }
  }
  &.danger {
    border: 1px solid $red;
    background-color: $red;

    &:hover {
      background-color: #ff0537;
    }
  }
}
</style>
