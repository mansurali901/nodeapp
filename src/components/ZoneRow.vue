<template functional>
  <tr :id="props.zone.id">
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :id="`action-zone-row${props.id}`"
          :checked="props.zone.checked"
          @change="(e)=>data.on.checked(props.zone, e.target.checked)"
        >
        <label :for="`action-zone-row${props.id}`"></label>
      </div>
    </td>
    <td
      class="zone-name"
      :title="props.zone.name"
      @click="(e)=>{data.on.clicked(e, props.zone)}"
    >{{props.zone.name}}</td>
  </tr>
</template>

<style scoped lang="scss">
.zone-name {
  color: $blue;
  text-decoration: underline;
  min-width: 120px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    cursor: pointer;
  }
}
</style>
