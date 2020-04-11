<template functional>
  <tr>
    <td>
      <div class="field">
        <input
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :checked="props.site.checked"
          :id="`action-site-row${props.id}`"
          @change="(e)=>data.on.checked(props.site, e.target.checked)">
        <label :for="`action-site-row${props.id}`"></label>
      </div>
    </td>
    <td>
      <router-link :to="props.path" append>{{props.site.name}}</router-link>
    </td>
    <td>{{props.site.accountId}}</td>
    <td>{{props.site.areaCount}}</td>
  </tr>
</template>
