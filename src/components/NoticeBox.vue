<template functional>
  <div :class="props.show ? 'notification is-danger' : 'is-hidden'">
    <button class="delete" @click="props.click"></button>
    {{props.msg}}
  </div>
</template>

<style scoped>
.notification {
  border-radius: 0;
  padding: 1em;
}
</style>