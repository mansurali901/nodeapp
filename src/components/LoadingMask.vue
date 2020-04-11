<template functional>
  <div class="loading-mask is-overlay has-background-white-ter" :class="{'is-hidden': props.show}">
    <div>
      <i class="has-text-info fas fa-spinner fa-pulse fa-4x"/>
    </div>
  </div>
</template>

<style lang="scss">
.loading-mask {
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
