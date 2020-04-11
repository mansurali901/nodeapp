<template functional>
  <tr
    :class="[data.class, (props.accesspoint.dragged || props.accesspoint.point) ? 'dragged': 'draggable']"
    :draggable="(props.accesspoint.dragged || props.accesspoint.point) ? false : true"
    @dragstart="(e)=>data.on.dragstart(e, props.accesspoint)"
    @dragend="(e)=>data.on.dragend(e, props.accesspoint)"
    :id="props.accesspoint.id"
  >
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :id="`action-ap-row${props.id}`"
          :checked="props.accesspoint.checked"
          @change="(e)=>data.on.checked(props.accesspoint, e.target.checked)"
        >
        <label :for="`action-ap-row${props.id}`"></label>
      </div>
    </td>
    <td
      class="area-name"
      :title="props.accesspoint.name"
      @click="(e)=>{data.on.clicked(e, props.accesspoint)}"
    >{{props.accesspoint.name}}</td>
    <td>{{props.accesspoint.macAddress}}</td>
  </tr>
</template>

<style scoped lang="scss">
.dragged {
  background: #af7fbf;
  color: white;
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
