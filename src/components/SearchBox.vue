<template functional>
  <div class="control has-icons-left searchbox">
    <input
      class="input is-small"
      type="text"
      :placeholder="props.placeholder"
      @keyup="(e)=>data.on.keypress(e.target.value)"
    >
    <span class="icon is-small is-left">
      <i class="fas fa-search"></i>
    </span>
  </div>
</template>
