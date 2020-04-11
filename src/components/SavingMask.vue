<template functional>
  <div class="saving-mask is-overlay has-background-white-ter" :class="{'is-hidden': !props.show}">
    <div>
      <i class="has-text-success fas fa-spinner fa-pulse fa-4x"/>
    </div>
  </div>
</template>

<style lang="scss">
.saving-mask {
  display: flex;
  flex-flow: column;
  justify-content: center;
  z-index: 1000;
  opacity: 0.4;
  div {
    align-self: center;
  }
}
</style>

