<template functional>
  <div class="modal" :class="{'is-active': props.show}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{props.title}}</p>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
      <footer class="modal-card-foot is-pull-right">
        <button
          :class="{'is-loading': props.saving}"
          class="button is-primary"
          @click="(e)=>{data.on.save(e)}">{{props.primary || 'Save'}}</button>
        <a class="is-link" @click="(e)=>{data.on.cancel(e)}">Cancel</a>
      </footer>
    </div>
  </div>
</template>
