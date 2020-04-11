<template functional>
  <tr>
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :checked="props.area.checked"
          :id="`action-area-row${props.id}`"
          @change="(e)=>data.on.checked(props.area, e.target.checked)"
        >
        <label :for="`action-area-row${props.id}`"></label>
      </div>
    </td>
    <td>
      <router-link :to="props.path" append>{{props.area.name}}</router-link>
    </td>
    <td>{{props.area.address}}</td>
    <td>{{props.area.point}}</td>
    <td>{{props.area.zoneCount}}</td>
    <td>{{props.area.indoorMapping}}</td>
    <td>{{props.area.geoReferenced === 'true' ? 'Yes' : 'No'}}</td>
    <td class="polygon">{{props.area.polygon}}</td>

    <td>{{props.area.locationCount}}</td>
  </tr>
</template>

<style scoped>
.polygon {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
