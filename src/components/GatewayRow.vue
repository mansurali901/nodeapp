<template functional>
  <tr
    :class="[data.class, (props.gateway.dragged || props.gateway.point) ? 'dragged': 'draggable']"
    :draggable="(props.gateway.dragged || props.gateway.point) ? false : true"
    @dragstart="(e)=>data.on.dragstart(e, props.gateway)"
    @dragend="(e)=>data.on.dragend(e, props.gateway)"
    :id="props.gateway.id"
  >
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :id="`action-gw-row${props.id}`"
          :checked="props.gateway.checked"
          @change="(e)=>data.on.checked(props.gateway, e.target.checked)"
        >
        <label :for="`action-gw-row${props.id}`"></label>
      </div>
    </td>
    <td
      class="area-name"
      :title="props.gateway.name"
      @click="(e)=>{data.on.clicked(e, props.gateway)}"
    >{{props.gateway.name}}</td>
    <td>{{props.gateway.id}}</td>
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
  background: #cae7a8;
}
.draggable:hover {
  cursor: pointer;
  background: $green;
}
.area-name {
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
