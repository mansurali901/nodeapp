<template functional>
  <tr
    :class="[data.class, (props.location.dragged || props.location.point) ? 'dragged': 'draggable']"
    :draggable="(props.location.dragged || props.location.point) ? false : true"
    @dragstart="(e)=>data.on.dragstart(e, props.location)"
    @dragend="(e)=>data.on.dragend(e, props.location)"
    :id="props.location.id"
  >
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :id="`action-row${props.id}`"
          :checked="props.location.checked"
          @change="(e)=>{e.stopPropagation(); e.preventDefault(); data.on.checked(props.location, e.target.checked)}"
        >
        <label :for="`action-row${props.id}`"></label>
      </div>
    </td>
    <td
      class="area-name"
      :title="props.location.name"
      @click="(e)=>{data.on.clicked(e, props.location)}"
    >{{props.location.name}}</td>
    <td>{{props.location.macAddress}}</td>
  </tr>
</template>

<style scoped lang="scss">
.polygon {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dragged {
  background: #bce2ff;
}
.draggable:hover {
  cursor: pointer;
  background: $green;
}
.area-name {
  color: $blue;
  text-decoration: underline;
  max-width: 175px;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    cursor: pointer;
  }
}
</style>
