<template>
  <div class="action-btns">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "action-button",
  props: ["tooltip"],
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
.action-btns {
  position: absolute;
  display: flex;
  flex-flow: column;
  bottom: 20px;
  right: 20px;
  align-items: center;
  .action-btn:last-child {
    position: relative;
    display: block;
  }
  .action-btn {
    position: relative;
    display: none;
    margin-top: 10px;
  }
  &:hover {
    cursor: pointer;
    .action-btn {
      display: flex;
      flex-flow: column;
      justify-content: center;
      position: relative;
    }
  }
}
</style>
